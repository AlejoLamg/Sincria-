"use client";

import { motion } from "framer-motion";
import { useProjectConfig } from "@/context/ProjectConfigContext";

export default function PricingSection() {
  const { selectedPlan, selectPlanByName } = useProjectConfig();

  const plans = [
    {
      name: "WEB BASE",
      price: "1.890.000",
      billing: "Pago único • Sin mensualidades",
      features: [
        "Páginas ultra veloces que convierten visitantes (Next.js 15)",
        "Garantía de estabilidad global (Hosting Edge Vercel)",
        "Dominio profesional .com o .co incluido por 1 año",
        "Tu web en Google transmitiendo autoridad (SEO & SSL)",
        "Diseño impecable y 100% Mobile-First (WCAG 2.1)",
        "Acompañamiento y entrega guiada de lanzamiento"
      ],
    },
    {
      name: "E-COMMERCE",
      price: "3.490.000",
      billing: "Pago único • Cero comisiones por venta",
      features: [
        "Tienda virtual de alta velocidad optimizada para vender",
        "Integración con pasarelas de Colombia: Wompi, Bold, PSE",
        "Carga instantánea < 0.8s para evitar carritos abandonados",
        "Gestión ágil de catálogo, inventario y pedidos",
        "Base de datos segura en la nube (Supabase)",
        "Capacitación personalizada para operar tu tienda"
      ],
    },
    {
      name: "IA PRO",
      price: "2.490.000",
      billing: "Pago único • Automatización 24/7",
      features: [
        "Agente de IA entrenado con la información de tu negocio",
        "Atención y calificación de prospectos 24/7 en WhatsApp/Web",
        "Respuestas en 2 segundos sin pausas ni descansos",
        "Agendamiento automático con Google Calendar",
        "Centralización directa de clientes en tu correo o CRM",
        "Flujos guiados para maximizar cierres y ventas"
      ],
    },
    {
      name: "ECOSISTEMA TOTAL",
      price: "5.490.000",
      billing: "Pago único • Solución integral",
      popular: true,
      features: [
        "Portal Web Ultra Veloz + Agente de IA para WhatsApp y Web",
        "Ecosistema integral diseñado para liderar tu sector",
        "Automatización completa de captación, filtro y cierre",
        "Conexión con pasarelas de pago, CRM y bases de datos",
        "Soporte prioritario durante y tras el despliegue",
        "100% código propio sin ataduras a plataformas mensuales"
      ],
    }
  ];

  return (
    <section id="planes" className="py-24 bg-brand-navy relative overflow-hidden" aria-label="Planes de inversión">
      {/* Halo de luz difuminada (Blur de fondo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-cyan/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">03 / Inversión Transparente</span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Soluciones diseñadas para escalar tu ROI.
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto font-light">
            Tecnología de nivel corporativo a una fracción del costo de agencias tradicionales ($8.000.000 a $15.000.000 COP) o nóminas internas. Precios en pesos colombianos, sin costes ocultos.
          </p>
        </motion.div>
        
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
                    
                    <ul className="space-y-3 mb-8" role="list">
                      {plan.features.map((feat) => (
                        <li key={feat} className="text-gray-300 text-xs leading-relaxed flex items-start">
                          <span className="text-brand-cyan mr-2 shrink-0" aria-hidden="true">•</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      selectPlanByName(plan.name);
                      // Desplazar suavemente a módulos para animar a personalizar, o a contacto
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

        {/* Garantías y Reducción de Riesgo (Neuromarketing) */}
        <div className="mt-14 p-6 rounded-2xl bg-brand-surface/70 border border-white/10 grid md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl text-brand-cyan" aria-hidden="true">⚡</span>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Carga &lt; 0.8s Garantizada</h4>
              <p className="text-[11px] text-gray-400">Puntaje 90+ certificado en Google PageSpeed.</p>
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