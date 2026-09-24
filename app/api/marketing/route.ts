import { NextResponse } from "next/server";
import { executeMarketingAgent, executeTeamPipeline, executeAdsPipeline } from "@/lib/marketing-agents/engine";
import { MarketingAgentRequest } from "@/lib/marketing-agents/types";
import { executeMetaPublish, MetaPublishRequest } from "@/lib/marketing-agents/meta-publisher";

export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({
    status: "online",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasMetaKey: Boolean(process.env.META_ACCESS_TOKEN),
    agents: [
      {
        id: "cmo",
        name: "Chief Marketing Officer (CMO)",
        description: "Director estratégico de marketing y orquestador maestro",
      },
      {
        id: "brand_strategist",
        name: "Brand & Identity Strategist",
        description: "Custodio de voz, bios de perfiles, posicionamiento y valores",
      },
      {
        id: "copywriter",
        name: "Creative Copywriter Agent",
        description: "Redactor de copys, guiones de video, anuncios y posts fundacionales",
      },
      {
        id: "virtual_asset",
        name: "Virtual Asset Agent",
        description: "Diseñador de activos visuales, banners, storyboards y prompts de arte",
      },
      {
        id: "growth_ops",
        name: "Growth Ops Agent",
        description: "Estratega de embudos, enlaces UTM a WhatsApp y calendarios tácticos",
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // Guardar apiKey si viene en el request
    if (rawBody.customApiKey && rawBody.customApiKey.trim().length > 10) {
      if (!process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = rawBody.customApiKey.trim();
      }
    }

    // Acción especial: Pipeline de Trabajo en Equipo
    if (rawBody.action === "team_pipeline") {
      const pipelineRes = await executeTeamPipeline({
        objective: rawBody.objective,
        niche: rawBody.niche,
        network: rawBody.network,
        customApiKey: rawBody.customApiKey,
      });
      return NextResponse.json(pipelineRes);
    }

    // Acción especial: Generador de Anuncios de Pauta (Meta Ads Studio)
    if (rawBody.action === "ads_pipeline") {
      const adsRes = await executeAdsPipeline({
        objective: rawBody.objective,
        niche: rawBody.niche,
        offerType: rawBody.offerType,
        targetAudience: rawBody.targetAudience,
        customApiKey: rawBody.customApiKey,
      });
      return NextResponse.json(adsRes);
    }

    // Acción especial: Publicar en Meta (Facebook / Instagram)
    if (rawBody.action === "publish_meta") {
      const publishReq: MetaPublishRequest = {
        platform: rawBody.platform || "both",
        imageUrl: rawBody.imageUrl,
        videoUrl: rawBody.videoUrl,
        mediaType: rawBody.mediaType,
        caption: rawBody.caption,
        pageId: rawBody.pageId || process.env.FACEBOOK_PAGE_ID,
        igUserId: rawBody.igUserId || process.env.INSTAGRAM_ACCOUNT_ID,
        accessToken: rawBody.accessToken || process.env.META_ACCESS_TOKEN,
      };

      const publishRes = await executeMetaPublish(publishReq);
      return NextResponse.json(publishRes);
    }

    // Acción por defecto: Ejecutar agente de IA
    const body = rawBody as MarketingAgentRequest;

    if (!body.role || !body.task) {
      return NextResponse.json(
        { error: "Los campos 'role' y 'task' son obligatorios." },
        { status: 400 }
      );
    }

    // Si viene apiKey en el cuerpo, asignarla si no existe
    if (body.customApiKey && body.customApiKey.trim().length > 10) {
      if (!process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = body.customApiKey.trim();
      }
    }

    const result = await executeMarketingAgent(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error en POST /api/marketing:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
