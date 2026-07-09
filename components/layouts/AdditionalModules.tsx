"use client";

import { motion } from "framer-motion";

export default function AdditionalModules() {
const modules = [
  { name: "E-commerce Completo", desc: "Catálogo, carrito y pagos seguros.", price: "+$500" },
  { name: "Facturación Electrónica", desc: "API para procesos legales automáticos.", price: "+$300" },
  { name: "Métricas Avanzadas", desc: "Dashboard con insights en tiempo real.", price: "+$250" },
  { name: "Agente Ventas Pro", desc: "IA con base de datos personalizada.", price: "+$400" },
  // NUEVOS MÓDULOS
  { name: "CRM Omnicanal", desc: "Gestiona WhatsApp, IG y Web en un solo lugar.", price: "+$350" },
  { name: "Sistema de Reservas", desc: "Booking automático y recordatorios.", price: "+$200" },
  { name: "Seguridad & Backups", desc: "Protección premium y copias diarias.", price: "+$150" },
  { name: "Integraciones API", desc: "Conecta tu web con cualquier sistema.", price: "+$600" },
];

  return (
    <section className="py-16 bg-brand-navy border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-light text-white mb-2">Personaliza tu ecosistema</h3>
          <p className="text-gray-400 text-sm">Añade capacidades específicas a cualquier plan de inversión.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <motion.div 
              key={mod.name}
              whileHover={{ y: -5 }}
              className="p-6 border border-white/10 rounded-xl bg-white/[0.02] hover:border-brand-cyan/50 transition-all"
            >
              <h4 className="text-white font-medium mb-1">{mod.name}</h4>
              <p className="text-gray-500 text-[11px] mb-4">{mod.desc}</p>
              <div className="text-brand-cyan font-bold text-sm">{mod.price} USD</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}