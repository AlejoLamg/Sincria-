"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Primera abierta por defecto

  const faqs = [
    {
      question: "¿Cuánto tiempo toma tener mi web o agente de IA funcionando?",
      answer: "El Plan Web Base y el Agente de IA toman entre 1 y 2 semanas de desarrollo ágil. El Plan E-commerce y el Ecosistema Total toman de 2 a 3 semanas. Todos nuestros proyectos incluyen cronograma transparente de entregas y garantía de lanzamiento a satisfacción."
    },
    {
      question: "¿Los precios son de pago único o cobran mensualidades?",
      answer: "La arquitectura, diseño y entrenamiento inicial son de PAGO ÚNICO en pesos colombianos ($1.890.000 a $4.890.000 COP). Además, incluimos el primer mes de servidor en la nube y bolsa de mensajes de IA 100% GRATIS. A partir del mes 2, cuentas con nuestro plan de continuidad SincroCare por solo $190.000 COP/mes (sin contratos de permanencia), o si lo prefieres, te entregamos el código completo para que lo autogestiones sin costo de intermediación."
    },
    {
      question: "¿Emiten factura legal o soporte tributario para mi empresa?",
      answer: "Totalmente. Emitimos factura legal y cuenta de cobro con RUT comercial vigente para que tu empresa pueda deducir el 100% de la inversión en su contabilidad e impuestos ante la DIAN."
    },
    {
      question: "¿Cómo garantizan que el bot de IA no invente respuestas falsas ni se equivoque?",
      answer: "Nuestros agentes operan con guardrails de ingeniería estrictos: el modelo solo responde basándose en tu catálogo, políticas y documentos oficiales. Sofía jamás inventa precios ni promete servicios no autorizados. Si un cliente hace una consulta compleja o pide un humano, el bot le avisa, se silencia automáticamente y te envía una alerta prioritaria a tu celular."
    },
    {
      question: "¿El agente funciona si mi computador está apagado o se va la luz?",
      answer: "Sí, 100%. Tu agente opera en servidores dedicados en la nube 24/7 con disponibilidad 99.9%. No depende de que tu computador o celular estén encendidos ni conectados a Wi-Fi; atiende, cotiza y califica prospectos incluso mientras duermes o estás de viaje."
    },
    {
      question: "¿Qué pasa si ya tengo un hosting o dominio comprado?",
      answer: "Lo integramos sin costo adicional. Conectamos tus registros DNS y desplegamos la plataforma sobre tu infraestructura existente o migramos todo a Next.js 15 sin interrumpir tus correos corporativos ni tu posicionamiento previo en Google."
    },
    {
      question: "¿El agente funciona con mi número actual de WhatsApp Business?",
      answer: "Sí. Podemos vincularlo de forma transparente a tu número actual en menos de 1 minuto mediante conexión multi-dispositivo o WhatsApp Cloud API oficial, sin perder tus chats históricos ni interrumpir tu comunicación diaria."
    },
    {
      question: "¿Cómo es el proceso de pago y contratación?",
      answer: "Manejamos una modalidad segura de 50% de anticipo al firmar la propuesta y 50% final contra entrega a entera satisfacción tras verificar la web o el bot en un entorno privado de pruebas. Aceptamos transferencias Bancolombia, Davivienda, Nequi, Daviplata y links de tarjeta de crédito/débito con Wompi o Bold."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-24 bg-brand-navy border-t border-white/5" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">06 / FAQ</span>
          <h2 id="faq-heading" className="text-3xl md:text-5xl font-light text-white tracking-tight">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
            Respuestas claras y directas sobre nuestros procesos, tecnología e inversión.
          </p>
        </motion.div>

        <div className="space-y-4" role="region" aria-label="Acordeón de preguntas frecuentes">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-brand-surface/90 border-brand-cyan/50 shadow-[0_0_25px_rgba(0,229,255,0.12)]" 
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-brand-cyan font-mono text-xs shrink-0">
                      0{index + 1}.
                    </span>
                    <h3 className="text-white font-medium text-base sm:text-lg">
                      {faq.question}
                    </h3>
                  </div>

                  <span 
                    className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? "border-brand-cyan text-brand-cyan rotate-180 bg-brand-cyan/10" 
                        : "border-white/20 text-gray-400"
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-300 text-sm leading-relaxed border-t border-white/5 pl-12">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}