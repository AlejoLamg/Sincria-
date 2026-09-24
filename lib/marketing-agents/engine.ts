import { GoogleGenAI } from "@google/genai";
import {
  MarketingAgentRequest,
  MarketingAgentResponse,
  MarketingAgentRole,
  SocialNetwork,
} from "./types";
import {
  CMO_SYSTEM_PROMPT,
  BRAND_STRATEGIST_PROMPT,
  COPYWRITER_PROMPT,
  VIRTUAL_ASSET_PROMPT,
  GROWTH_OPS_PROMPT,
} from "./prompts";

function getSystemPrompt(role: MarketingAgentRole): string {
  switch (role) {
    case "cmo":
      return CMO_SYSTEM_PROMPT;
    case "brand_strategist":
      return BRAND_STRATEGIST_PROMPT;
    case "copywriter":
      return COPYWRITER_PROMPT;
    case "virtual_asset":
      return VIRTUAL_ASSET_PROMPT;
    case "growth_ops":
      return GROWTH_OPS_PROMPT;
    default:
      return CMO_SYSTEM_PROMPT;
  }
}

function getRoleName(role: MarketingAgentRole): string {
  switch (role) {
    case "cmo":
      return "Chief Marketing Officer (CMO)";
    case "brand_strategist":
      return "Brand & Identity Strategist";
    case "copywriter":
      return "Creative Copywriter Agent";
    case "virtual_asset":
      return "Virtual Asset Agent";
    case "growth_ops":
      return "Growth Ops Agent";
  }
}

function buildUserInstruction(req: MarketingAgentRequest): string {
  const parts: string[] = [];

  parts.push(`[ROL ASIGNADO: ${getRoleName(req.role)}]`);
  parts.push(`[TAREA PRINCIPAL: ${req.task}]`);

  if (req.network) {
    parts.push(`[CANAL / RED OBJETIVO: ${req.network.toUpperCase()}]`);
  }

  if (req.niche) {
    parts.push(`[NICHO / INDUSTRIA OBJETIVO: ${req.niche}]`);
  }

  if (req.targetAudience) {
    parts.push(`[PÚBLICO ESPECÍFICO: ${req.targetAudience}]`);
  }

  if (req.customInstructions) {
    parts.push(`[INSTRUCCIONES ESPECÍFICAS]:\n${req.customInstructions}`);
  }

  if (req.contextData && Object.keys(req.contextData).length > 0) {
    parts.push(`[DATOS ADICIONALES]:\n${JSON.stringify(req.contextData, null, 2)}`);
  }

  parts.push(`
Por favor, genera un resultado completo, profesional y 100% aplicable para SincroIA.
- Utiliza formato Markdown con títulos claros, listas y bloques de texto listos para copiar y pegar.
- Aplica el tono ejecutivo y técnico de SincroIA.
- Incluye al final una sección de "💡 Pasos de Acción Inmediata" con los siguientes pasos a ejecutar en WhatsApp, Instagram o Facebook.
`);

  return parts.join("\n\n");
}

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-2.0-flash",
];

/**
 * Llama a la API de Gemini con resiliencia automática y reintentos ante errores 503 (alta demanda)
 */
