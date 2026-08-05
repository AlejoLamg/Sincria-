"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto de vidrio líquido al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "h-16 bg-brand-navy/80 backdrop-blur-lg border-b border-brand-violet/10 shadow-[0_4px_30px_rgba(10,15,30,0.4)]"
          : "h-24 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* LOGO: Imagen PNG Transparente Original */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group cursor-pointer">
              <img
                src="/logo.webp"
                alt="SincroIA Logo"
                className="h-9 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* MENÚ DESKTOP: Estructura Comercial Optimizada */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="#soluciones"
              className="group relative text-[11px] font-mono tracking-[0.2em] text-gray-400 hover:text-brand-cyan transition-all duration-300 py-6"
            >
              SOLUCIONES
              <span className="absolute bottom-4 left-0 w-0 h-[1px] bg-brand-cyan transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#proceso"
              className="group relative text-[11px] font-mono tracking-[0.2em] text-gray-400 hover:text-brand-cyan transition-all duration-300 py-6"
            >
              PROCESO
              <span className="absolute bottom-4 left-0 w-0 h-[1px] bg-brand-cyan transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#planes"
              className="group relative text-[11px] font-mono tracking-[0.2em] text-gray-400 hover:text-brand-cyan transition-all duration-300 py-6"
            >
              PLANES
              <span className="absolute bottom-4 left-0 w-0 h-[1px] bg-brand-cyan transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* BOTÓN CTA DESKTOP */}
          <div className="hidden md:block">
            <Link 
              href="#contacto"
              className="inline-block px-6 py-2 rounded-lg bg-brand-cyan text-brand-navy font-mono text-[11px] tracking-widest font-bold hover:bg-white transition-all duration-300"
            >
              INICIAR PROYECTO
            </Link>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE (Sincronizado y sin 404) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-brand-navy/95 backdrop-blur-lg border-b border-brand-violet/10 transition-all duration-300 overflow-hidden ${
          isOpen
            ? "max-h-96 opacity-100 py-6 px-6"
            : "max-h-0 opacity-0 pointer-events-none py-0 px-6"
        }`}
      >
        <div className="flex flex-col space-y-4">
          <Link
            href="#soluciones"
            onClick={() => setIsOpen(false)}
            className="text-sm font-mono text-gray-400 hover:text-brand-cyan py-1 transition-colors"
          >
            [ SOLUCIONES ]
          </Link>
          <Link
            href="#proceso"
            onClick={() => setIsOpen(false)}
            className="text-sm font-mono text-gray-400 hover:text-brand-cyan py-1 transition-colors"
          >
            [ PROCESO ]
          </Link>
          <Link
            href="#planes"
            onClick={() => setIsOpen(false)}
            className="text-sm font-mono text-gray-400 hover:text-brand-cyan py-1 transition-colors"
          >
            [ PLANES ]
          </Link>
          
          {/* BOTÓN CTA MÓVIL UNIFICADO */}
          <Link 
            href="#contacto"
            onClick={() => setIsOpen(false)}
            className="block text-center w-full py-3 bg-brand-cyan text-brand-navy font-mono text-xs rounded-lg tracking-wider font-bold hover:bg-white transition-colors mt-2"
          >
            INICIAR PROYECTO
          </Link>
        </div>
      </div>
    </nav>
  );
}