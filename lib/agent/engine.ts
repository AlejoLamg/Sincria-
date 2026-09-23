import { GoogleGenAI } from "@google/genai";
import { AGENT_SYSTEM_PROMPT } from "./prompt";
import {
  getSessionHistoryForGemini,
  addMessage,
  isSessionPaused,
  pauseSession,
  setContactInfo,
} from "./memory";

export interface AgentResponse {
  reply: string | null;
  isPaused: boolean;
  action?: "HUMAN_TAKEOVER" | "SCHEDULE_MEETING" | "READY_TO_BUY" | "PARTNER_LEAD";
  actionDetails?: Record<string, string>;
  sessionId: string;
}

export async function processAgentMessage(
  userMessage: string,
  sessionId: string,
  contactName?: string,
  customApiKey?: string
): Promise<AgentResponse> {
  if (contactName) {
    setContactInfo(sessionId, contactName);
  }

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
  const humanKeywords = ["humano", "persona", "asesor", "hablar con alguien", "hablar con alejo", "hablar con alejandro", "ingeniero", "llamada directa"];
  const directHumanRequest = humanKeywords.some((kw) => lowerMsg.includes(kw));

  if (directHumanRequest) {
    pauseSession(sessionId, 1);
    const takeoverMsg = `¡Claro que sí${contactName ? ` ${contactName}` : ""}! Con mucho gusto te comunico en este momento con Alejandro, nuestro Director de Ingeniería, para que revise tu caso de forma personalizada. Te responderá por este mismo chat en breve. 👨‍💻`;
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
      const systemInstruction = contactName
        ? `${AGENT_SYSTEM_PROMPT}\n\n[DATO DEL CLIENTE: El nombre de este cliente en WhatsApp es "${contactName}". Puedes saludarlo o referirte a él con naturalidad si es la primera vez o si lo amerita el contexto.]`
        : AGENT_SYSTEM_PROMPT;

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
            systemInstruction,
            temperature: 0.6,
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
            systemInstruction,
            temperature: 0.6,
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

  // 4. Analizar etiquetas de acción (simples o enriquecidas con payload)
  let action: AgentResponse["action"] = undefined;
  const actionDetails: Record<string, string> = {};

  const actionMatch = rawReply.match(/\[ACTION:([A-Z_]+)(?:\s*\|\s*([^\]]+))?\]/);
  if (actionMatch) {
    const rawActionType = actionMatch[1];
    const rawPayload = actionMatch[2];

    if (rawActionType === "HUMAN_TAKEOVER") {
      action = "HUMAN_TAKEOVER";
      pauseSession(sessionId, 1);
    } else if (rawActionType === "SCHEDULE_MEETING") {
      action = "SCHEDULE_MEETING";
    } else if (rawActionType === "READY_TO_BUY") {
      action = "READY_TO_BUY";
    } else if (rawActionType === "PARTNER_LEAD") {
      action = "PARTNER_LEAD";
    }

    if (rawPayload) {
      const parts = rawPayload.split("|");
      for (const part of parts) {
        const colonIdx = part.indexOf(":");
        if (colonIdx !== -1) {
          const key = part.slice(0, colonIdx).trim().toLowerCase();
          const val = part.slice(colonIdx + 1).trim();
          if (key && val) {
            actionDetails[key] = val;
          }
        }
      }
    }
  }

  // 5. Limpiar etiquetas internas del mensaje antes de enviarlo
  const cleanReply = rawReply
    .replace(/\[ACTION:[^\]]+\]/g, "")
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
      details: Object.keys(actionDetails).length > 0 ? actionDetails : undefined,
    });
  }

  return {
    reply: cleanReply,
    isPaused: action === "HUMAN_TAKEOVER",
    action,
    actionDetails: Object.keys(actionDetails).length > 0 ? actionDetails : undefined,
    sessionId,
  };
}

async function notifyTelegramAlert(data: {
  type: string;
  sessionId: string;
  contactName?: string;
  message: string;
  details?: Record<string, string>;
}): Promise<void> {
  // 1. Notificación a Telegram (si está configurado)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const phone = data.sessionId.replace(/\D/g, "");
    const waLink = phone ? `https://wa.me/${phone}` : "";

    let title = "🤖 *ALERTA DE AGENTE IA*";
    if (data.type === "HUMAN_TAKEOVER") {
      title = "🚨 *CLIENTE SOLICITA ATENCIÓN HUMANA (ING. ALEJANDRO)*";
    } else if (data.type === "SCHEDULE_MEETING") {
      title = "📅 *PROSPECTO INTERESADO EN AGENDAR REUNIÓN*";
    } else if (data.type === "READY_TO_BUY") {
      title = "🔥 *¡PROSPECTO LISTO PARA COTIZACIÓN / PAGO!*";
    } else if (data.type === "PARTNER_LEAD") {
      title = "🤝 *¡AGENCIA / PARTNER B2B INTERESADO EN ALIANZA!*";
    }

    let detailsText = "";
    if (data.details && Object.keys(data.details).length > 0) {
      const lines = Object.entries(data.details).map(
        ([k, v]) => `• *${k.charAt(0).toUpperCase() + k.slice(1)}:* ${v}`
      );
      detailsText = `\n📋 *Ficha Resumen del Lead:*\n${lines.join("\n")}\n`;
    }

    const text = `${title}

👤 *Contacto:* ${data.contactName || "Usuario WhatsApp"}
📱 *Chat ID:* ${data.sessionId}${detailsText}
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

  // 2. Registro automático en Google Sheets CRM (si LEADS_WEBHOOK_URL está configurado)
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const isGoogleAppsScript = webhookUrl.includes("script.google.com");
      const fechaBogota = new Date().toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        dateStyle: "medium",
        timeStyle: "short",
      });
      const cleanPhone = data.sessionId.replace(/\D/g, "");

      let statusLabel = "🟡 1. Lead Nuevo";
      if (data.type === "READY_TO_BUY") statusLabel = "🟣 4. Propuesta 50/50";
      else if (data.type === "SCHEDULE_MEETING") statusLabel = "🟢 3. Sesión Agendada";
      else if (data.type === "HUMAN_TAKEOVER") statusLabel = "🔵 2. Diagnóstico Sofía (Atención Alejandro)";

      const payload = {
        fecha: fechaBogota,
        nombre: data.contactName || data.details?.lead || "Prospecto WhatsApp",
        telefono: cleanPhone ? `+${cleanPhone}` : data.sessionId,
        email: data.details?.email || "",
        empresa: data.details?.empresa || data.details?.sector || "No especificada",
        tipoProyecto: data.details?.plan || data.type,
        presupuesto: data.details?.presupuesto || "Por cotizar",
        comentarios: `[Acción IA: ${data.type}] ${data.message}`,
        estado: statusLabel,
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": isGoogleAppsScript
            ? "text/plain;charset=utf-8"
            : "application/json",
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      });
    } catch (whErr) {
      console.error("Error al registrar lead en Google Sheets:", whErr);
    }
  }
}


