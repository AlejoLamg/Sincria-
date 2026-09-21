"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIDemoSection() {
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const scenarios = [
    {
      id: 0,
      title: "Clínicas & Salud (Citas 24/7)",
      industry: "Salud y Estética",
      userQuestion: "Buenas noches, ¿tienen disponibilidad para una valoración de ortodoncia este sábado en la tarde?",
      botAnswer: "¡Hola! Con mucho gusto. Para este sábado tenemos disponibles las 3:30 PM y las 5:00 PM con la Dra. Gómez en la sede norte. La valoración incluye diagnóstico 3D preliminar. ¿Cuál de estos dos horarios te queda más cómodo para apartar tu cupo?",
      metrics: "Respuesta: 1.4s • Agendamiento: Automático",
    },
    {
      id: 1,
      title: "Inmobiliarias & B2B (Calificación)",
      industry: "Bienes Raíces / Asesoría",
      userQuestion: "Hola, me interesa información del apartamento en venta en Rosales.",
      botAnswer: "¡Excelente día! El apartamento en Rosales tiene 115m², 3 habitaciones, 2 parqueaderos y vista panorámica. Su valor es de $780M COP (admón: $520.000). ¿Buscas para inversión o para habitar con tu familia? ¿Cuentas con crédito aprobado o pago de contado?",
      metrics: "Filtro de prospectos: 100% autónomo",
    },
    {
      id: 2,
      title: "Retail & E-commerce (Cobro Wompi/Bold)",
      industry: "Tiendas y Comercio",
      userQuestion: "¿Tienen la chaqueta impermeable en talla M color negro y cuánto cuesta el envío a Medellín?",
      botAnswer: "¡Hola! Sí la tenemos disponible en talla M negro para despacho inmediato. Su valor es de $189.000 COP y el envío a Medellín toma 24-48 horas ($14.000 o GRATIS por compras superiores a $250.000). ¿Deseas que te genere el enlace de pago seguro por Wompi/Bancolombia o Nequi?",
      metrics: "Cierre de venta: Inmediato con pasarela",
    },
    {
      id: 3,
      title: "Sofía de SincroIA (Ventas de Software)",
      industry: "Agencia SincroIA",
      userQuestion: "¿Por qué debería contratar su Agente de IA en vez de contratar a una recepcionista?",
      botAnswer: "¡Gran pregunta! Una persona solo atiende 8 horas al día, descansa fines de semana y puede demorar minutos en responder mientras atiende a otro cliente. Nuestro agente atiende a 50 clientes en simultáneo en menos de 2 segundos, no descansa nunca y cuesta una fracción de una nómina mensual. Además, si tú deseas intervenir en cualquier chat, el bot se silencia y te cede el control. ¿Quieres agendar una demo corta de 15 min por Meet?",
      metrics: "Disponibilidad: 24/7/365 • Relevo Humano: Activo",
    },
  ];

  const verticalBenefits = [
    {
      icon: "🏥",
      vertical: "Salud & Clínicas Estéticas",
      headline: "Hasta +65% en Citas Efectivas",
      description: "Métrica observada en pilotos del sector salud: los pacientes agendan fuera de horario y los recordatorios automáticos reducen el absentismo.",
    },
    {
      icon: "🏢",
      vertical: "Inmobiliarias & Concesionarios",
      headline: "Filtro Automático de Curiosos",
      description: "Filtra en 3 preguntas el presupuesto y capacidad crediticia antes de transferir el lead calificado al WhatsApp de tu equipo comercial.",
    },
    {
      icon: "🛍️",
      vertical: "Comercio & Servicios B2B",
      headline: "Cobros en Caliente 24/7",
      description: "Muestra catálogo, responde dudas técnicas de productos y envía botones de pago por Wompi, Bold o PSE en el momento exacto de interés.",
    }
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
            Comprueba la velocidad, naturalidad y psicología de cierre de nuestros agentes en diferentes sectores comerciales de Colombia.
          </p>
        </motion.div>

        {/* Contenedor del Simulador */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          
          {/* Selector de Escenarios: Horizontal scroll en móviles, vertical en desktop */}
          <div className="md:col-span-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Selecciona una industria:
              </span>
              <span className="text-[10px] font-mono text-brand-cyan/70 md:hidden">
                Desliza →
              </span>
            </div>
            
            <div 
              style={{ WebkitOverflowScrolling: "touch" }}
              className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2.5 md:space-y-3 md:gap-0 pb-3 md:pb-0 snap-x snap-mandatory scrollbar-none"
            >
              {scenarios.map((scen, idx) => {
                const isSelected = activeScenario === idx;
                return (
                  <button
                    key={scen.id}
                    onClick={() => setActiveScenario(idx)}
                    className={`min-w-[240px] md:min-w-0 md:w-full text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer snap-start shrink-0 ${
                      isSelected
                        ? "bg-brand-surface border-brand-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-brand-cyan/80 block uppercase tracking-wider">
                          {scen.industry}
                        </span>
                        <h3 className={`text-sm font-medium ${isSelected ? "text-white font-semibold" : "text-gray-200"}`}>
                          {scen.title}
                        </h3>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 font-mono">
                      {scen.metrics}
                    </p>
                  </button>
                );
              })}
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
                    <h4 className="text-sm font-semibold text-white">Sofía • Sincro Asistente Pro</h4>
                    <p className="text-[11px] text-emerald-400 font-mono">● En línea 24/7 (Respuesta &lt; 2s)</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Simulación
                </span>
              </div>

              {/* Cuerpo de Mensajes */}
              <div className="p-6 space-y-4 min-h-[300px] flex flex-col justify-end bg-gradient-to-b from-transparent to-black/20">
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
                          ✓✓ Atendido en tiempo récord
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
                  value="Elige una industria a la izquierda para ver cómo responde..." 
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

        {/* TARJETA DE CONVERSIÓN DIRECTA A WHATSAPP REAL (Elimina el escepticismo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-brand-surface via-neutral-900 to-brand-surface border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Agente en Vivo Disponible
            </div>
            <h3 className="text-lg font-bold text-white">¿Quieres probar a Sofía en tu propio WhatsApp ahora mismo?</h3>
            <p className="text-xs text-gray-400 max-w-lg">
              Haz clic y envíale cualquier pregunta difícil sobre desarrollo o cotizaciones. Te responderá en menos de 2 segundos.
            </p>
          </div>

          <a
            href="https://wa.me/573124630488?text=Hola%20Sof%C3%ADa%2C%20quiero%20ver%20c%C3%B3mo%20vendes%20en%20vivo%20y%20hacerte%20unas%20preguntas."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 flex items-center gap-2"
          >
            <span>💬 CHATEAR CON SOFÍA EN VIVO</span>
            <span>→</span>
          </a>
        </motion.div>

        {/* CASOS DE ESTUDIO / VERTICALES DE NEGOCIO */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan">Sectores de Alto Impacto</span>
            <h3 className="text-2xl font-light text-white mt-1">Soluciones diseñadas para los dolores de tu industria</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {verticalBenefits.map((item) => (
              <div 
                key={item.vertical}
                className="p-6 rounded-2xl bg-brand-surface/40 border border-white/10 hover:border-brand-cyan/40 transition-all duration-300 space-y-3"
              >
                <span className="text-3xl block" aria-hidden="true">{item.icon}</span>
                <span className="text-xs font-mono text-brand-cyan block">{item.vertical}</span>
                <h4 className="text-base font-bold text-white">{item.headline}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}