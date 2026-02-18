/**
 * API Service — connects React frontend to Sofia's Express backend
 * Ethan's frontend work: src/services/api.ts
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface Doc {
  id: string;
  slug: string;
  title: string;
  section: string;
  description: string;
  tags: string[];
  content: string;
  order: number;
}

export interface SearchResult extends Doc {
  score: number;
}

export interface ApiMeta {
  total: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  /** List all documentation pages */
  docs: {
    list: () => request<{ data: Doc[]; meta: ApiMeta }>('/api/docs'),
    get:  (id: string) => request<{ data: Doc }>(`/api/docs/${id}`),
  },

  /** Full-text search */
  search: (q: string, limit = 8) =>
    request<{ data: SearchResult[]; meta: { total: number; query: string; took: string } }>(
      '/api/search',
      { method: 'POST', body: JSON.stringify({ q, limit }) }
    ),

  /** Health check */
  health: () =>
    request<{ status: string; version: string; uptime: number }>('/api/health'),
};
