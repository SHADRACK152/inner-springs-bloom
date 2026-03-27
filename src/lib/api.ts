const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const host = typeof window !== "undefined" ? window.location.hostname : "";
const isLocalHost = host === "localhost" || host === "127.0.0.1";
const pointsToLocalHost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredApiUrl);

const API_URL = (() => {
  // Use explicit API URL when valid, but never force localhost for remote production clients.
  if (configuredApiUrl) {
    if (!import.meta.env.DEV && pointsToLocalHost && !isLocalHost) {
      return "";
    }
    return configuredApiUrl.replace(/\/+$/, "");
  }

  // In development, default to local API; in production, default to same-origin /api.
  return import.meta.env.DEV ? "http://localhost:4000" : "";
})();

async function request(path: string, options: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Cannot connect to API. For local dev, start both services with `npm run dev:full`.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export const api = {
  post: (path: string, body: unknown) => request(path, { method: "POST", body: JSON.stringify(body) }),
  get: (path: string) => request(path),
  delete: (path: string) => request(path, { method: "DELETE" }),
};

export { API_URL };
