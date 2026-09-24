/**
 * Módulo de Publicación y Conexión Directa con Meta Graph API
 * Permite a los agentes de SincroIA publicar directamente en Facebook e Instagram
 * Soporta publicaciones estándar (imágenes 1:1) y Reels / Videos (9:16)
 */

import fs from "fs";
import path from "path";

export interface MetaPublishRequest {
  platform: "facebook" | "instagram" | "both";
  imageUrl: string;
  videoUrl?: string;
  mediaType?: "IMAGE" | "REELS" | "VIDEO";
  caption: string;
  pageId?: string;
  igUserId?: string;
  accessToken?: string;
}

export interface MetaPublishResult {
  success: boolean;
  facebookPostId?: string;
  instagramMediaId?: string;
  error?: string;
  details?: any;
}

/**
 * Convierte un archivo multimedia local (imagen o video) a una URL pública temporal para que Meta pueda descargarlo
 */
export async function ensurePublicMediaUrl(mediaUrl: string): Promise<string> {
  // Si ya es una URL pública https externa, devolverla directamente
  if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
    if (!mediaUrl.includes("localhost") && !mediaUrl.includes("127.0.0.1")) {
      return mediaUrl;
    }
  }

  // Resolver la ruta local del archivo
  let localPath = mediaUrl;
  if (mediaUrl.startsWith("/")) {
    localPath = path.join(process.cwd(), "public", mediaUrl);
  } else if (!path.isAbsolute(mediaUrl)) {
    localPath = path.join(process.cwd(), mediaUrl);
  }

  if (fs.existsSync(localPath)) {
    try {
      const fileData = fs.readFileSync(localPath);
      const isVideo =
        localPath.toLowerCase().endsWith(".mp4") ||
        localPath.toLowerCase().endsWith(".mov") ||
        localPath.toLowerCase().endsWith(".webm");

      const mimeType = isVideo
        ? "video/mp4"
        : localPath.toLowerCase().endsWith(".png")
        ? "image/png"
        : "image/jpeg";

      const fileName = isVideo ? "reel-sincroia.mp4" : "post-sincroia.jpg";

      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", new Blob([fileData], { type: mimeType }), fileName);

      const res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: form,
      });

      const publicUrl = (await res.text()).trim();
      if (publicUrl.startsWith("http")) {
        return publicUrl;
      }
    } catch (err) {
      console.error("Error subiendo archivo multimedia a host público:", err);
    }
  }

  return mediaUrl;
}

/**
 * Publica una imagen o video con caption en una Página de Facebook
 */
export async function publishToFacebookPage(
  pageId: string,
  accessToken: string,
  mediaUrl: string,
  caption: string,
  options?: { isVideo?: boolean }
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const finalUrl = await ensurePublicMediaUrl(mediaUrl);
    const isVideo =
      options?.isVideo ||
      mediaUrl.toLowerCase().endsWith(".mp4") ||
      mediaUrl.toLowerCase().endsWith(".mov") ||
      mediaUrl.toLowerCase().endsWith(".webm");

    // Intentar obtener el Page Access Token específico si el token provisto es de usuario
    let tokenToUse = accessToken;
    try {
      // 1. Consultar me/accounts (la ruta oficial cuando se usa un User Access Token con permisos de administración)
      const accountsRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
      );
      const accountsData = await accountsRes.json();
      if (accountsData.data && Array.isArray(accountsData.data)) {
        const matchedPage = accountsData.data.find(
          (p: any) => p.id === pageId || (p.name && p.name.toLowerCase().includes("sincro"))
        );
        if (matchedPage?.access_token) {
          tokenToUse = matchedPage.access_token;
        } else if (accountsData.data.length > 0 && accountsData.data[0].access_token) {
          tokenToUse = accountsData.data[0].access_token;
        }
      }

      // 2. Si no se encontró en me/accounts, intentar consultar directamente el objeto de página
      if (tokenToUse === accessToken) {
        const pageInfo = await fetch(
          `https://graph.facebook.com/v21.0/${pageId}?fields=access_token&access_token=${accessToken}`
        ).then((r) => r.json());
        if (pageInfo.access_token) {
          tokenToUse = pageInfo.access_token;
        }
      }
    } catch {
      // Usar token original si no se pudo consultar
    }

    if (isVideo) {
      // Publicación de Video / Reel en Facebook Page
      const url = `https://graph.facebook.com/v21.0/${pageId}/videos`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_url: finalUrl,
          description: caption,
          access_token: tokenToUse,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        return {
          success: false,
          error: data.error?.message || "Error al publicar video en Facebook",
        };
      }

      return {
        success: true,
        postId: data.id || data.post_id,
      };
    } else {
      // Publicación de Foto estándar en Facebook Page
      const url = `https://graph.facebook.com/v21.0/${pageId}/photos`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: finalUrl,
          caption: caption,
          access_token: tokenToUse,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        return {
          success: false,
          error: data.error?.message || "Error al publicar foto en Facebook",
        };
      }

      return {
        success: true,
        postId: data.id || data.post_id,
      };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Publica una imagen o Reel en una Cuenta Comercial de Instagram (Graph API con polling asíncrono)
 */
