"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Efecto de vidrio líquido al hacer scroll y ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detectar sección activa
      const sections = ["soluciones", "demo-ia", "proyectos", "calculadora-roi", "proceso", "planes", "faq", "contacto"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const navLinks = [
    { href: "#soluciones", label: "SOLUCIONES", id: "soluciones" },
    { href: "#demo-ia", label: "DEMO IA", id: "demo-ia" },
    { href: "#proyectos", label: "CASOS REALES", id: "proyectos" },
    { href: "#planes", label: "PLANES", id: "planes" },
    { href: "#faq", label: "FAQ", id: "faq" },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "h-16 bg-brand-navy/85 backdrop-blur-xl border-b border-brand-violet/15 shadow-[0_4px_30px_rgba(10,15,30,0.5)]"
          : "h-24 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* LOGO: Optimizado con next/image */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" aria-label="Ir al inicio de SincroIA" className="flex items-center group cursor-pointer">
              <Image
                src="/logo.webp"
                alt="SincroIA Logo"
                width={130}
                height={36}
                priority
                className="h-8 md:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* MENÚ DESKTOP: Con ScrollSpy activo y mejor ergonomía */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`group relative text-xs font-mono tracking-[0.2em] py-5 transition-all duration-300 ${
                    isActive
                      ? "text-brand-cyan font-bold"
                      : "text-gray-400 hover:text-brand-cyan"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-3 left-0 h-[2px] bg-brand-cyan transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* BOTÓN CTA DESKTOP */}
          <div className="hidden md:block">
            <Link 
              href="#contacto"
              className="inline-block px-6 py-2.5 rounded-lg bg-brand-cyan text-brand-navy font-mono text-xs tracking-widest font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300"
            >
              INICIAR PROYECTO
            </Link>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-brand-navy/95 backdrop-blur-2xl border-b border-brand-violet/20 transition-all duration-300 ${
          isOpen
            ? "max-h-[85vh] overflow-y-auto opacity-100 py-6 px-6 shadow-2xl"
            : "max-h-0 overflow-hidden opacity-0 pointer-events-none py-0 px-6"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-mono py-2 transition-colors ${
                activeSection === link.id ? "text-brand-cyan font-bold" : "text-gray-300 hover:text-brand-cyan"
              }`}
            >
              [ {link.label} ]
            </Link>
          ))}
          
          <Link 
            href="#contacto"
            onClick={() => setIsOpen(false)}
            className="block text-center w-full py-3.5 bg-brand-cyan text-brand-navy font-mono text-xs rounded-lg tracking-wider font-bold hover:bg-white transition-colors mt-2 shadow-lg"
          >
            INICIAR PROYECTO
          </Link>
        </div>
      </div>
    </nav>
  );
}