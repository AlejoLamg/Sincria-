const https = require("https");

const TELEGRAM_BOT_TOKEN = "8600254102:AAEEZcXid_xwDwhNWAxOVJp7g2w2e4vM4JE";
const TELEGRAM_CHAT_ID = "8741803575";
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxSJlke_sz9jxwaMqo0GaPclRE5S2cEC8E55oYk3AFSrp0Cd3rBGU_5-2vMOm6xBNNy/exec";

// 1. PRUEBA DIRECTA A TELEGRAM
async function testTelegram() {
  console.log("--> 1. Enviando alerta ejecutiva de prueba a Telegram...");
  const text = `🚀 *PRUEBA DE CONEXIÓN EXITOSA - SINCROIA*

👤 *Canal:* Telegram Ejecutivo
📱 *Estado:* Operativo 100%
⏰ *Fecha:* ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}

🔥 Las alertas de clientes calificados, solicitudes de reunión y pedidos de compra llegarán a este chat en tiempo real.`;

  const payload = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "Markdown",
  });

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  const data = await res.json();
  if (data.ok) {
    console.log("✅ Telegram: ¡Mensaje recibido por el bot correctamente!");
  } else {
    console.log("❌ Telegram Error:", data);
  }
}

// 2. PRUEBA SIMULADA DE WHATSAPP CONTRA EL AGENTE EN PRODUCCIÓN
async function testWhatsAppAgent() {
  console.log("\n--> 2. Enviando consulta simulada de WhatsApp a Sofía en producción...");
  
  const payload = {
    message: "Hola Sofía, tengo una clínica estética y quiero contratar el Agente IA Pro de $2.490.000 COP para responder en WhatsApp. ¿A qué cuenta transfiero el 50% de anticipo para arrancar?",
    sessionId: "573109876543",
    contactName: "Dra. Carolina Martínez (Clínica Estética)",
  };

  const res = await fetch("https://www.sincroia.lat/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("✅ Respuesta del Agente en Producción:");
  if (data.data) {
    console.log("Respuesta para WhatsApp:\n", data.data.reply);
    console.log("\nAcción detectada por Sofía:", data.data.action);
    console.log("Detalles capturados:", data.data.details);
  } else {
    console.log("Respuesta cruda:", data);
  }
}

async function main() {
  await testTelegram();
  await testWhatsAppAgent();
}

main().catch(console.error);
