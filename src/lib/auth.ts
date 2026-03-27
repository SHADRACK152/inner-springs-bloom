const AUTH_KEY = "innersprings_auth";

export interface AuthUser {
  id: string;
  role: "client" | "admin";
  name: string;
  email: string;
  clientId?: string;
  phone?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}
