import express from 'express';
import cors from 'cors';
import docsRouter from './routes/docs';
import searchRouter from './routes/search';

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '3.0.0', uptime: process.uptime() });
});

app.use('/api/docs',   docsRouter);
app.use('/api/search', searchRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`\n  ⚡ DevDocs API running on http://localhost:${PORT}\n`);
});

export default app;
