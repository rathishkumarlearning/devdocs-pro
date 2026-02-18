import express from 'express';
import cors from 'cors';
import docsRouter from './routes/docs';
import searchRouter from './routes/search';

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:8744', '*'] }));
app.use(express.json());

// ── Request logger ──────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '3.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/docs',   docsRouter);
app.use('/api/search', searchRouter);

// ── 404 handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ⚡ DevDocs Pro API — Running
  ───────────────────────────
  URL:     http://localhost:${PORT}
  Health:  http://localhost:${PORT}/api/health
  Docs:    http://localhost:${PORT}/api/docs
  Search:  POST http://localhost:${PORT}/api/search
  `);
});

export default app;
