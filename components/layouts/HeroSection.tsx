export default function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-navy pt-20"
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

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white font-space">

          Automatizamos procesos

          <br className="hidden md:block" />

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">

            para que tu empresa crezca más rápido.

          </span>

        </h1>

        {/* Subtitle */}

        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">

          Desarrollamos <span className="text-white">software a medida</span> y
          <span className="text-white"> agentes de IA</span> que trabajan 24/7,
          optimizando operaciones, reduciendo tareas manuales y acelerando el crecimiento de tu negocio.

        </p>

        {/* CTA */}

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">

          <a
            href="#contacto"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-cyan text-brand-navy font-bold font-mono tracking-widest text-sm transition-all duration-300 hover:bg-white hover:shadow-[0_0_35px_rgba(0,229,255,0.45)] active:scale-[0.98]"
          >
            AGENDA UNA CONSULTORÍA
          </a>

          <a
            href="#proyectos"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/15 text-white hover:border-brand-cyan hover:text-brand-cyan transition-all duration-300"
          >
            VER PROYECTOS
          </a>

        </div>

      </div>
    </section>
  );
}