"use client";
import { motion } from "framer-motion";

export default function ProcessSection() {
  const steps = [
    { num: "01", title: "Diagnóstico", desc: "Auditamos tu operación actual para identificar cuellos de botella donde la IA generará el mayor ROI." },
    { num: "02", title: "Estrategia", desc: "Diseñamos la arquitectura técnica de tu automatización, alineada con tus objetivos de crecimiento." },
    { num: "03", title: "Despliegue", desc: "Implementamos las soluciones con despliegue ágil, garantizando estabilidad desde el primer día." },
    { num: "04", title: "Optimización", desc: "Monitoreo constante y ajustes finos para que tu sistema escale de forma autónoma." }
  ];

  return (
    // 1. Semantic Section con ID para navegación interna (ej: desde el Navbar)
    <section id="proceso" className="pt-16 pb-32 bg-brand-navy" aria-label="Nuestra metodología de trabajo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24 -mt-10"
        >
           <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">02 / Metodología</span>
           {/* H2 semántico para jerarquía de contenido */}
           <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
             Tu hoja de ruta hacia <br />
             <span className="text-gray-500">la autonomía total.</span>
           </h2>
        </motion.div>

        {/* 2. Lista semántica <ol> (Ordered List) perfecta para procesos */}
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-12" role="list">
          {steps.map((step, index) => (
            <motion.li 
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group list-none"
            >
              {/* 3. Article para cada etapa del proceso */}
              <article>
                <div className="text-brand-cyan/20 text-6xl font-bold mb-6 transition-all duration-500 group-hover:text-brand-cyan/40 group-hover:scale-110 origin-left" aria-hidden="true">
                  {step.num}
                </div>
                <h3 className="text-xl font-medium text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{step.desc}</p>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}