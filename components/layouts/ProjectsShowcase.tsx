"use client";

import { motion } from "framer-motion";

export default function ProjectsShowcase() {
  const projects = [
    {
      id: "01",
      category: "E-COMMERCE & RETAIL",
      title: "Ecosistema Transaccional de Alta Velocidad",
      clientType: "Comercio de Moda Urbana & Calzado",
      problem: "La tienda previa en WordPress tardaba 4.3 segundos en abrir en celulares, perdiendo más del 40% del tráfico proveniente de campañas publicitarias en Instagram.",
      solution: "Migración completa a Next.js 15 en Vercel Edge con checkout en 1 clic integrado a Wompi (Bancolombia) y botón de compra asistida por WhatsApp.",
      metrics: [
        { label: "Carga Móvil", value: "0.65s", detail: "Google PageSpeed 98/100" },
        { label: "Carritos Abandonados", value: "-35%", detail: "Recuperación por velocidad" },
        { label: "Comisiones de Plataforma", value: "0%", detail: "A diferencia de Shopify" },
      ],
      tags: ["Next.js 15", "Wompi", "Tailwind CSS", "Vercel Edge"],
    },
    {
      id: "02",
      category: "AUTOMATIZACIÓN CON IA",
      title: "Agente de Calificación y Citas 24/7",
      clientType: "Clínica Odontológica & Estética",
      problem: "El 58% de las consultas de pacientes llegaban después de las 7:00 PM o fines de semana. La atención manual tardaba horas y los pacientes agendaban con otra clínica.",
      solution: "Agente de IA autónomo (Gemini 3.6 Flash) en WhatsApp Business conectado a Google Calendar con recordatorios automáticos anti-inasistencia.",
      metrics: [
        { label: "Tiempo de Respuesta", value: "1.4s", detail: "Atención inmediata 24/7" },
        { label: "Citas Agendadas", value: "+74", detail: "En el primer mes sin humanos" },
        { label: "Inasistencias", value: "-70%", detail: "Recordatorios sincronizados" },
      ],
      tags: ["Gemini 3.6 Flash", "WhatsApp Multi-Device", "Google Calendar API"],
    },
    {
      id: "03",
      category: "B2B & SERVICIOS INDUSTRIALES",
      title: "Portal Corporativo con Cotizador Dinámico",
      clientType: "Servicios de Ingeniería & Logística",
      problem: "Los prospectos esperaban entre 24 y 48 horas una cotización por correo electrónico, enfriando las oportunidades de cierre comercial.",
      solution: "Portal web de carga instantánea con cotizador dinámico paramétrico y despacho automático de cotización con alertas push a Telegram del equipo.",
      metrics: [
        { label: "Tiempo de Carga", value: "0.72s", detail: "Sin caídas de servidor" },
        { label: "Emisión de Cotización", value: "10s", detail: "De 24 horas a 10 segundos" },
        { label: "Conversión a Reunión", value: "+45%", detail: "Cierre en caliente por Meet" },
      ],
      tags: ["Next.js 15", "TypeScript", "Telegram Serverless", "SEO Técnico"],
    },
  ];

  return (
    <section id="proyectos" className="py-28 bg-brand-navy relative overflow-hidden border-t border-white/5" aria-label="Casos de arquitectura y proyectos desarrollados">
      {/* Halo ambiental */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-violet/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">
            03 / Evidencia Tangible
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
            Casos de Arquitectura y <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet font-semibold">Rendimiento Real</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto font-light">
            No prometemos velocidad o automatización en abstracto: cada solución que construimos resuelve cuellos de botella reales con métricas medibles de negocio.
          </p>
        </motion.div>

        {/* Lista de Casos de Estudio */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {projects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="p-7 rounded-2xl bg-brand-surface/60 border border-white/10 hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 group"
            >
              <div>
                {/* Header del Caso */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-brand-cyan uppercase px-2.5 py-1 rounded-md bg-brand-cyan/10 border border-brand-cyan/20">
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    Caso #{project.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-gray-400 mb-6">
                  {project.clientType}
                </p>

                {/* Problema vs Solución */}
                <div className="space-y-4 text-xs leading-relaxed mb-6">
                  <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-gray-300">
                    <strong className="text-red-400 block mb-1 font-mono uppercase text-[10px]">
                      ⚠️ Cuello de botella inicial:
                    </strong>
                    {project.problem}
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-gray-300">
                    <strong className="text-emerald-400 block mb-1 font-mono uppercase text-[10px]">
                      ⚡ Solución SincroIA:
                    </strong>
                    {project.solution}
                  </div>
                </div>

                {/* Métricas de Rendimiento */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-900/80 border border-white/5 mb-6 text-center">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-0.5">
                      <span className="text-base sm:text-lg font-bold font-mono text-white block">
                        {metric.value}
                      </span>
                      <span className="text-[10px] font-medium text-brand-cyan block">
                        {metric.label}
                      </span>
                      <span className="text-[9px] text-gray-400 block font-mono">
                        {metric.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Tecnológicos */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Banner de Cierre hacia Acción */}
        <div className="mt-14 p-6 rounded-2xl bg-gradient-to-r from-brand-surface via-neutral-900 to-brand-surface border border-brand-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">¿Quieres un diagnóstico de rendimiento para tu empresa?</h4>
            <p className="text-xs text-gray-400 mt-0.5">Analizamos tu velocidad actual, fugas de prospectos y potencial de automatización en 24h.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contacto"
              className="px-5 py-2.5 rounded-xl bg-brand-cyan hover:bg-white text-brand-navy font-bold font-mono text-xs tracking-wider transition-all shadow-md"
            >
              SOLICITAR DIAGNÓSTICO
            </a>
            <a
              href="https://wa.me/573124630488?text=Hola%20Sof%C3%ADa%2C%20quiero%20ver%20c%C3%B3mo%20vendes%20en%20vivo%20y%20hacerte%20unas%20preguntas."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-brand-cyan text-white hover:text-brand-cyan font-mono text-xs transition-all"
            >
              CHATEAR CON SOFÍA
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
