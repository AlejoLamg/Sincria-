"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function WhatsAppButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573124630488";

  // Disparador proactivo tras 6 segundos para capturar la atención en LATAM
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setShowPrompt(true);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  return (
    <div className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col sm:flex-row items-end gap-3 pointer-events-none">
      {/* Burbuja proactiva conversacional */}
      {showPrompt && !isDismissed && (
        <div className="relative max-w-[270px] sm:max-w-xs p-3.5 bg-brand-surface/95 border border-brand-cyan/40 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white backdrop-blur-xl pointer-events-auto">
          <button
            onClick={() => {
              setShowPrompt(false);
              setIsDismissed(true);
            }}
            aria-label="Cerrar notificación"
            className="absolute -top-2 -left-2 w-5 h-5 bg-neutral-800 border border-white/20 text-gray-400 hover:text-white rounded-full flex items-center justify-center text-xs cursor-pointer shadow-md"
          >
            ×
          </button>
          <a
            href={`https://wa.me/${phoneNumber}?text=Hola%20Sof%C3%ADa%2C%20quiero%20ver%20c%C3%B3mo%20vendes%20en%20vivo%20y%20hacerte%20unas%20preguntas.`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <p className="text-[11px] font-mono text-brand-cyan uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SincroIA en Línea
            </p>
            <p className="text-xs text-gray-200 font-light leading-snug">
              ¿Quieres ver cómo un <strong className="text-white font-semibold">Agente de IA</strong> responde a tus clientes en vivo? Chatea con nosotros.
            </p>
          </a>
        </div>
      )}

      <a
        href={`https://wa.me/${phoneNumber}?text=Hola%20Sof%C3%ADa%2C%20quiero%20ver%20c%C3%B3mo%20vendes%20en%20vivo%20y%20hacerte%20unas%20preguntas.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 shrink-0 flex items-center justify-center rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_35px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 bg-[#25D366] pointer-events-auto cursor-pointer"
        aria-label="Contactar por WhatsApp a SincroIA"
      >
        <Image 
          src="/whatsapp.png" 
          alt="WhatsApp Logo" 
          width={36} 
          height={36}
          className="w-9 h-9 object-contain"
        />
      </a>
    </div>
  );
}