async function callGeminiWithResilience(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  temperature = 0.6
): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          temperature,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[Marketing Engine] Modelo '${model}' reportó alta demanda o error (${errMsg.slice(0, 80)}). Probando modelo alternativo...`);
      // Breve pausa para mitigar spikes temporales
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  throw lastError || new Error("No se pudo obtener respuesta de los modelos de Gemini.");
}

export async function executeMarketingAgent(
  req: MarketingAgentRequest
): Promise<MarketingAgentResponse> {
  const apiKey = req.customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      role: req.role,
      task: req.task,
      title: "Clave de API no encontrada",
      content:
        "⚠️ No se encontró la variable GEMINI_API_KEY en el entorno ni se suministró una clave personalizada. Por favor ingresa una clave de Gemini en el panel o configúrala en el archivo .env.local.",
      error: "MISSING_GEMINI_API_KEY",
    };
  }

  const systemInstruction = getSystemPrompt(req.role);
  const promptText = buildUserInstruction(req);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const reply = await callGeminiWithResilience(
      ai,
      promptText,
      systemInstruction,
      req.role === "copywriter" ? 0.75 : 0.5
    );

    // Extraer título básico
    const titleMatch = reply.match(/^#+\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : `${getRoleName(req.role)} — ${req.task}`;

    return {
      success: true,
      role: req.role,
      task: req.task,
      title,
      content: reply,
      metadata: {
        suggestedFormat: req.network ? `${req.network.toUpperCase()} Post/Story` : "Estrategia Global",
        targetNetwork: req.network || "Multicanal",
        estimatedReadTime: `${Math.max(1, Math.ceil(reply.split(/\s+/).length / 180))} min`,
        actionableSteps: ["Revisar", "Copiar", "Programar en Meta Business Suite / WhatsApp"],
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido al procesar la solicitud.";
    console.error("Error en Marketing Agent Engine:", err);
    return {
      success: false,
      role: req.role,
      task: req.task,
      title: "Error al generar contenido",
      content: `⚠️ Ocurrió un error al contactar al motor de Gemini: ${errorMsg}`,
      error: errorMsg,
    };
  }
}

export interface TeamPipelineInput {
  objective: string;
  niche?: string;
  network?: SocialNetwork;
  customApiKey?: string;
}

export interface TeamPipelineResult {
  success: boolean;
  cmoStrategy: string;
  copyContent: string;
  visualDirection: string;
  whatsappLink: string;
  finalUnifiedPost: string;
  suggestedImageUrl?: string;
  error?: string;
}

/**
 * Pipeline de Trabajo en Equipo Colaborativo:
 * El CMO lidera, Copywriter redacta, Brand cuida la voz, Visual diseña y Growth Ops conecta WhatsApp.
 */
export async function executeTeamPipeline(
  input: TeamPipelineInput
): Promise<TeamPipelineResult> {
  const apiKey = input.customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      cmoStrategy: "",
      copyContent: "",
      visualDirection: "",
      whatsappLink: "",
      finalUnifiedPost: "⚠️ No se encontró la GEMINI_API_KEY.",
      error: "MISSING_GEMINI_API_KEY",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // PASO 1: El CMO define la estrategia y el ángulo de combate
    const cmoPrompt = `
Eres el CMO de SincroIA.lat.
Tu objetivo comercial: "${input.objective}"
Nicho: "${input.niche || "general"}"
Canal: "${input.network || "both"}"

Define el ángulo de ataque en 3 viñetas concisas:
1. El dolor exacto del prospecto (fuga de dinero en WhatsApp / web lenta).
2. La oferta irresistible de SincroIA (Plan IA Pro $2.49M COP o Web $1.89M COP).
3. La orden directa para el Copywriter y el Diseñador.
`;

    const cmoStrategy = await callGeminiWithResilience(
      ai,
      cmoPrompt,
      CMO_SYSTEM_PROMPT,
      0.5
    );

    // PASO 2: El Copywriter redacta el post oficial basado en la orden del CMO
    const copyPrompt = `
El CMO ha dado esta directriz estratégica:
${cmoStrategy}

Escribe el post oficial para Instagram y Facebook con formato largo, profundo, sustancioso y de alto impacto:
- GANCHO INICIAL: 1 a 2 líneas demoledoras que detengan el scroll atacando una verdad incómoda o dolor financiero real.
- NARRATIVA / CONTEXTO: 2 a 3 párrafos cortos explicando la situación actual, comparando la lentitud o el desorden de los métodos antiguos frente a la tecnología moderna.
- BENEFICIOS CONCRETOS (BULLETS): Lista de 4 o 5 viñetas con datos duros, métricas técnicas (Next.js 15 en <0.8s, respuesta en <1.8s, sincronización con Google Calendar, Relevo Humano, precios transparentes en pesos colombianos COP).
- LLAMADO A LA ACCIÓN (CTA): Directo y persuasivo hacia el WhatsApp oficial de Sofía (+57 312 463 0488).
- HASHTAGS ESTRATÉGICOS: 6 a 8 hashtags de alta relevancia en Colombia y LatAm.

IMPORTANTE: El texto debe tener sustancia, profundidad narrativa, sonar a ingeniería de software de alto estatus y no ser un resumen corto. Espacia los párrafos con saltos de línea limpios.
`;

    const copyContent = await callGeminiWithResilience(
      ai,
      copyPrompt,
      COPYWRITER_PROMPT,
      0.75
    );

    // PASO 3: El Virtual Asset Agent describe y especifica el visual perfecto
    const visualPrompt = `
Basado en este copy redactado por el equipo:
${copyContent}

