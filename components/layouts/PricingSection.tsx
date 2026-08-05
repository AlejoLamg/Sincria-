"use client";

import { motion } from "framer-motion";

export default function PricingSection() {
  const plans = [
    {
      name: "WEB BASE",
      price: "200",
      billing: "Pago único",
      features: [
        "Páginas ultra veloces que atraen clientes (Next.js)",
        "Garantía de estabilidad total (Hosting Vercel)",
        "Identidad lista para operar (Dominio .com incluido)",
        "Tu web aparece en Google y transmite confianza (SEO & SSL)",
        "Diseño impecable en celulares y PCs (UI/UX Adaptativo)",
        "Acompañamiento inicial de lanzamiento"
      ],
    },
    {
      name: "E-COMMERCE",
      price: "600",
      billing: "Pago único",
      features: [
        "Tienda virtual optimizada para vender en piloto automático",
        "Pasarelas de pago y gestión de inventarios integradas",
        "Velocidad de carga superior para evitar carritos abandonados",
        "Diseño enfocado 100% en conversión y ventas",
        "Estructura lista para escalar catálogos grandes",
        "Soporte técnico especializado de lanzamiento"
      ],
    },
    {
      name: "IA PRO",
      price: "400",
      billing: "Pago único",
      features: [
        "Atención y calificación de clientes 24/7 (Agente IA)",
        "Centralización de prospectos (Integración con CRM)",
        "Fidelización en piloto automático (Email marketing)",
        "Visibilidad clara de tus clientes (Dashboard de prospectos)",
        "Tus clientes compran de forma guiada (Flujos de venta)",
        "Automatización operativa inicial"
      ],
    },
    {
      name: "ECOSISTEMA TOTAL",
      price: "1100",
      billing: "+ Soporte mensual",
      features: [
        "Control total de tu negocio en tiempo real (Dashboard)",
        "Acompañamiento continuo mensual (Membresía Partner IA)",
        "Eliminación de tareas manuales (Automatización interna)",
        "Toma decisiones basadas en datos (Reportes estratégicos)",
        "Atención preferencial sin filas (Soporte prioritario 24/7)",
        "La solución integral definitiva para escalar sin límites"
      ],
    }
  ];

  return (
    // 1. Semantic <section>
    <section id="planes" className="py-24 bg-brand-navy" aria-label="Planes de inversión">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">03 / Inversión</span>
          {/* H2 para SEO de servicios */}
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Soluciones diseñadas <br /> para escalar.
          </h2>
        </motion.div>
        
        {/* 2. Lista semántica adaptada a 4 columnas */}
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {plans.map((plan, index) => (
            <motion.li 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="p-6 border border-white/10 rounded-2xl bg-white/5 flex flex-col justify-between hover:border-brand-cyan/50 transition-all group list-none"
            >
              {/* 3. Article para cada unidad de servicio */}
              <article className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-brand-cyan font-mono text-xs tracking-widest mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-white">
                      ${plan.price} <span className="text-sm font-normal text-gray-500">USD</span>
                    </div>
                    <span className="text-[11px] font-mono text-brand-cyan mt-1 block">
                      {plan.billing}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-8" role="list">
                    {plan.features.map((feat) => (
                      <li key={feat} className="text-gray-300 text-xs leading-relaxed flex items-start">
                        <span className="text-brand-cyan mr-2 shrink-0" aria-hidden="true">•</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Enlace como botón para mejor SEO */}
                <a 
                  href="#contacto" 
                  className="block text-center w-full py-3 border border-white/20 rounded-lg text-white hover:bg-brand-cyan hover:text-brand-navy transition-all font-bold text-xs tracking-wider group-hover:border-brand-cyan"
                >
                  ELEGIR {plan.name}
                </a>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}