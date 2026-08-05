"use client";

import { motion } from "framer-motion";

export default function FaqSection() {
  const faqs = [
    {
      question: "¿Cuánto tiempo toma desarrollar una web o IA?",
      answer: "Una Web Base toma de 1 a 2 semanas. Portales de E-commerce o integraciones complejas de IA toman entre 3 y 4 semanas."
    },
    {
      question: "¿Los precios son de pago único o mensual?",
      answer: "Nuestros planes de desarrollo son de pago único. Solo el 'Ecosistema Total' incluye una membresía de soporte mensual opcional."
    },
    {
      question: "¿Necesito conocimientos técnicos para administrarla?",
      answer: "Para nada. Entregamos plataformas autoadministrables, intuitivas y te capacitamos para gestionar todo sin programar."
    },
    {
      question: "¿Cómo funciona el soporte técnico?",
      answer: "Incluimos acompañamiento inicial de lanzamiento. Para monitoreo continuo 24/7 y reportes, cuentas con nuestra membresía especializada."
    },
    {
      question: "¿Qué incluye el dominio y el hosting?",
      answer: "Incluimos el registro de tu dominio .com y despliegue global en Vercel, garantizando velocidad extrema y certificado SSL."
    },
    {
      question: "¿Cómo se integran los agentes de IA?",
      answer: "Diseñamos asistentes conversacionales conectados a tus bases de datos o catálogos para atender y calificar prospectos 24/7."
    },
    {
      question: "¿Atienden fuera de Bogotá?",
      answer: "Sí. Aunque estamos en Bogotá, desarrollamos soluciones digitales de alto rendimiento para clientes en toda Colombia y Latinoamérica."
    },
    {
      question: "¿Cuál es el siguiente paso para iniciar?",
      answer: "Solo elige tu plan ideal en la sección de inversión o escríbenos directamente. Nuestro equipo te atenderá de inmediato."
    }
  ];

  return (
    <section className="py-24 bg-brand-navy border-t border-white/5" aria-labelledby="faq-heading">
      <div className="max-w-6xl mx-auto px-6">
        
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

        <ul className="grid md:grid-cols-2 gap-6" role="list">
          {faqs.map((faq, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-6 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-brand-cyan/40 transition-all list-none flex flex-col justify-between"
            >
              <article>
                <h3 className="text-white font-medium text-base mb-2 flex items-start gap-2">
                  <span className="text-brand-cyan font-mono text-sm shrink-0">0{index + 1}.</span>
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}