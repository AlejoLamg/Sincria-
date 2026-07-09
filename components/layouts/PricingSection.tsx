"use client";

import { motion } from "framer-motion";

export default function PricingSection() {
  const plans = [
    {
      name: "WEB BASE",
      price: "200",
      features: [
        "Desarrollo Web en Next.js (Velocidad)",
        "Hosting de alto rendimiento (Vercel)",
        "Dominio .com profesional incluido",
        "SEO Técnico & SSL de seguridad",
        "Diseño UI/UX adaptativo (Responsive)",
        "Soporte técnico de lanzamiento"
      ],
    },
    {
      name: "IA PRO",
      price: "400",
      features: [
        "Todo lo incluido en Web Base",
        "Agente de IA personalizado 24/7",
        "Integración con CRM de ventas",
        "Automatización de email marketing",
        "Dashboard básico de prospectos",
        "Configuración de flujos de venta"
      ],
    },
    {
      name: "ECOSISTEMA TOTAL",
      price: "1100",
      features: [
        "Todo lo incluido en IA Pro",
        "Dashboard de métricas en tiempo real",
        "Membresía Partner IA (Soporte mensual)",
        "Automatización de procesos internos",
        "Reportes estratégicos de ROI",
        "Soporte técnico prioritario 24/7"
      ],
    }
  ];

  return (
    <section className="py-24 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">03 / Inversión</span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Soluciones diseñadas <br /> para escalar.
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-8 border border-white/10 rounded-2xl bg-white/5 flex flex-col hover:border-brand-cyan/50 transition-all group"
            >
              <h3 className="text-brand-cyan font-mono text-xs tracking-widest mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-white mb-6">
                ${plan.price} <span className="text-sm font-normal text-gray-500">USD</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feat) => (
                  <li key={feat} className="text-gray-300 text-sm flex items-start">
                    <span className="text-brand-cyan mr-2">•</span> {feat}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 border border-white/20 rounded-lg text-white hover:bg-brand-cyan hover:text-brand-navy transition-all font-bold group-hover:border-brand-cyan">
                ELEGIR {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}