import { GoogleGenAI } from "@google/genai";
import { AGENT_SYSTEM_PROMPT } from "./prompt";
import {
  getSessionHistoryForGemini,
  addMessage,
  isSessionPaused,
  pauseSession,
} from "./memory";

export interface AgentResponse {
  reply: string | null;
  isPaused: boolean;
  action?: "HUMAN_TAKEOVER" | "SCHEDULE_MEETING" | "READY_TO_BUY";
  sessionId: string;
}

export async function processAgentMessage(
  userMessage: string,
  sessionId: string,
  contactName?: string
): Promise<AgentResponse> {
  // 1. Si la sesión está en pausa (relevo humano activo), no responder
  if (isSessionPaused(sessionId)) {
    return {
      reply: null,
      isPaused: true,
      sessionId,
    };
  }

  // 2. Detección rápida de solicitud de humano
  const lowerMsg = userMessage.toLowerCase();
  const humanKeywords = ["humano", "persona", "asesor", "hablar con alguien", "hablar con alejo", "llamada directa"];
  const directHumanRequest = humanKeywords.some((kw) => lowerMsg.includes(kw));

  if (directHumanRequest) {
    pauseSession(sessionId, 24);
    const takeoverMsg = `¡Claro que sí${contactName ? ` ${contactName}` : ""}! Con mucho gusto te comunico en este momento con Alejo, nuestro Director de Ingeniería, para que revise tu caso personalmente. Te responderá por este mismo chat en breve. 👨‍💻`;
    addMessage(sessionId, "user", userMessage);
    addMessage(sessionId, "model", takeoverMsg);

    await notifyTelegramAlert({
      type: "HUMAN_TAKEOVER",
      sessionId,
      contactName,
      message: userMessage,
    });

    return {
      reply: takeoverMsg,
      isPaused: true,
      action: "HUMAN_TAKEOVER",
      sessionId,
    };
  }

  // 3. Procesar con Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  let rawReply = "";

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const history = getSessionHistoryForGemini(sessionId);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history,
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        config: {
          systemInstruction: AGENT_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      rawReply = response.text || "";
    } catch (error) {
      console.error("Error en GoogleGenAI engine:", error);
      rawReply = generateIntelligentMockReply(userMessage, contactName);
    }
  } else {
    // Si aún no se ha ingresado GEMINI_API_KEY, opera con respuestas de demostración estructuradas
    rawReply = generateIntelligentMockReply(userMessage, contactName);
  }

  // 4. Analizar etiquetas de acción
  let action: AgentResponse["action"] = undefined;

  if (rawReply.includes("[ACTION:HUMAN_TAKEOVER]")) {
    action = "HUMAN_TAKEOVER";
    pauseSession(sessionId, 24);
  } else if (rawReply.includes("[ACTION:SCHEDULE_MEETING]")) {
    action = "SCHEDULE_MEETING";
  } else if (rawReply.includes("[ACTION:READY_TO_BUY]")) {
    action = "READY_TO_BUY";
  }

  // 5. Limpiar etiquetas internas del mensaje antes de enviarlo
  const cleanReply = rawReply
    .replace(/\[ACTION:[A-Z_]+\]/g, "")
    .trim();

  // 6. Guardar en memoria
  addMessage(sessionId, "user", userMessage);
  addMessage(sessionId, "model", cleanReply);

  // 7. Notificar a Telegram si ocurrió una acción relevante
  if (action) {
    await notifyTelegramAlert({
      type: action,
      sessionId,
      contactName,
      message: userMessage,
    });
  }

  return {
    reply: cleanReply,
    isPaused: action === "HUMAN_TAKEOVER",
    action,
    sessionId,
  };
}

async function notifyTelegramAlert(data: {
  type: string;
  sessionId: string;
  contactName?: string;
  message: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const phone = data.sessionId.replace(/\D/g, "");
  const waLink = phone ? `https://wa.me/${phone}` : "";

  let title = "🤖 *ALERTA DE AGENTE IA*";
  if (data.type === "HUMAN_TAKEOVER") {
    title = "🚨 *CLIENTE SOLICITA ATENCIÓN HUMANA (ALEJO)*";
  } else if (data.type === "SCHEDULE_MEETING") {
    title = "📅 *PROSPECTO INTERESADO EN AGENDAR REUNIÓN*";
  } else if (data.type === "READY_TO_BUY") {
    title = "🔥 *¡PROSPECTO LISTO PARA COTIZACIÓN / PAGO!*";
  }

  const text = `${title}

👤 *Contacto:* ${data.contactName || "Usuario WhatsApp"}
📱 *Chat ID:* ${data.sessionId}
${waLink ? `💬 *Abrir chat:* [Chatear con el cliente](${waLink})` : ""}
📝 *Último mensaje recibido:*
"${data.message}"
`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Error al enviar alerta Telegram del agente:", err);
  }
}

function generateIntelligentMockReply(userMsg: string, contactName?: string): string {
  const lower = userMsg.toLowerCase();
  const nameGreeting = contactName ? ` ${contactName}` : "";

  if (lower.includes("precio") || lower.includes("cuanto cuesta") || lower.includes("costo") || lower.includes("planes")) {
    return `¡Hola${nameGreeting}! 👋 En SincroIA tenemos opciones a medida en pago único:
• *Web Base Next.js:* $1.890.000 COP (<0.8s de carga).
• *Agente IA Pro 24/7:* $2.490.000 COP (atención y ventas en automático).
• *E-commerce:* $3.490.000 COP (con pasarelas Wompi/Bold/PSE).
• *Ecosistema Total:* $5.490.000 COP (Web + Agente IA).

¿Qué tipo de solución se adapta mejor a tu modelo de negocio hoy?`;
  }

  if (lower.includes("reunión") || lower.includes("llamada") || lower.includes("demo") || lower.includes("agendar")) {
    return `¡Con mucho gusto${nameGreeting}! Podemos hacer una sesión corta de 15 minutos en Google Meet para mostrarte cómo opera el Agente de IA y analizar tu proyecto sin compromiso. ¿Te queda mejor mañana en la mañana o en la tarde? [ACTION:SCHEDULE_MEETING]`;
  }

  if (lower.includes("comprar") || lower.includes("contratar") || lower.includes("pago") || lower.includes("empezar")) {
    return `¡Excelente decisión${nameGreeting}! 🚀 Trabajamos con 50% de anticipo al inicio y 50% contra entrega con garantía de lanzamiento. Por favor indícame tu nombre completo, nombre de tu empresa y correo electrónico para generarte la propuesta formal y orden de inicio. [ACTION:READY_TO_BUY]`;
  }

  return `¡Hola${nameGreeting}! 👋 Soy Sofía de SincroIA.lat. Ayudamos a empresas a triplicar su conversión con portales web ultrarrápidos y agentes de Inteligencia Artificial que atienden 24/7. ¿Qué tipo de negocio tienes o qué proyecto te gustaría cotizar?`;
}
