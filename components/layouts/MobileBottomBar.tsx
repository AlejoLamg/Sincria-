"use client";

import React from "react";

export default function MobileBottomBar() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573124630488";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hola%20Sof%C3%ADa%2C%20quiero%20ver%20c%C3%B3mo%20vendes%20en%20vivo%20y%20hacerte%20unas%20preguntas.`;

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      aria-label="Acciones rápidas móviles"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-brand-navy/95 backdrop-blur-xl border-t border-brand-cyan/20 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2"
    >
      {/* Botón Secundario: Diagnóstico y Cotización */}
      <a
        href="#contacto"
        onClick={scrollToContact}
        className="w-2/5 py-3 px-2 rounded-xl border border-white/20 bg-brand-surface/90 text-white font-mono text-[11px] font-bold text-center tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all"
      >
        <span>📋</span>
        <span className="truncate">Diagnóstico</span>
      </a>

      {/* Botón Primario: Probar Sofía en WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-3/5 py-3 px-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-brand-cyan text-brand-navy font-mono text-[11px] font-extrabold text-center tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95 transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-brand-navy animate-ping shrink-0" />
        <span className="truncate uppercase">Probar en WhatsApp</span>
      </a>
    </div>
  );
}
