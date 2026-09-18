export default function HeroSection() {
  return (
    <section
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-navy pt-24 sm:pt-28 pb-12"
      aria-label="Software a medida y automatización con Inteligencia Artificial"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[650px] rounded-full bg-brand-violet opacity-20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono text-[11px] tracking-[0.25em] uppercase mb-8">

          <span
            className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"
            aria-hidden="true"
          />

          Software • IA • Automatización

        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white font-space">
          Portales web ultra veloces y{" "}
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">
            Agentes de IA que cierran clientes 24/7.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed font-light">
          Sustituye páginas web lentas y tareas operativas manuales por un <span className="text-white font-medium">ecosistema digital automatizado</span> que califica prospectos, responde de inmediato y multiplica tus ventas en piloto automático.
        </p>

        {/* CTAs de Alta Conversión */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#contacto"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-cyan text-brand-navy font-bold font-mono tracking-widest text-xs sm:text-sm transition-all duration-300 hover:bg-white hover:shadow-[0_0_35px_rgba(0,229,255,0.45)] active:scale-[0.98] shadow-lg"
          >
            SOLICITAR DIAGNÓSTICO GRATIS
          </a>

          <a
            href="#demo-ia"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white hover:border-brand-cyan hover:text-brand-cyan transition-all duration-300 font-mono tracking-wider text-xs sm:text-sm"
          >
            PROBAR DEMO DE IA
          </a>
        </div>

        <p className="text-xs font-mono text-gray-400 mt-4">
          ⚡ Respuesta en menos de 2 horas hábiles • Diagnóstico y cotización sin compromiso
        </p>

        {/* BARRA DE AUTORIDAD Y MÉTRICAS (Social Proof) */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-cyan">&lt; 0.8s</span>
            <p className="text-xs text-gray-400">Tiempo de carga promedio</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">24/7</span>
            <p className="text-xs text-gray-400">Atención y ventas autónomas</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-cyan">0</span>
            <p className="text-xs text-gray-400">Leads perdidos por espera</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">100%</span>
            <p className="text-xs text-gray-400">Código a medida en Next.js</p>
          </div>
        </div>

      </div>
    </section>
  );
}