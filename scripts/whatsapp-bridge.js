const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcodeTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
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

const AUTH_DIR = path.join(__dirname, "..", "whatsapp_auth");
const QR_HTML_PATH = path.join(__dirname, "..", "public", "whatsapp-qr.html");
const API_URL = process.env.AGENT_API_URL || "http://localhost:3000/api/agent/chat";

async function writeQrHtml(qrString) {
  try {
    const qrDataUrl = await QRCode.toDataURL(qrString, { width: 340, margin: 2 });
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Vincular WhatsApp - SincroIA Sofía</title>
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
      max-width: 420px;
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
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      background: rgba(37, 211, 102, 0.15);
      color: #25D366;
      border: 1px solid rgba(37, 211, 102, 0.3);
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Conectar WhatsApp Business</h1>
    <p>Escanea este código QR con tu celular para activar a <strong>Sofía (Agente de IA 24/7)</strong> en tu WhatsApp.</p>
    <div class="qr-container">
      <img src="${qrDataUrl}" alt="Código QR WhatsApp" />
    </div>
    <div class="steps">
      <ol>
        <li>Abre <strong>WhatsApp</strong> en tu celular.</li>
        <li>Toca los tres puntos ⋮ o <strong>Ajustes</strong>.</li>
        <li>Toca <strong>Dispositivos vinculados</strong>.</li>
        <li>Toca <strong>Vincular un dispositivo</strong> y apunta tu cámara hacia esta pantalla.</li>
      </ol>
    </div>
    <div class="badge">⚡ Actualización automática cada 25s</div>
  </div>
</body>
</html>`;
    fs.writeFileSync(QR_HTML_PATH, htmlContent, "utf-8");
  } catch (err) {
    console.error("Error al generar HTML de QR:", err);
  }
}

function writeConnectedHtml() {
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>WhatsApp Conectado - SincroIA</title>
  <style>
    body {
      background-color: #070B14;
      color: #FFFFFF;
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #10172A;
      border: 1px solid rgba(37, 211, 102, 0.4);
      padding: 40px;
      border-radius: 24px;
      text-align: center;
      max-width: 400px;
    }
    .check { font-size: 50px; margin-bottom: 10px; }
    h1 { color: #25D366; font-size: 22px; margin: 0 0 10px 0; }
    p { color: #94A3B8; font-size: 14px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✅</div>
    <h1>¡WhatsApp Vinculado con Éxito!</h1>
    <p>Sofía ya está activa y respondiendo mensajes en tu WhatsApp Business 24/7 con Gemini 3.6 Flash.</p>
    <p style="margin-top: 15px; font-size: 12px; color: #00E5FF;">Ya puedes cerrar esta ventana y usar tu WhatsApp normalmente.</p>
  </div>
</body>
</html>`;
    fs.writeFileSync(QR_HTML_PATH, htmlContent, "utf-8");
  } catch (err) {
    console.error("Error al escribir HTML conectado:", err);
  }
}

async function startWhatsAppBridge() {
  console.log("\n=======================================================");
  console.log("🚀 SINCROIA - INICIANDO PUENTE WHATSAPP CON SOFÍA IA");
  console.log("=======================================================\n");

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
      await writeQrHtml(qr);
      console.log("\n👉 También puedes abrir en tu navegador para escanear en pantalla grande:");
      console.log("   http://localhost:3000/whatsapp-qr.html\n");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        `⚠️ Conexión cerrada. Razón: ${lastDisconnect?.error?.message || "Desconocida"}. ¿Reconectando?: ${shouldReconnect}`
      );
      if (shouldReconnect) {
        startWhatsAppBridge();
      } else {
        console.log("❌ Sesión cerrada por el usuario en WhatsApp. Por favor reinicia para generar un nuevo QR.");
      }
    } else if (connection === "open") {
      console.log("\n=======================================================");
      console.log("🎉 ¡CONECTADO CON ÉXITO A TU WHATSAPP BUSINESS!");
      console.log("🤖 Sofía está escuchando y respondiendo en vivo 24/7.");
      console.log("=======================================================\n");
      writeConnectedHtml();
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

      // 1. RELEVO HUMANO: Si Alejo envió el mensaje desde el celular o la PC
      if (msg.key.fromMe) {
        console.log(`👨‍💻 [ALEJO INTERVINO EN CHAT] Con: ${senderNumber}. Bot silenciado 24h.`);
        try {
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "pause",
              sessionId: senderNumber,
            }),
          });
        } catch {}
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
          }),
        });

        const data = await res.json();

        // Pausa natural de 1.8 segundos para simular lectura y tipeo humano
        await new Promise((r) => setTimeout(r, 1800));

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

startWhatsAppBridge();
