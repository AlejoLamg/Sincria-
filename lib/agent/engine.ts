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
  contactName?: string,
  customApiKey?: string
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
  const activeKey = customApiKey || process.env.GEMINI_API_KEY;
  let rawReply = "";

  if (activeKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const history = getSessionHistoryForGemini(sessionId);

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
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
      } catch {
        // Fallback a gemini-3.5-flash-lite
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
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
      }

      rawReply = response.text || "";
    } catch (error: unknown) {
      const errDetail = error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en GoogleGenAI engine:", error);
      rawReply = `⚠️ Error al consultar Gemini API: ${errDetail}. Por favor verifica que tu GEMINI_API_KEY sea válida.`;
    }
  } else {
    // Si no hay API key, avisar claramente
    rawReply = `⚠️ *[MOTOR DE IA DESCONECTADO]*
Aún no se ha ingresado una *GEMINI_API_KEY*. Sin la clave de IA, el agente no puede razonar ni dialogar fluidamente y solo mostraba plantillas preguardadas.

👉 Consigue tu clave gratuita en 15 segundos en *aistudio.google.com/apikey*, pégala en la barra superior del simulador y verás a Sofía razonar y vender como un profesional.`;
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


