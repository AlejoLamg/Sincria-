import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#050505] border-t border-white/5" aria-label="Pie de página">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo y estado */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
          <Link href="/" aria-label="Ir al inicio">
            <Image 
              src="/logo.webp" 
              alt="Logo de SincroIA.lat - Ingeniería de Software" 
              className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" 
              width={120} 
              height={32}
              priority
            />
          </Link>
          <p className="text-gray-400 text-xs">
            Ingeniería y desarrollo de alto rendimiento.
          </p>
        </div>

        {/* Navegación corporativa y redes sociales */}
        <nav className="flex flex-wrap justify-center items-center gap-4 sm:gap-6" aria-label="Enlaces legales y de contacto">
          <a href="#contacto" className="text-gray-300 hover:text-brand-cyan transition-colors text-sm py-2 px-1 inline-block">Contacto</a>
          <a href="/terminos" className="text-gray-300 hover:text-brand-cyan transition-colors text-sm py-2 px-1 inline-block">Términos</a>
          <a href="/privacidad" className="text-gray-300 hover:text-brand-cyan transition-colors text-sm py-2 px-1 inline-block">Privacidad</a>
          <span className="text-white/20 hidden sm:inline">|</span>
          <a
            href="https://www.instagram.com/sincroia.lat/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram oficial de SincroIA"
            className="text-gray-400 hover:text-pink-400 transition-colors p-1"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61594315517827"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook oficial de SincroIA"
            className="text-gray-400 hover:text-blue-400 transition-colors p-1"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-gray-400 text-xs text-center md:text-right">
          <p>&copy; {currentYear} SincroIA.lat</p>
          <p className="mt-1">Ingeniería de software en Bogotá</p>
        </div>
      </div>
    </footer>
  );
}