import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#050505] border-t border-white/5" aria-label="Pie de página">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo y estado */}
  {/* Logo sin el badge falso */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
          <Link href="/" aria-label="Ir al inicio">
            <Image 
              src="/logo.webp" 
              alt="Logo de Sincro.ia - Ingeniería de Software" 
              className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" 
              width={120} 
              height={32}
              priority
            />
          </Link>
          <p className="text-gray-500 text-xs">
            Ingeniería y desarrollo de alto rendimiento.
          </p>
        </div>

        {/* Navegación corporativa sin placeholders */}
        <nav className="flex gap-6 md:gap-8" aria-label="Enlaces legales y de contacto">
          <a href="#contacto" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">Contacto</a>
          <a href="/terminos" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">Términos</a>
          <a href="/privacidad" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">Privacidad</a>
        </nav>

        {/* Copyright */}
        <div className="text-gray-600 text-xs text-center md:text-right">
          <p>&copy; {currentYear} SincroIA.lat</p>
          <p className="mt-1">Ingeniería de software en Bogotá</p>
        </div>
      </div>
    </footer>
  );
}