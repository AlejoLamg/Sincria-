import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, email, telefono, objetivo, comentarios, totalEstimatedPrice } = data;

    if (!nombre || (!email && !telefono)) {
      return NextResponse.json(
        { error: "Nombre y al menos un método de contacto (email o teléfono) son obligatorios." },
        { status: 400 }
      );
    }

    const cleanPhone = (telefono || "").replace(/\D/g, "");
    const fechaBogota = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const formattedPrice = totalEstimatedPrice
      ? `$${Number(totalEstimatedPrice).toLocaleString("es-CO")} COP`
      : "Por cotizar";

    // 1. CANAL TELEGRAM (Alerta push al celular en < 1 segundo)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "";
      const textTelegram = `🚀 *¡NUEVO LEAD EN SINCROIA.LAT!*

👤 *Nombre:* ${nombre}
📞 *Teléfono:* ${telefono || "No especificado"}
${waLink ? `💬 *WhatsApp directo:* [Chatear ahora en WhatsApp](${waLink})` : ""}
📧 *Email:* ${email || "No especificado"}
🎯 *Objetivo:* ${objetivo || "Diagnóstico general"}
💰 *Inversión Estimada:* ${formattedPrice}
⏰ *Fecha:* ${fechaBogota}

📝 *Detalles del proyecto:*
${comentarios ? comentarios : "Sin comentarios adicionales."}`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: textTelegram,
            parse_mode: "Markdown",
            disable_web_page_preview: false,
          }),
        });
      } catch (err) {
        console.error("Error al enviar alerta a Telegram:", err);
      }
    }

    // 2. CANAL WEBHOOK UNIVERSAL (Google Sheets CRM / Discord / Slack / Zapier)
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const isDiscord = webhookUrl.includes("discord.com");
        const payload = isDiscord
          ? {
              content: `🔔 **Nuevo Prospecto en SincroIA.lat**\n**Nombre:** ${nombre}\n**Teléfono:** ${telefono}\n**Email:** ${email}\n**Plan:** ${objetivo}\n**Presupuesto:** ${formattedPrice}`,
            }
          : {
              fecha: fechaBogota,
              nombre,
              email,
              telefono,
              objetivo,
              inversionEstimada: formattedPrice,
              comentarios,
            };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Error al enviar webhook de leads:", err);
      }
    }

    // Registro en log del servidor para trazabilidad
    console.log(`[LEAD RECIBIDO] ${fechaBogota} - ${nombre} (${telefono || email}) - ${objetivo} - ${formattedPrice}`);

    return NextResponse.json({
      success: true,
      message: "Lead recibido y procesado correctamente.",
    });
  } catch (error) {
    console.error("Error al procesar el lead en /api/leads:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el mensaje." },
      { status: 500 }
    );
  }
}
