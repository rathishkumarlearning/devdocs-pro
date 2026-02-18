const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export interface Doc {
  id: string;
  title: string;
  section: string;
  description: string;
  tags: string[];
  order: number;
  score?: number;
}

export type SearchResult = Doc;

export interface ApiHealth {
  status: string;
  version: string;
  uptime: number;
}

export const api = {
  async health(): Promise<ApiHealth> {
    const r = await fetch(`${BASE}/health`);
    return r.json();
  },
  async listDocs(): Promise<{ data: Doc[]; meta: { total: number } }> {
    const r = await fetch(`${BASE}/docs`);
    return r.json();
  },
  async getDoc(id: string): Promise<{ data: Doc }> {
    const r = await fetch(`${BASE}/docs/${id}`);
    return r.json();
  },
  async search(q: string, limit = 8): Promise<{ data: SearchResult[]; meta: { total: number; query: string; took: string } }> {
    const r = await fetch(`${BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, limit }),
    });
    return r.json();
  },
};