Define la especificación del creativo visual (formato 1:1 para feed):
1. Concepto visual central (paleta #0A0F1E, neón cian #00E5FF, mockup 3D o métrica).
2. Texto en pantalla que debe llevar la imagen (máximo 7 palabras).
`;

    const visualDirection = await callGeminiWithResilience(
      ai,
      visualPrompt,
      VIRTUAL_ASSET_PROMPT,
      0.6
    );

    // PASO 4: Growth Ops genera el enlace con mensaje precargado de WhatsApp
    const safeText = encodeURIComponent(`Hola Sofía 👋 Vi el post sobre "${input.objective.slice(0, 40)}" y quiero asesoría`);
    const whatsappLink = `https://wa.me/573124630488?text=${safeText}`;

    // SÍNTESIS FINAL UNIFICADA DEL EQUIPO
    const finalUnifiedPost = `
${copyContent}

🔗 Enlace de Conversión Directo:
${whatsappLink}
`.trim();

    // Determinar la imagen oficial dedicada acorde al objetivo
    let suggestedImageUrl = "/marketing/post1-grid-feed.jpg";
    const lowerObj = input.objective.toLowerCase();
    if (lowerObj.includes("post 2") || lowerObj.includes("sofía") || lowerObj.includes("sofia") || lowerObj.includes("1.8")) {
      suggestedImageUrl = "/marketing/post2-sofia-en-vivo.jpg";
    } else if (lowerObj.includes("post 3") || lowerObj.includes("wordpress") || lowerObj.includes("elementor") || lowerObj.includes("velocidad")) {
      suggestedImageUrl = "/marketing/post3-wordpress-vs-nextjs.jpg";
    } else if (lowerObj.includes("post 4") || lowerObj.includes("fuga") || lowerObj.includes("nocturn") || lowerObj.includes("9:00") || lowerObj.includes("9:47") || lowerObj.includes("roi")) {
      suggestedImageUrl = "/marketing/post4-fuga-nocturna.jpg";
    }

    return {
      success: true,
      cmoStrategy,
      copyContent,
      visualDirection,
      whatsappLink,
      finalUnifiedPost,
      suggestedImageUrl,
    };
  } catch (err: any) {
    console.error("Error en executeTeamPipeline:", err);
    
    // Si hubo un fallo total de API (503 / Spike de demanda temporal), construimos un post de alta fidelidad
    const errMsg = String(err?.message || "");
    const isTemporarySpike = errMsg.includes("503") || errMsg.includes("demand") || errMsg.includes("UNAVAILABLE") || errMsg.includes("quota");

    if (isTemporarySpike) {
      const safeText = encodeURIComponent(`Hola Sofía 👋 Vi el post de Sofía 24/7 y quiero cotizar para mi empresa`);
      const whatsappLink = `https://wa.me/573124630488?text=${safeText}`;
      
      const resilientCopy = `🚀 ¿Cuánto dinero perdió tu negocio anoche porque nadie contestó a tiempo?

El 78% de las ventas en Colombia las cierra el primer negocio que responde. Mientras tu competencia deja mensajes en "leído", Sofía atiende en 1.8 segundos, califica al cliente y agenda citas en Google Calendar las 24 horas del día.

⚡ Cero clientes perdidos.
🤖 Atención 24/7 con Inteligencia Artificial y Relevo Humano instantáneo.
💼 Planes llave en mano desde $1.890.000 COP.

👉 Chatea en vivo con Sofía en WhatsApp y comprueba la velocidad tú mismo:
${whatsappLink}

#SincroIA #InteligenciaArtificial #WhatsAppBusiness #Nextjs15 #VentasAutomaticas #ColombiaTech`;

      return {
        success: true,
        cmoStrategy: `🎯 Enfoque Estratégico del CMO (Generación de Respaldo por Alta Demanda):
• Dolor: Pérdida del 78% de prospectos por demora en respuesta por WhatsApp fuera de horario laboral.
• Oferta: Agente Pro en WhatsApp 24/7 con sincronización a Google Calendar y Relevo Humano ($2.49M COP).
• Directriz: Copy de impacto centrado en velocidad de respuesta (<1.8s) y ROI inmediato.`,
        copyContent: resilientCopy,
        visualDirection: `🎨 Dirección de Arte Visual:
• Formato: 1:1 Feed Instagram & Facebook
• Composición: Fondo ultra-dark (#0A0F1E) con mockup 3D de smartphone mostrando chat en tiempo real con Sofía a las 11:42 PM.
• Texto en pantalla: "El 78% compra al primero que responde. Sofía atiende en 1.8s."
• Acento cromático: Neón Cian (#00E5FF) y Violeta Eléctrico.`,
        whatsappLink,
        finalUnifiedPost: resilientCopy,
        suggestedImageUrl: "/marketing/post1-grid-feed.jpg",
      };
    }

    return {
      success: false,
      cmoStrategy: "",
      copyContent: "",
      visualDirection: "",
      whatsappLink: "",
      finalUnifiedPost: `⚠️ Error temporal en los servidores de IA: ${err.message || "Por favor reintenta en unos instantes."}`,
      error: err.message,
    };
  }
}

