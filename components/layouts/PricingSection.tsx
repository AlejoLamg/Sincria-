"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProjectConfig } from "@/context/ProjectConfigContext";

export default function PricingSection() {
  const { selectedPlan, selectPlanByName } = useProjectConfig();
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpanded = (planName: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planName]: !prev[planName],
    }));
  };

  const plans = [
    {
      name: "WEB BASE",
      price: "1.890.000",
      billing: "Pago único • Sin mensualidades",
      features: [
        "Arquitectura de alto rendimiento optimizada para cargas inferiores a 0.8s bajo condiciones objetivo (Next.js 15)",
        "Infraestructura Cloud Edge orientada a 99.9% de disponibilidad (Vercel)",
        "Dominio profesional .com o .co incluido por 1 año",
        "Configuración SEO técnica inicial para facilitar indexación en Google",
        "Diseño impecable y 100% Mobile-First de alta conversión",
        "Entrega ágil en 1 a 2 semanas con garantía de lanzamiento"
      ],
    },
    {
      name: "IA PRO",
      price: "2.490.000",
      billing: "Pago único • Automatización 24/7",
      features: [
        "Agente de IA entrenado con la información y catálogo de tu empresa",
        "Atención y calificación de prospectos 24/7 en WhatsApp y Web",
        "Respuestas en tiempo real con objetivo < 2s sin pausas ni descansos",
        "Agendamiento automático sincronizado con Google Calendar",
        "Protocolo de Relevo Humano: si tú intervienes, el bot se silencia solo",
        "Alertas push inmediatas a tu celular cuando un cliente esté listo para comprar"
      ],
    },
    {
      name: "E-COMMERCE",
      price: "3.690.000",
      billing: "Pago único • Cero comisiones por venta",
      features: [
        "Tienda virtual transaccional de alta velocidad optimizada para vender",
        "Integración de pasarelas Colombia: Wompi, Bold, PSE, Nequi y Tarjetas",
        "Optimizado para cargas inferiores a 0.8s bajo condiciones objetivo para reducir rebote",
        "Gestión ágil de catálogo, inventario, tallas y pedidos",
        "Botón de pedido asistido directo a WhatsApp con resumen de orden",
        "Capacitación personalizada y acompañamiento de lanzamiento"
      ],
    },
    {
      name: "ECOSISTEMA TOTAL",
      price: "4.890.000",
      billing: "Pago único • Ahorras $700.000 COP",
      popular: true,
      features: [
        "Portal Web optimizado < 0.8s + Agente de IA para WhatsApp y Web",
        "Sincronización total: los leads web pasan a WhatsApp en automático",
        "Pasarela de pagos colombiana o cotizador dinámico incluido",
        "Calificación de prospectos y agendamiento 24/7 sin intervención humana",
        "Soporte técnico prioritario VIP + 1 hora de capacitación privada",
        "100% código propio sin ataduras ni mensualidades forzosas"
      ],
    }
  ];

  const decisionPriorities = [
    { 
      label: "💬 Atención WhatsApp", 
      plan: "IA PRO", 
      desc: "Ventas y citas 24/7",
      reason: "Atiende en 2s, filtra presupuesto y sincroniza citas en Google Calendar." 
    },
    { 
      label: "⚡ Web Ultra Rápida", 
      plan: "WEB BASE", 
      desc: "Carga veloz < 0.8s",
      reason: "Portal corporativo en Next.js 15 optimizado para cargas < 0.8s bajo condiciones objetivo." 
    },
    { 
      label: "🛍️ Tienda Virtual", 
      plan: "E-COMMERCE", 
      desc: "Wompi / PSE / Bold",
      reason: "Catálogo transaccional rápido, 0% comisiones por venta y cobro asistido por WhatsApp." 
    },
    { 
      label: "🚀 Todo en Uno (VIP)", 
      plan: "ECOSISTEMA TOTAL", 
      desc: "Web + Bot IA", 
      popular: true,
      reason: "Solución llave en mano con integración total. Ahorras $700.000 COP frente a planes por separado." 
    },
  ];

  const activePriority = decisionPriorities.find((p) => p.plan === selectedPlan?.name);

  return (
    <section id="planes" className="py-16 md:py-24 bg-brand-navy relative overflow-hidden" aria-label="Planes de inversión">
      {/* Halo de luz difuminada (Blur de fondo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-cyan/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">03 / Inversión Transparente</span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Soluciones diseñadas para escalar tu ROI.
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto font-light">
            Tecnología de nivel corporativo a una fracción del costo de agencias tradicionales ($8.000.000 a $15.000.000 COP) o nóminas internas. Precios en pesos colombianos, sin costes ocultos.
          </p>
        </motion.div>

        {/* Guía Interactiva de Decisión: "¿Cuál de estas soluciones necesitas?" */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono text-[10px] tracking-wider uppercase mb-1">
              <span>🎯</span> ¿Cuál de estas soluciones necesitas?
            </span>
            <p className="text-xs text-gray-300">
              Selecciona tu objetivo principal para recomendarte la configuración exacta para tu empresa:
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {decisionPriorities.map((item) => {
              const isMatch = selectedPlan?.name === item.plan;
              return (
                <button
                  key={item.plan}
                  type="button"
                  onClick={() => selectPlanByName(item.plan)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isMatch
                      ? "bg-brand-cyan/20 border-brand-cyan text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] ring-1 ring-brand-cyan"
                      : "bg-white/[0.03] border-white/10 text-gray-300 hover:border-brand-cyan/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs block truncate text-white">{item.label}</span>
                    {item.popular && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-brand-cyan text-brand-navy font-bold uppercase shrink-0">
                        Top
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block mt-1 truncate">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Banner de Recomendación Contextual */}
          {activePriority && selectedPlan && (
            <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-brand-surface/90 border border-brand-cyan/40 shadow-[0_0_25px_rgba(0,229,255,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block font-bold">
                  🎯 Recomendación para tu caso:
                </span>
                <p className="text-white text-xs sm:text-sm font-semibold mt-0.5">
                  {selectedPlan.name} (${selectedPlan.price.toLocaleString("es-CO")} COP) — <span className="font-normal text-gray-300">{activePriority.reason}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('modulos')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 bg-brand-cyan text-brand-navy font-mono text-xs font-bold rounded-lg hover:bg-white transition-all shrink-0 cursor-pointer shadow-md"
              >
                Ver Módulos Compatibles ↓
              </button>
            </div>
          )}
        </div>
        
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch" role="list">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan?.name === plan.name;
            return (
              <motion.li 
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 list-none group relative ${
                  isSelected
                    ? "bg-brand-surface border-2 border-brand-cyan shadow-[0_0_30px_rgba(0,229,255,0.3)] scale-[1.02]"
                    : plan.popular 
                    ? "bg-brand-surface/90 border-2 border-brand-cyan/70 shadow-[0_20px_50px_rgba(0,229,255,0.12)] hover:-translate-y-2" 
                    : "bg-brand-surface/40 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 hover:border-brand-cyan/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
                }`}
              >
                {isSelected ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-cyan text-brand-navy font-mono text-[9px] tracking-widest font-bold rounded-full uppercase shadow-lg">
                    ✓ Seleccionado
                  </span>
                ) : plan.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-cyan text-brand-navy font-mono text-[9px] tracking-widest font-bold rounded-full uppercase shadow-lg">
                    Recomendado
                  </span>
                ) : null}

                <article className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-brand-cyan font-mono text-xs tracking-widest mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <div className="text-2xl sm:text-3xl font-bold text-white">
                        ${plan.price} <span className="text-xs font-mono text-brand-cyan">COP</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400 mt-1 block">
                        {plan.billing}
                      </span>
                    </div>
                    
                    {(() => {
                      const isExpanded = !!expandedPlans[plan.name];
                      return (
                        <>
                          <ul className="space-y-3 mb-4" role="list">
                            {plan.features.map((feat, fIndex) => {
                              const hideOnMobile = fIndex >= 3 && !isExpanded;
                              return (
                                <li 
                                  key={feat} 
                                  className={`text-gray-300 text-xs leading-relaxed items-start ${
                                    hideOnMobile ? "hidden md:flex" : "flex"
                                  }`}
                                >
                                  <span className="text-brand-cyan mr-2 shrink-0" aria-hidden="true">•</span> {feat}
                                </li>
                              );
                            })}
                          </ul>

                          {/* Botón de revelación progresiva visible solo en celulares */}
                          {plan.features.length > 3 && (
                            <div className="md:hidden mb-6 text-center">
                              <button
                                type="button"
                                onClick={() => togglePlanExpanded(plan.name)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-brand-cyan hover:text-white py-1.5 px-3 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 transition-colors active:scale-95 cursor-pointer"
                              >
                                <span>{isExpanded ? "Ocultar detalles ↑" : `+ Ver ${plan.features.length - 3} características más ↓`}</span>
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      selectPlanByName(plan.name);
                      document.getElementById('modulos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block text-center w-full py-3 rounded-lg transition-all font-bold text-xs tracking-wider cursor-pointer ${
                      isSelected
                        ? "bg-brand-cyan text-brand-navy shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                        : plan.popular
                        ? "bg-brand-cyan text-brand-navy hover:bg-white shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                        : "border border-white/20 text-white hover:bg-brand-cyan hover:text-brand-navy hover:border-brand-cyan"
                    }`}
                  >
                    {isSelected ? "✓ PLAN SELECCIONADO" : `ELEGIR ${plan.name}`}
                  </button>
                </article>
              </motion.li>
            );
          })}
        </ul>

        {/* PLAN DE CONTINUIDAD OPERATIVA Y RETENCIÓN (SincroCare) */}
        <div className="mt-10 md:mt-14 p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-surface/90 via-neutral-900/90 to-brand-surface/90 border border-brand-cyan/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono text-[10px] tracking-wider uppercase mb-2">
                <span>🛡️</span> Plan de Continuidad Operativa (SincroCare)
              </div>
              <h3 className="text-xl font-bold text-white">¿Cómo funcionan los servidores cloud y el consumo de IA?</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                Tu implementación incluye el <span className="text-brand-cyan font-medium">primer mes de servidor 24/7 y bolsa de mensajes de IA 100% GRATIS</span>. A partir del 2do mes, cuentas con nuestro plan de acompañamiento para que nunca te preocupes por caídas técnicas.
              </p>
            </div>
            <div className="text-left md:text-right shrink-0">
              <span className="text-2xl font-bold font-mono text-white">$190.000 <span className="text-xs text-brand-cyan font-normal">COP/mes</span></span>
              <span className="block text-[10px] font-mono text-gray-400">A partir del mes 2 • Sin permanencia</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-6 text-xs text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-base shrink-0">✓</span>
              <div>
                <strong className="text-white block mb-0.5">Infraestructura Cloud Edge & Monitoreo 24/7:</strong>
                Tu bot y web se mantienen en infraestructura Cloud Edge administrada y orientada a 99.9% de disponibilidad.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-base shrink-0">✓</span>
              <div>
                <strong className="text-white block mb-0.5">Bolsa de Tokens & Calibración de IA:</strong>
                Cubre el consumo de miles de respuestas mensuales y re-entrenamiento periódico de prompts.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-base shrink-0">✓</span>
              <div>
                <strong className="text-white block mb-0.5">Soporte Técnico & Reconexiones:</strong>
                Monitoreo de sesión de WhatsApp, copias de seguridad continuas y asistencia prioritaria.
              </div>
            </div>
          </div>

          <p className="text-[11px] font-mono text-gray-400 text-center mt-6 pt-4 border-t border-white/5">
            💡 <span className="text-gray-300 font-semibold">100% Libertad:</span> Si tu empresa prefiere gestionar sus propias cuentas de API y servidores, te entregamos el código completo sin ataduras ni intermediarios.
          </p>
        </div>

        {/* Garantías y Reducción de Riesgo (Neuromarketing) */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-brand-surface/70 border border-white/10 grid md:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl text-brand-cyan" aria-hidden="true">⚡</span>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Objetivo &lt; 0.8s</h4>
              <p className="text-[11px] text-gray-400">Arquitectura de ingeniería orientada a score 90+ en PageSpeed.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl text-brand-cyan" aria-hidden="true">🤝</span>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Capacitación y Soporte</h4>
              <p className="text-[11px] text-gray-400">Acompañamiento inicial y entrega guiada.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl text-brand-cyan" aria-hidden="true">📜</span>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">100% de tu Propiedad</h4>
              <p className="text-[11px] text-gray-400">Sin ataduras: el código y tus datos te pertenecen.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}