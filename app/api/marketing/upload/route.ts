import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customName = formData.get("filename") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se envió ningún archivo para subir" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "marketing");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Nombre seguro para el archivo
    const originalExt = path.extname(file.name) || ".mp4";
    const baseName = customName
      ? customName.replace(/[^a-zA-Z0-9_-]/g, "_")
      : `reel-${Date.now()}`;
    const safeName = baseName.endsWith(originalExt)
      ? baseName
      : `${baseName}${originalExt}`;

    const targetPath = path.join(uploadsDir, safeName);
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/marketing/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeName,
      sizeBytes: buffer.length,
    });
  } catch (error: any) {
    console.error("Error en /api/marketing/upload:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al subir archivo" },
      { status: 500 }
    );
  }
}
