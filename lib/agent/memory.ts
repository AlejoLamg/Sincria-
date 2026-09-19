export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: number;
}

export interface SessionData {
  sessionId: string;
  messages: ChatMessage[];
  isPaused: boolean;
  pausedUntil?: number;
  contactName?: string;
  objective?: string;
}

// Almacén en memoria persistente durante el ciclo de vida del runtime
// (En producción distribuida se puede conectar a Upstash Redis con 2 líneas de código)
const sessionsMap = new Map<string, SessionData>();

const MAX_HISTORY_MESSAGES = 12;

export function getSession(sessionId: string): SessionData {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      messages: [],
      isPaused: false,
    };
    sessionsMap.set(sessionId, session);
  }

  // Verificar si la pausa ya expiró
  if (session.isPaused && session.pausedUntil && Date.now() > session.pausedUntil) {
    session.isPaused = false;
    session.pausedUntil = undefined;
  }

  return session;
}

export function addMessage(sessionId: string, role: "user" | "model", text: string): void {
  const session = getSession(sessionId);
  session.messages.push({
    role,
    text,
    timestamp: Date.now(),
  });

  // Mantener ventana deslizante
  if (session.messages.length > MAX_HISTORY_MESSAGES) {
    session.messages = session.messages.slice(-MAX_HISTORY_MESSAGES);
  }
}

export function pauseSession(sessionId: string, hours = 24): void {
  const session = getSession(sessionId);
  session.isPaused = true;
  session.pausedUntil = Date.now() + hours * 60 * 60 * 1000;
}

export function resumeSession(sessionId: string): void {
  const session = getSession(sessionId);
  session.isPaused = false;
  session.pausedUntil = undefined;
}

export function isSessionPaused(sessionId: string): boolean {
  const session = getSession(sessionId);
  return session.isPaused;
}

export function clearSession(sessionId: string): void {
  sessionsMap.delete(sessionId);
}

export function getSessionHistoryForGemini(sessionId: string): { role: "user" | "model"; parts: { text: string }[] }[] {
  const session = getSession(sessionId);
  return session.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}
