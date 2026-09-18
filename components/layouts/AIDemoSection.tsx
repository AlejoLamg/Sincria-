"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function AIDemoSection() {
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const scenarios = [
    {
      id: 0,
      title: "Calificación y Cierre 24/7",
      userQuestion: "Hola, me interesa automatizar la atención de mi negocio por WhatsApp. ¿Cómo funciona?",
      botAnswer: "¡Hola! Diseñamos un agente conversacional entrenado con todo tu catálogo, precios y políticas. Atiende a tus clientes en 2 segundos a cualquier hora, responde preguntas frecuentes, filtra prospectos calificados y agenda citas o ventas directamente en tu calendario o CRM. ¿En qué sector está tu empresa?",
      metrics: "Respuesta: 1.8s • Tasa de conversión: +45%",
    },
    {
      id: 1,
      title: "Ventas y Catálogo en E-commerce",
      userQuestion: "¿Tienen disponibilidad de la solución E-commerce y pasarelas de pago colombianas?",
      botAnswer: "Sí, integramos las pasarelas líderes en Colombia: Wompi (Bancolombia), Bold, PayU y PSE. La plataforma cobra en COP, carga en menos de 0.8s en celulares para evitar carritos abandonados e incluye gestión de inventario en tiempo real. ¿Manejas productos físicos o digitales?",
      metrics: "Carga: 0.6s • Pasarelas: Wompi, Bold, PSE",
    },
    {
      id: 2,
      title: "Soporte Técnico y Reservas",
      userQuestion: "¿Puedo sincronizar el agente con Google Calendar para que los clientes reserven solos?",
      botAnswer: "Totalmente. El agente verifica tus horarios disponibles en tiempo real, le ofrece opciones al cliente en WhatsApp, confirma la cita y envía recordatorios automáticos 24 horas antes para evitar inasistencias.",
      metrics: "Reducción de ausencias: 70% • Sincronización: 100%",
    },
  ];

  return (
    <section id="demo-ia" className="py-24 bg-brand-navy border-t border-white/5 relative overflow-hidden" aria-labelledby="demo-heading">
      {/* Luz ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-violet/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">
            Demostración en Vivo
          </span>
          <h2 id="demo-heading" className="text-3xl md:text-5xl font-light text-white tracking-tight">
            Así atiende tu negocio un <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet font-semibold">Agente de IA</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Interactúa con los diferentes escenarios para comprobar la velocidad, tono y precisión con la que nuestros agentes atienden y cierran prospectos.
          </p>
        </motion.div>

        {/* Contenedor del Simulador */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          
          {/* Selector de Escenarios */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">
              Selecciona un caso de uso:
            </span>
            {scenarios.map((scen, idx) => {
              const isSelected = activeScenario === idx;
              return (
                <button
                  key={scen.id}
                  onClick={() => setActiveScenario(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-brand-surface border-brand-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${isSelected ? "text-brand-cyan" : "text-white"}`}>
                      {scen.title}
                    </h3>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {scen.metrics}
                  </p>
                </button>
              );
            })}

            <div className="pt-4">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-xs font-mono text-brand-cyan hover:text-white transition"
              >
                <span>→</span> ¿Quieres este agente en tu empresa? Solicítalo aquí
              </a>
            </div>
          </div>

          {/* Ventana de Chat Mockup */}
          <div className="md:col-span-7">
            <div className="bg-brand-surface/90 border border-brand-cyan/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
              
              {/* Header de la ventana de chat */}
              <div className="bg-neutral-900/80 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-violet flex items-center justify-center text-brand-navy font-bold text-xs">
                      IA
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Sincro Asistente Pro</h4>
                    <p className="text-[11px] text-emerald-400 font-mono">● En línea 24/7 (Respuesta instantánea)</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Demo en Vivo
                </span>
              </div>

              {/* Cuerpo de Mensajes */}
              <div className="p-6 space-y-4 min-h-[290px] flex flex-col justify-end bg-gradient-to-b from-transparent to-black/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScenario}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Mensaje del Usuario */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-brand-cyan/20 border border-brand-cyan/40 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm">
                        {scenarios[activeScenario].userQuestion}
                        <span className="block text-[9px] text-gray-400 text-right mt-1 font-mono">Ahora</span>
                      </div>
                    </div>

                    {/* Mensaje del Agente IA */}
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-cyan/30 text-brand-cyan flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                        IA
                      </div>
                      <div className="max-w-[85%] bg-neutral-900 border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-xs md:text-sm leading-relaxed shadow-md">
                        {scenarios[activeScenario].botAnswer}
                        <span className="block text-[9px] text-brand-cyan text-right mt-1 font-mono">
                          ✓✓ Atendido en 1.8s
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Barra inferior de entrada simulada */}
              <div className="p-4 bg-neutral-900/60 border-t border-white/10 flex items-center gap-3">
                <input 
                  type="text" 
                  disabled 
                  value="Elige un escenario a la izquierda para ver más respuestas..." 
                  className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-400 outline-none"
                />
                <button 
                  disabled 
                  className="p-2.5 rounded-xl bg-brand-cyan text-brand-navy font-bold text-xs opacity-80"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}