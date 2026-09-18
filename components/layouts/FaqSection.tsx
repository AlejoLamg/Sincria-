"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Primera abierta por defecto

  const faqs = [
    {
      question: "¿Cuánto tiempo toma desarrollar una web o IA?",
      answer: "Una Web Base toma de 1 a 2 semanas. Portales de E-commerce o integraciones complejas de IA toman entre 3 y 4 semanas con despliegue continuo."
    },
    {
      question: "¿Los precios son de pago único o mensual?",
      answer: "Nuestros planes de desarrollo son de pago único en pesos colombianos (COP). No cobramos mensualidades obligatorias ni comisiones sobre tus ventas; el código y la plataforma son 100% de tu propiedad."
    },
    {
      question: "¿Necesito conocimientos técnicos para administrarla?",
      answer: "Para nada. Entregamos plataformas autoadministrables, intuitivas y te capacitamos para gestionar contenidos, ventas y datos sin tocar una sola línea de código."
    },
    {
      question: "¿Cómo funciona el soporte técnico?",
      answer: "Incluimos acompañamiento inicial de lanzamiento sin costo adicional. Para monitoreo proactivo 24/7, optimización continua y reportes de rendimiento, cuentas con nuestros planes de membresía especializada."
    },
    {
      question: "¿Qué incluye el dominio y el hosting?",
      answer: "Incluimos el registro de tu dominio .com por el primer año y despliegue en infraestructura global edge de Vercel, garantizando tiempos de carga inferiores a 1 segundo y certificado SSL automático."
    },
    {
      question: "¿El Agente de IA funciona con mi número actual de WhatsApp?",
      answer: "Totalmente. Podemos integrar el agente a tu número empresarial actual mediante vinculación segura o WhatsApp Cloud API. El agente responderá en 2 segundos día y noche, y tu equipo humano puede tomar el control de la conversación en cualquier momento sin fricción."
    },
    {
      question: "¿Qué pasa si ya tengo un sitio web en WordPress o Wix?",
      answer: "Realizamos una migración técnica completa hacia Next.js 15. Diseñamos una plataforma mucho más rápida (< 0.8s), moderna y de alta conversión, preservando tus correos corporativos y tu posicionamiento en Google, pero eliminando las caídas y la lentitud de WordPress."
    },
    {
      question: "¿Cómo se integran los agentes de IA?",
      answer: "Diseñamos asistentes conversacionales entrenados con la base de conocimiento de tu empresa, conectados a tus bases de datos, WhatsApp, CRM o Google Calendar para calificar prospectos y agendar citas de venta 24/7."
    },
    {
      question: "¿Atienden fuera de Bogotá?",
      answer: "Sí. Aunque nuestra sede principal está en Bogotá, trabajamos de forma 100% remota y ágil con clientes en toda Colombia y Latinoamérica."
    },
    {
      question: "¿Cuál es el siguiente paso para iniciar?",
      answer: "Elige tu plan en la sección de inversión, selecciona los módulos que necesites y completa el formulario de cotización. Nuestro equipo te contactará de inmediato por WhatsApp para coordinar la reunión inicial y diagnóstico."
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