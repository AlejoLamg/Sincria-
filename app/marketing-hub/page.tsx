"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Palette,
  MessageSquare,
  Key,
  Flame,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Send,
  Sliders,
  Compass,
  Download,
  ExternalLink,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Target,
  Video,
  Play,
  Film,
  Megaphone,
  Upload,
} from "lucide-react";
import { MarketingAgentRole, SocialNetwork, MarketingTaskType } from "@/lib/marketing-agents/types";
import { SINCROIA_CONTENT_CALENDAR, CalendarPost } from "@/lib/marketing-agents/calendar";

interface AgentDef {
  id: MarketingAgentRole;
  name: string;
  shortName: string;
  roleTitle: string;
  icon: any;
  color: string;
  accentBg: string;
  description: string;
  tasks: { id: MarketingTaskType; label: string; defaultNetwork?: SocialNetwork }[];
}

const AGENTS: AgentDef[] = [
  {
    id: "cmo",
    name: "Chief Marketing Officer",
    shortName: "CMO",
    roleTitle: "Director Estratégico",
    icon: Sparkles,
    color: "text-amber-400",
    accentBg: "bg-amber-500/10 border-amber-500/30",
    description: "Orquesta campañas integrales, roadmap de lanzamiento y planes maestros de ataque comercial.",
    tasks: [
      { id: "full_launch_strategy", label: "Plan Maestro de Lanzamiento (IG + FB + WhatsApp)" },
      { id: "niche_attack_plan", label: "Plan de Ataque por Nicho (Clínicas, E-commerce, B2B)" },
      { id: "campaign_brief", label: "Briefing Ejecutivo de Campaña Multicanal" },
    ],
  },
  {
    id: "brand_strategist",
    name: "Brand & Identity Strategist",
    shortName: "Brand",
    roleTitle: "Posicionamiento & Voz",
    icon: ShieldCheck,
    color: "text-brand-cyan",
    accentBg: "bg-cyan-500/10 border-cyan-500/30",
    description: "Construye la autoridad técnica de SincroIA, redacta las biografías y las Historias Destacadas.",
    tasks: [
      { id: "profile_bios", label: "Biografías de Alto Impacto (Instagram & Facebook)", defaultNetwork: "instagram" },
      { id: "highlight_stories", label: "Arquitectura de Historias Destacadas (5 Highlights)", defaultNetwork: "instagram" },
      { id: "content_pillars", label: "Pilares de Contenido y Tesis de Combate" },
      { id: "brand_manifesto", label: "Manifiesto de Marca SincroIA" },
    ],
  },
  {
    id: "copywriter",
    name: "Creative Copywriter Agent",
    shortName: "Copywriter",
    roleTitle: "Redacción Persuasiva",
    icon: FileText,
    color: "text-purple-400",
    accentBg: "bg-purple-500/10 border-purple-500/30",
    description: "Escribe piezas de alta conversión: el grid de los 9 posts, guiones de video y anuncios para WhatsApp.",
    tasks: [
      { id: "foundational_grid_posts", label: "Grid de los 9 Posts Fundacionales de Lanzamiento", defaultNetwork: "instagram" },
      { id: "reel_tiktok_script", label: "Guion de Video Demostrativo (30-45s Reels/TikTok)", defaultNetwork: "instagram" },
      { id: "meta_ads_copy", label: "Copy para Meta Ads (Click to WhatsApp)", defaultNetwork: "facebook" },
      { id: "carousel_slides", label: "Estructura de Carrusel Educativo (Next.js vs WP)", defaultNetwork: "instagram" },
    ],
  },
  {
    id: "virtual_asset",
    name: "Virtual Asset Agent",
    shortName: "Visual Assets",
    roleTitle: "Dirección de Arte & Prompts",
    icon: Palette,
    color: "text-pink-400",
    accentBg: "bg-pink-500/10 border-pink-500/30",
    description: "Diseña especificaciones de portadas, storyboards de grabación y prompts de imagen para IA.",
    tasks: [
      { id: "social_banner_prompt", label: "Especificación & Prompt de Portada de Facebook (820x312)", defaultNetwork: "facebook" },
      { id: "ui_mockup_prompt", label: "Prompts de IA para Mockup de Sofía en Celular" },
      { id: "storyboard_video", label: "Storyboard para Video de Pantalla (Efecto Demostración)" },
      { id: "highlight_icons", label: "Concepto de Iconos para Historias Destacadas", defaultNetwork: "instagram" },
    ],
  },
  {
    id: "growth_ops",
    name: "Growth Ops Agent",
    shortName: "Growth Ops",
    roleTitle: "Embudos & WhatsApp",
    icon: TrendingUp,
    color: "text-emerald-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/30",
    description: "Configuración táctica de WhatsApp Business, enlaces con UTMs y calendario de publicación.",
    tasks: [
      { id: "whatsapp_deep_links", label: "Generador de Enlaces Inteligentes wa.me con UTMs", defaultNetwork: "whatsapp" },
      { id: "whatsapp_catalog_setup", label: "Fichas de Catálogo para WhatsApp Business (+57 312...)", defaultNetwork: "whatsapp" },
      { id: "launch_calendar", label: "Calendario de Publicación de 14 Días (Lanzamiento)" },
      { id: "outbound_audit_script", label: "Guion de Auditoría Outbound de 60s (Prospección)" },
    ],
  },
];

