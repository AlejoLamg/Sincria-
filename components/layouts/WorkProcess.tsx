"use client";
import { motion } from "framer-motion";

export default function WorkProcess() {
  const steps = [
    { num: "01", time: "Día 1", title: "Diagnóstico en 24h", desc: "Auditamos tu modelo actual para identificar los cuellos de botella con mayor retorno de inversión (ROI)." },
    { num: "02", time: "Día 2-3", title: "Arquitectura Estratégica", desc: "Diseñamos la interfaz de alta conversión y entrenamos los flujos del agente de IA con tu información." },
    { num: "03", time: "Semana 1-2", title: "Despliegue Ágil", desc: "Programación en Next.js, conexión de WhatsApp y pruebas exhaustivas de carga y rendimiento." },
    { num: "04", time: "Garantía", title: "Lanzamiento y Soporte", desc: "Capacitación personalizada, puesta en marcha y optimización continua basada en datos de usuarios." }
  ];

  return (
    <section id="proceso" className="py-24 bg-brand-navy border-t border-white/5" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">02 / Metodología</span>
          <h2 id="process-heading" className="text-4xl md:text-6xl font-light text-white tracking-tight">Tu transformación, <br />en cuatro etapas claras.</h2>
        </div>

        {/* Lista semántica para procesos */}
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {steps.map((step, index) => (
            <motion.li 
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="list-none"
            >
              <article className="relative p-6 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-brand-cyan/50 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-brand-cyan/25 text-4xl font-bold font-mono group-hover:text-brand-cyan/50">
                      {step.num}
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                      {step.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}