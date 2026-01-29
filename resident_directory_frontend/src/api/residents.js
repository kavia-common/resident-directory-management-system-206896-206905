import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listResidents({ q } = {}) {
  /** List residents; optional 'q' query for search if backend supports it. */
  // Prefer server-side search if available; UI also filters client-side.
  return apiRequest("/residents", { query: q ? { q } : undefined });
}

// PUBLIC_INTERFACE
export async function getResident(id) {
  /** Fetch a single resident by id. */
  if (!id) throw new Error("Resident id is required.");
  return apiRequest(`/residents/${encodeURIComponent(String(id))}`);
}

// PUBLIC_INTERFACE
export async function createResident(token, data) {
  /** Admin: create resident. */
  return apiRequest("/residents", { method: "POST", token, json: data });
}

// PUBLIC_INTERFACE
export async function updateResident(token, id, data) {
  /** Admin: update resident by id. */
  if (!id) throw new Error("Resident id is required.");
  return apiRequest(`/residents/${encodeURIComponent(String(id))}`, {
    method: "PUT",
    token,
    json: data,
  });
}

// PUBLIC_INTERFACE
export async function deleteResident(token, id) {
  /** Admin: delete resident by id. */
  if (!id) throw new Error("Resident id is required.");
  return apiRequest(`/residents/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
    token,
  });
}
