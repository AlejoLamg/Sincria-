export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // 1. Footer semántico
    <footer className="py-12 bg-[#050505] border-t border-white/5" aria-label="Pie de página">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* 2. Logo con relación de aspecto optimizada */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
          <a href="/" aria-label="Ir al inicio">
            <img 
              src="/logo.webp" 
              alt="Logo de Sincro.ia - Ingeniería de Software" 
              className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" 
              width={120} 
              height={32}
            />
          </a>
          
          <div className="flex items-center gap-2 text-gray-500 text-xs" role="status">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
            SYSTEMS OPERATIONAL
          </div>
        </div>

        {/* 3. Navegación con enlaces externos optimizados */}
        <nav className="flex gap-8" aria-label="Enlaces legales y sociales">
          <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">GitHub</a>
          <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">LinkedIn</a>
          <a href="/privacidad" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">Privacidad</a>
        </nav>

        {/* 4. Copyright con copyright técnico */}
        <div className="text-gray-600 text-xs text-center md:text-right">
          <p>&copy; {currentYear} Sincro.ia</p>
          <p className="mt-1">Ingeniería de software boutique en Bogotá</p>
        </div>
      </div>
    </footer>
  );
}