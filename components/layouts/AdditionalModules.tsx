"use client";

import { motion } from "framer-motion";
import { useProjectConfig, formatCOP } from "@/context/ProjectConfigContext";

export default function AdditionalModules() {
  const { toggleModule, isModuleSelected, selectedModules, modulesPrice } = useProjectConfig();

  const modules = [
    { name: "Agente IA para Instagram DM y Messenger", desc: "Centraliza WhatsApp, Instagram y Facebook en el mismo cerebro inteligente.", price: "+$750.000", priceNum: 750000 },
    { name: "Facturación Electrónica DIAN Automática", desc: "Conexión directa con Siigo, Alegra o Factus para emitir facturas legales.", price: "+$850.000", priceNum: 850000 },
    { name: "Pasarela Colombia (Wompi / PSE / Bold)", desc: "Recibe pagos instantáneos con Nequi, Daviplata, PSE y tarjetas sin fricción.", price: "+$590.000", priceNum: 590000 },
    { name: "Sistema de Citas y Reservas Sincronizado", desc: "Agenda conectada a Google Calendar con recordatorios automáticos anti-inasistencias.", price: "+$490.000", priceNum: 490000 },
    { name: "CRM y Base de Datos de Clientes", desc: "Registro automático de prospectos en Google Sheets/CRM con métricas de ventas.", price: "+$490.000", priceNum: 490000 },
    { name: "Blog y Gestor de Contenidos SEO", desc: "Panel autogestionable para posicionar artículos y captar tráfico en Google.", price: "+$550.000", priceNum: 550000 },
    { name: "Sistema Multi-idioma (Español / Inglés)", desc: "Traducción optimizada y detección automática para clientes internacionales.", price: "+$450.000", priceNum: 450000 },
    { name: "Cobros Recurrentes & Suscripciones", desc: "Automatiza cobros periódicos y membresías mensuales sin gestión manual.", price: "+$690.000", priceNum: 690000 },
  ];

  return (
    <section id="modulos" className="py-16 bg-brand-navy border-t border-white/5 overflow-hidden" aria-labelledby="modules-heading">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">05 / MÓDULOS DE INTEGRACIÓN</span>
          <h2 id="modules-heading" className="text-3xl font-light text-white mb-2">
            Módulos complementarios para tu ecosistema
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
            Componentes especializados listos para acoplarse a tu Web o Agente de IA. Selecciona únicamente las integraciones que tu empresa necesita para operar.
          </p>
        </motion.div>

        {/* 
          MODO MOBILE: Carrusel horizontal con scroll-snap y barra oculta
          MODO DESKTOP: Grid clásico de 4 columnas
        */}
        <div 
          style={{ WebkitOverflowScrolling: "touch" }}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory scrollbar-none"
        >
          {modules.map((mod) => {
            const isSelected = isModuleSelected(mod.name);

            return (
              <motion.div 
                key={mod.name}
                whileHover={{ y: -5 }}
                className={`min-w-[280px] md:min-w-0 p-6 border rounded-xl bg-white/[0.02] transition-all flex flex-col justify-between snap-center shrink-0 ${
                  isSelected ? "border-brand-cyan bg-brand-cyan/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]" : "border-white/10 hover:border-brand-cyan/50"
                }`}
              >
                <article className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">{mod.name}</h3>
                    <p className="text-gray-400 text-[11px] mb-4">{mod.desc}</p>
                    <div className="text-brand-cyan font-bold text-sm mb-4 font-mono">
                      {mod.price} COP
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModule({ name: mod.name, desc: mod.desc, price: mod.priceNum })}
                    className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-brand-cyan text-brand-navy shadow-md" 
                        : "border border-white/20 text-gray-300 hover:border-brand-cyan hover:text-white"
                    }`}
                  >
                    {isSelected ? "✓ Agregado" : "+ Agregar al proyecto"}
                  </button>
                </article>
              </motion.div>
            );
          })}
        </div>

        {/* Barra de confirmación rápida si hay módulos seleccionados */}
        {selectedModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-xl bg-brand-surface border border-brand-cyan/30 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <div className="text-center sm:text-left">
              <p className="text-xs text-brand-cyan font-mono uppercase tracking-wider">
                {selectedModules.length} {selectedModules.length === 1 ? "módulo seleccionado" : "módulos seleccionados"}
              </p>
              <p className="text-white text-sm font-semibold mt-0.5">
                Subtotal módulos: +{formatCOP(modulesPrice)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 py-2.5 bg-brand-cyan text-brand-navy font-mono text-xs font-bold rounded-lg hover:bg-white transition-all cursor-pointer shadow-md"
            >
              Completar Solicitud →
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}