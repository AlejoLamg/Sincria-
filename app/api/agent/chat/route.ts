import { NextResponse } from "next/server";
import { processAgentMessage } from "@/lib/agent/engine";
import { clearSession, resumeSession, pauseSession, isSessionPaused } from "@/lib/agent/memory";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

// Permitir hasta 30 segundos de ejecución en Vercel para respuestas de IA
export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    // Rate limit: 25 peticiones por minuto por IP (suficiente para pruebas fluidas pero detiene ataques)
    const isLocalBridge = clientIp === "127.0.0.1" || clientIp === "::1";
    const limit = isLocalBridge ? 120 : 25;
    const rateCheck = checkRateLimit(clientIp, limit, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Has alcanzado el límite de mensajes por minuto. Por favor espera 30 segundos antes de enviar otro mensaje.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "30",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const { message, sessionId = "test-session", contactName, action, apiKey, pauseHours = 2 } = body;

    // Guardar apiKey en runtime si se envía
    if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 10) {
      process.env.GEMINI_API_KEY = apiKey.trim();
    }

    // Acción para pausar bot por relevo humano
    if (action === "pause") {
      pauseSession(sessionId, pauseHours);
      return NextResponse.json({
        success: true,
        message: `Sesión en pausa durante ${pauseHours} horas por relevo humano.`,
        isPaused: true,
      });
    }

    // Acción para reiniciar historial
    if (action === "reset") {
      clearSession(sessionId);
      return NextResponse.json({
        success: true,
        message: "Historial de conversación reiniciado con éxito.",
        isPaused: false,
      });
    }

    // Acción para reanudar el bot tras un relevo humano
    if (action === "resume") {
      resumeSession(sessionId);
      return NextResponse.json({
        success: true,
        message: "Agente reanudado. Sofía volverá a responder.",
        isPaused: false,
      });
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es obligatorio y debe ser un texto." },
        { status: 400 }
      );
    }

    const result = await processAgentMessage(message, sessionId, contactName, apiKey);

    return NextResponse.json({
      success: true,
      data: result,
      isPaused: isSessionPaused(sessionId),
    });
  } catch (error) {
    console.error("Error en /api/agent/chat:", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje con el agente." },
      { status: 500 }
    );
  }
}
