const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcodeTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Cargar variables de entorno desde .env.local si no están definidas
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...v] = trimmed.split("=");
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join("=").trim();
        }
      }
    }
  }
}
loadEnv();

// Directorio de autenticación: soporta volumen persistente de Railway (/app/whatsapp_auth) o local
const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || path.join(__dirname, "..", "whatsapp_auth");
const QR_HTML_PATH = path.join(__dirname, "..", "public", "whatsapp-qr.html");
const PORT = process.env.PORT || 8080;

// URL de la API del agente: en producción apunta a Vercel, en desarrollo a localhost
const API_URL =
  process.env.AGENT_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.sincroia.lat/api/agent/chat"
    : "http://localhost:3000/api/agent/chat");

// Estado en memoria para el servidor HTTP embebido
let latestQrDataUrl = null;
let isConnected = false;
let startTime = Date.now();

// Plantillas HTML para el servidor embebido
function renderQrHtml(qrDataUrl) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Vincular WhatsApp - SincroIA Sofía 24/7</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="25">
  <style>
    body {
      background-color: #070B14;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #10172A;
      border: 1px solid rgba(0, 229, 255, 0.3);
      padding: 30px;
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      text-align: center;
      max-width: 440px;
      width: 100%;
    }
    h1 { font-size: 20px; margin-bottom: 8px; color: #00E5FF; }
    p { font-size: 13px; color: #94A3B8; line-height: 1.5; margin-bottom: 20px; }
    .qr-container {
      background: white;
      padding: 16px;
      border-radius: 16px;
      display: inline-block;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    img { display: block; width: 280px; height: 280px; }
    .steps {
      text-align: left;
      font-size: 12px;
      color: #CBD5E1;
      margin-top: 20px;
      background: rgba(255,255,255,0.03);
      padding: 15px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .steps ol { margin: 0; padding-left: 20px; }
    .steps li { margin-bottom: 6px; }
    .badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11px;
      background: rgba(0, 229, 255, 0.12);
      color: #00E5FF;
      border: 1px solid rgba(0, 229, 255, 0.3);
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Vincular Sofía IA en la Nube</h1>
    <p>Escanea este código QR con tu WhatsApp Business para dejar a <strong>Sofía activa 24/7</strong> sin depender de tu laptop.</p>
    <div class="qr-container">
      <img src="${qrDataUrl}" alt="Código QR WhatsApp" />
    </div>
    <div class="steps">
      <ol>
        <li>Abre <strong>WhatsApp</strong> en tu teléfono.</li>
        <li>Toca Ajustes o los tres puntos ⋮.</li>
        <li>Selecciona <strong>Dispositivos vinculados</strong>.</li>
        <li>Toca <strong>Vincular un dispositivo</strong> y apunta tu cámara.</li>
      </ol>
    </div>
    <div class="badge">⚡ Actualización automática cada 25s</div>
  </div>
</body>
</html>`;
}

function renderConnectedHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>WhatsApp Conectado 24/7 - SincroIA</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background-color: #070B14;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #10172A;
      border: 1px solid rgba(37, 211, 102, 0.4);
      padding: 40px;
      border-radius: 24px;
      text-align: center;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
    .check { font-size: 54px; margin-bottom: 15px; }
    h1 { color: #25D366; font-size: 22px; margin: 0 0 10px 0; }
    p { color: #94A3B8; font-size: 14px; line-height: 1.6; }
    .status-badge {
      display: inline-block;
      margin-top: 15px;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(37, 211, 102, 0.15);
      color: #25D366;
      font-size: 12px;
      font-weight: bold;
      border: 1px solid rgba(37, 211, 102, 0.3);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✅</div>
    <h1>¡Sofía IA Conectada 24/7!</h1>
    <p>El asistente de ventas de <strong>SincroIA.lat</strong> está operando en la nube con Gemini 3.6 Flash y respondiendo en menos de 2 segundos.</p>
    <div class="status-badge">🟢 Sesión Activa &bull; 100% Autónoma</div>
  </div>
</body>
</html>`;
}

function renderLoadingHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Iniciando Sofía IA - SincroIA</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="5">
  <style>
    body {
      background-color: #070B14;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: #10172A;
      border: 1px solid rgba(0, 229, 255, 0.2);
      padding: 40px;
      border-radius: 24px;
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #00E5FF; font-size: 18px; }
    p { color: #94A3B8; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Iniciando Conexión...</h1>
    <p>Generando código QR seguro. Esta página se actualizará en unos segundos.</p>
  </div>
</body>
</html>`;
}

// Iniciar mini servidor HTTP embebido para Railway
function startHttpServer() {
  const server = http.createServer((req, res) => {
    const url = req.url || "/";

    if (url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          connected: isConnected,
          uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
          apiUrl: API_URL,
        })
      );
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    if (isConnected) {
      res.end(renderConnectedHtml());
    } else if (latestQrDataUrl) {
      res.end(renderQrHtml(latestQrDataUrl));
    } else {
      res.end(renderLoadingHtml());
    }
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Servidor HTTP para QR y Healthcheck escuchando en puerto ${PORT}`);
  });
}

// Notificaciones a Telegram sobre el estado del daemon
async function notifyTelegramBridgeStatus(status) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const publicUrl = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.PUBLIC_URL || "";

  let text = "";
  if (status === "CONNECTED") {
    text = `🎉 *SINCROIA - SOFÍA IA CONECTADA 24/7 EN RAILWAY*

✅ *Estado:* En línea y respondiendo mensajes
⚡ *Motor:* Gemini 3.6 Flash
🌐 *API de Destino:* ${API_URL}

Sofía está operando en la nube de forma 100% autónoma. Tu laptop ya no necesita estar encendida. 🚀`;
  } else if (status === "DISCONNECTED") {
    text = `⚠️ *SINCROIA - ATENCIÓN: WHATSAPP DESCONECTADO*

Se cerró la sesión o se requiere escanear un nuevo código QR.
${publicUrl ? `👉 *Escanear nuevo QR:* ${publicUrl}` : "Abre la URL de tu servicio en Railway para escanear el QR."}`;
  }

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
    console.error("Error al enviar alerta Telegram de estado:", err.message);
  }
}

