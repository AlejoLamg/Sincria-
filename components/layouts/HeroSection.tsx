export default function HeroSection() {
  return (
    // 1. Semantic Section
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-navy pt-20"
      aria-label="Introducción a servicios de automatización"
    >
      
      {/* GRILLA TÉCNICA Y GLOW */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-brand-violet opacity-20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* GANCHO SEO: Especificidad técnica */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono text-[10px] tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" aria-hidden="true"></span>
          AGENCIA DE INGENIERÍA DE SOFTWARE EN BOGOTÁ
        </div>

        {/* TITULAR: Clarity + Keywords */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-space leading-[1.1]">
          Automatización de Negocios e <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">
            Inteligencia Artificial
          </span>
        </h1>

        {/* SUBTÍTULO: Beneficio claro + Solución */}
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-10 font-sans leading-relaxed">
          Diseñamos sistemas autónomos a medida que eliminan tareas manuales. 
          <span className="block text-white mt-2 font-medium">Transforma tu operación y escala tu rentabilidad con ingeniería de alto impacto.</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#contacto" 
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-brand-cyan text-brand-navy font-mono text-sm tracking-widest font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] active:scale-[0.98]"
          >
            AGENDAR_AUDITORÍA_IA
          </a>
        </div>
      </div>
    </section>
  );
}