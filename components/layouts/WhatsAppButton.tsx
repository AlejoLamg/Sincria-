"use client";
import React from 'react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/57TU_NUMERO_AQUI?text=Hola,%20me%20gustaría%20más%20información%20sobre%20los%20servicios%20de%20Sincro.ia"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tu icono oficial de WhatsApp como imagen */}
      <img 
        src="/whatsapp.png" 
        alt="WhatsApp" 
        className="w-full h-full object-contain"
      />
    </a>
  );
}