export default function MarketingHubPage() {
  const [selectedAgent, setSelectedAgent] = useState<MarketingAgentRole>("cmo");
  const [selectedTask, setSelectedTask] = useState<MarketingTaskType>("full_launch_strategy");
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork>("both");
  const [selectedNiche, setSelectedNiche] = useState<string>("general");
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showMetaModal, setShowMetaModal] = useState<boolean>(false);
  const [metaToken, setMetaToken] = useState<string>("");
  const [hasMetaKey, setHasMetaKey] = useState<boolean>(false);

  // Estados de Modo: Cronograma | Ads Studio | Sala de Guerra | Especialistas
  const [hubMode, setHubMode] = useState<"calendar" | "ads" | "team" | "specialists">("calendar");
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>(SINCROIA_CONTENT_CALENDAR);
  const [expandedPostId, setExpandedPostId] = useState<string | null>("post_3");
  const [expandedReelId, setExpandedReelId] = useState<string | null>("post_2");
  const [filterPhase, setFilterPhase] = useState<string>("all");
  const [teamObjective, setTeamObjective] = useState<string>(
    "Post 3: Comparativa técnica de WordPress (4.5s con Elementor) vs Next.js 15 (<0.8s en celulares). Cómo las empresas botan dinero en pauta."
  );
  const [teamRunning, setTeamRunning] = useState<boolean>(false);
  const [teamStep, setTeamStep] = useState<number>(0);
  const [teamResult, setTeamResult] = useState<any>(null);
  const [selectedTeamImage, setSelectedTeamImage] = useState<string>("/marketing/post3-wordpress-vs-nextjs.jpg");

  // Estados para Ads Studio (Modo Anuncios de Pauta Meta)
  const [adObjective, setAdObjective] = useState<string>(
    "Generar conversaciones de WhatsApp con dueños de clínicas y negocios para vender el Plan Agente IA Pro ($2.490.000 COP)"
  );
  const [adNiche, setAdNiche] = useState<string>("clinicas_odontologicas");
  const [adAudience, setAdAudience] = useState<string>(
    "Dueños de clínicas odontológicas, centros de estética y consultorios médicos en Bogotá, Medellín y Cali"
  );
  const [adRunning, setAdRunning] = useState<boolean>(false);
  const [adResult, setAdResult] = useState<any>(null);
  const [selectedAdImage, setSelectedAdImage] = useState<string>("/marketing/post5-clinicas-odontologia.jpg");

  // Check key on mount
  useEffect(() => {
    fetch("/api/marketing")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasGeminiKey) {
          setHasServerKey(true);
        } else {
          const saved = localStorage.getItem("sincro_gemini_key");
          if (saved) {
            setApiKey(saved);
            setHasServerKey(true);
          } else {
            setShowKeyInput(true);
          }
        }
        if (data.hasMetaKey) {
          setHasMetaKey(true);
        } else {
          const savedMeta = localStorage.getItem("sincro_meta_token");
          if (savedMeta) {
            setMetaToken(savedMeta);
            setHasMetaKey(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentAgent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];

  // Auto-update task when agent changes
  const handleAgentChange = (agentId: MarketingAgentRole) => {
    setSelectedAgent(agentId);
    const agent = AGENTS.find((a) => a.id === agentId);
    if (agent && agent.tasks.length > 0) {
      setSelectedTask(agent.tasks[0].id);
      if (agent.tasks[0].defaultNetwork) {
        setSelectedNetwork(agent.tasks[0].defaultNetwork);
      }
    }
  };

  const handleTaskChange = (taskId: MarketingTaskType) => {
    setSelectedTask(taskId);
    const taskDef = currentAgent.tasks.find((t) => t.id === taskId);
    if (taskDef?.defaultNetwork) {
      setSelectedNetwork(taskDef.defaultNetwork);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("sincro_gemini_key", apiKey.trim());
      setHasServerKey(true);
      setShowKeyInput(false);
    }
  };

  const [testingToken, setTestingToken] = useState<boolean>(false);
  const [tokenStatus, setTokenStatus] = useState<{
    tested: boolean;
    valid?: boolean;
    name?: string;
    message?: string;
  } | null>(null);

  const handleTestMetaToken = async (explicitToken?: string) => {
    const tokenToTest = explicitToken || metaToken || localStorage.getItem("sincro_meta_token") || undefined;
    if (!tokenToTest) {
      setTokenStatus({
        tested: true,
        valid: false,
        message: "Por favor ingresa un token de Meta antes de verificar.",
      });
      return;
    }
    setTestingToken(true);
    setTokenStatus(null);
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_meta_token",
          accessToken: tokenToTest,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTokenStatus({
          tested: true,
          valid: true,
          name: data.user?.name || "Meta User",
          message: `¡Conexión verificada! Token activo y válido para ${data.user?.name || "tu cuenta de Meta"}.`,
        });
        setHasMetaKey(true);
      } else {
        setTokenStatus({
          tested: true,
          valid: false,
          message: data.error || "Token inválido o sesión caducada.",
        });
        setHasMetaKey(false);
      }
    } catch (err: any) {
      setTokenStatus({
        tested: true,
        valid: false,
        message: err.message,
      });
    } finally {
      setTestingToken(false);
    }
  };

  const handleSaveMetaToken = () => {
    if (metaToken.trim()) {
      localStorage.setItem("sincro_meta_token", metaToken.trim());
      setHasMetaKey(true);
      handleTestMetaToken(metaToken.trim());
    }
  };

  const [publishing, setPublishing] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [uploadingVideo, setUploadingVideo] = useState<string | null>(null);

  const handleUploadVideo = async (postId: string, file: File) => {
    setUploadingVideo(postId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", `reel-${postId}.mp4`);

      const res = await fetch("/api/marketing/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCalendarPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, videoUrl: data.url } : p))
        );
      } else {
        alert(data.error || "Error al subir video");
      }
    } catch (err: any) {
      alert("Error al subir video: " + err.message);
    } finally {
      setUploadingVideo(null);
    }
  };

  const handleAutoPublish = async (
    imageUrl = "/marketing/post1-grid-feed.jpg",
    captionText?: string,
    platformOverride?: SocialNetwork,
    videoUrl?: string,
    format?: "post" | "reel"
  ) => {
    setPublishing(true);
    setPublishResult(null);
    const platformToUse = platformOverride || selectedNetwork;
    try {
      const finalCaption =
        captionText ||
        response ||
        "SincroIA — Portales Web Next.js 15 (<0.8s) y Agentes de IA en WhatsApp 24/7 en Colombia y LatAm. Visita https://www.sincroia.lat";
      const isReel = format === "reel" || Boolean(videoUrl);
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_meta",
          platform: platformToUse === "both" ? "both" : platformToUse,
          imageUrl: imageUrl,
          videoUrl: videoUrl,
          mediaType: isReel ? "REELS" : "IMAGE",
          caption: finalCaption,
          accessToken: metaToken || localStorage.getItem("sincro_meta_token") || undefined,
        }),
      });
      const data = await res.json();
      setPublishResult(data);
      if (data.success && (data.instagramMediaId || data.facebookPostId)) {
        setCalendarPosts((prev) =>
          prev.map((p) =>
            p.recommendedImage === imageUrl || (videoUrl && p.videoUrl === videoUrl)
              ? {
                  ...p,
                  status: "published",
                  publishedId: data.instagramMediaId || data.facebookPostId,
                  publishedPlatform:
                    data.instagramMediaId && data.facebookPostId
                      ? (isReel ? "Reel en Instagram & Facebook" : "Instagram & Facebook")
                      : data.instagramMediaId
                      ? (isReel ? "Reel en Instagram (@sincroia.lat)" : "Instagram (@sincroia.lat)")
                      : "Facebook (Sincro IA LAT)",
                  publishedDate: new Date().toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                }
              : p
          )
        );
      }
    } catch (err: any) {
      setPublishResult({ success: false, error: err.message });
    } finally {
      setPublishing(false);
    }
  };

  const handleRunTeamPipeline = async () => {
    setTeamRunning(true);
    setTeamResult(null);
    setTeamStep(1);

    const stepInterval = setInterval(() => {
      setTeamStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 2800);

    try {
      const activeKey = apiKey || localStorage.getItem("sincro_gemini_key") || undefined;
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "team_pipeline",
          objective: teamObjective,
          niche: selectedNiche,
          network: selectedNetwork,
          customApiKey: activeKey,
        }),
      });
      const data = await res.json();
      setTeamResult(data);
      setTeamStep(5);
    } catch (err: any) {
      setTeamResult({
        success: false,
        error: err.message,
        finalUnifiedPost: "Error ejecutando el equipo.",
      });
    } finally {
      clearInterval(stepInterval);
      setTeamRunning(false);
    }
  };

  const handleRunAdsPipeline = async () => {
    setAdRunning(true);
    setAdResult(null);
    try {
      const activeKey = apiKey || localStorage.getItem("sincro_gemini_key") || undefined;
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ads_pipeline",
          objective: adObjective,
          niche: adNiche,
          targetAudience: adAudience,
          customApiKey: activeKey,
        }),
      });
      const data = await res.json();
      setAdResult(data);
      if (data.recommendedTemplateImage) {
        setSelectedAdImage(data.recommendedTemplateImage);
      }
    } catch (err: any) {
      setAdResult({
        success: false,
        error: err.message,
      });
    } finally {
      setAdRunning(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const activeKey = apiKey || localStorage.getItem("sincro_gemini_key") || undefined;
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedAgent,
          task: selectedTask,
          network: selectedNetwork,
          niche: selectedNiche,
          customInstructions: customInstructions.trim() || undefined,
          customApiKey: activeKey,
        }),
      });

      const data = await res.json();
      if (data.content) {
        setResponse(data.content);
      } else if (data.error) {
        setResponse(`⚠️ Error: ${data.error}`);
      }
    } catch (err: any) {
      setResponse(`⚠️ Error en la conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 selection:bg-brand-cyan/20 selection:text-brand-cyan pb-24">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base">
                  Sincro<span className="text-brand-cyan">IA</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-brand-cyan font-mono">
                    Marketing Hub
                  </span>
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to Test Agent */}
            <Link
              href="/test-agent"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-cyan" />
              Probar a Sofía
            </Link>

            {/* Meta API Status */}
            <button
              onClick={() => setShowMetaModal(!showMetaModal)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                hasMetaKey
                  ? "bg-blue-950/40 border-blue-500/30 text-blue-400 hover:border-blue-500/50"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">
                {hasMetaKey ? "Meta API Conectada" : "Enlazar Meta (IG/FB)"}
              </span>
            </button>

            {/* API Key Status */}
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                hasServerKey
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50"
                  : "bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-500/50"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {hasServerKey ? "Gemini Conectado" : "Configurar API Key"}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Meta API drawer */}
        {showMetaModal && (
          <div className="max-w-7xl mx-auto mt-3 p-4 rounded-xl bg-slate-900/95 border border-blue-500/40 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    Conexión Oficial Meta Graph API (Instagram & Facebook)
                    {tokenStatus?.tested && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          tokenStatus.valid
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {tokenStatus.valid ? "● Token Activo" : "● Token Expirado / Inválido"}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Permite a los agentes de SincroIA publicar imágenes, carruseles y Reels automáticamente en Instagram (@sincroia.lat) y Facebook.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://developers.facebook.com/tools/explorer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir Graph API Explorer
                </a>
                <button
                  onClick={() => setShowMetaModal(false)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Input & Buttons */}
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="password"
                placeholder="Ingresa tu META_ACCESS_TOKEN (EAANk...)"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                className="w-full sm:flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
              />
              <button
                onClick={handleSaveMetaToken}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar Token
              </button>
              <button
                onClick={() => handleTestMetaToken()}
                disabled={testingToken}
                className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shrink-0 border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingToken ? "animate-spin" : ""}`} />
                {testingToken ? "Verificando..." : "Verificar Token"}
              </button>
            </div>

            {/* Status Message */}
            {tokenStatus && (
              <div
                className={`mt-2.5 p-2 rounded-lg text-xs flex items-center gap-2 ${
                  tokenStatus.valid
                    ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                    : "bg-red-950/40 text-red-300 border border-red-500/20"
                }`}
              >
                {tokenStatus.valid ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Flame className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{tokenStatus.message}</span>
              </div>
            )}

            {/* Guía Rápida de Renovación y Token Permanente */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-blue-400 flex items-center gap-1 mb-1">
                  ⚡ Opción 1: Renovación Rápida (1 Minuto)
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>
                    Abre el{" "}
                    <a
                      href="https://developers.facebook.com/tools/explorer/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline font-medium"
                    >
                      Graph API Explorer ↗
                    </a>.
                  </li>
                  <li>Selecciona tu App y en <b>User or Page</b> elige tu Página <b>SincroIA</b>.</li>
                  <li>
                    Asegúrate de marcar los permisos: <code className="text-slate-300">pages_manage_posts</code>,{" "}
                    <code className="text-slate-300">pages_read_engagement</code>, <code className="text-slate-300">pages_show_list</code>,{" "}
                    <code className="text-slate-300">instagram_basic</code>, <code className="text-slate-300">instagram_content_publish</code>.
                  </li>
                  <li>Haz clic en <b>"Generate Access Token"</b>, cópialo y pégalo arriba.</li>
                </ol>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                  🛡️ Opción 2: Token Permanente (Nunca Caduca)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Para que tu token <b>no caduque cada 24 horas</b>:
                  <br />
                  1. Ve a{" "}
                  <a
                    href="https://business.facebook.com/settings/system-users"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline font-medium"
                  >
                    Meta Business &gt; Usuarios del Sistema ↗
                  </a>.
                  <br />
                  2. Crea un usuario (ej. <i>SincroIA Bot</i>), asígnale la Página y la cuenta de Instagram.
                  <br />
                  3. Haz clic en <b>Generar nuevo token</b> y selecciona caducidad: <b>"Nunca"</b>.
                  <br />
                  4. Ese token será permanente y podrás publicar indefinidamente sin renovaciones manuales.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expandable API Key drawer */}
        {showKeyInput && (
          <div className="max-w-7xl mx-auto mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
            <input
              type="password"
              placeholder="Ingresa tu GEMINI_API_KEY (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full sm:flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
            />
            <button
              onClick={handleSaveApiKey}
              className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-medium text-xs hover:bg-cyan-300 transition-colors"
            >
              Guardar Clave
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {/* Banner: Objetivo Inmediato */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-brand-cyan shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Sprint Activo: Lanzamiento de Redes Sociales desde Cero
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-brand-cyan border border-cyan-500/30 font-mono">
                  Instagram • Facebook • WhatsApp
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Genera biografías, los 9 posts fundacionales, especificaciones de portada y enlaces con UTMs listos para publicar.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleAgentChange("cmo");
              setSelectedTask("full_launch_strategy");
            }}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-cyan-500/10 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cargar Suite de Lanzamiento
          </button>
        </div>

        {/* Selector de Modo: Cronograma vs Sala de Guerra vs Modo Especialistas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHubMode("calendar")}
              className={`text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                hubMode === "calendar"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              📅 Cronograma Estratégico (Hilo de 12 Días)
            </button>
            <button
              onClick={() => setHubMode("ads")}
              className={`text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                hubMode === "ads"
                  ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Target className="w-4 h-4 text-pink-400" />
              🎯 Anuncios de Pauta (Meta Ads Studio)
            </button>
            <button
              onClick={() => setHubMode("team")}
              className={`text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                hubMode === "team"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              🤝 Sala de Guerra (Generador en Cadena)
            </button>
            <button
              onClick={() => setHubMode("specialists")}
              className={`text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                hubMode === "specialists"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="w-4 h-4" />
              🔬 Modo Especialistas
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {hubMode === "calendar"
              ? "📋 Hilo de 12 días coordinado con imágenes oficiales y Reels de alta interactividad"
              : hubMode === "ads"
              ? "🎯 Anuncios de respuesta directa para Meta Ads con destino a WhatsApp y segmentación"
              : hubMode === "team"
              ? "⚡ Los 5 agentes colaboran en cadena y te entregan el post listo"
              : "Interactúa con cada agente por separado"}
          </span>
        </div>

        {/* VISTA 0: CRONOGRAMA ESTRATÉGICO & HILO NARRATIVO */}
        {hubMode === "calendar" && (
          <div className="space-y-6">
            {/* Header / Banner del Cronograma */}
            <div className="bg-[#131316] border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 text-brand-cyan" />
                    <h3 className="text-base font-bold text-white">
                      Cronograma Editorial & Hilo Conductor de Lanzamiento
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-brand-cyan border border-cyan-500/30">
                      12 Días Coordinados
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Cada publicación sigue un hilo narrativo calculado: de la conmoción por la lentitud de WordPress y la desatención nocturna, a la demostración en vivo de Sofía y la conversión por nichos en Colombia.
                  </p>
                </div>

                {/* Métricas del Cronograma */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                    <span className="text-sm font-bold text-emerald-400">
                      {calendarPosts.filter((p) => p.status === "published").length}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">Publicados</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-center">
                    <span className="text-sm font-bold text-brand-cyan">
                      {calendarPosts.filter((p) => p.status === "ready").length}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">Listos (Lanzar)</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/30 text-center">
                    <span className="text-sm font-bold text-purple-400">
                      {calendarPosts.filter((p) => p.status === "scheduled").length}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">Programados</span>
                  </div>
                </div>
              </div>

              {/* Filtros de Fase del Hilo */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-slate-800">
                {[
                  { id: "all", label: "Todas las Fases (12 Días)" },
                  { id: "fase1", label: "Fase 1: Conmoción & Ruptura (Días 1-4)" },
                  { id: "fase2", label: "Fase 2: Ataque a Nichos (Días 5-9)" },
                  { id: "fase3", label: "Fase 3: Oferta & Cierre (Días 10-12)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterPhase(f.id)}
                    className={`text-[11px] px-3 py-1 rounded-lg border transition-all ${
                      filterPhase === f.id
                        ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-semibold shadow-sm shadow-cyan-500/20"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notificación de Publicación en Meta si existe */}
            {publishResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  publishResult.success
                    ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                    : "bg-red-950/60 border-red-500/50 text-red-300"
                }`}
              >
                <div className="flex items-start sm:items-center gap-2.5">
                  {publishResult.success ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <div className="space-y-1">
                    <p className="leading-relaxed">
                      {publishResult.success ? (
                        publishResult.instagramMediaId && publishResult.facebookPostId ? (
                          `🎉 ¡Publicado automáticamente con éxito en Instagram y Facebook!`
                        ) : publishResult.instagramMediaId ? (
                          `🎉 ¡Publicado automáticamente con éxito en Instagram (@sincroia.lat)! ID: ${publishResult.instagramMediaId}`
                        ) : (
                          `🎉 ¡Publicado automáticamente con éxito en Facebook Page! ID: ${publishResult.facebookPostId}`
                        )
                      ) : (
                        `⚠️ ${publishResult.error}`
                      )}
                    </p>
                    {publishResult.success && publishResult.error && (
                      <span className="block text-[11px] text-amber-300/80">
                        Nota: {publishResult.error}
                      </span>
                    )}
                    {!publishResult.success &&
                      (publishResult.error?.includes("Session has expired") ||
                        publishResult.error?.includes("Error validating access token") ||
                        publishResult.error?.includes("expired")) && (
                        <div className="pt-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] text-amber-300">
                            💡 Tu token temporal de Meta ha expirado (duró 24h). Renuévalo en 1 minuto:
                          </span>
                          <button
                            onClick={() => {
                              setShowMetaModal(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-colors flex items-center gap-1 shadow"
                          >
                            <Share2 className="w-3 h-3" />
                            Renovar Token de Meta
                          </button>
                        </div>
                      )}
                  </div>
                </div>
                <button
                  onClick={() => setPublishResult(null)}
                  className="text-slate-400 hover:text-white text-xs px-1 self-start sm:self-center"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Tarjetas de Publicaciones */}
            <div className="space-y-4">
              {calendarPosts
                .filter((p) => filterPhase === "all" || p.phase === filterPhase)
                .map((post) => {
                  const isExpanded = expandedPostId === post.id;
                  const isPublished = post.status === "published";
                  const isReady = post.status === "ready";

                  return (
                    <div
                      key={post.id}
                      className={`bg-[#131316] border rounded-2xl p-5 transition-all ${
                        isPublished
                          ? "border-emerald-500/30 hover:border-emerald-500/50"
                          : isReady
                          ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5 hover:border-cyan-500/60"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {/* Cabecera de la tarjeta */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-brand-cyan">
                            DÍA {post.day}
                          </span>
                          {post.format === "reel" ? (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono font-semibold flex items-center gap-1 shadow-sm shadow-purple-500/10">
                              <Film className="w-3 h-3 text-purple-400" />
                              🎬 REEL / VIDEO (9:16)
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                              {post.pillar}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 hidden md:inline">
                            • {post.phaseTitle}
                          </span>
                        </div>

                        {/* Status badge */}
                        <div>
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Publicado en Instagram {post.publishedId ? `(${post.publishedId.slice(0, 8)}...)` : ""}
                            </span>
                          ) : isReady ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-brand-cyan ring-1 ring-cyan-500/30">
                              <Flame className="w-3.5 h-3.5 text-brand-cyan" />
                              Listo para Lanzar (1 Clic)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              Programado en Hilo
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cuerpo de la tarjeta: Imagen + Texto */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4">
                        {/* Creativo Visual Dedicado */}
                        <div className="md:col-span-4 lg:col-span-3">
                          <div className={`relative ${post.format === "reel" ? "aspect-[9/13]" : "aspect-square"} rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group`}>
                            {post.format === "reel" && post.videoUrl ? (
                              <video
                                src={post.videoUrl}
                                poster={post.recommendedImage}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={post.recommendedImage}
                                alt={post.imageAlt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            )}
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-[10px] font-mono text-cyan-300">
                              {post.format === "reel" ? (post.videoUrl ? "🎬 Video MP4 Listo" : "9:16 Portada Reel") : "1:1 Oficial Dedicado"}
                            </div>
                            <a
                              href={post.videoUrl || post.recommendedImage}
                              download
                              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Descargar archivo"
                            >
                              <Download className="w-3.5 h-3.5 text-brand-cyan" />
                            </a>
                          </div>

                          {/* Botón de Carga de Video para Reels */}
                          {post.format === "reel" && (
                            <div className="mt-2 space-y-1">
                              <label className="cursor-pointer text-[10px] py-1.5 px-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 flex items-center justify-center gap-1.5 transition-colors w-full font-medium shadow-sm">
                                <Upload className="w-3 h-3 text-purple-400" />
                                <span>
                                  {uploadingVideo === post.id
                                    ? "Subiendo MP4..."
                                    : post.videoUrl
                                    ? "Cambiar Video MP4"
                                    : "Subir Clip de Video (.mp4)"}
                                </span>
                                <input
                                  type="file"
                                  accept="video/mp4,video/quicktime,video/webm"
                                  className="hidden"
                                  disabled={uploadingVideo === post.id}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadVideo(post.id, file);
                                  }}
                                />
                              </label>
                              <p className="text-[9px] text-slate-400 text-center font-mono">
                                {post.videoUrl ? "✅ Clip MP4 asociado para Reel" : "ℹ️ Sin .mp4 se publica la portada como foto"}
                              </p>
                            </div>
                          )}

                          <span className="block text-[10px] text-slate-500 font-mono mt-1.5 truncate">
                            {post.recommendedImage.replace("/marketing/", "")}
                          </span>
                        </div>

                        {/* Copy y Acciones */}
                        <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1.5">
                              {post.title}
                            </h4>
                            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 mb-3">
                              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">
                                Gancho de Ruptura (Hook):
                              </span>
                              <p className="text-xs text-brand-cyan font-medium italic">
                                "{post.hook}"
                              </p>
                            </div>

                            {/* Guión Técnico de Producción del Reel si aplica */}
                            {post.format === "reel" && post.reelDetails && (
                              <div className="mb-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Film className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-bold text-purple-200">
                                      Guión de Producción del Reel ({post.reelDetails.duration})
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setExpandedReelId(expandedReelId === post.id ? null : post.id)}
                                    className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                                  >
                                    {expandedReelId === post.id ? (
                                      <>
                                        <ChevronUp className="w-3 h-3" /> Ocultar Escenas
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-3 h-3" /> Ver 5 Escenas y Audio
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="text-[11px] text-slate-300 space-y-1">
                                  <p><span className="text-purple-300 font-semibold">🎵 Audio Recomendado:</span> {post.reelDetails.recommendedAudio}</p>
                                  <p><span className="text-purple-300 font-semibold">🎣 Gancho Visual:</span> "{post.reelDetails.hookHeadline}"</p>
                                </div>

                                {expandedReelId === post.id && (
                                  <div className="mt-3 pt-3 border-t border-purple-500/20 space-y-2.5">
                                    {post.reelDetails.scenes.map((scene, sIdx) => (
                                      <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/20 text-xs">
                                        <div className="flex items-center justify-between font-mono text-[10px] text-purple-400 font-bold mb-1">
                                          <span>ESCENA {sIdx + 1}</span>
                                          <span>⏱️ {scene.time}</span>
                                        </div>
                                        <p className="text-slate-200 text-[11px]"><span className="text-slate-400 font-medium">🎥 Visual:</span> {scene.visual}</p>
                                        <p className="text-slate-200 text-[11px] mt-0.5"><span className="text-slate-400 font-medium">🎙️ Voz en off:</span> "{scene.audioVoiceover}"</p>
                                        <p className="text-brand-cyan text-[11px] mt-0.5"><span className="text-slate-400 font-medium">🔤 Texto en pantalla:</span> {scene.textOverlay}</p>
                                      </div>
                                    ))}
                                    <div className="p-2 rounded-lg bg-purple-900/30 text-[11px] text-purple-200 font-medium">
                                      👉 <span className="font-bold">CTA Final:</span> {post.reelDetails.callToAction}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Contenido Completo / Colapsable */}
                            <div className="relative">
                              <div
                                className={`text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60 transition-all ${
                                  !isExpanded ? "max-h-24 overflow-hidden" : "max-h-[500px] overflow-y-auto"
                                }`}
                              >
                                {post.fullCopy}
                              </div>
                              {!isExpanded && (
                                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none rounded-b-xl" />
                              )}
                            </div>

                            <button
                              onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                              className="text-[11px] text-slate-400 hover:text-brand-cyan mt-1.5 flex items-center gap-1 font-medium transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3" /> Colapsar texto
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" /> Leer texto completo del post
                                </>
                              )}
                            </button>
                          </div>

                          {/* Barra de Acciones */}
                          <div className="flex flex-wrap items-center gap-2 pt-4 mt-3 border-t border-slate-800/80">
                            {/* Botón 1: Publicar a Instagram */}
                            <button
                              onClick={() =>
                                handleAutoPublish(
                                  post.recommendedImage,
                                  post.fullCopy,
                                  "instagram",
                                  post.videoUrl,
                                  post.format
                                )
                              }
                              disabled={publishing}
                              className={`text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md ${
                                isPublished && post.publishedPlatform?.includes("Instagram")
                                  ? "bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50"
                                  : post.format === "reel"
                                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-90 text-white shadow-purple-500/20"
                                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white shadow-pink-500/20"
                              } disabled:opacity-50`}
                              title={
                                post.format === "reel"
                                  ? "Publicar Reel en Instagram (@sincroia.lat)"
                                  : "Publicar en Instagram (@sincroia.lat)"
                              }
                            >
                              {publishing ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Publicando...</span>
                                </>
                              ) : (
                                <>
                                  {post.format === "reel" ? (
                                    <Film className="w-3.5 h-3.5 text-purple-200" />
                                  ) : (
                                    <Share2 className="w-3.5 h-3.5" />
                                  )}
                                  <span>
                                    {isPublished && post.publishedPlatform?.includes("Instagram")
                                      ? post.format === "reel"
                                        ? "Republicar Reel"
                                        : "Republicar en IG"
                                      : post.format === "reel"
                                      ? post.videoUrl
                                        ? "🎬 Publicar Reel a IG"
                                        : "🚀 Publicar Portada a IG"
                                      : "🚀 Publicar a IG"}
                                  </span>
                                </>
                              )}
                            </button>

                            {/* Botón 2: Publicar a Facebook Page */}
                            <button
                              onClick={() =>
                                handleAutoPublish(
                                  post.recommendedImage,
                                  post.fullCopy,
                                  "facebook",
                                  post.videoUrl,
                                  post.format
                                )
                              }
                              disabled={publishing}
                              className="text-xs px-3 py-2 rounded-xl font-bold bg-[#1877F2]/80 hover:bg-[#1877F2] text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                              title="Publicar en Facebook Page (Sincro IA LAT)"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span>{post.format === "reel" && post.videoUrl ? "FB Reel" : "FB Page"}</span>
                            </button>

                            {/* Botón 3: Publicar a Ambas */}
                            <button
                              onClick={() =>
                                handleAutoPublish(
                                  post.recommendedImage,
                                  post.fullCopy,
                                  "both",
                                  post.videoUrl,
                                  post.format
                                )
                              }
                              disabled={publishing}
                              className="text-xs px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1 font-medium transition-colors disabled:opacity-50"
                              title="Publicar en Instagram y Facebook al mismo tiempo"
                            >
                              <span>IG + FB</span>
                            </button>

                            {/* Botón 4: Abrir en Sala de Guerra */}
                            <button
                              onClick={() => {
                                setTeamObjective(post.objective);
                                setSelectedTeamImage(post.recommendedImage);
                                setHubMode("team");
                              }}
                              className="text-xs px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 font-medium transition-colors"
                              title="Personalizar este post con los 5 agentes"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                              <span>Sala de Guerra</span>
                            </button>

                            {/* Botón 5: Copiar texto */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(post.fullCopy);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="text-xs px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center gap-1 font-medium transition-colors"
                              title="Copiar texto al portapapeles"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* VISTA ADS: META ADS STUDIO (GENERADOR DE ANUNCIOS DE ALTA CONVERSIÓN) */}
        {hubMode === "ads" && (
          <div className="space-y-6">
            {/* Header del Ads Studio */}
            <div className="bg-[#131316] border border-pink-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Meta Ads Studio: Generador de Anuncios de Alta Conversión
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                      Click-to-WhatsApp
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Diseña campañas de pauta publicitaria para Meta Ads Manager (Facebook + Instagram) con objetivo de mensajes directos a WhatsApp (+57 312 463 0488). Incluye 3 ganchos A/B, segmentación en Colombia, copy persuasivo con precios en COP y enlaces parametrizados con UTMs.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-pink-500/30 text-center">
                    <span className="text-xs font-bold text-pink-400 block">&lt; $6.500 COP</span>
                    <span className="text-[10px] text-slate-400">CPA Objetivo / Lead</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-purple-500/30 text-center">
                    <span className="text-xs font-bold text-purple-400 block">WhatsApp AI</span>
                    <span className="text-[10px] text-slate-400">Sofía Calificando</span>
                  </div>
                </div>
              </div>

              {/* Formulario de Configuración de Campaña */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-slate-800">
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-pink-400" />
                    Objetivo Comercial del Anuncio:
                  </label>
                  <input
                    type="text"
                    value={adObjective}
                    onChange={(e) => setAdObjective(e.target.value)}
                    placeholder="Ej: Conseguir pacientes para clínicas odontológicas con el bot Sofía en WhatsApp"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500/60 font-sans"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Nicho / Vertical:
                  </label>
                  <select
                    value={adNiche}
                    onChange={(e) => setAdNiche(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500/60"
                  >
                    <option value="clinicas_odontologicas">Clínicas & Odontología</option>
                    <option value="retail_moda">E-commerce & Retail</option>
                    <option value="inmobiliarias">Inmobiliarias & Concesionarios</option>
                    <option value="b2b_industrial">B2B & Servicios Empresariales</option>
                    <option value="general">General (Next.js 15 + Sofía)</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Público Objetivo / Ciudades:
                  </label>
                  <input
                    type="text"
                    value={adAudience}
                    onChange={(e) => setAdAudience(e.target.value)}
                    placeholder="Ej: Dueños de clínicas en Bogotá y Medellín"
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500/60"
                  />
                </div>
              </div>

              {/* Botón de Lanzamiento de Ads Pipeline */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400">
                  Colaboran: <strong className="text-slate-200">CMO</strong> (estrategia) + <strong className="text-slate-200">Growth Hacker</strong> (segmentación) + <strong className="text-slate-200">Redactor</strong> (copy de conversión) + <strong className="text-slate-200">Closer</strong> (WhatsApp)
                </span>
                <button
                  onClick={handleRunAdsPipeline}
                  disabled={adRunning}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-50 shrink-0"
                >
                  {adRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Estructurando Campaña de Anuncios...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Generar Anuncio de Alta Conversión</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Resultados de la Campaña de Anuncio */}
            {adResult && (
              <div className="space-y-6">
                {/* 1. Estructura y Segmentación de Meta Ads Manager */}
                <div className="bg-[#131316] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800">
                    <Sliders className="w-4 h-4 text-brand-cyan" />
                    <h4 className="text-sm font-bold text-white">
                      1. Estructura de Campaña en Meta Ads Manager
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                        🎯 Objetivo en Meta:
                      </span>
                      <p className="font-semibold text-white">
                        {adResult.campaignStructure?.campaignObjective || "Mensajes a WhatsApp"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                        📍 Ubicaciones:
                      </span>
                      <p className="font-semibold text-white">
                        {adResult.campaignStructure?.recommendedLocations || "Colombia (Bogotá, Medellín, Cali)"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                        💵 Presupuesto Diario Sugerido:
                      </span>
                      <p className="font-semibold text-emerald-400">
                        {adResult.campaignStructure?.suggestedDailyBudget || "$30.000 COP / día"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                        📉 CPA Objetivo / Lead:
                      </span>
                      <p className="font-semibold text-brand-cyan">
                        {adResult.campaignStructure?.targetCpa || "< $6.500 COP"}
                      </p>
                    </div>
                  </div>

                  {adResult.campaignStructure?.detailedTargeting && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] font-mono text-slate-400 font-semibold block mb-1.5">
                        Intereses y Datos Demográficos para Meta Ads:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {adResult.campaignStructure.detailedTargeting.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-300 font-mono"
                          >
                            + {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Laboratorio de Ganchos A/B */}
                {adResult.creativeHooks && adResult.creativeHooks.length > 0 && (
                  <div className="bg-[#131316] border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">
                        2. Laboratorio de Ganchos A/B (Para Detener el Scroll)
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {adResult.creativeHooks.map((h: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-block mb-2">
                              {h.angle || `Variación ${idx + 1}`}
                            </span>
                            <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
                              "{h.hook}"
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(h.hook);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="mt-3 text-[11px] text-slate-400 hover:text-brand-cyan flex items-center gap-1 font-medium transition-colors"
                          >
                            <Copy className="w-3 h-3" /> Copiar gancho
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Copy Oficial del Anuncio (Primary Text + Headline) + Creativo Visual */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Copywriter Ad Copy */}
                  <div className="lg:col-span-7 bg-[#131316] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <h4 className="text-sm font-bold text-white">
                            3. Texto del Anuncio (Primary Text)
                          </h4>
                        </div>
                        <button
                          onClick={() => {
                            if (adResult.adCopy?.primaryText) {
                              navigator.clipboard.writeText(adResult.adCopy.primaryText);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }
                          }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1 font-medium transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Copiar Copy
                        </button>
                      </div>

                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/60 max-h-72 overflow-y-auto mb-3">
                        {adResult.adCopy?.primaryText}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block mb-0.5">
                            Titular (Headline):
                          </span>
                          <span className="font-bold text-brand-cyan">
                            {adResult.adCopy?.headline || "Atiende y Vende 24/7 en WhatsApp"}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block mb-0.5">
                            Botón de Llamado a la Acción:
                          </span>
                          <span className="font-bold text-emerald-400">
                            {adResult.adCopy?.callToActionButton || "Enviar mensaje de WhatsApp"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Creativo Visual y Publicación Directa */}
                  <div className="lg:col-span-5 bg-[#131316] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800">
                        <Palette className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">
                          Creativo Visual Recomendado
                        </h4>
                      </div>

                      <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950 mb-3">
                        <img
                          src={selectedAdImage}
                          alt="Creativo de Anuncio"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-[10px] font-mono text-pink-300">
                          Anuncio Optimizado 1:1
                        </div>
                      </div>

                      {/* Selector de Creativo Visual */}
                      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                        {[
                          "/marketing/post5-clinicas-odontologia.jpg",
                          "/marketing/post4-fuga-nocturna.jpg",
                          "/marketing/post3-wordpress-vs-nextjs.jpg",
                          "/marketing/post7-planes-precios.jpg",
                        ].map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedAdImage(img)}
                            className={`w-12 h-12 rounded-lg overflow-hidden border shrink-0 transition-all ${
                              selectedAdImage === img ? "border-brand-cyan ring-2 ring-cyan-500/40" : "border-slate-800 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleAutoPublish(selectedAdImage, adResult.adCopy?.primaryText, "both")}
                        disabled={publishing}
                        className="w-full text-xs py-2.5 rounded-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/20 disabled:opacity-50"
                      >
                        {publishing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Publicando en Redes...</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Publicar Anuncio Orgánicamente (IG + FB)</span>
                          </>
                        )}
                      </button>
                      <a
                        href={selectedAdImage}
                        download
                        className="w-full text-xs py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Descargar Imagen para Meta Ads Manager</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. Enlace Parametrizado Click-to-WhatsApp */}
                {adResult.whatsAppDestination && (
                  <div className="bg-[#131316] border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">
                        4. Destino de Conversión: Enlace Oficial a WhatsApp con UTMs
                      </h4>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-0.5">
                          Enlace Click-to-WhatsApp para el Anuncio:
                        </span>
                        <code className="text-xs text-slate-300 font-mono truncate block">
                          {adResult.whatsAppDestination.deepLink}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(adResult.whatsAppDestination.deepLink);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center gap-1 font-medium transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Copiar Enlace
                        </button>
                        <a
                          href={adResult.whatsAppDestination.deepLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-brand-cyan" /> Probar
                        </a>
                      </div>
                    </div>

                    {adResult.whatsAppDestination.qualificationWorkflow && (
                      <div className="text-xs text-slate-400 space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">
                          Flujo de Calificación Automatizado con Sofía:
                        </span>
                        {adResult.whatsAppDestination.qualificationWorkflow.map((step: string, sIdx: number) => (
                          <p key={sIdx} className="flex items-center gap-2 text-slate-300">
                            <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono text-brand-cyan flex items-center justify-center shrink-0">
                              {sIdx + 1}
                            </span>
                            {step}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA 1: SALA DE GUERRA DEL EQUIPO (TRABAJO EN CADENA) */}
        {hubMode === "team" && (
          <div className="space-y-6">
            <div className="bg-[#131316] border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-cyan" />
                    Sala de Guerra Multi-Agente: Cadena de Montaje en Vivo
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tú solo indicas el objetivo. El <strong>CMO</strong> diseña el ángulo, el <strong>Copywriter</strong> redacta, <strong>Brand</strong> cuida la voz, <strong>Virtual Asset</strong> crea la dirección de imagen y <strong>Growth Ops</strong> conecta el enlace de WhatsApp.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-brand-cyan border border-cyan-500/30 shrink-0">
                  5 Agentes Sincronizados
                </span>
              </div>

              {/* Objetivo General */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    ¿Cuál es el objetivo o post que el equipo debe producir y alistar?
                  </label>
                  <textarea
                    value={teamObjective}
                    onChange={(e) => setTeamObjective(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan resize-none"
                    placeholder="Ej: Post 2: Conoce a Sofía en Vivo (Atención 24/7 en 1.8 segundos)..."
                  />
                </div>

                {/* Presets Rápidos */}
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                    O selecciona una misión predefinida del Kit de Lanzamiento:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setTeamObjective(
                          "Post 2: Conoce a Sofía en Vivo (Atención en 1.8 segundos, agendamiento en Google Calendar 24/7 y Relevo Humano)"
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white transition-colors"
                    >
                      🚀 Post 2: Sofía en Vivo (1.8s)
                    </button>
                    <button
                      onClick={() =>
                        setTeamObjective(
                          "Post 3: Comparativa técnica de WordPress (4.5s con Elementor) vs Next.js 15 (<0.8s en celulares). Cómo las empresas botan dinero en pauta."
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white transition-colors"
                    >
                      🐌 Post 3: WordPress Lento vs Next.js 15
                    </button>
                    <button
                      onClick={() =>
                        setTeamObjective(
                          "Post 4: ¿Cuánto dinero perdiste anoche a las 9:00 PM por WhatsApp desatendido? Cálculo matemático de ROI para pymes."
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white transition-colors"
                    >
                      💰 Post 4: Fuga de Clientes Nocturnos
                    </button>
                    <button
                      onClick={() =>
                        setTeamObjective(
                          "Campaña de Prospección para Clínicas Odontológicas y Estéticas: pacientes que consultan fines de semana y se van con otra clínica."
                        )
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white transition-colors"
                    >
                      🏥 Campaña Odontología & Estética
                    </button>
                  </div>
                </div>

                {/* Filtros de Canal y Nicho */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Destino de Publicación:
                    </label>
                    <select
                      value={selectedNetwork}
                      onChange={(e) => setSelectedNetwork(e.target.value as SocialNetwork)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="both">🚀 Instagram + Facebook (Ambas a la vez)</option>
                      <option value="instagram">Instagram (@sincroia.lat)</option>
                      <option value="facebook">Facebook Page (Sincro IA LAT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nicho / Industria:
                    </label>
                    <select
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="general">SincroIA Institucional (General)</option>
                      <option value="clinicas_odontologicas">Clínicas & Medicina Estética</option>
                      <option value="retail_moda">Retail & E-commerce Moda</option>
                      <option value="b2b_industrial">B2B & Servicios Industriales</option>
                      <option value="inmobiliarias">Inmobiliarias & Concesionarios</option>
                    </select>
                  </div>
                </div>

                {/* Botón Principal del Equipo */}
                <button
                  onClick={handleRunTeamPipeline}
                  disabled={teamRunning}
                  className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
                >
                  {teamRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>El Equipo de Agentes está Colaborando en Vivo...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>⚡ Poner a Trabajar al Equipo Completo (5 Agentes en Cadena)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Stepper de Trabajo en Vivo de los Agentes */}
              {teamRunning && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 animate-in fade-in">
                  <div className="text-xs font-semibold text-brand-cyan flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Progreso de la Cadena de Montaje:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                    <div
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        teamStep >= 1
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className="font-bold">1. CMO:</span> Estrategia
                    </div>
                    <div
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        teamStep >= 2
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className="font-bold">2. Copy & Brand:</span> Redacción
                    </div>
                    <div
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        teamStep >= 3
                          ? "bg-pink-500/10 border-pink-500/30 text-pink-300"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className="font-bold">3. Visual:</span> Dirección de Arte
                    </div>
                    <div
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        teamStep >= 4
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className="font-bold">4. Growth:</span> WhatsApp Link
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resultado Unificado del Equipo */}
            {teamResult && (
              <div className="bg-[#131316] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Producto Terminado del Equipo Listo para Publicar
                      </h4>
                      <p className="text-xs text-slate-400">
                        Estrategia, copy persuasivo, dirección de imagen y enlace de WhatsApp unificados.
                      </p>
                    </div>
                  </div>

                  {/* Botón de Publicación Inmediata */}
                  <button
                    onClick={() =>
                      handleAutoPublish(selectedTeamImage, teamResult.finalUnifiedPost)
                    }
                    disabled={publishing}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-50"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Publicando en Instagram & Facebook...</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-white" />
                        <span>🚀 Publicar este Post a Instagram y Facebook (1 Clic)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Banner de resultado de publicación si existe */}
                {publishResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      publishResult.success
                        ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                        : "bg-red-950/60 border-red-500/50 text-red-300"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-2.5">
                      {publishResult.success ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                      ) : (
                        <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                      )}
                      <div className="space-y-1">
                        <p className="leading-relaxed">
                          {publishResult.success ? (
                            publishResult.instagramMediaId && publishResult.facebookPostId ? (
                              `🎉 ¡Publicado automáticamente con éxito en Instagram y Facebook!`
                            ) : publishResult.instagramMediaId ? (
                              `🎉 ¡Publicado automáticamente con éxito en Instagram (@sincroia.lat)! ID: ${publishResult.instagramMediaId}`
                            ) : (
                              `🎉 ¡Publicado automáticamente con éxito en Facebook Page! ID: ${publishResult.facebookPostId}`
                            )
                          ) : (
                            `⚠️ ${publishResult.error}`
                          )}
                        </p>
                        {publishResult.success && publishResult.error && (
                          <span className="block text-[11px] text-amber-300/80">
                            Nota: {publishResult.error}
                          </span>
                        )}
                        {!publishResult.success &&
                          (publishResult.error?.includes("Session has expired") ||
                            publishResult.error?.includes("Error validating access token") ||
                            publishResult.error?.includes("expired")) && (
                            <div className="pt-1.5 flex flex-wrap items-center gap-2">
                              <span className="text-[11px] text-amber-300">
                                💡 Tu token temporal de Meta ha expirado (duró 24h). Renuévalo en 1 minuto:
                              </span>
                              <button
                                onClick={() => {
                                  setShowMetaModal(true);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-colors flex items-center gap-1 shadow"
                              >
                                <Share2 className="w-3 h-3" />
                                Renovar Token de Meta
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                    <button
                      onClick={() => setPublishResult(null)}
                      className="text-slate-400 hover:text-white text-xs px-1 self-start sm:self-center"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Aportes de Cada Agente */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                      👑 Estrategia del CMO
                    </span>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
                      {teamResult.cmoStrategy}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1.5 mb-1">
                      🎨 Dirección Visual de Arte
                    </span>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
                      {teamResult.visualDirection}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                      🔗 Enlace Rastreado de WhatsApp
                    </span>
                    <p className="text-[11px] font-mono text-cyan-300 break-all">
                      {teamResult.whatsappLink}
                    </p>
                  </div>
                </div>

                {/* Selector de Creativo Visual Adjunto */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-pink-400" />
                      Imagen Oficial que se Publicará con el Post:
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedTeamImage}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        path: "/marketing/post1-grid-feed.jpg",
                        title: "Post Feed (78% Compra)",
                        desc: "Gráfico 1:1 de Conversión",
                      },
                      {
                        path: "/marketing/portada-facebook.jpg",
                        title: "Portada / Mockup 3D",
                        desc: "Banner Sofía + Next.js",
                      },
                      {
                        path: "/marketing/avatar-sincroia.jpg",
                        title: "Logo Neón SincroIA",
                        desc: "Isotipo Oficial HD",
                      },
                    ].map((img) => (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => setSelectedTeamImage(img.path)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                          selectedTeamImage === img.path
                            ? "bg-pink-950/40 border-pink-500/60 ring-1 ring-pink-500/50 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <img
                          src={img.path}
                          alt={img.title}
                          className="w-10 h-10 rounded-md object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {img.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {img.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Copy Oficial Terminado */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      Texto Oficial del Post (Copywriter + Brand):
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(teamResult.finalUnifiedPost);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                    {teamResult.finalUnifiedPost}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: MODO ESPECIALISTAS INDIVIDUALES */}
        {hubMode === "specialists" && (
          <div>
            {/* Selector de Agentes (5 Roles) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => handleAgentChange(agent.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? `${agent.accentBg} ring-1 ring-cyan-500/40 shadow-lg`
                    : "bg-[#131316] border-slate-800/80 hover:border-slate-700/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-white/10" : "bg-slate-900"
                    } ${agent.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                  )}
                </div>
                <div className="text-xs font-bold text-white tracking-tight leading-tight">
                  {agent.shortName}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {agent.roleTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel Central: Controles + Salida */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Configuración de la Tarea (5 columnas) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#131316] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <currentAgent.icon className={`w-4 h-4 ${currentAgent.color}`} />
                  <span className="text-sm font-semibold text-white">
                    {currentAgent.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {currentAgent.roleTitle}
                </span>
              </div>

              {/* Tarea Específica */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Selecciona la Tarea:
                </label>
                <div className="space-y-1.5">
                  {currentAgent.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskChange(task.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                        selectedTask === task.id
                          ? "bg-cyan-500/15 border border-cyan-500/40 text-brand-cyan font-medium"
                          : "bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span>{task.label}</span>
                      {selectedTask === task.id && (
                        <Check className="w-3.5 h-3.5 text-brand-cyan" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Red Social Objetivo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Canal Principal:
                  </label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value as SocialNetwork)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="both">🚀 Instagram + Facebook (Ambas a la vez)</option>
                    <option value="instagram">Instagram (@sincroia.lat)</option>
                    <option value="facebook">Facebook Page (Sincro IA LAT)</option>
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="linkedin">LinkedIn B2B</option>
                    <option value="tiktok">TikTok / Reels</option>
                  </select>
                </div>

                {/* Nicho / Enfoque */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nicho / Audiencia:
                  </label>
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="general">SincroIA Institucional (General)</option>
                    <option value="clinicas_odontologicas">Clínicas & Medicina Estética</option>
                    <option value="retail_moda">Retail & E-commerce Moda</option>
                    <option value="b2b_industrial">B2B & Servicios Industriales</option>
                    <option value="inmobiliarias">Inmobiliarias & Concesionarios</option>
                  </select>
                </div>
              </div>

              {/* Instrucciones Adicionales */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Instrucciones o Contexto Adicional (Opcional):
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ej: Enfatizar que Sofía responde en 1.8 segundos y mencionar la tarifa del Plan Agente IA Pro ($2.490.000 COP)..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan resize-none"
                />
              </div>

              {/* Botón de Generar */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-semibold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Ejecutando Agente con Gemini Flash...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Generar con {currentAgent.shortName}</span>
                  </>
                )}
              </button>
            </div>

            {/* Atajos Rápidos */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2.5">
                <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
                Acciones Rápidas del Sprint de Lanzamiento
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setSelectedAgent("brand_strategist");
                    setSelectedTask("profile_bios");
                    setSelectedNetwork("instagram");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 flex items-center justify-between group"
                >
                  <span>1. Biografía Optimizada para Instagram & Facebook</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-brand-cyan transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent("copywriter");
                    setSelectedTask("foundational_grid_posts");
                    setSelectedNetwork("instagram");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 flex items-center justify-between group"
                >
                  <span>2. El Grid de los 9 Posts Fundacionales</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-brand-cyan transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent("virtual_asset");
                    setSelectedTask("social_banner_prompt");
                    setSelectedNetwork("facebook");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 flex items-center justify-between group"
                >
                  <span>3. Portada Facebook (820x312) & Mockups</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-brand-cyan transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent("growth_ops");
                    setSelectedTask("whatsapp_deep_links");
                    setSelectedNetwork("whatsapp");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 flex items-center justify-between group"
                >
                  <span>4. Links Inteligentes de WhatsApp con UTMs</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-brand-cyan transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Visor de Resultados (7 columnas) */}
          <div className="lg:col-span-7">
            <div className="bg-[#131316] border border-slate-800 rounded-2xl flex flex-col h-full min-h-[580px]">
              {/* Header del Visor */}
              <div className="border-b border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></div>
                  <span className="text-xs font-semibold text-white">
                    Consola de Salida del Agente
                  </span>
                  {selectedNetwork && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800">
                      {selectedNetwork.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {response && (
                    <>
                      <button
                        onClick={() => handleAutoPublish("/marketing/post1-grid-feed.jpg", response)}
                        disabled={publishing}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1.5 font-medium transition-all shadow-md shadow-pink-500/20 disabled:opacity-50"
                      >
                        {publishing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Publicando en Meta...</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>🚀 Publicar a Redes (1 Clic)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCopy}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notificación de Publicación en Meta */}
              {publishResult && (
                <div
                  className={`mx-4 mt-3 p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    publishResult.success
                      ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/50 border-red-500/40 text-red-300"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-2.5">
                    {publishResult.success ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                    ) : (
                      <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                    )}
                    <div className="space-y-1">
                      <p className="leading-relaxed">
                        {publishResult.success
                          ? `🎉 ¡Publicado automáticamente con éxito en tus redes oficiales! (ID: ${publishResult.instagramMediaId || publishResult.facebookPostId})`
                          : `⚠️ ${publishResult.error}`}
                      </p>
                      {!publishResult.success &&
                        (publishResult.error?.includes("Session has expired") ||
                          publishResult.error?.includes("Error validating access token") ||
                          publishResult.error?.includes("expired")) && (
                          <div className="pt-1.5 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-amber-300">
                              💡 Tu token temporal de Meta ha expirado (duró 24h). Renuévalo en 1 minuto:
                            </span>
                            <button
                              onClick={() => {
                                setShowMetaModal(true);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-colors flex items-center gap-1 shadow"
                            >
                              <Share2 className="w-3 h-3" />
                              Renovar Token de Meta
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                  <button
                    onClick={() => setPublishResult(null)}
                    className="text-slate-400 hover:text-white text-xs px-1.5 self-start sm:self-center"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Área de Visualización */}
              <div className="flex-1 p-5 overflow-y-auto max-h-[750px] font-sans">
                {loading ? (
                  <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-brand-cyan mb-4 animate-bounce">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {currentAgent.name} está redactando...
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Consultando la base de conocimiento de SincroIA y estructurando copys de alta conversión.
                    </p>
                  </div>
                ) : response ? (
                  <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {response}
                  </div>
                ) : (
                  <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Consola de Marketing Lista
                    </div>
                    <p className="text-xs text-slate-400 max-w-md mt-1.5">
                      Selecciona un agente y una tarea a la izquierda, o haz clic en{" "}
                      <span className="text-brand-cyan">"Generar con {currentAgent.shortName}"</span> para producir los textos, briefs y directrices de tus redes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

        {/* Sección de Activos Visuales Oficiales Listos */}
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-400" />
                Activos Visuales Oficiales Generados para tus Redes
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-mono">
                  Listos para Descargar
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Imágenes oficiales en alta resolución con la estética de SincroIA, listas para subir a tus perfiles hoy mismo.
              </p>
            </div>
            <a
              href="/docs/KIT_LANZAMIENTO_REDES_SINCROIA.md"
              target="_blank"
              className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-medium"
            >
              Ver Guía del Kit de Lanzamiento <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activo 1: Logo / Avatar */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/avatar-sincroia.jpg"
                  alt="Logo Avatar Oficial SincroIA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-cyan-300">
                  1:1 Cuadrado
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Logo & Avatar Oficial</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Foto de perfil para Instagram (@sincroia.lat), Facebook Page y WhatsApp Business.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">avatar-sincroia.jpg</span>
                  <a
                    href="/marketing/avatar-sincroia.jpg"
                    download="avatar-sincroia.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-brand-cyan" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 2: Portada Facebook */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-blue-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/portada-facebook.jpg"
                  alt="Portada Facebook SincroIA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-blue-300">
                  Banner 16:9
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Portada de Facebook Page</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Banner de cabecera con mockups 3D de Sofía en WhatsApp y velocidad Next.js 15.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">portada-facebook.jpg</span>
                  <a
                    href="/marketing/portada-facebook.jpg"
                    download="portada-facebook.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 3: Post 1 Feed */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-purple-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post1-grid-feed.jpg"
                  alt="Post 1 Grid Feed"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-purple-300">
                  Feed 1:1
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 1: El Manifiesto SincroIA</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gráfico comparativo: El 78% compra al primero que responde vs. la lentitud en WhatsApp.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post1-grid-feed.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Share2 className="w-3 h-3" />
                    )}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post1-grid-feed.jpg"
                    download="post1-grid-feed.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-purple-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 4: Post 2 Sofía en Vivo */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post2-sofia-en-vivo.jpg"
                  alt="Post 2 Sofía en Vivo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-brand-cyan">
                  Feed 1:1 HD
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 2: Sofía en Vivo (1.8s)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mockup 3D de celular con chat nocturno a las 11:42 PM y cita confirmada en Google Calendar.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post2-sofia-en-vivo.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post2-sofia-en-vivo.jpg"
                    download="post2-sofia-en-vivo.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-brand-cyan" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 5: Post 3 WordPress vs Next.js */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post3-wordpress-vs-nextjs.jpg"
                  alt="Post 3 WordPress vs Next.js"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-emerald-400">
                  Infografía 1:1
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 3: WordPress vs Next.js 15</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Comparativa de velocímetro: lentitud de Elementor (4.5s) vs velocidad instantánea Next.js (&lt;0.8s).
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post3-wordpress-vs-nextjs.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post3-wordpress-vs-nextjs.jpg"
                    download="post3-wordpress-vs-nextjs.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 6: Post 4 Fuga Nocturna */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-amber-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post4-fuga-nocturna.jpg"
                  alt="Post 4 Fuga Nocturna"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-amber-400">
                  Fintech 1:1
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 4: Fuga Nocturna (9:47 PM)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Alerta de 3 mensajes sin responder y fuga de ventas de $3.8M COP vs Sofía atendiendo 24/7.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post4-fuga-nocturna.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post4-fuga-nocturna.jpg"
                    download="post4-fuga-nocturna.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>
            {/* Activo 7: Post 5 Clínicas & Odontología */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post5-clinicas-odontologia.jpg"
                  alt="Post 5 Clínicas y Odontología"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-cyan-300">
                  Salud 1:1
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 5: Clínicas & Odontología</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mockup 3D de WhatsApp agendando citas odontológicas 24/7 sin esperas (+40% citas).
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post5-clinicas-odontologia.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post5-clinicas-odontologia.jpg"
                    download="post5-clinicas-odontologia.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-cyan-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 8: Post 6 Relevo Humano */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-indigo-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post6-relevo-humano.jpg"
                  alt="Post 6 Relevo Humano"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-indigo-400">
                  Arquitectura 1:1
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 6: Protocolo Relevo Humano</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Infografía 3D: Sofía detecta clientes calientes y transfiere al asesor humano sin trabas.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post6-relevo-humano.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post6-relevo-humano.jpg"
                    download="post6-relevo-humano.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-indigo-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>

            {/* Activo 9: Post 7 Planes & Precios Transparentes */}
            <div className="bg-[#131316] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/40 transition-all">
              <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/marketing/post7-planes-precios.jpg"
                  alt="Post 7 Planes y Precios Transparentes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0A0F1E]/80 backdrop-blur border border-white/10 text-emerald-400">
                  Precios COP 1:1
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Post 7: 4 Planes Transparentes</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Infografía oficial con los 4 planes en COP: Web Base, Agente IA Pro, E-commerce y Ecosistema.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAutoPublish("/marketing/post7-planes-precios.jpg")}
                    disabled={publishing}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white flex items-center gap-1 font-medium transition-all shadow-md shadow-pink-500/10 disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                    <span>Publicar con 1 Clic</span>
                  </button>
                  <a
                    href="/marketing/post7-planes-precios.jpg"
                    download="post7-planes-precios.jpg"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-medium transition-colors border border-slate-700"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
