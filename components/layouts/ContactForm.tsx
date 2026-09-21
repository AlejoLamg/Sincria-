"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner"; 
import { motion, AnimatePresence } from "framer-motion";
import { useProjectConfig, formatCOP } from "@/context/ProjectConfigContext";

export default function ContactForm() {
  const {
    selectedObjective,
    setObjective,
    selectedPlan,
    selectedModules,
    removeModule,
    totalEstimatedPrice,
    modulesPrice,
    clearConfig,
  } = useProjectConfig();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedHabeasData, setAcceptedHabeasData] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    "Plan Web Base (Portal ultra veloz <0.8s Next.js - $1.890.000 COP)",
    "Plan Agente IA Pro 24/7 (Ventas y atención autónoma - $2.490.000 COP)",
    "Plan E-commerce Pro (Tienda transaccional con Wompi/Bold/PSE - $3.690.000 COP)",
    "Plan Ecosistema Total (Web Ultra Veloz + Agente IA - $4.890.000 COP)",
    "Un plan base con módulos adicionales a la medida",
    "Asesoría técnica o desarrollo a medida"
  ];

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Accesibilidad de teclado para el dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      setObjective(options[highlightedIndex]);
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!acceptedHabeasData) {
      toast.error("Por favor autoriza el tratamiento de datos personales para continuar.");
      return;
    }

    setLoading(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const userComments = (formData.get("comentarios") as string) || "";

    // Combinar comentarios del usuario con los módulos seleccionados sin sobrescribir
    let finalComments = userComments.trim();
    if (selectedModules.length > 0) {
      const modulesText = selectedModules.map((m) => `${m.name} (+${formatCOP(m.price)})`).join(", ");
      finalComments = `${finalComments ? `${finalComments}\n\n` : ""}--- MÓDULOS SELECCIONADOS ---\n${modulesText}\nInversión total estimada: ${formatCOP(totalEstimatedPrice)}`;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          email: formData.get("email"),
          telefono: formData.get("telefono"),
          objetivo: selectedObjective,
          comentarios: finalComments,
          totalEstimatedPrice,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "No fue posible procesar la solicitud.");
      }

      toast.success("¡Solicitud recibida con éxito!", {
        description: "Nuestro equipo técnico y agente de IA procesarán tu solicitud de inmediato.",
      });
      formElement.reset();
      clearConfig();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Por favor intenta de nuevo o escríbenos directamente por WhatsApp.";
      toast.error("Error al procesar la solicitud", {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative overflow-hidden" aria-labelledby="form-heading">
      
      {/* Halo de luz difuminada de fondo para dar profundidad */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-cyan/5 blur-[150px] pointer-events-none rounded-full" />

      {/* SEÑAL DE CONFIANZA Y TIEMPO DE RESPUESTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12 relative z-10"
      >
        <span className="text-[10px] tracking-[0.3em] text-brand-cyan uppercase mb-2 block font-mono">05 / Diagnóstico Estratégico</span>
        <h2 id="form-heading" className="text-3xl md:text-5xl font-light text-white tracking-tight mb-3">
          Solicita tu Diagnóstico Técnico y Cotización
        </h2>
        <p className="text-gray-300 text-sm max-w-lg mx-auto font-light">
          Cuéntanos sobre tu negocio. En menos de 2 horas hábiles analizaremos tu caso y te presentaremos una propuesta exacta para acelerar tus ventas con software e IA.
        </p>
      </motion.div>

      {/* BARRA EN VIVO DE PRESUPUESTO ESTIMADO (Si hay plan o módulos seleccionados) */}
      {(selectedPlan || selectedModules.length > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 sm:p-5 bg-brand-surface/90 border border-brand-cyan/40 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.15)] relative z-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-cyan uppercase">
                Resumen de Configuración
              </span>
              <div className="text-white text-sm mt-1">
                {selectedPlan && (
                  <span className="font-semibold text-white mr-3">
                    Plan: <span className="text-brand-cyan">{selectedPlan.name} ({formatCOP(selectedPlan.price)})</span>
                  </span>
                )}
                {selectedModules.length > 0 && (
                  <span className="text-gray-300">
                    + {selectedModules.length} {selectedModules.length === 1 ? "módulo" : "módulos"} (+{formatCOP(modulesPrice)})
                  </span>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <span className="text-xs text-gray-400 block">Inversión Estimada:</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-cyan font-mono">
                {formatCOP(totalEstimatedPrice)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="space-y-6 sm:space-y-8 bg-brand-surface/60 backdrop-blur-md p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative z-10" 
        onSubmit={handleSubmit}
      >
        
        {/* BLOQUE 1: DATOS DE CONTACTO */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-brand-cyan">
              1. Tus Datos de Contacto
            </h3>
            <span className="text-[10px] font-mono text-gray-400">* Campos obligatorios</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-xs font-mono uppercase tracking-wider text-gray-300">
                Nombre <span className="text-brand-cyan">*</span>
              </label>
              <input 
                id="nombre" 
                name="nombre" 
                type="text" 
                placeholder="Ej. Carlos Pérez" 
                required 
                className="w-full bg-brand-navy/80 border border-white/10 p-4 rounded-xl text-gray-100 placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-gray-300">
                Correo electrónico <span className="text-brand-cyan">*</span>
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="carlos@tuempresa.com" 
                required 
                className="w-full bg-brand-navy/80 border border-white/10 p-4 rounded-xl text-gray-100 placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="telefono" className="block text-xs font-mono uppercase tracking-wider text-gray-300">
              Teléfono / WhatsApp <span className="text-brand-cyan">*</span>
            </label>
            <input 
              id="telefono" 
              name="telefono" 
              type="tel" 
              placeholder="+57 300 000 0000" 
              required 
              className="w-full bg-brand-navy/80 border border-white/10 p-4 rounded-xl text-gray-100 placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all" 
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
            <label id="objective-label" className="block text-xs font-mono uppercase tracking-wider text-gray-300">
              ¿Qué te gustaría construir o automatizar hoy? <span className="text-brand-cyan">*</span>
            </label>
            <div className="relative z-50" ref={dropdownRef} onKeyDown={handleKeyDown}>
              <button 
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby="objective-label"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-brand-navy/80 border border-white/10 p-4 rounded-xl text-gray-200 text-left flex justify-between items-center hover:border-brand-cyan/50 transition-all focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                <span className="truncate">{selectedObjective}</span>
                <span className="text-brand-cyan transition-transform duration-300 ml-2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.ul 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    role="listbox"
                    className="absolute left-0 w-full mt-2 bg-brand-surface border border-white/20 rounded-xl overflow-hidden z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl max-h-64 overflow-y-auto"
                  >
                    {options.map((opt, idx) => (
                      <li 
                        key={opt}
                        role="option"
                        aria-selected={selectedObjective === opt}
                        onClick={() => { setObjective(opt); setIsOpen(false); }}
                        className={`p-4 text-sm cursor-pointer transition-colors border-b border-white/5 last:border-none ${
                          selectedObjective === opt 
                            ? "bg-brand-cyan/20 text-brand-cyan font-medium" 
                            : idx === highlightedIndex
                            ? "bg-white/10 text-white"
                            : "text-gray-300 hover:text-white hover:bg-brand-cyan/10"
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CHIPS DE MÓDULOS ADICIONALES (SIN PÉRDIDA DE DATOS) */}
          {selectedModules.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300">
                Módulos adicionales incluidos ({selectedModules.length}):
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-brand-navy/60 rounded-xl border border-white/5">
                {selectedModules.map((mod) => (
                  <span
                    key={mod.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 text-white text-xs font-mono"
                  >
                    <span>{mod.name} (+{formatCOP(mod.price)})</span>
                    <button
                      type="button"
                      onClick={() => removeModule(mod.name)}
                      aria-label={`Quitar ${mod.name}`}
                      className="text-brand-cyan hover:text-white hover:bg-brand-cyan/30 rounded-full w-4 h-4 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="comentarios" className="block text-xs font-mono uppercase tracking-wider text-gray-300">
              Comentarios adicionales o requerimientos especiales <span className="text-gray-500">(Opcional)</span>
            </label>
            <textarea 
              id="comentarios" 
              name="comentarios" 
              placeholder="Cuéntanos brevemente sobre tu empresa, objetivos o dudas adicionales..." 
              className="w-full bg-brand-navy/80 border border-white/10 p-4 rounded-xl text-gray-100 placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all h-32 resize-none" 
            />
          </div>
        </div>

        {/* CONSENTIMIENTO EXPLÍCITO HABEAS DATA (LEY 1581 DE 2012) */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left">
          <input 
            id="habeasData" 
            type="checkbox" 
            checked={acceptedHabeasData} 
            onChange={(e) => setAcceptedHabeasData(e.target.checked)}
            required
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-brand-navy text-brand-cyan focus:ring-brand-cyan focus:ring-offset-0 cursor-pointer shrink-0 accent-cyan-400" 
          />
          <label htmlFor="habeasData" className="text-xs text-gray-300 leading-relaxed cursor-pointer select-none">
            Autorizo a SincroIA el tratamiento de mis datos personales para recibir el diagnóstico y cotización solicitada, conforme a la <strong className="text-white font-medium">Ley 1581 de 2012 (Habeas Data)</strong> y su{" "}
            <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline font-medium">
              Política de Privacidad
            </a>.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-brand-cyan text-brand-navy font-mono text-xs tracking-widest font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:shadow-[0_0_35px_rgba(0,255,255,0.4)] disabled:opacity-50 cursor-pointer active:scale-[0.99]"
        >
          {loading ? "Procesando solicitud..." : "SOLICITAR DIAGNÓSTICO Y COTIZACIÓN →"}
        </button>

        <p className="text-[11px] font-mono text-gray-400 text-center pt-1">
          🔒 Respuesta en menos de 2 horas hábiles • Asesoría técnica 100% gratuita y sin compromiso
        </p>
      </motion.form>
    </section>
  );
}