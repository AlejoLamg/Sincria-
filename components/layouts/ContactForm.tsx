"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de que esta ruta sea correcta

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Selecciona tu objetivo de inversión");
  const [loading, setLoading] = useState(false);

  const options = ["Web Base", "IA Pro", "Ecosistema Total", "Consultoría de IA", "Auditoría Técnica"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Enviamos los datos a la tabla 'leads' de Supabase
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
      alert("Error al enviar: " + error.message);
    } else {
      alert("¡Recibido! Nos pondremos en contacto pronto.");
      e.currentTarget.reset();
      setSelected("Selecciona tu objetivo de inversión");
    }
    setLoading(false);
  };

  return (
    <section id="contacto" className="max-w-3xl mx-auto px-6 py-24" aria-labelledby="form-heading">
      <h2 id="form-heading" className="sr-only">Formulario de contacto para servicios de ingeniería</h2>
      
      <form className="space-y-6 bg-[#0a0a0a] p-8 rounded-2xl border border-white/5" onSubmit={handleSubmit}>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className="sr-only">Nombre</label>
            <input id="nombre" name="nombre" type="text" placeholder="Nombre" required className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input id="email" name="email" type="email" placeholder="Correo" required className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
          </div>
        </div>

        <div>
          <label htmlFor="telefono" className="sr-only">Teléfono / WhatsApp</label>
          <input id="telefono" name="telefono" type="tel" placeholder="Teléfono o WhatsApp" required className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all" />
        </div>

        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-400 text-left flex justify-between items-center hover:border-white/10 transition-all"
          >
            {selected}
            <span className="text-brand-cyan/50">▼</span>
          </button>
          
          {isOpen && (
            <ul className="absolute w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl">
              {options.map((opt) => (
                <li 
                  key={opt}
                  onClick={() => { setSelected(opt); setIsOpen(false); }}
                  className="p-4 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="comentarios" className="sr-only">Comentarios adicionales</label>
          <textarea 
            id="comentarios" 
            name="comentarios" 
            placeholder="¿Algo más que debamos saber? (Opcional)" 
            className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan/50 outline-none transition-all h-32 resize-none" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-brand-cyan hover:text-black transition-all disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </section>
  );
}