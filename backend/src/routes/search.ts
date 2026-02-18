import { Router, Request, Response } from 'express';
import docs from '../data/docs.json';

const router = Router();

// POST /api/search — full-text search
router.post('/', (req: Request, res: Response) => {
  const { q, limit = 10, section } = req.body as { q: string; limit?: number; section?: string };

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const query = q.toLowerCase().trim();

  let results = docs.filter(doc => {
    const searchable = [doc.title, doc.description, doc.content, ...doc.tags].join(' ').toLowerCase();
    return searchable.includes(query);
  });

  if (section) {
    results = results.filter(d => d.section.toLowerCase() === section.toLowerCase());
  }

  // Score: title match scores higher
  const scored = results.map(doc => ({
    ...doc,
    score: doc.title.toLowerCase().includes(query) ? 1.0
         : doc.tags.some(t => t.includes(query))   ? 0.8
         : 0.5,
  })).sort((a, b) => b.score - a.score).slice(0, limit);

  return res.json({
    data: scored,
    meta: { total: scored.length, query: q, took: '1ms' },
  });
});

export default router;
