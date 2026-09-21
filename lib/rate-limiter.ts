/**
 * Rate Limiter en memoria con algoritmo Sliding Window Counter por IP.
 * Protege los endpoints de Inteligencia Artificial y Leads contra ataques DoS,
 * scraping masivo o drenado malicioso de cuotas de tokens de API.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Limpieza automática periódica para evitar fugas de memoria
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(): void {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    rateLimitMap.forEach((record, ip) => {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    });
    lastCleanup = now;
  }
}

/**
 * Verifica si una IP ha excedido el límite de solicitudes permitidas en una ventana de tiempo.
 * @param ip Dirección IP del cliente.
 * @param limit Número máximo de solicitudes permitidas en la ventana.
 * @param windowMs Duración de la ventana en milisegundos (por defecto 60.000 ms = 1 minuto).
 */
export function checkRateLimit(
  ip: string,
  limit = 20,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanupExpiredRecords();

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(ip, newRecord);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Extrae la dirección IP real del cliente considerando proxies y CDN (Vercel, Cloudflare).
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  return "127.0.0.1";
}
