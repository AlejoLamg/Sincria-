export default function SolutionsSection() {
  const solutions = [
    { 
      id: "01", 
      title: "Arquitectura Web", 
      desc: "Transformamos interfaces en activos digitales. Webs de carga instantánea diseñadas para convertir visitantes en clientes." 
    },
    { 
      id: "02", 
      title: "Automatización con IA", 
      desc: "Eliminamos tareas repetitivas mediante agentes inteligentes que operan 24/7, optimizando costos y eficiencia operativa." 
    },
    { 
      id: "03", 
      title: "Escalabilidad Técnica", 
      desc: "Arquitectura robusta y flexible preparada para manejar picos de tráfico y crecimiento exponencial sin interrupciones." 
    }
  ];

  return (
    // 1. Semantic Section con ID para navegación
    <section id="soluciones" className="py-32 bg-brand-navy" aria-label="Nuestras soluciones de ingeniería">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="mb-24">
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">01 / Ecosistema</span>
          {/* H2 semántico para el SEO de tus servicios */}
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Diseñamos sistemas que <br />
            <span className="text-gray-500">potencian el rendimiento.</span>
          </h2>
        </div>

        {/* 2. Lista semántica para servicios */}
        <ul className="flex flex-col" role="list">
          {solutions.map((item) => (
            <li 
              key={item.id} 
              className="group flex flex-col md:flex-row py-12 border-b border-white/10 transition-all duration-500 hover:border-brand-cyan/50 list-none"
            >
              {/* 3. Article para contenido independiente */}
              <article className="flex flex-col md:flex-row w-full">
                <div className="md:w-1/6 text-brand-cyan font-mono text-sm mb-4 md:mb-0" aria-hidden="true">
                  {item.id}
                </div>
                <header className="md:w-2/6 text-2xl font-medium text-white group-hover:pl-4 transition-all duration-300">
                  <h3>{item.title}</h3>
                </header>
                <div className="md:w-3/6 text-gray-400 font-light leading-relaxed max-w-md">
                  <p>{item.desc}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}