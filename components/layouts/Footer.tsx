export default function Footer() {
  return (
    <footer className="py-12 bg-[#050505] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Lado izquierdo: Logo y Status */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
          {/* Aquí incluimos tu logo */}
          <img src="/logo.webp" alt="Sincro.ia Logo" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            SYSTEMS OPERATIONAL
          </div>
        </div>

        {/* Lado central: Links de Autoridad */}
        <div className="flex gap-8">
          <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">GitHub</a>
          <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">LinkedIn</a>
          <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">Política de Privacidad</a>
        </div>

        {/* Lado derecho: Copyright */}
        <div className="text-gray-600 text-xs text-center md:text-right">
          © {new Date().getFullYear()} Sincro.ia <br />
          Ingeniería de software boutique
        </div>
      </div>
    </footer>
  );
}