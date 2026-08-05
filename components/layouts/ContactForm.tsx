"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner"; 
import { motion } from "framer-motion";

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Selecciona una opción para tu negocio...");
  const [loading, setLoading] = useState(false);

  const options = [
    "Plan Web Base (Página web rápida y moderna)",
    "Plan E-commerce (Tienda virtual optimizada para vender)",
    "Plan IA Pro (Asistente virtual y automatización 24/7)",
    "Plan Ecosistema Total (Solución integral y dashboard)",
    "Un plan base con módulos adicionales a la medida",
    "Asesoría técnica o optimización a medida"
  ];

  // Escuchar el evento cuando el usuario da clic en "Elegir Plan"
  useEffect(() => {
    const handleSelectPlan = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setSelected(customEvent.detail);
      }
    };

    window.addEventListener('selectPlan', handleSelectPlan);
    return () => window.removeEventListener('selectPlan', handleSelectPlan);
  }, []);

  // Escuchar cuando el usuario selecciona o deselecciona módulos adicionales
  useEffect(() => {
    const handleSelectModules = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const modulesList: string[] = customEvent.detail;
        const comentariosInput = document.getElementById("comentarios") as HTMLTextAreaElement;
        if (comentariosInput) {
          if (modulesList.length > 0) {
            comentariosInput.value = `Módulos adicionales seleccionados:\n- ${modulesList.join("\n- ")}`;
          } else {
            comentariosInput.value = "";
          }
        }
      }
    };

    window.addEventListener('selectModules', handleSelectModules);
    return () => window.removeEventListener('selectModules', handleSelectModules);
  }, []);

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
        description: "Nuestro agente IA procesará tu solicitud de inmediato.",
      });
      e.currentTarget.reset();
      setSelected("Selecciona una opción para tu negocio...");
    }
    setLoading(false);
  };

  return (
    <section id="contacto" className="max-w-4xl mx-auto px-6 py-24 relative overflow-hidden" aria-labelledby="form-heading">
      
      {/* Halo de luz difuminada de fondo para dar profundidad (Blur) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-cyan/5 blur-[150px] pointer-events-none rounded-full" />

      {/* SEÑAL DE CONFIANZA Y TIEMPO DE RESPUESTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12 relative z-10"
      >
        <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-2 block">05 / Contacto Directo</span>
        <h2 id="form-heading" className="text-3xl md:text-5xl font-light text-white tracking-tight mb-3">
          Comencemos a escalar tu negocio
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Completa el formulario o escríbenos directamente. Nuestro agente y equipo técnico te atenderán de manera <span className="text-brand-cyan font-medium">inmediata vía WhatsApp</span>.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="space-y-8 bg-brand-surface/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative z-10" 
        onSubmit={handleSubmit}
      >
        
        {/* BLOQUE 1: DATOS DE CONTACTO */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
              1. Tus Datos de Contacto
            </h3>
            <span className="text-[10px] font-mono text-gray-500">* Campos obligatorios</span>
          </div>

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
                className="w-full bg-brand-navy/60 border border-white/10 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all" 
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
                className="w-full bg-brand-navy/60 border border-white/10 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all" 
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
              placeholder="+57 300 000 0000" 
              required 
              className="w-full bg-brand-navy/60 border border-white/10 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all" 
            />
          </div>
        </div>

        {/* BLOQUE 2: DETALLES DEL PROYECTO */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
              2. Detalles del Proyecto
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">
              ¿Qué te gustaría construir o automatizar hoy? <span className="text-brand-cyan">*</span>
            </label>
            <div className="relative z-50">
              <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-brand-navy/60 border border-white/10 p-4 rounded-xl text-gray-300 text-left flex justify-between items-center hover:border-brand-cyan/50 transition-all focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                {selected}
                <span className="text-brand-cyan transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              
              {isOpen && (
                <ul className="absolute left-0 w-full mt-2 bg-brand-navy border border-white/20 rounded-xl overflow-hidden z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                  {options.map((opt) => (
                    <li 
                      key={opt}
                      onClick={() => { setSelected(opt); setIsOpen(false); }}
                      className="p-4 text-gray-300 hover:text-white hover:bg-brand-cyan/10 cursor-pointer transition-colors text-sm border-b border-white/5 last:border-none"
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
              Comentarios adicionales o módulos seleccionados <span className="text-gray-600">(Opcional)</span>
            </label>
            <textarea 
              id="comentarios" 
              name="comentarios" 
              placeholder="Cuéntanos brevemente sobre tu proyecto o necesidades actuales..." 
              className="w-full bg-brand-navy/60 border border-white/10 p-4 rounded-xl text-gray-300 placeholder-gray-600 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all h-32 resize-none" 
            />
          </div>
        </div>

        {/* AVISO DE PRIVACIDAD / CONSENTIMIENTO */}
        <p className="text-gray-500 text-[11px] text-center leading-relaxed pt-2">
          Al enviar este formulario, aceptas el tratamiento de tus datos personales conforme a nuestra{" "}
          <a href="/privacidad" className="text-brand-cyan hover:underline">
            Política de Privacidad
          </a>.
        </p>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-brand-cyan text-brand-navy font-mono text-xs tracking-widest font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:shadow-[0_0_35px_rgba(0,255,255,0.4)] disabled:opacity-50 cursor-pointer active:scale-[0.99]"
        >
          {loading ? "Iniciando proyecto..." : "Iniciar Proyecto"}
        </button>
      </motion.form>
    </section>
  );
}