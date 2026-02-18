import { Router } from 'express';
import docs from '../data/docs.json';

const router = Router();

router.post('/', (req, res) => {
  const { q, limit = 10 } = req.body as { q?: string; limit?: number };
  if (!q) return res.status(400).json({ error: '"q" is required' });

  const query = q.toLowerCase();
  const results = docs
    .filter(d => [d.title, d.description, ...d.tags].join(' ').toLowerCase().includes(query))
    .map(d => ({
      ...d,
      score: d.title.toLowerCase().includes(query) ? 1.0
           : d.tags.some((t: string) => t.includes(query)) ? 0.8 : 0.5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return res.json({ data: results, meta: { total: results.length, query: q, took: '1ms' } });
});

export default router;
