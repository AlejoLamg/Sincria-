"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useProjectConfig, formatCOP } from "@/context/ProjectConfigContext";

const RESPONSE_OPTIONS = [
  { label: "< 15 min", penalty: 0.15, desc: "Pérdida baja" },
  { label: "30 - 60 min", penalty: 0.30, desc: "Pérdida moderada" },
  { label: "2 - 4 horas", penalty: 0.45, desc: "Pérdida crítica" },
  { label: "Al día siguiente", penalty: 0.65, desc: "Fuga masiva" },
];

export default function ROICalculator() {
  const { selectPlanByName } = useProjectConfig();

  // Estados interactivos
  const [leadsMonth, setLeadsMonth] = useState<number>(150);
  const [avgTicket, setAvgTicket] = useState<number>(250000);
  const [responseTime, setResponseTime] = useState<number>(2); // 0: <15m, 1: 30-60m, 2: 2-4h, 3: >4h / día siguiente

  // Cálculos en tiempo real basados en benchmarks de ventas B2B
  const { lostLeads, lostMoneyMonth, hoursSaved, paybackDays } = useMemo(() => {
    const penaltyRate = RESPONSE_OPTIONS[responseTime].penalty;
    // Tasa base de conversión potencial si se respondiera en 2 segundos
    const potentialConversionRate = 0.20; 
    
    // Clientes perdidos exclusivamente por fricción de tiempo de respuesta
    const lostClients = Math.max(1, Math.round(leadsMonth * potentialConversionRate * penaltyRate));
    const lostCash = lostClients * avgTicket;

    // Horas ahorradas: promedio de 8 minutos de atención humana por consulta
    const savedHours = Math.round((leadsMonth * 8) / 60);

    // Días para recuperar la inversión de un Agente IA ($2.490.000 COP)
    const dailyLoss = lostCash / 30;
    const payback = dailyLoss > 0 ? Math.max(5, Math.min(90, Math.round(2490000 / dailyLoss))) : 30;

    return {
      lostLeads: lostClients,
      lostMoneyMonth: lostCash,
      hoursSaved: savedHours,
      paybackDays: payback,
    };
  }, [leadsMonth, avgTicket, responseTime]);

  const handleSelectAndScroll = () => {
    selectPlanByName("IA PRO");
    document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="calculadora-roi" className="py-24 bg-brand-navy border-t border-white/5 relative overflow-hidden" aria-labelledby="roi-heading">
      {/* Luz ambiental difuminada */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-violet/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Encabezado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">
            02.5 / Calculadora de Retorno de Inversión
          </span>
          <h2 id="roi-heading" className="text-3xl md:text-5xl font-light text-white tracking-tight">
            Descubre cuánto dinero pierde tu negocio <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet font-semibold">
              por no responder en 2 segundos
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto font-light leading-relaxed">
            El 78% de los compradores en internet cierran con el primer proveedor que responde. Modela tus variables operativas actuales y proyecta el impacto económico estimado de automatizar tu atención con IA.
          </p>
        </motion.div>

        {/* Panel Interactivo de la Calculadora */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Columna Izquierda: Parámetros y Sliders */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-brand-surface/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-8"
          >
            
            {/* Control 1: Consultas al mes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="leads-slider" className="text-xs font-mono uppercase tracking-wider text-gray-300">
                  1. Mensajes / Prospectos al mes:
                </label>
                <span className="text-lg font-bold font-mono text-brand-cyan px-3 py-1 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                  {leadsMonth} <span className="text-xs font-normal text-gray-400">leads/mes</span>
                </span>
              </div>
              <input
                id="leads-slider"
                type="range"
                min="20"
                max="1000"
                step="10"
                value={leadsMonth}
                onChange={(e) => setLeadsMonth(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                aria-label="Mensajes o prospectos mensuales"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>20 al mes</span>
                <span>500</span>
                <span>1.000+ al mes</span>
              </div>
            </div>

            {/* Control 2: Ticket promedio en COP */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="ticket-slider" className="text-xs font-mono uppercase tracking-wider text-gray-300">
                  2. Valor promedio de tu venta (Ticket):
                </label>
                <span className="text-lg font-bold font-mono text-brand-cyan px-3 py-1 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                  {formatCOP(avgTicket)}
                </span>
              </div>
              <input
                id="ticket-slider"
                type="range"
                min="50000"
                max="2500000"
                step="25000"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                aria-label="Valor promedio de venta por cliente en COP"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>$50.000 COP</span>
                <span>$1.000.000 COP</span>
                <span>$2.500.000+ COP</span>
              </div>
            </div>

            {/* Control 3: Tiempo promedio de respuesta actual */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-300 block">
                3. ¿Cuánto tarda hoy tu equipo en responder un mensaje?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {RESPONSE_OPTIONS.map((opt, index) => {
                  const isSelected = responseTime === index;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setResponseTime(index)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-cyan/15 border-brand-cyan text-white shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                          : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold font-mono">{opt.label}</p>
                      <span className="text-[9px] text-gray-400 block mt-0.5">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>

          {/* Columna Derecha: Tarjeta de Resultados de Impacto */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gradient-to-b from-brand-surface to-[#0d1326] p-6 sm:p-8 rounded-3xl border-2 border-brand-cyan/40 shadow-[0_20px_50px_rgba(0,229,255,0.12)] flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-cyan uppercase block mb-2">
                Pérdida Mensual Estimada (Simulación)
              </span>
              
              {/* Cifra de Pérdida en Grande */}
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-white">
                  -{formatCOP(lostMoneyMonth)}
                </div>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Ventas no concretadas que terminan comprando a competidores más rápidos.
                </p>
              </div>

              {/* Métricas de Impacto */}
              <div className="space-y-3 pt-4 border-t border-white/10 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Clientes perdidos por lentitud:
                  </span>
                  <span className="font-bold text-white font-mono">~{lostLeads} ventas/mes</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                    Tiempo operativo ahorrado:
                  </span>
                  <span className="font-bold text-brand-cyan font-mono">~{hoursSaved} hrs/mes</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Retorno de inversión estimado:
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">En {paybackDays} días</span>
                </div>
              </div>
            </div>

            {/* CTA de Cierre */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleSelectAndScroll}
                className="w-full py-4 rounded-xl bg-brand-cyan text-brand-navy font-mono font-bold text-xs tracking-wider uppercase hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all cursor-pointer text-center active:scale-[0.98]"
              >
                Detener Pérdidas y Activar IA →
              </button>
              <p className="text-[10px] text-center text-gray-400 font-mono">
                ⚡ Respuesta en 1.8 segundos • Atención ininterrumpida 24/7
              </p>
              <p className="text-[9px] text-gray-500 font-mono leading-relaxed text-center pt-2 border-t border-white/5">
                * Estimación matemática basada en los datos ingresados. Los resultados son aproximaciones ilustrativas y no constituyen una promesa o garantía de ventas o retorno.
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