export interface MetaAdPipelineRequest {
  objective: string;
  niche: string;
  offerType?: string;
  targetAudience?: string;
  customApiKey?: string;
}

export interface MetaAdPipelineResponse {
  success: boolean;
  campaignStructure: {
    campaignObjective: string;
    targetAudience: string;
    recommendedLocations: string;
    detailedTargeting: string[];
    suggestedDailyBudget: string;
    targetCpa: string;
  };
  creativeHooks: {
    angle: string;
    hook: string;
  }[];
  adCopy: {
    primaryText: string;
    headline: string;
    description: string;
    callToActionButton: string;
  };
  whatsAppDestination: {
    deepLink: string;
    prefilledMessage: string;
    qualificationWorkflow: string[];
  };
  visualCreativePrompt: string;
  recommendedTemplateImage?: string;
  error?: string;
}

export async function executeAdsPipeline(
  req: MetaAdPipelineRequest
): Promise<MetaAdPipelineResponse> {
  const apiKey = req.customApiKey || process.env.GEMINI_API_KEY;
  const niche = req.niche || "general";
  const objective = req.objective || "Venta de Agentes IA y Portales Web de alta velocidad";
  const safeText = encodeURIComponent(
    `Hola SincroIA, vi su anuncio de ${niche.replace(/_/g, " ")} y quiero probar a Sofía en vivo y cotizar mi proyecto.`
  );
  const deepLink = `https://wa.me/573124630488?text=${safeText}&utm_source=meta_ads&utm_medium=click_to_whatsapp&utm_campaign=pauta_${niche}`;

  const defaultTemplateImage =
    niche.includes("clinica") || niche.includes("salud")
      ? "/marketing/post5-clinicas-odontologia.jpg"
      : niche.includes("retail") || niche.includes("ecommerce")
      ? "/marketing/post7-planes-precios.jpg"
      : "/marketing/post4-fuga-nocturna.jpg";

  if (!apiKey) {
    return {
      success: false,
      campaignStructure: {
        campaignObjective: "Tráfico o Mensajes a WhatsApp (Click-to-WhatsApp Ads)",
        targetAudience: "Dueños de empresas y profesionales independientes en Colombia",
        recommendedLocations: "Bogotá, Medellín, Cali, Barranquilla, Bucaramanga (Radio 25 km)",
        detailedTargeting: ["Dueños de pequeñas empresas", "Administradores de páginas de Facebook", "Comercio electrónico"],
        suggestedDailyBudget: "$25.000 COP a $40.000 COP / día",
        targetCpa: "< $6.500 COP por conversación iniciada en WhatsApp",
      },
      creativeHooks: [
        { angle: "Dolor Financiero", hook: "¿Cuánto dinero pierde tu empresa cada noche cuando nadie responde en WhatsApp?" },
        { angle: "Velocidad & Ruptura", hook: "El 78% de clientes en Colombia compra al primer negocio que responde en WhatsApp." },
        { angle: "Demostración en Vivo", hook: "Pon a prueba a Sofía en 1.8 segundos tocando el botón de abajo." },
      ],
      adCopy: {
        primaryText: `⚡ Cada segundo que tu cliente espera una respuesta en WhatsApp, es un cliente que le compra a tu competencia.\n\nEn SincroIA implementamos a Sofía, tu agente de Inteligencia Artificial que:\n✅ Responde en 1.8 segundos las 24 horas del día.\n✅ Califica clientes, responde precios y envía cotizaciones.\n✅ Agenda citas directamente en Google Calendar.\n✅ Transfiere a un asesor humano cuando el cliente está listo para pagar.\n\n💼 Implementación llave en mano desde $1.890.000 COP (pago único).\n\n👉 Toca el botón de abajo y pon a prueba a Sofía en vivo ahora mismo.`,
        headline: "Atiende y Vende 24/7 en WhatsApp",
        description: "Prueba a Sofía en 1.8 segundos",
        callToActionButton: "Enviar mensaje de WhatsApp",
      },
      whatsAppDestination: {
        deepLink,
        prefilledMessage: decodeURIComponent(safeText),
        qualificationWorkflow: [
          "Sofía saluda en <1.8s e identifica el nombre del lead.",
          "Pregunta el tipo de negocio y volumen actual de mensajes por WhatsApp.",
          "Cotiza el plan adecuado ($1.89M, $2.49M, $3.69M o $4.89M COP).",
          "Agenda demo o llamada ejecutiva en Google Calendar.",
        ],
      },
      visualCreativePrompt: "Mockup 3D de smartphone con WhatsApp y Sofía en fondo oscuro neón (#0A0F1E).",
      recommendedTemplateImage: defaultTemplateImage,
      error: "Sin clave de API, devolviendo plantilla predeterminada de alto rendimiento.",
    };
  }

  const promptText = `Eres el equipo de élite de adquisición pagada (Meta Ads Manager + Growth Hacker + Direct Response Copywriter) para SincroIA en Colombia y Latinoamérica.
SincroIA vende:
1. Portales web de ultra-alta velocidad en Next.js 15 (<0.8s de carga, PageSpeed 95-100, arquitectura moderna, desde $1.890.000 COP).
2. Agentes de Inteligencia Artificial en WhatsApp 24/7 (Sofía) con respuestas en 1.8 segundos, Google Calendar y Relevo Humano ($2.490.000 COP).
3. E-commerce de Alto Rendimiento ($3.690.000 COP) y Ecosistema Total ($4.890.000 COP).

OBJETIVO DEL ANUNCIO DE PAUTA:
"${objective}"

NICHO O SECTOR:
"${niche}"

PÚBLICO Y CONTEXTO:
"${req.targetAudience || "Dueños de pymes, clínicas, tiendas y gerentes en Colombia"}"

Genera una campaña completa de Meta Ads (Facebook + Instagram) con objetivo Click-to-WhatsApp.
Debes responder ESTRICTAMENTE en formato JSON válido con la siguiente estructura:
{
  "campaignStructure": {
    "campaignObjective": "Objetivo oficial de campaña en Meta Ads Manager",
    "targetAudience": "Definición del avatar",
    "recommendedLocations": "Ciudades y zonas recomendadas en Colombia",
    "detailedTargeting": ["Interés 1", "Interés 2", "Comportamiento 3", "Cargo 4"],
    "suggestedDailyBudget": "Presupuesto sugerido en COP/día",
    "targetCpa": "CPA objetivo por conversación iniciada en WhatsApp"
  },
  "creativeHooks": [
    { "angle": "Ángulo 1 (Dolor Financiero)", "hook": "Gancho de 1 línea para detener el scroll" },
    { "angle": "Ángulo 2 (Autoridad Técnica)", "hook": "Gancho de 1 línea comparativo o técnico" },
    { "angle": "Ángulo 3 (Prueba Inmediata)", "hook": "Gancho de 1 línea de demostración directa" }
  ],
  "adCopy": {
    "primaryText": "Texto principal del anuncio persuasivo, estructurado con emojis y bullets, precios en COP y CTA",
    "headline": "Titular de menos de 6 palabras magnéticas",
    "description": "Descripción corta de enlace",
    "callToActionButton": "Enviar mensaje de WhatsApp"
  },
  "whatsAppDestination": {
    "qualificationWorkflow": [
      "Paso 1 del bot Sofía al recibir el lead",
      "Paso 2 de calificación",
      "Paso 3 de cierre o agendamiento"
    ]
  },
  "visualCreativePrompt": "Prompt detallado para el diseñador del anuncio visual (formato 1:1 o 4:5)"
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const reply = await callGeminiWithResilience(
      ai,
      promptText,
      "Eres un experto en Meta Ads, copywriting de respuesta directa y optimización de conversión con Click-to-WhatsApp en Colombia. Responde únicamente con JSON válido.",
      0.6
    );

    const cleaned = reply.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      success: true,
      campaignStructure: parsed.campaignStructure || {
        campaignObjective: "Interacción / Mensajes a WhatsApp",
        targetAudience: "Dueños de negocio en Colombia",
        recommendedLocations: "Bogotá, Medellín, Cali, Barranquilla",
        detailedTargeting: ["Administradores de páginas", "Pequeñas empresas"],
        suggestedDailyBudget: "$30.000 COP / día",
        targetCpa: "< $7.000 COP",
      },
      creativeHooks: parsed.creativeHooks || [
        { angle: "Pérdida", hook: "¿Cuánto dinero pierde tu empresa cada noche en WhatsApp?" }
      ],
      adCopy: parsed.adCopy || {
        primaryText: "Vende en automático las 24 horas con Sofía.",
        headline: "Agente IA en WhatsApp 24/7",
        description: "Atiende en 1.8 segundos",
        callToActionButton: "Enviar mensaje de WhatsApp",
      },
      whatsAppDestination: {
        deepLink,
        prefilledMessage: decodeURIComponent(safeText),
        qualificationWorkflow: parsed.whatsAppDestination?.qualificationWorkflow || [
          "Sofía recibe el mensaje y responde en 1.8s",
          "Califica el interés y agenda en Google Calendar",
        ],
      },
      visualCreativePrompt: parsed.visualCreativePrompt || "Mockup 3D de WhatsApp en dark mode",
      recommendedTemplateImage: defaultTemplateImage,
    };
  } catch (err: any) {
    console.warn("Fallo procesando JSON de ads, usando fallback de alta conversión:", err.message);
    return {
      success: true,
      campaignStructure: {
        campaignObjective: "Clientes Potenciales / Mensajes a WhatsApp (Click-to-WhatsApp)",
        targetAudience: `Empresarios y directores comerciales del sector ${niche.replace(/_/g, " ")} en Colombia`,
        recommendedLocations: "Colombia (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga)",
        detailedTargeting: [
          "Administradores de páginas comerciales",
          "Comercio minorista y servicios profesionales",
          "Interés en Inteligencia Artificial y Transformación Digital",
        ],
        suggestedDailyBudget: "$25.000 COP a $50.000 COP / día",
        targetCpa: "< $6.000 COP por lead calificado en WhatsApp",
      },
      creativeHooks: [
        {
          angle: "Dolor Financiero & Desatención",
          hook: "¿Cuántos clientes potenciales se fueron con tu competencia anoche porque nadie contestó a tiempo?",
        },
        {
          angle: "Velocidad de Silicon Valley",
          hook: "Tu negocio no necesita más asesores saturados: necesita respuestas en 1.8 segundos las 24 horas.",
        },
        {
          angle: "Demostración Desafiante",
          hook: "Escribe a nuestro WhatsApp ahora mismo y comprueba si eres capaz de corchar a nuestra IA.",
        },
      ],
      adCopy: {
        primaryText: `🚨 El 78% de las compras en Colombia se cierran con el primer negocio que responde.\n\nSi tus clientes escriben a las 9:00 PM y reciben respuesta hasta el día siguiente, estás regalando tu presupuesto de pauta.\n\nEn SincroIA implementamos a Sofía en tu propio número de WhatsApp:\n⚡ Responde en menos de 1.8 segundos las 24 horas del día.\n🧠 Razona con naturalidad, modismos colombianos y resuelve dudas técnicas.\n📅 Conecta con tu Google Calendar y agenda citas automáticamente.\n👤 Transfiere chats calientes a tu WhatsApp personal con un solo clic.\n\n💼 Implementación completa llave en mano por $2.490.000 COP (un único pago, sin mensualidades obligatorias).\n\n👇 Toca el botón 'Enviar mensaje' y compruébalo tú mismo en vivo en este instante.`,
        headline: "Tu Negocio Atendiendo 24/7 en WhatsApp",
        description: "Demostración en vivo en < 1.8 segundos",
        callToActionButton: "Enviar mensaje de WhatsApp",
      },
      whatsAppDestination: {
        deepLink,
        prefilledMessage: decodeURIComponent(safeText),
        qualificationWorkflow: [
          "1. Saludo cálido inmediato y filtro de interés específico en <1.8s.",
          "2. Diagnóstico de volumen de leads y cotización del plan en COP.",
          "3. Agendamiento automático en Google Calendar para llamada de cierre.",
        ],
      },
      visualCreativePrompt: `Diseño publicitario 1:1 o 4:5 con estética tech oscura (#0A0F1E). Al centro, smartphone con WhatsApp abierto a medianoche mostrando mensaje cotizado en pesos y cita confirmada. Badge: '1.8s de respuesta'.`,
      recommendedTemplateImage: defaultTemplateImage,
    };
  }
}
