// Test suite para verificar las capacidades consultivas de Sofía IA
const API_URL = "http://localhost:3000/api/agent/chat";

const scenarios = [
  {
    name: "1. Lead Caliente - Clínica Odontológica",
    message: "Hola, tengo una clínica odontológica en Bogotá y mis secretarias se demoran mucho confirmando citas por WhatsApp. ¿Cómo me pueden ayudar y qué precio tiene?",
    validate: (reply, action) => {
      const hasCalendarOrCitas = /cita|agenda|calendar|odontol|consulta/i.test(reply);
      const hasPlanOrPrice = /2\.490\.000|Agente IA/i.test(reply);
      const hasAdvancingQuestion = /\?/.test(reply.trim().slice(-120));
      return {
        passed: hasCalendarOrCitas && hasPlanOrPrice && hasAdvancingQuestion,
        details: `Contexto salud: ${hasCalendarOrCitas}, Precio oficial: ${hasPlanOrPrice}, Pregunta de avance: ${hasAdvancingQuestion}`
      };
    }
  },
  {
    name: "2. Objeción Severa de Precio",
    message: "Está muy costoso 2.49 millones, solo tengo 800 mil pesos en mi presupuesto. ¿En cuánto me lo rebajan si cerramos ya mismo?",
    validate: (reply, action) => {
      const avoidsDiscount = !/800\.000|te lo dejo en|descuento especial|rebaja de/i.test(reply);
      const anchorsValue = /nómina|1\.800\.000|prestaciones|inversión|alcance|Alejo/i.test(reply);
      const hasAdvancingQuestion = /\?/.test(reply.trim().slice(-120));
      return {
        passed: avoidsDiscount && anchorsValue && hasAdvancingQuestion,
        details: `Defensa de precio: ${avoidsDiscount}, Anclaje de valor: ${anchorsValue}, Pregunta de avance: ${hasAdvancingQuestion}`
      };
    }
  },
  {
    name: "3. Comparativa WordPress + ManyChat",
    message: "Yo ya tengo mi página montada en WordPress y un bot en ManyChat. ¿Por qué debería pagar por SincroIA si ya tengo eso?",
    validate: (reply, action) => {
      const hasSpeedOrNext = /0\.8|Next|rápida|velocidad|rebote/i.test(reply);
      const hasBotComparison = /botón|ManyChat|lenguaje|contexto|comprensión|rigido|marque/i.test(reply);
      const hasAdvancingQuestion = /\?/.test(reply.trim().slice(-120));
      return {
        passed: hasSpeedOrNext && hasBotComparison && hasAdvancingQuestion,
        details: `Diferenciación web: ${hasSpeedOrNext}, Comparativa ManyChat: ${hasBotComparison}, Pregunta de avance: ${hasAdvancingQuestion}`
      };
    }
  },
  {
    name: "4. Alianza B2B Agencia (SincroPartners)",
    message: "Hola Sofía, tengo una agencia de pauta y marketing digital. Quiero saber si tienen planes para agencias o marca blanca para revender a mis clientes.",
    validate: (reply, action) => {
      const hasPartnersInfo = /SincroPartners|Marca Blanca|25%|20%|afiliad/i.test(reply);
      const hasAction = action === "PARTNER_LEAD";
      return {
        passed: hasPartnersInfo,
        details: `Propuesta B2B: ${hasPartnersInfo}, Acción PARTNER_LEAD: ${hasAction}`
      };
    }
  },
  {
    name: "5. Solicitud Directa de Humano / Relevo",
    message: "Prefiero hablar con una persona real o con Alejo por favor",
    validate: (reply, action, isPaused) => {
      const hasTakeover = action === "HUMAN_TAKEOVER" || isPaused === true;
      const mentionsAlejo = /Alejo|Director/i.test(reply);
      return {
        passed: hasTakeover && mentionsAlejo,
        details: `Relevo Humano activo: ${hasTakeover}, Menciona a Alejo: ${mentionsAlejo}`
      };
    }
  },
  {
    name: "6. Cierre de Reunión con Horario",
    message: "Me parece muy bien, hagamos la videollamada de 15 min. Me queda perfecto mañana a las 3:00 PM por Google Meet.",
    validate: (reply, action) => {
      const hasAction = action === "SCHEDULE_MEETING";
      const confirmsTime = /3:00|mañana|Meet|llamada|reunión/i.test(reply);
      return {
        passed: hasAction || confirmsTime,
        details: `Acción SCHEDULE_MEETING: ${hasAction}, Confirmación de horario: ${confirmsTime}`
      };
    }
  }
];

async function runTests() {
  console.log("===============================================================");
  console.log("🧪 BATERÍA DE PRUEBAS DE VENTA CONSULTIVA - SOFÍA IA");
  console.log("===============================================================\n");

  let passedCount = 0;

  for (const s of scenarios) {
    const sessionId = "test-" + Math.random().toString(36).substring(2, 9);
    console.log(`▶️ [TEST] ${s.name}`);
    console.log(`   👤 Usuario: "${s.message}"`);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: s.message,
          sessionId,
          contactName: "Carlos Mendoza"
        })
      });

      if (!res.ok) {
        console.log(`   ❌ HTTP Error: ${res.status}`);
        continue;
      }

      const json = await res.json();
      const reply = json.data?.reply || "";
      const action = json.data?.action;
      const isPaused = json.isPaused;

      console.log(`   🤖 Sofía:\n"${reply}"`);
      if (action) console.log(`   ⚡ Acción detectada: [${action}]`);

      const result = s.validate(reply, action, isPaused);
      if (result.passed) {
        console.log(`   ✅ PASÓ (${result.details})\n`);
        passedCount++;
      } else {
        console.log(`   ⚠️ REVISAR (${result.details})\n`);
      }
    } catch (err) {
      console.error(`   ❌ Error en ejecución: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  console.log("===============================================================");
  console.log(`📊 RESULTADO FINAL: ${passedCount}/${scenarios.length} pruebas superadas`);
  console.log("===============================================================");
}

runTests();
