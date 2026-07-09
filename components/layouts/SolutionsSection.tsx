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
    <section className="py-32 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* TÍTULO EDITORIAL */}
        <div className="mb-24">
          <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-4 block">01 / Ecosistema</span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Diseñamos sistemas que <br />
            <span className="text-gray-500">potencian el rendimiento.</span>
          </h2>
        </div>

        {/* LISTA DE SOLUCIONES (Estilo Editorial) */}
        <div className="flex flex-col">
          {solutions.map((item) => (
            <div 
              key={item.id} 
              className="group flex flex-col md:flex-row py-12 border-b border-white/10 transition-all duration-500 hover:border-brand-cyan/50"
            >
              <div className="md:w-1/6 text-brand-cyan font-mono text-sm mb-4 md:mb-0">{item.id}</div>
              <div className="md:w-2/6 text-2xl font-medium text-white group-hover:pl-4 transition-all duration-300">
                {item.title}
              </div>
              <div className="md:w-3/6 text-gray-400 font-light leading-relaxed max-w-md">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}