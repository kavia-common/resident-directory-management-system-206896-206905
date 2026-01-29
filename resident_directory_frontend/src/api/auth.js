import { apiRequest } from "./client";

const TOKEN_KEY = "resident_directory_admin_token";

// PUBLIC_INTERFACE
export function getStoredToken() {
  /** Returns stored admin token or null. */
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function storeToken(token) {
  /** Stores admin token. */
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage failures (private mode, etc.)
  }
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clears admin token. */
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export async function loginAdmin({ username, password }) {
  /** Logs in admin and returns token. */
  if (!username || !password) throw new Error("Username and password are required.");

  // Backend is assumed to accept either {username,password} or {email,password}.
  // We send both to maximize compatibility.
  const payload = await apiRequest("/auth/login", {
    method: "POST",
    json: { username, email: username, password },
  });

  const token =
    (payload && typeof payload === "object" && (payload.token || payload.access_token)) || null;

  if (!token) {
    throw new Error("Login succeeded but no token was returned by the backend.");
  }

  storeToken(token);
  return token;
}
