import fs from "fs";
import path from "path";

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
  lastActive?: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const MAX_HISTORY_MESSAGES = 24;

// Cache en memoria sincronizado con disco
const sessionsMap = new Map<string, SessionData>();
let isLoaded = false;

function loadSessionsFromDisk(): void {
  if (isLoaded) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      const parsed: Record<string, SessionData> = JSON.parse(raw);
      for (const [key, val] of Object.entries(parsed)) {
        sessionsMap.set(key, val);
      }
    }
  } catch (err) {
    console.error("Error al cargar sesiones desde disco:", err);
  }
  isLoaded = true;
}

function saveSessionsToDisk(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const obj: Record<string, SessionData> = {};
    sessionsMap.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al guardar sesiones en disco:", err);
  }
}

export function getSession(sessionId: string): SessionData {
  loadSessionsFromDisk();

  let session = sessionsMap.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      messages: [],
      isPaused: false,
      lastActive: Date.now(),
    };
    sessionsMap.set(sessionId, session);
    saveSessionsToDisk();
  }

  // Verificar si la pausa ya expiró
  if (session.isPaused && session.pausedUntil && Date.now() > session.pausedUntil) {
    session.isPaused = false;
    session.pausedUntil = undefined;
    saveSessionsToDisk();
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
  session.lastActive = Date.now();

  // Mantener ventana deslizante amplia
  if (session.messages.length > MAX_HISTORY_MESSAGES) {
    session.messages = session.messages.slice(-MAX_HISTORY_MESSAGES);
  }

  saveSessionsToDisk();
}

export function setContactInfo(sessionId: string, contactName?: string, objective?: string): void {
  const session = getSession(sessionId);
  if (contactName && !session.contactName) {
    session.contactName = contactName;
  }
  if (objective) {
    session.objective = objective;
  }
  session.lastActive = Date.now();
  saveSessionsToDisk();
}

export function pauseSession(sessionId: string, hours = 24): void {
  const session = getSession(sessionId);
  session.isPaused = true;
  session.pausedUntil = Date.now() + hours * 60 * 60 * 1000;
  saveSessionsToDisk();
}

export function resumeSession(sessionId: string): void {
  const session = getSession(sessionId);
  session.isPaused = false;
  session.pausedUntil = undefined;
  saveSessionsToDisk();
}

export function isSessionPaused(sessionId: string): boolean {
  const session = getSession(sessionId);
  return session.isPaused;
}

export function clearSession(sessionId: string): void {
  loadSessionsFromDisk();
  sessionsMap.delete(sessionId);
  saveSessionsToDisk();
}

export function getSessionHistoryForGemini(sessionId: string): { role: "user" | "model"; parts: { text: string }[] }[] {
  const session = getSession(sessionId);
  return session.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}

