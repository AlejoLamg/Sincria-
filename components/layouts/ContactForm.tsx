"use client";
import { useState } from "react";

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Selecciona tu objetivo de inversión");

  const options = ["Web Base", "IA Pro", "Ecosistema Total", "Consultoría de IA", "Auditoría Técnica"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      {/* Usamos colores mucho más suaves: Gris oscuro en lugar de negro puro */}
      <div className="space-y-6 bg-[#0a0a0a] p-8 rounded-2xl border border-white/5">
        
        {/* INPUTS SUAVES */}
        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Nombre" className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
          <input type="email" placeholder="Correo" className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
        </div>

        {/* MENÚ PERSONALIZADO */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-400 text-left flex justify-between items-center hover:border-white/10 transition-all"
          >
            {selected}
            <span className="text-brand-cyan/50">▼</span>
          </button>
          
          {isOpen && (
            <div className="absolute w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl">
              {options.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => { setSelected(opt); setIsOpen(false); }}
                  className="p-4 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="w-full py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-brand-cyan hover:text-black transition-all">
          Enviar solicitud
        </button>
      </div>
    </div>
  );
}