import { NextResponse } from "next/server";
import { processAgentMessage } from "@/lib/agent/engine";
import { pauseSession } from "@/lib/agent/memory";

// Verificación de Webhook (Meta Cloud API / Gateway)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "sincroia_secure_token";

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge || "OK", { status: 200 });
  }

  return NextResponse.json({ status: "Webhook activo y en escucha." });
}

// Procesamiento de Mensajes Entrantes
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Extraer información según el proveedor (Evolution API / Baileys o Meta Cloud API)
    let senderId = "";
    let senderName = "";
    let textMessage = "";
    let isFromMe = false;

    // Formato Evolution API / Baileys Bridge
    if (body.data?.key || body.key) {
      const data = body.data || body;
      const remoteJid = data.key?.remoteJid || "";
      
      // Ignorar mensajes de grupos o estados
      if (remoteJid.includes("@g.us") || remoteJid.includes("status@broadcast")) {
        return NextResponse.json({ status: "ignored_group" });
      }

      senderId = remoteJid.replace("@s.whatsapp.net", "").replace(/\D/g, "");
      senderName = data.pushName || "";
      isFromMe = Boolean(data.key?.fromMe);

      textMessage =
        data.message?.conversation ||
        data.message?.extendedTextMessage?.text ||
        data.message?.imageMessage?.caption ||
        "";
    }
    // Formato Meta Cloud API Oficial
    else if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const contact = body.entry[0].changes[0].value.contacts?.[0];
      senderId = msg.from;
      senderName = contact?.profile?.name || "";
      textMessage = msg.text?.body || "";
      isFromMe = false;
    }

    if (!senderId || !textMessage) {
      return NextResponse.json({ status: "no_text_or_sender" });
    }

    // 2. FILTRO DE RELEVO HUMANO: Si Alejo envió el mensaje desde la PC o celular
    if (isFromMe) {
      pauseSession(senderId, 24);
      console.log(`[RELEVO HUMANO ACTIVADO] Alejo intervino en el chat con ${senderId}. Bot silenciado 24h.`);
      return NextResponse.json({ status: "human_takeover_recorded" });
    }

    // 3. Procesar el mensaje con el motor de IA
    const agentResult = await processAgentMessage(textMessage, senderId, senderName);

    // 4. Si el agente respondió, despachar a WhatsApp vía Gateway
    if (agentResult.reply) {
      await sendWhatsAppMessage({
        to: senderId,
        message: agentResult.reply,
      });
    }

    return NextResponse.json({
      success: true,
      senderId,
      replied: Boolean(agentResult.reply),
    });
  } catch (error) {
    console.error("Error al procesar webhook de WhatsApp:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// Despacho de mensaje saliente a través del Gateway
async function sendWhatsAppMessage(data: { to: string; message: string }) {
  const evolutionUrl = process.env.EVOLUTION_API_URL;
  const evolutionApiKey = process.env.EVOLUTION_API_KEY;
  const instanceName = process.env.EVOLUTION_INSTANCE || "sincroia";

  // Si está configurada la API de WhatsApp Gateway
  if (evolutionUrl && evolutionApiKey) {
    try {
      await fetch(`${evolutionUrl}/message/sendText/${instanceName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionApiKey,
        },
        body: JSON.stringify({
          number: data.to,
          text: data.message,
        }),
      });
      return;
    } catch (err) {
      console.error("Error despachando mensaje a Evolution API:", err);
    }
  }

  // Si está configurada Meta Cloud API
  const metaToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_CLOUD_PHONE_ID;
  if (metaToken && metaPhoneId) {
    try {
      await fetch(`https://graph.facebook.com/v21.0/${metaPhoneId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${metaToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: data.to,
          type: "text",
          text: { body: data.message },
        }),
      });
      return;
    } catch (err) {
      console.error("Error despachando mensaje a Meta Cloud API:", err);
    }
  }

  console.log(`[DESPACHO SIMULADO - WHATSAPP] Para: ${data.to} | Mensaje: "${data.message}"`);
}
