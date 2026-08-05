"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner"; 

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("¿Qué te gustaría construir o automatizar hoy?");
  const [loading, setLoading] = useState(false);

  const options = ["Una página web rápida y moderna para mi negocio",
  "Una tienda virtual o e-commerce optimizado para vender con IA",
  "Un asistente virtual o chat de ventas con IA (24/7)",
  "Una plataforma completa (Web + Automatizaciones + IA)",
  "Asesoría técnica para mi empresa",
  "Optimizar o revisar un sistema que ya tengo"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("leads").insert([
      {
        nombre: formData.get("nombre"),
        email: formData.get("email"),
        telefono: formData.get("telefono"),
        objetivo: selected,
        comentarios: formData.get("comentarios"),
      },
    ]);

    if (error) {
      toast.error("Error al procesar la solicitud", {
        description: error.message,
      });
    } else {
      toast.success("¡Solicitud recibida con éxito!", {
        description: "Nuestro equipo analizará tu caso y te contactará pronto.",
      });
      e.currentTarget.reset();
      setSelected("Selecciona tu objetivo de inversión");
    }
    setLoading(false);
  };

  return (
    <section id="contacto" className="max-w-3xl mx-auto px-6 py-24" aria-labelledby="form-heading">
      <h2 id="form-heading" className="sr-only">Formulario de contacto para servicios de ingeniería</h2>
      
      <form className="space-y-6 bg-brand-background p-8 rounded-2xl border border-white/5" onSubmit={handleSubmit}>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
              Nombre <span className="text-brand-cyan">*</span>
            </label>
            <input 
              id="nombre" 
              name="nombre" 
              type="text" 
              placeholder="Ej. Carlos Pérez" 
              required 
              className="w-full bg-brand-surface border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
              Correo electrónico <span className="text-brand-cyan">*</span>
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="carlos@tuempresa.com" 
              required 
              className="w-full bg-brand-surface border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="telefono" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
            Teléfono / WhatsApp <span className="text-brand-cyan">*</span>
          </label>
          <input 
            id="telefono" 
            name="telefono" 
            type="tel" 
            placeholder="+57 322 555 6666" 
            required 
            className="w-full bg-brand-surface border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">
            Objetivo de inversión <span className="text-brand-cyan">*</span>
          </label>
          <div className="relative z-50">
            <button 
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-brand-surface border border-white/5 p-4 rounded-xl text-gray-300 text-left flex justify-between items-center hover:border-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-brand-cyan/50"
            >
              {selected}
              <span className="text-brand-cyan/50">▼</span>
            </button>
            
            {isOpen && (
              <ul className="absolute left-0 w-full mt-2 bg-brand-navy border border-white/20 rounded-xl overflow-hidden z-[100] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                {options.map((opt) => (
                  <li 
                    key={opt}
                    onClick={() => { setSelected(opt); setIsOpen(false); }}
                    className="p-4 text-gray-300 hover:text-white hover:bg-brand-cyan/10 cursor-pointer transition-colors"
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="comentarios" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
            Comentarios adicionales <span className="text-gray-600">(Opcional)</span>
          </label>
          <textarea 
            id="comentarios" 
            name="comentarios" 
            placeholder="Cuéntanos brevemente sobre tu proyecto o necesidades actuales..." 
            className="w-full bg-brand-surface border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all h-32 resize-none" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-brand-cyan text-brand-navy font-mono text-xs tracking-widest font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50"
        >
          {loading ? "Iniciando proyecto..." : "Iniciar Proyecto"}
        </button>
      </form>
    </section>
  );
}