/**
 * Thin fetch wrapper for the Correspondence API.
 * Base URL is read from VITE_API_URL env var (set to your api-server origin).
 * Falls back to relative path (same origin) when unset — useful for Netlify
 * Functions or when api-server is reverse-proxied at /api.
 */
import type { CorrLetter, CorrCreateLetterInput, CorrUpdateLetterInput, CorrLetterStats } from "@workspace/api-zod";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const ROOT = `${BASE}/api/correspondence`;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ROOT}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const correspondenceApi = {
  listLetters:   (params?: { type?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.type)   qs.set("type",   params.type);
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString() ? `?${qs}` : "";
    return req<CorrLetter[]>(`/letters${query}`);
  },
  getStats:      ()                           => req<CorrLetterStats>("/letters/stats"),
  getRecent:     ()                           => req<CorrLetter[]>("/letters/recent"),
  getLetter:     (id: number)                 => req<CorrLetter>(`/letters/${id}`),
  createLetter:  (data: CorrCreateLetterInput) => req<CorrLetter>("/letters", {
    method: "POST", body: JSON.stringify(data),
  }),
  updateLetter:  (id: number, data: CorrUpdateLetterInput) => req<CorrLetter>(`/letters/${id}`, {
    method: "PATCH", body: JSON.stringify(data),
  }),
  deleteLetter:  (id: number)                 => req<void>(`/letters/${id}`, { method: "DELETE" }),
  generateDocx:  (id: number)                 => req<{ downloadPath: string; filename: string }>(
    `/letters/${id}/generate-docx`, { method: "POST" }
  ),
  downloadUrl:   (id: number)                 => `${ROOT}/letters/${id}/download`,
};

/** True when VITE_API_URL is explicitly set (production / staging with backend) */
export const API_ENABLED = Boolean(import.meta.env.VITE_API_URL);
