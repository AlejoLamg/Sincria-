"use client";
import { useState } from "react";

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Selecciona tu objetivo de inversión");

  const options = ["Web Base", "IA Pro", "Ecosistema Total", "Consultoría de IA", "Auditoría Técnica"];

  return (
    // 1. Usamos <section> con un id para poder navegar hasta aquí desde el Hero
    <section id="contacto" className="max-w-3xl mx-auto px-6 py-24" aria-labelledby="form-heading">
      <h2 id="form-heading" className="sr-only">Formulario de contacto para servicios de ingeniería</h2>
      
      {/* 2. <form> real en lugar de un div para que los navegadores lo reconozcan como formulario */}
      <form className="space-y-6 bg-[#0a0a0a] p-8 rounded-2xl border border-white/5" onSubmit={(e) => e.preventDefault()}>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* 3. Inputs con etiquetas y nombres para que los navegadores autocompleten */}
          <div>
            <label htmlFor="nombre" className="sr-only">Nombre</label>
            <input id="nombre" name="nombre" type="text" placeholder="Nombre" required className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input id="email" name="email" type="email" placeholder="Correo" required className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
          </div>
        </div>

        {/* 4. Menú accesible: usamos <button> y aria-expanded */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-400 text-left flex justify-between items-center hover:border-white/10 transition-all"
          >
            {selected}
            <span aria-hidden="true" className="text-brand-cyan/50">▼</span>
          </button>
          
          {isOpen && (
            <ul role="listbox" className="absolute w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl">
              {options.map((opt) => (
                <li 
                  key={opt}
                  role="option"
                  onClick={() => { setSelected(opt); setIsOpen(false); }}
                  className="p-4 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="w-full py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-brand-cyan hover:text-black transition-all">
          Enviar solicitud
        </button>
      </form>
    </section>
  );
}