async function writeLocalQrHtml(qrString) {
  try {
    const qrDataUrl = await QRCode.toDataURL(qrString, { width: 340, margin: 2 });
    latestQrDataUrl = qrDataUrl;
    // Si la carpeta public existe (desarrollo local), escribir el archivo
    if (fs.existsSync(path.dirname(QR_HTML_PATH))) {
      fs.writeFileSync(QR_HTML_PATH, renderQrHtml(qrDataUrl), "utf-8");
    }
  } catch (err) {
    console.error("Error al generar HTML de QR:", err);
  }
}

async function startWhatsAppBridge() {
  console.log("\n=======================================================");
  console.log("🚀 SINCROIA - INICIANDO PUENTE WHATSAPP CON SOFÍA IA");
  console.log(`📁 Auth Dir: ${AUTH_DIR}`);
  console.log(`🎯 API Target: ${API_URL}`);
  console.log("=======================================================\n");

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    browser: ["SincroIA Sofía", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📲 CÓDIGO QR GENERADO. Escanéalo en terminal o en el navegador:");
      qrcodeTerminal.generate(qr, { small: true });
      await writeLocalQrHtml(qr);
      console.log(`\n👉 Abre en tu navegador para escanear en pantalla grande: puerto ${PORT}\n`);
    }

    if (connection === "close") {
      isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(
        `⚠️ Conexión cerrada. Razón: ${lastDisconnect?.error?.message || "Desconocida"}. ¿Reconectando?: ${shouldReconnect}`
      );

      if (shouldReconnect) {
        console.log("🔄 Reintentando conexión en 3 segundos...");
        setTimeout(() => {
          startWhatsAppBridge();
        }, 3000);
      } else {
        console.log("❌ Sesión cerrada o invalidada en WhatsApp. Limpiando credenciales para nuevo QR...");
        try {
          fs.rmSync(AUTH_DIR, { recursive: true, force: true });
        } catch (e) {}
        await notifyTelegramBridgeStatus("DISCONNECTED");
        console.log("🔄 Generando nuevo código QR en 2 segundos...");
        setTimeout(() => {
          startWhatsAppBridge();
        }, 2000);
      }
    } else if (connection === "open") {
      isConnected = true;
      latestQrDataUrl = null;
      console.log("\n=======================================================");
      console.log("🎉 ¡CONECTADO CON ÉXITO A TU WHATSAPP BUSINESS!");
      console.log("🤖 Sofía está escuchando y respondiendo en vivo 24/7.");
      console.log("=======================================================\n");
      if (fs.existsSync(path.dirname(QR_HTML_PATH))) {
        fs.writeFileSync(QR_HTML_PATH, renderConnectedHtml(), "utf-8");
      }
      await notifyTelegramBridgeStatus("CONNECTED");
    }
  });

  // Escucha de mensajes entrantes
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message) continue;

      const remoteJid = msg.key.remoteJid;
      // Ignorar grupos y difusiones de estado
      if (!remoteJid || remoteJid.includes("@g.us") || remoteJid === "status@broadcast") {
        continue;
      }

      const senderNumber = remoteJid.replace("@s.whatsapp.net", "").replace(/\D/g, "");
      const senderName = msg.pushName || "Cliente";

      // Extraer texto del mensaje
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";

      if (!text.trim()) continue;

      // 1. RELEVO HUMANO Y COMANDOS DEL DUEÑO (ALEJANDRO)
      if (msg.key.fromMe) {
        const lowerText = text.trim().toLowerCase();
        // Si Alejandro escribe un comando de reactivación desde su propio celular
        if (lowerText === "#bot" || lowerText === "#sofia" || lowerText === "#activar" || lowerText === "#reset" || lowerText === "#reanudar") {
          console.log(`🟢 [ALEJANDRO REACTIVÓ A SOFÍA] En chat: ${senderNumber}`);
          try {
            await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "resume", sessionId: senderNumber }),
            });
            await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "reset", sessionId: senderNumber }),
            });
            await sock.sendMessage(remoteJid, {
              text: "🟢 *[SOFÍA REACTIVADA]* He retomado el control de este chat y reiniciado el historial. Sofía vuelve a responder."
            });
          } catch (e) {
            console.error("Error al reactivar desde fromMe:", e);
          }
          continue;
        }

        // Si Alejandro escribe un mensaje normal a un cliente, pausar por 45 minutos
        console.log(`👨‍💻 [ALEJANDRO INTERVINO EN CHAT] Con: ${senderNumber}. Bot en pausa por 45 minutos.`);
        try {
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "pause",
              pauseHours: 0.75, // 45 minutos de ventana de cortesía
              sessionId: senderNumber,
            }),
          });
        } catch {}
        continue;
      }

      // 1.1 COMANDO DE CONTROL: #activar o #reset para reactivar el bot en pruebas
      const cleanCmd = text.trim().toLowerCase();
      if (cleanCmd === "#activar" || cleanCmd === "#reset" || cleanCmd === "!reset" || cleanCmd === "!activar") {
        console.log(`🔄 [COMANDO DE CONTROL] Reactivando sesión para: ${senderNumber}`);
        try {
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "resume", sessionId: senderNumber }),
          });
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "reset", sessionId: senderNumber }),
          });
          await sock.sendMessage(remoteJid, {
            text: "🟢 *[SESIÓN REACTIVADA]* Sofía está lista de nuevo y el historial ha sido reiniciado. Puedes escribirle cualquier mensaje para probar."
          });
        } catch (err) {
          console.error("Error al reactivar sesión:", err);
        }
        continue;
      }

      console.log(`\n📩 [MENSAJE DE CLIENTE] ${senderName} (+${senderNumber}): "${text}"`);

      // Mostrar que Sofía está escribiendo...
      try {
        await sock.sendPresenceUpdate("composing", remoteJid);
      } catch {}

      // 2. Procesar con el motor de Sofía (Next.js / Gemini 3.6 Flash)
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            sessionId: senderNumber,
            contactName: senderName,
            apiKey: process.env.GEMINI_API_KEY,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`❌ [ERROR API ${res.status}]:`, errText);
          continue;
        }

        const data = await res.json();

        // Micro-pausa de 200ms para fluidez instantánea
        await new Promise((r) => setTimeout(r, 200));

        if (data.data?.reply) {
          await sock.sendMessage(remoteJid, { text: data.data.reply });
          console.log(`🤖 [SOFÍA RESPONDIÓ]:\n"${data.data.reply}"\n`);
        } else if (data.data?.isPaused) {
          console.log(`⏸️ [MODO SILENCIO]: El chat está en relevo humano. Sofía no interrumpe.`);
        }
      } catch (err) {
        console.error("Error al procesar respuesta con Sofía:", err.message);
      } finally {
        try {
          await sock.sendPresenceUpdate("paused", remoteJid);
        } catch {}
      }
    }
  });
}

// Iniciar servidor HTTP y puente de WhatsApp
startHttpServer();
startWhatsAppBridge();
