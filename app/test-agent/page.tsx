"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
  action?: string;
}

export default function TestAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      text: "¡Hola! 👋 Soy Sofía de SincroIA.lat. Vi que nos visitas para conocer sobre nuestros portales web de alta velocidad y agentes de IA. ¿Qué tipo de negocio tienes o qué proyecto te gustaría cotizar?",
      time: "10:00 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [sessionId] = useState(() => "test-" + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const startTime = performance.now();
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          contactName: "Alejo (Prueba)",
        }),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      if (data.data?.reply) {
        const agentMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          text: data.data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action: data.data.action,
        };
        setMessages((prev) => [...prev, agentMsg]);
        if (data.data.action) {
          setLastAction(`${data.data.action} (${elapsed}ms)`);
        } else {
          setLastAction(`Respuesta normal (${elapsed}ms)`);
        }
      } else if (data.data?.isPaused) {
        setLastAction("SESIÓN PAUSADA: El bot está en modo silencio por relevo humano.");
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickScenarios = [
    { label: "💰 Preguntar precios", text: "¿Cuáles son sus precios y planes para Colombia?" },
    { label: "🐌 Tengo WordPress", text: "Ya tengo una página web en WordPress pero siento que no me vende nada." },
    { label: "💸 Está muy caro", text: "Me parece que $1.890.000 COP está muy costoso para una web." },
    { label: "🤖 ¿Cómo funciona la IA?", text: "¿Cómo funciona exactamente el agente de IA para WhatsApp?" },
    { label: "👨‍💻 Hablar con Alejo", text: "Quiero hablar con una persona real o con Alejo directamente." },
    { label: "🚀 Quiero contratar", text: "Me interesa el Plan Web Base de $1.890.000. ¿Cómo empezamos?" },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans">
      {/* Barra superior del simulador */}
      <header className="bg-brand-navy/90 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-violet flex items-center justify-center font-bold text-brand-navy text-sm shadow-lg">
              S
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-brand-navy rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white flex items-center gap-2">
              Sofía • Asistente Comercial SincroIA
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online 24/7
              </span>
            </h1>
            <p className="text-[11px] text-gray-400 font-mono">
              Simulador de WhatsApp Business con Gemini 2.5 Flash
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastAction && (
            <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-brand-surface border border-brand-cyan/30 text-brand-cyan">
              ⚡ {lastAction}
            </span>
          )}
          <Link
            href="/"
            className="text-xs font-mono text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            ← Volver a la Web
          </Link>
        </div>
      </header>

      {/* Botones de escenarios rápidos */}
      <div className="bg-brand-navy/50 border-b border-white/5 px-6 py-3 overflow-x-auto flex gap-2">
        <span className="text-xs font-mono text-gray-400 self-center shrink-0 mr-2">
          Pruebas rápidas:
        </span>
        {quickScenarios.map((sc) => (
          <button
            key={sc.label}
            onClick={() => handleSend(sc.text)}
            disabled={loading}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan border border-white/10 hover:border-brand-cyan/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Área del Chat simulando WhatsApp */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-y-auto flex flex-col space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-md p-4 rounded-2xl shadow-lg leading-relaxed text-sm ${
                m.sender === "user"
                  ? "bg-[#005c4b] text-white rounded-tr-sm border border-emerald-500/20"
                  : "bg-brand-surface/90 text-gray-100 rounded-tl-sm border border-white/10 backdrop-blur-md"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <div className="flex items-center justify-end gap-1.5 mt-2">
                <span className="text-[10px] text-gray-300 font-mono">{m.time}</span>
                {m.sender === "user" && <span className="text-[10px] text-emerald-300">✓✓</span>}
              </div>
            </div>
            {m.action && (
              <span className="text-[10px] font-mono text-brand-cyan mt-1 px-2 py-0.5 rounded bg-brand-cyan/10">
                Acción detectada: {m.action}
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="bg-brand-surface/90 border border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-gray-400 font-mono ml-2">Sofía está escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Barra de entrada de texto */}
      <footer className="bg-brand-navy/90 border-t border-white/10 p-4 sticky bottom-0 backdrop-blur-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje como si fueras un cliente en WhatsApp..."
            disabled={loading}
            className="flex-1 bg-brand-surface/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-[#25D366] text-black font-bold font-mono text-xs rounded-xl hover:bg-emerald-400 transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-1.5"
          >
            ENVIAR ➤
          </button>
        </form>
      </footer>
    </div>
  );
}
