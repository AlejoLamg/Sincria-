"use client";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        {/* BRAND & LOGO COLUMN */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Aquí va tu logo */}
          <div className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
            <img
              src="/logo.webp"
              alt="Sincro.ia Logo"
              className="h-9 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
            Arquitectura digital, automatización con IA y sistemas de alto
            rendimiento. Construimos el futuro de tu negocio con ingeniería de
            precisión.
          </p>
          {/* Email con acento de marca */}
          <a
            href="mailto:contacto@sincroia.lat"
            className="text-brand-cyan font-mono hover:underline"
          >
            contacto@sincroia.lat
          </a>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 className="text-white text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">
            Navegación
          </h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                Servicios
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                Metodología
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                Proyectos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL & LOCATION */}
        <div>
          <h4 className="text-white text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">
            Ubicación
          </h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>Bogotá, Colombia</li>
            <li>Disponible mundialmente</li>
            <li className="pt-4 flex gap-4">
              {/* Aquí añadirías iconos sociales */}
              <span className="w-6 h-6 bg-white/10 rounded-full"></span>
              <span className="w-6 h-6 bg-white/10 rounded-full"></span>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-[10px] text-gray-600 uppercase tracking-widest">
        <p>© 2026 Sincro.ia. Todos los derechos reservados.</p>
        <p>Impulsado por ingeniería e IA</p>
      </div>
    </footer>
  );
}