export async function publishToInstagram(
  igUserId: string,
  accessToken: string,
  mediaUrl: string,
  caption: string,
  options?: { isReel?: boolean; coverUrl?: string }
): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  try {
    const isVideo =
      options?.isReel ||
      mediaUrl.toLowerCase().endsWith(".mp4") ||
      mediaUrl.toLowerCase().endsWith(".mov") ||
      mediaUrl.toLowerCase().endsWith(".webm");

    const finalMediaUrl = await ensurePublicMediaUrl(mediaUrl);

    let finalCoverUrl: string | undefined = undefined;
    if (options?.coverUrl && !options.coverUrl.toLowerCase().endsWith(".mp4")) {
      finalCoverUrl = await ensurePublicMediaUrl(options.coverUrl);
    }

    // Paso 1: Crear el contenedor multimedia (Media Container)
    const step1Url = `https://graph.facebook.com/v21.0/${igUserId}/media`;
    const step1Body: Record<string, any> = {
      caption: caption,
      access_token: accessToken,
    };

    if (isVideo) {
      step1Body.media_type = "REELS";
      step1Body.video_url = finalMediaUrl;
      step1Body.share_to_feed = true;
      if (finalCoverUrl && finalCoverUrl.startsWith("http")) {
        step1Body.cover_url = finalCoverUrl;
      }
    } else {
      step1Body.image_url = finalMediaUrl;
    }

    const step1Res = await fetch(step1Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(step1Body),
    });

    const step1Data = await step1Res.json();
    if (!step1Res.ok || !step1Data.id) {
      return {
        success: false,
        error: step1Data.error?.message || "Error creando contenedor de medios en Instagram",
      };
    }

    const creationId = step1Data.id;

    // Paso 2: Esperar a que Instagram descargue y procese el video/imagen en sus servidores
    // Para Reels y videos, Meta requiere transcodificación y puede demorar entre 10 y 45 segundos
    const maxAttempts = isVideo ? 20 : 8;
    const intervalMs = isVideo ? 2800 : 1800;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      try {
        const checkRes = await fetch(
          `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
        );
        const checkData = await checkRes.json();
        if (checkData.status_code === "FINISHED") {
          break;
        }
        if (checkData.status_code === "ERROR") {
          return {
            success: false,
            error: "Instagram reportó un error al procesar el archivo multimedia (código: ERROR).",
          };
        }
      } catch {
        // Continuar esperando
      }
    }

    // Paso 3: Publicar el contenedor en Instagram
    const step2Url = `https://graph.facebook.com/v21.0/${igUserId}/media_publish`;
    const step2Res = await fetch(step2Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const step2Data = await step2Res.json();
    if (!step2Res.ok || !step2Data.id) {
      return {
        success: false,
        error: step2Data.error?.message || "Error publicando medios en Instagram",
      };
    }

    return {
      success: true,
      mediaId: step2Data.id,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Publicador orquestado: envía imágenes o Reels a las plataformas seleccionadas
 */
export async function executeMetaPublish(
  req: MetaPublishRequest
): Promise<MetaPublishResult> {
  const token = req.accessToken || process.env.META_ACCESS_TOKEN;
  const pageId = req.pageId || process.env.FACEBOOK_PAGE_ID;
  const igUserId = req.igUserId || process.env.INSTAGRAM_ACCOUNT_ID;

  if (!token) {
    return {
      success: false,
      error:
        "Falta el META_ACCESS_TOKEN. Para publicar automáticamente necesitas configurar tu Token de Acceso de Meta Graph API en .env.local o en la configuración.",
    };
  }

  // Determinar si es video o reel
  const mediaToPublish = req.videoUrl || req.imageUrl;
  const isVideo =
    req.mediaType === "REELS" ||
    req.mediaType === "VIDEO" ||
    Boolean(req.videoUrl) ||
    mediaToPublish.toLowerCase().endsWith(".mp4") ||
    mediaToPublish.toLowerCase().endsWith(".mov") ||
    mediaToPublish.toLowerCase().endsWith(".webm");

  const result: MetaPublishResult = { success: false };
  const errors: string[] = [];

  // Publicar en Instagram
  if ((req.platform === "instagram" || req.platform === "both") && igUserId) {
    const igRes = await publishToInstagram(
      igUserId,
      token,
      mediaToPublish,
      req.caption,
      {
        isReel: isVideo,
        coverUrl: req.imageUrl !== mediaToPublish ? req.imageUrl : undefined,
      }
    );
    if (igRes.success) {
      result.instagramMediaId = igRes.mediaId;
    } else {
      errors.push(`Instagram: ${igRes.error}`);
    }
  }

  // Publicar en Facebook
  if ((req.platform === "facebook" || req.platform === "both") && pageId) {
    const fbRes = await publishToFacebookPage(
      pageId,
      token,
      mediaToPublish,
      req.caption,
      { isVideo }
    );
    if (fbRes.success) {
      result.facebookPostId = fbRes.postId;
    } else {
      errors.push(`Facebook: ${fbRes.error}`);
    }
  }

  // Si al menos una plataforma publicó con éxito
  if (result.instagramMediaId || result.facebookPostId) {
    result.success = true;
    if (errors.length > 0) {
      result.error = errors.join(" | ");
    }
  } else {
    result.success = false;
    result.error = errors.join(" | ") || "No se pudo publicar en ninguna red seleccionada.";
  }

  return result;
}
