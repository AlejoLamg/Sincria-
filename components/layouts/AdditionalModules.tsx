"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AdditionalModules() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const modules = [
    { name: "Cobros Recurrentes", desc: "Automatiza membresías y cobros periódicos.", price: "+$500" },
    { name: "Facturación Electrónica", desc: "API para procesos legales automáticos.", price: "+$300" },
    { name: "Métricas Avanzadas", desc: "Dashboard con insights en tiempo real.", price: "+$250" },
    { name: "Agente Ventas Pro", desc: "IA con base de datos personalizada.", price: "+$400" },
    { name: "CRM Omnicanal", desc: "Gestiona WhatsApp, IG y Web en un solo lugar.", price: "+$350" },
    { name: "Sistema de Reservas", desc: "Booking automático y recordatorios.", price: "+$200" },
    { name: "Seguridad & Backups", desc: "Protección premium y copias diarias.", price: "+$150" },
    { name: "Integraciones API", desc: "Conecta tu web con cualquier sistema.", price: "+$600" },
  ];

  const toggleModule = (modName: string, modPrice: string) => {
    const itemText = `${modName} (${modPrice} USD)`;
    let updated: string[];
    
    if (selectedModules.includes(itemText)) {
      updated = selectedModules.filter((m) => m !== itemText);
    } else {
      updated = [...selectedModules, itemText];
    }

    setSelectedModules(updated);
    window.dispatchEvent(new CustomEvent('selectModules', { detail: updated }));
  };

  return (
    <section className="py-16 bg-brand-navy border-t border-white/5 overflow-hidden" aria-labelledby="modules-heading">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">04 / MÓDULOS</span>
          <h2 id="modules-heading" className="text-3xl font-light text-white mb-2">
            Personaliza tu ecosistema digital
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Potencia tu plataforma con módulos avanzados. Desliza y selecciona los que necesites para tu proyecto.
          </p>
        </motion.div>

        {/* 
          MODO MOBILE: Carrusel horizontal con scroll-snap y barra oculta
          MODO DESKTOP: Grid clásico de 4 columnas
        */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory scrollbar-none">
          {modules.map((mod) => {
            const itemText = `${mod.name} (${mod.price} USD)`;
            const isSelected = selectedModules.includes(itemText);

            return (
              <motion.div 
                key={mod.name}
                whileHover={{ y: -5 }}
                className={`min-w-[280px] md:min-w-0 p-6 border rounded-xl bg-white/[0.02] transition-all flex flex-col justify-between snap-center shrink-0 ${
                  isSelected ? "border-brand-cyan bg-brand-cyan/5 shadow-[0_0_20px_rgba(0,229,255,0.15)]" : "border-white/10 hover:border-brand-cyan/50"
                }`}
              >
                <article className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">{mod.name}</h3>
                    <p className="text-gray-500 text-[11px] mb-4">{mod.desc}</p>
                    <div className="text-brand-cyan font-bold text-sm mb-4">
                      {mod.price} USD
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModule(mod.name, mod.price)}
                    className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-brand-cyan text-brand-navy" 
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
      </div>
    </section>
  );
}