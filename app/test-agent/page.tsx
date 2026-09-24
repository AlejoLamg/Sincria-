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
  const [sessionId, setSessionId] = useState(() => "test-" + Math.random().toString(36).substring(2, 9));
  const [isPaused, setIsPaused] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar estado inicial de la clave
  useEffect(() => {
    fetch("/api/agent/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasGeminiKey) {
          setHasKey(true);
        } else {
          const savedKey = localStorage.getItem("sincro_gemini_key");
          if (savedKey) {
            setApiKey(savedKey);
            setHasKey(true);
          } else {
            setShowKeyInput(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isPaused]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("sincro_gemini_key", apiKey.trim());
      setHasKey(true);
      setShowKeyInput(false);
      setLastAction("Clave de Gemini guardada. ¡IA activa!");
    }
  };

  const handleResumeAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resume",
          sessionId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsPaused(false);
        setLastAction("Agente reanudado con éxito.");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "agent",
            text: "¡Listo! He retomado la conversación. ¿En qué más puedo asesorarte sobre tu proyecto?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = async () => {
    try {
      await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          sessionId,
        }),
      });
      const newSession = "test-" + Math.random().toString(36).substring(2, 9);
      setSessionId(newSession);
      setIsPaused(false);
      setLastAction("Conversación reiniciada desde cero.");
      setMessages([
        {
          id: "1",
          sender: "agent",
          text: "¡Hola! 👋 Soy Sofía de SincroIA.lat. Vi que nos visitas para conocer sobre nuestros portales web de alta velocidad y agentes de IA. ¿Qué tipo de negocio tienes o qué proyecto te gustaría cotizar?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

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
          apiKey: apiKey || localStorage.getItem("sincro_gemini_key") || undefined,
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
          setLastAction(`Respuesta generada en ${elapsed}ms`);
        }
      }

      if (data.isPaused || data.data?.isPaused) {
        setIsPaused(true);
        setLastAction("RELEVO HUMANO: Sofía se silenció para cederte el control.");
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
      <header className="bg-brand-navy/90 border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-violet flex items-center justify-center font-bold text-brand-navy text-sm shadow-lg">
              S
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-brand-navy rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white flex items-center gap-2">
              Sofía • Agente de Ventas SincroIA
              {hasKey ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ● Cerebro Gemini IA Conectado
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⚠️ Sin Clave Gemini (Modo Plantilla)
                </span>
              )}
            </h1>
            <p className="text-[11px] text-gray-400 font-mono">
              Simulador de WhatsApp Business con Relevo Humano
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {lastAction && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-cyan/30 text-brand-cyan">
              ⚡ {lastAction}
            </span>
          )}

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-brand-violet/50 text-brand-violet hover:bg-brand-violet/10 transition-all cursor-pointer"
          >
            🔑 {hasKey ? "Cambiar API Key" : "Conectar API Key"}
          </button>

          <button
            onClick={handleResetChat}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
          >
            🔄 Reiniciar Chat
          </button>

          <Link
            href="/marketing-hub"
            className="text-xs font-mono text-brand-cyan hover:text-white px-3 py-1.5 rounded-lg border border-brand-cyan/30 hover:border-brand-cyan transition-all flex items-center gap-1"
          >
            🚀 Marketing Hub
          </Link>

          <Link
            href="/"
            className="text-xs font-mono text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all"
          >
            ← Web
          </Link>
        </div>
      </header>

      {/* Panel para pegar la Gemini API Key */}
      {showKeyInput && (
        <div className="bg-brand-surface/95 border-b border-brand-cyan/30 px-6 py-4 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 text-xs">
              <p className="font-semibold text-white">Conecta el Cerebro de Inteligencia Artificial:</p>
              <p className="text-gray-400 mt-0.5">
                Obtén tu clave gratuita en 15 segundos en{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-cyan underline"
                >
                  aistudio.google.com/apikey
                </a>{" "}
                y pégala aquí para activar a Sofía con razonamiento dinámico.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="bg-brand-navy border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-brand-cyan w-full sm:w-64"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-brand-cyan text-brand-navy font-mono text-xs font-bold rounded-lg hover:bg-white transition-all cursor-pointer shrink-0"
              >
                Activar IA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botones de escenarios rápidos */}
      <div className="bg-brand-navy/50 border-b border-white/5 px-6 py-2.5 overflow-x-auto flex gap-2">
        <span className="text-xs font-mono text-gray-400 self-center shrink-0 mr-1">
          Pruebas:
        </span>
        {quickScenarios.map((sc) => (
          <button
            key={sc.label}
            onClick={() => handleSend(sc.text)}
            disabled={loading || isPaused}
            className="shrink-0 text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan border border-white/10 hover:border-brand-cyan/40 transition-all cursor-pointer disabled:opacity-40"
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

        {/* Tarjeta de Alerta si el Relevo Humano está Activo */}
        {isPaused && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span>⚠️</span> Relevo Humano Activo (Human Takeover)
              </p>
              <p className="text-gray-300 mt-0.5">
                El cliente pidió hablar con Alejo o una persona. En WhatsApp real, Sofía se silencia para que tú tomes el control del chat.
              </p>
            </div>
            <button
              onClick={handleResumeAgent}
              className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md"
            >
              ▶️ Reanudar Sofía
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-start">
            <div className="bg-brand-surface/90 border border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-gray-400 font-mono ml-2">Sofía está analizando y respondiendo...</span>
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
            placeholder={
              isPaused
                ? "Sesión en pausa por relevo humano. Presiona 'Reanudar Sofía' arriba para reactivarla..."
                : "Escribe cualquier pregunta u objeción a Sofía..."
            }
            disabled={loading || isPaused}
            className="flex-1 bg-brand-surface/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || isPaused || !input.trim()}
            className="px-6 py-3 bg-[#25D366] text-black font-bold font-mono text-xs rounded-xl hover:bg-emerald-400 transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-1.5"
          >
            ENVIAR ➤
          </button>
        </form>
      </footer>
    </div>
  );
}
