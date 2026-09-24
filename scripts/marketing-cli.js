#!/usr/bin/env node

/**
 * CLI de Agentes de Marketing — SincroIA.lat
 * Permite ejecutar a cualquiera de los 5 agentes de marketing desde la terminal.
 *
 * Uso:
 *   node scripts/marketing-cli.js --role=copywriter --task=foundational_grid_posts
 *   node scripts/marketing-cli.js --role=brand_strategist --task=profile_bios
 *   node scripts/marketing-cli.js --role=cmo --task=full_launch_strategy
 */

const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Cargar variables de entorno desde .env.local si existe
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  });
}

const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith("--")) {
    const [k, v] = arg.slice(2).split("=");
    acc[k] = v || true;
  }
  return acc;
}, {});

const role = args.role || "cmo";
const task = args.task || "full_launch_strategy";
const network = args.network || "instagram";
const niche = args.niche || "general";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: No se encontró GEMINI_API_KEY en las variables de entorno o en .env.local.");
  process.exit(1);
}

console.log(`\n🤖 SincroIA Marketing Engine`);
console.log(`──────────────────────────────────────────`);
console.log(`• Rol Asignado:   ${role.toUpperCase()}`);
console.log(`• Tarea:          ${task}`);
console.log(`• Canal:          ${network}`);
console.log(`• Nicho:          ${niche}`);
console.log(`──────────────────────────────────────────\n`);
console.log(`⏳ Consultando a Gemini Flash...`);

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Actúa como el agente ${role} de SincroIA.lat.
Ejecuta la tarea: ${task}
Canal: ${network}
Nicho: ${niche}

Contexto: SincroIA es una firma de ingeniería web en Next.js 15 (<0.8s) y Agentes de IA en WhatsApp 24/7 (Gemini) en Colombia.
Entrega un resultado profesional, listo para copiar y publicar en formato Markdown.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    console.log(`\n✅ RESULTADO GENERADO:\n`);
    console.log(response.text);
    console.log(`\n──────────────────────────────────────────`);
    console.log(`🎉 Proceso completado exitosamente.\n`);
  } catch (err) {
    console.error(`❌ Error al ejecutar:`, err.message);
  }
}

run();
