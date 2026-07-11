"use client";
import { motion } from "framer-motion";

export default function WorkProcess() {
  const steps = [
    { num: "01", title: "Diagnóstico Técnico", desc: "Auditamos tu infraestructura actual para identificar cuellos de botella y oportunidades de IA." },
    { num: "02", title: "Arquitectura a Medida", desc: "Diseñamos el ecosistema digital (Web + IA) alineado a tus objetivos de negocio." },
    { num: "03", title: "Despliegue Ágil", desc: "Implementación en Vercel con integración de módulos expertos y automatizaciones." },
    { num: "04", title: "Optimización Continua", desc: "Mantenimiento proactivo y ajustes basados en métricas reales de rendimiento." }
  ];

  return (
    <section id="proceso" className="py-24 bg-brand-navy border-t border-white/5" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">04 / Metodología</span>
          <h2 id="process-heading" className="text-4xl md:text-6xl font-light text-white tracking-tight">Tu transformación, <br />en cuatro etapas.</h2>
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
              /* INTERACTIVIDAD: Escalado y elevación al pasar el mouse */
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="list-none"
            >
              <article className="relative p-6 border border-white/5 rounded-2xl bg-white/[0.02] hover:border-brand-cyan/50 hover:bg-white/[0.04] transition-all duration-300 h-full">
                <div className="text-brand-cyan/20 text-4xl font-bold mb-4 transition-colors group-hover:text-brand-cyan/40">
                  {step.num}
                </div>
                <h3 className="text-lg font-medium text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}