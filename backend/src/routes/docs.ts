import { Router, Request, Response } from 'express';
import docs from '../data/docs.json';

const router = Router();

// GET /api/docs — list all docs
router.get('/', (_req: Request, res: Response) => {
  res.json({
    data: docs,
    meta: { total: docs.length },
  });
});

// GET /api/docs/:id — get a single doc
router.get('/:id', (req: Request, res: Response) => {
  const doc = docs.find(d => d.id === req.params.id || d.slug === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found', id: req.params.id });
  }
  return res.json({ data: doc });
});

export default router;
