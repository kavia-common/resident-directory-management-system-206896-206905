/**
 * Resident Directory API client.
 *
 * IMPORTANT: This frontend assumes a REST backend with endpoints similar to:
 * - POST   /auth/login            -> { token }
 * - GET    /residents             -> [{...}]
 * - GET    /residents/:id         -> {...}
 * - POST   /residents             -> created
 * - PUT    /residents/:id         -> updated
 * - DELETE /residents/:id         -> { ok: true }
 *
 * If your backend differs, adjust only this module and keep the UI unchanged.
 */

const DEFAULT_TIMEOUT_MS = 15000;

function resolveApiBase() {
  // Prefer REACT_APP_API_BASE, fallback to REACT_APP_BACKEND_URL.
  const base =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";
  return String(base).replace(/\/+$/, "");
}

function timeoutSignal(ms) {
  if (!("AbortController" in window)) return null;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL derived from REACT_APP_API_BASE/REACT_APP_BACKEND_URL. */
  return resolveApiBase();
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", token, json, query, timeoutMs } = {}) {
  /** Generic request helper with JSON parsing, errors, and optional auth token. */
  const base = resolveApiBase();
  if (!base) {
    throw new Error(
      "API base URL is not configured. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL."
    );
  }

  const url = new URL(base + path);

  if (query && typeof query === "object") {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      url.searchParams.set(k, String(v));
    });
  }

  const t = timeoutSignal(timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      method,
      headers: {
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: json ? JSON.stringify(json) : undefined,
      signal: t?.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const message =
        (payload && typeof payload === "object" && (payload.detail || payload.message)) ||
        (typeof payload === "string" && payload) ||
        `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  } finally {
    t?.cancel?.();
  }
}
