import { NextResponse } from "next/server";
import { processAgentMessage } from "@/lib/agent/engine";
import { clearSession, resumeSession, isSessionPaused } from "@/lib/agent/memory";

export async function GET() {
  return NextResponse.json({
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, sessionId = "test-session", contactName, action, apiKey } = body;

    // Guardar apiKey en runtime si se envía
    if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 10) {
      process.env.GEMINI_API_KEY = apiKey.trim();
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
