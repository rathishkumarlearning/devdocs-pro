import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function SdkTypeScript({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ SDKs</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>TypeScript SDK</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          The official DevDocs TypeScript SDK — fully typed, tree-shakeable, and isomorphic (Node.js, Bun, Deno, and browsers).
        </p>

        {/* Badges row */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:32 }}>
          {[
            { label:'npm', val:'@devdocs/sdk', bg:'rgba(203,0,0,.1)', col:'#ff6b6b' },
            { label:'version', val:'3.4.1', bg:'rgba(16,185,129,.1)', col:'var(--green)' },
            { label:'types', val:'included', bg:'rgba(59,130,246,.1)', col:'#60a5fa' },
            { label:'license', val:'MIT', bg:'rgba(139,92,246,.1)', col:'#a78bfa' },
          ].map(b => (
            <div key={b.label} style={{ display:'flex', fontSize:12, borderRadius:6, overflow:'hidden', border:'1px solid var(--border)' }}>
              <span style={{ background:'var(--bg3)', padding:'3px 8px', color:'var(--text3)' }}>{b.label}</span>
              <span style={{ background:b.bg, color:b.col, padding:'3px 8px', fontWeight:700 }}>{b.val}</span>
            </div>
          ))}
        </div>

        {/* ── Installation ── */}
        <h2 id="installation">Installation</h2>

        <CodeBlock tabs={[
          { label:'npm',  code:'npm install @devdocs/sdk' },
          { label:'pnpm', code:'pnpm add @devdocs/sdk' },
          { label:'yarn', code:'yarn add @devdocs/sdk' },
          { label:'bun',  code:'bun add @devdocs/sdk' },
        ]} />

        <Callout kind="note">
          No peer dependencies. No <code>@types</code> package needed — types are bundled. Minimum TypeScript version: <strong>5.0</strong>.
        </Callout>

        {/* ── Initialisation ── */}
        <h2 id="init">Initialisation</h2>

        <CodeBlock filename="client.ts" language="TypeScript" code={`import { DevDocs } from '@devdocs/sdk'

// Minimal — token only
const client = new DevDocs({
  token: process.env.DEVDOCS_TOKEN!,
})

// Full options
const client = new DevDocs({
  token:   process.env.DEVDOCS_TOKEN!,
  version: 'v3',          // API version (default: latest stable)
  timeout: 30_000,        // ms per request (default: 30 s)
  retries: 3,             // auto-retry on 5xx (default: 3)
  baseUrl: 'https://api.devdocs.io', // override for self-hosted
})`} />

        {/* ── Projects ── */}
        <h2 id="projects">Projects</h2>

        <CodeBlock filename="projects.ts" language="TypeScript" code={`// List all projects
const { data, meta } = await client.projects.list({ limit: 20, offset: 0 })
// data → Project[];  meta → { total, limit, offset }

// Get a single project
const project = await client.projects.get('proj_abc123')
console.log(project.name, project.pages, project.plan)

// Create a project
const newProject = await client.projects.create({
  name:   'Payment API Docs',
  spec:   'https://api.payments.io/openapi.json',
  domain: 'docs.payments.io',
})
console.log(newProject.id)  // proj_xyz789

// Update project settings
await client.projects.update('proj_abc123', { name: 'Payments API v2' })

// Delete a project (irreversible)
await client.projects.delete('proj_abc123')`} />

        {/* ── Pages ── */}
        <h2 id="pages">Pages</h2>

        <CodeBlock filename="pages.ts" language="TypeScript" code={`// List pages in a project
const pages = await client.pages.list('proj_abc123', {
  limit: 50,
  section: 'api-reference',  // optional filter
})

// Get a specific page
const page = await client.pages.get('proj_abc123', 'authentication')
console.log(page.title, page.content, page.lastUpdated)

// Create a custom page
const created = await client.pages.create('proj_abc123', {
  id:      'my-guide',
  title:   'My Custom Guide',
  content: '# Hello\\nThis is **Markdown**.',
  section: 'guides',
})

// Update page content
await client.pages.update('proj_abc123', 'my-guide', {
  content: '# Updated\\nNew content here.',
})

// Publish / unpublish
await client.pages.publish('proj_abc123', 'my-guide')
await client.pages.unpublish('proj_abc123', 'my-guide')`} />

        {/* ── Search ── */}
        <h2 id="search">Search</h2>

        <CodeBlock filename="search.ts" language="TypeScript" code={`// Full-text search across all pages
const results = await client.search.query({
  q:       'rate limiting',
  project: 'proj_abc123',  // optional — omit for global search
  limit:   5,
})

results.data.forEach(r => {
  console.log(r.title, r.score, r.excerpt)
  // → "Rate Limits"  0.92  "Free plan: 1,000 req/day…"
})

// Autocomplete (optimised for typeahead UIs)
const suggestions = await client.search.suggest({ q: 'auth', limit: 8 })
suggestions.forEach(s => console.log(s.label, s.pageId))`} />

        {/* ── Versioning ── */}
        <h2 id="versioning">Versioning</h2>

        <CodeBlock filename="versions.ts" language="TypeScript" code={`// List versions for a project
const versions = await client.versions.list('proj_abc123')
// → [{ tag: 'v3', label: 'v3 (latest)', current: true }, ...]

// Create a new version snapshot
const snapshot = await client.versions.create('proj_abc123', {
  tag:   'v2',
  label: 'Version 2 (legacy)',
})
console.log(snapshot.tag)  // 'v2'

// Set current (default) version
await client.versions.setCurrent('proj_abc123', 'v3')`} />

        {/* ── Webhooks ── */}
        <h2 id="webhooks">Webhooks</h2>

        <CodeBlock filename="webhooks.ts" language="TypeScript" code={`// Register a webhook
const hook = await client.webhooks.create({
  url:    'https://your-app.io/webhooks/devdocs',
  events: ['page.published', 'page.deleted', 'project.deployed'],
  secret: process.env.WEBHOOK_SECRET!,
})
console.log(hook.id)  // hook_q1w2e3

// Verify incoming webhook signature (Express example)
import { verifyWebhook } from '@devdocs/sdk/webhooks'

app.post('/webhooks/devdocs', express.raw({ type: 'application/json' }), (req, res) => {
  const event = verifyWebhook(req.body, req.headers['x-devdocs-signature'], secret)
  if (!event) return res.sendStatus(403)

  if (event.type === 'page.published') {
    console.log('Page published:', event.data.pageId)
  }
  res.sendStatus(200)
})`} />

        <Callout kind="tip">
          Always verify webhook signatures. <code>verifyWebhook</code> returns <code>null</code> (not throws) for invalid signatures — easier to handle in Express/Fastify middleware.
        </Callout>

        {/* ── Error handling ── */}
        <h2 id="errors">Error handling</h2>

        <CodeBlock filename="errors.ts" language="TypeScript" code={`import { DevDocsError, RateLimitError, NotFoundError } from '@devdocs/sdk'

try {
  const page = await client.pages.get('proj_abc123', 'does-not-exist')
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log('Page not found:', err.message)
  } else if (err instanceof RateLimitError) {
    const retryAfter = err.retryAfter  // seconds
    console.log(\`Rate limited. Retry in \${retryAfter}s\`)
  } else if (err instanceof DevDocsError) {
    console.log('API error:', err.status, err.code, err.message)
  } else {
    throw err  // network / unexpected errors
  }
}`} />

        <div className="param-wrap">
          <table className="param-table">
            <thead>
              <tr>{['Error class','HTTP status','When thrown'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                ['AuthError',       '401','Invalid or missing token'],
                ['ForbiddenError',  '403','Insufficient scope'],
                ['NotFoundError',   '404','Resource does not exist'],
                ['ValidationError', '422','Malformed request body'],
                ['RateLimitError',  '429','Too many requests'],
                ['ServerError',     '5xx','DevDocs API error (auto-retried)'],
              ].map(([c,s,w]) => (
                <tr key={c as string}>
                  <td><code>{c}</code></td>
                  <td><code>{s}</code></td>
                  <td style={{ color:'var(--text2)' }}>{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <h2 id="pagination">Pagination</h2>

        <CodeBlock filename="pagination.ts" language="TypeScript" code={`// Manual pagination
let offset = 0
const limit = 50

while (true) {
  const { data, meta } = await client.pages.list('proj_abc123', { limit, offset })
  console.log(\`Fetched \${data.length} pages\`)
  if (offset + data.length >= meta.total) break
  offset += data.length
}

// Or use the built-in async iterator (recommended)
for await (const page of client.pages.iterate('proj_abc123')) {
  console.log(page.title)
  // DevDocs SDK fetches the next batch automatically
}`} />

        <h2 id="next">Next steps</h2>
        <ul>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('api-overview')}}>REST API Reference</a> — raw HTTP endpoints</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('webhooks')}}>Webhooks</a> — event-driven integrations</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-deploy')}}>Deployment guide</a> — CI/CD pipeline examples</li>
        </ul>

      </div>
    </div>
  );
}
