export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-navy pt-20">
      
      {/* GRILLA TÉCNICA Y GLOW DE FONDO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-brand-violet opacity-20 blur-[120px]"></div>
      </div>

      {/* CONTENIDO CON COPY DE CONVERSIÓN */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* GANCHO SEO */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono text-[10px] tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
          ESCALA TU OPERACIÓN CON INTELIGENCIA ARTIFICIAL
        </div>

        {/* TITULAR MASIVO OPTIMIZADO */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-space leading-[1.1]">
          Domina tu mercado con <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">
            Automatización e IA
          </span>
        </h1>

        {/* SUBTÍTULO DE VENTA */}
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-lg text-gray-400 mb-10 font-sans">
          Convertimos procesos manuales en flujos autónomos que venden 24/7. Deja de gestionar tareas y empieza a escalar tu negocio con nuestra tecnología de alto impacto.
        </p>

        {/* BOTÓN CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-cyan text-brand-navy font-mono text-xs tracking-widest font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] active:scale-[0.98]">
            AGENDAR_AUDITORÍA_IA
          </button>
        </div>
      </div>
    </section>
  );
}