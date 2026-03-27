const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");

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
    throw new Error("Cannot connect to local API. Start both services with `npm run dev:full`.");
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
