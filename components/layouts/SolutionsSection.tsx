export default function SolutionsSection() {
  const solutions = [
    { 
      id: "01", 
      title: "Portales Web de Alto Impacto (Next.js 15)", 
      problem: "Más del 53% de los usuarios abandonan si una web tarda más de 2.5s en abrir en celular, desperdiciando tu inversión en publicidad.",
      desc: "Optimizado para cargas inferiores a 0.8s bajo condiciones objetivo. Retén cada visitante, transmite máxima credibilidad corporativa y optimiza la tasa de conversión de tus campañas." 
    },
    { 
      id: "02", 
      title: "Agentes de IA para Cierre en WhatsApp", 
      problem: "Tu equipo pierde horas al día respondiendo las mismas preguntas manuales y pierde ventas en las noches y fines de semana.",
      desc: "Asistente inteligente con IA generativa que atiende en 2 segundos, califica el presupuesto del cliente, cotiza y agenda reuniones en Google Calendar de forma 100% autónoma." 
    },
    { 
      id: "03", 
      title: "Infraestructura Cloud & Pagos Directos", 
      problem: "Caídas de servidor en picos de ventas, procesos manuales de facturación y carritos abandonados por pasarelas confusas.",
      desc: "Arquitectura serverless en Vercel Edge con infraestructura orientada a 99.9% de disponibilidad, pasarelas colombianas en un clic (Wompi, Bold, PSE, Nequi) y cobro asistido por WhatsApp." 
    }
  ];

  return (
    <section id="soluciones" className="py-16 md:py-32 bg-brand-navy overflow-hidden" aria-label="Nuestras soluciones de ingeniería">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 md:mb-24">
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block font-mono">01 / Soluciones Estratégicas</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-light text-white tracking-tight">
            Eliminamos la fricción operativa <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet font-semibold">
              para multiplicar tus ventas.
            </span>
          </h2>
        </div>

        <ul className="flex flex-col" role="list">
          {solutions.map((item) => (
            <li 
              key={item.id} 
              className="group flex flex-col md:flex-row py-8 md:py-12 border-b border-white/10 transition-all duration-500 hover:border-brand-cyan/50 list-none"
            >
              <article className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
                <div className="md:w-1/12 text-brand-cyan font-mono text-sm" aria-hidden="true">
                  {item.id}
                </div>
                <header className="md:w-4/12 text-2xl font-medium text-white group-hover:text-brand-cyan transition-colors">
                  <h3>{item.title}</h3>
                  <p className="text-xs text-red-400/90 font-mono mt-2 leading-relaxed">
                    ⚠️ {item.problem}
                  </p>
                </header>
                <div className="md:w-7/12 text-gray-300 font-light leading-relaxed text-sm md:text-base">
                  <p className="p-4 rounded-xl bg-brand-surface/50 border border-white/5">
                    {item.desc}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}