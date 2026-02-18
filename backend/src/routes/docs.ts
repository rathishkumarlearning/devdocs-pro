import { Router } from 'express';
import docs from '../data/docs.json';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ data: docs, meta: { total: docs.length } });
});

router.get('/:id', (req, res) => {
  const doc = docs.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  return res.json({ data: doc });
});

export default router;
