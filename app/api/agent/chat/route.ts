import { NextResponse } from "next/server";
import { processAgentMessage } from "@/lib/agent/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, sessionId = "test-session", contactName } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es obligatorio y debe ser un texto." },
        { status: 400 }
      );
    }

    const result = await processAgentMessage(message, sessionId, contactName);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error en /api/agent/chat:", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje con el agente." },
      { status: 500 }
    );
  }
}
