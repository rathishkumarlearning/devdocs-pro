import { useEffect, useRef } from 'react';
import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

const QUICK = [
  { icon:'⚡', label:'Up in 3 min',    desc:'From zero to live docs fast.',      id:'quickstart', bg:'rgba(245,166,35,.1)' },
  { icon:'🔑', label:'Auth, sorted',   desc:'Bearer, OAuth, API keys.',           id:'authentication', bg:'rgba(37,99,235,.1)' },
  { icon:'📦', label:'Typed SDKs',     desc:'12 languages, auto-generated.',      id:'sdk-ts', bg:'rgba(16,185,129,.1)' },
  { icon:'🔌', label:'REST API',       desc:'Every endpoint documented.',         id:'api-overview', bg:'rgba(139,92,246,.1)' },
  { icon:'🚀', label:'Deploy',         desc:'Vercel, Netlify, anywhere.',         id:'guide-deploy', bg:'rgba(255,69,58,.1)' },
  { icon:'🗂️', label:'Multi-version', desc:'Ship v2 without killing v1.',        id:'versioning', bg:'rgba(100,210,255,.1)' },
];

export default function Introduction({ onNavigate }: { onNavigate:(id:string)=>void }) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  /* Trigger gradient-text animation on mount */
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.classList.add('hero-headline-animated');
  }, []);

  return (
    <div className="animate-up">

      {/* ── Hero ── */}
      <div className="page-hero page-hero-enhanced">
        {/* Animated orb accent */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="page-hero-tag">⬡ Getting Started</div>

        <h1 ref={headlineRef} className="hero-headline">
          <span className="hero-headline-gradient">Docs your team</span>
          <br />
          <span className="hero-headline-gradient hero-headline-gradient-2">will actually read.</span>
        </h1>

        <p className="hero-sub">
          DevDocs Pro turns your OpenAPI spec into a beautiful, searchable portal —
          in the time it takes to grab coffee. No templates to wrestle with.
        </p>

        <div className="hero-btns hero-btns-enhanced">
          <button className="btn-gold btn-gold-cta" onClick={() => onNavigate('quickstart')}>
            <span className="btn-cta-icon">▶</span>
            Get Started
          </button>
          <button className="btn-outline btn-outline-enhanced" onClick={() => onNavigate('api-overview')}>
            API Reference
            <span style={{ fontSize:11, opacity:.7 }}>→</span>
          </button>
          <button className="btn-ghost" onClick={() => onNavigate('changelog')}>
            What's new in v3.0 ✨
          </button>
        </div>

        {/* Stat badges */}
        <div className="hero-stats">
          {[
            ['50K+', 'developers'],
            ['3 min', 'to first deploy'],
            ['12', 'SDK languages'],
            ['99.9%', 'uptime SLA'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="hero-stat">
              <span className="hero-stat-val">{val}</span>
              <span className="hero-stat-lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="quick-grid animate-up d1">
        {QUICK.map(q => (
          <button key={q.id} className="quick-card" onClick={() => onNavigate(q.id)}>
            <div className="quick-card-icon" style={{ background:q.bg }}>{q.icon}</div>
            <div><h3>{q.label}</h3><p>{q.desc}</p></div>
          </button>
        ))}
      </div>

      {/* ── Prose ── */}
      <div className="prose animate-up d2">

        <h2 id="overview">Overview</h2>
        <p>DevDocs Pro is a <strong>documentation-as-code platform</strong> that auto-generates beautiful, searchable API docs from your OpenAPI spec. It handles hosting, versioning, search, and SDK generation — so you focus on building, not documenting.</p>

        <Callout kind="note">
          New to DevDocs? The <a href="#" onClick={e=>{e.preventDefault();onNavigate('quickstart')}}>quickstart guide</a> gets you live in under 3 minutes. No account required.
        </Callout>

        <h2 id="howitworks">How it works</h2>
        <p>Three steps. That's the whole process. We handle the heavy lifting so you can focus on what matters: building.</p>

        {/* Step cards */}
        {[
          { n:1, title:'Point to your spec',     desc:'Drop in your openapi.json or openapi.yaml URL. We parse OpenAPI 3.0, 3.1, and AsyncAPI 2.x. Already have a spec? You\'re basically done.' },
          { n:2, title:'Configure in seconds',   desc:'Set your project name, domain, and theme in devdocs.config.ts. Sensible defaults cover 90% of setups — you barely need to touch it.' },
          { n:3, title:'Deploy and forget',       desc:'One command: devdocs deploy. Vercel, Netlify, Cloudflare, or your own Node server. Your CI/CD pipeline handles the rest.' },
        ].map(s => (
          <div key={s.n} className="section-card" style={{ marginBottom:12 }}>
            <div className="section-card-header">
              <div className="section-card-num">{s.n}</div>
              <h3 style={{ margin:0 }}>{s.title}</h3>
            </div>
            <div className="section-card-body"><p>{s.desc}</p></div>
          </div>
        ))}

        <h2 id="installation">Installation</h2>
        <p>Install the CLI globally and the SDK as a project dependency.</p>

        <CodeBlock tabs={[
          { label:'npm',  code:'npm install -g @devdocs/cli\nnpm install @devdocs/sdk' },
          { label:'pnpm', code:'pnpm add -g @devdocs/cli\npnpm add @devdocs/sdk' },
          { label:'yarn', code:'yarn global add @devdocs/cli\nyarn add @devdocs/sdk' },
          { label:'bun',  code:'bun add -g @devdocs/cli\nbun add @devdocs/sdk' },
        ]} />

        <h2 id="authentication">Authentication</h2>
        <p>All API requests require a Bearer token. Generate yours from the <a href="#">dashboard</a>.</p>

        <CodeBlock filename="auth.ts" language="TypeScript" code={`import { DevDocs } from '@devdocs/sdk'

const client = new DevDocs({
  token: process.env.DEVDOCS_TOKEN,   // required
  version: 'v3',                      // default: latest
  timeout: 10_000,                    // ms, default: 30s
  retries: 3,                         // auto-retry on 5xx
})`} />

        <Callout kind="tip">
          Store your token in an environment variable. Never commit it to source control. Use <code>.env.local</code> locally and your CI/CD secret manager in production.
        </Callout>

        <h2 id="firstcall">Your first API call</h2>
        <p>List your projects and run your first search:</p>

        <CodeBlock filename="example.ts" language="TypeScript" code={`// List all projects
const projects = await client.projects.list({ limit: 10 })
console.log(projects.data) // Project[]

// Fetch a specific page
const page = await client.pages.get('proj_abc123', 'getting-started')
console.log(page.title)    // "Getting Started"

// Search across all docs
const results = await client.search.query({
  q: 'authentication',
  limit: 5,
})
results.data.forEach(r => console.log(r.title, r.score))`} />

        {/* Response */}
        <div className="response-block">
          <div className="response-status">
            <div className="status-dot" />
            <span className="status-text">200 OK</span>
            <span style={{ marginLeft:'auto', color:'var(--text3)', fontWeight:400, fontSize:11 }}>12ms</span>
          </div>
          <pre>{`{
  "data": [
    {
      "id":    "proj_abc123",
      "name":  "My API Docs",
      "pages": 24,
      "plan":  "pro"
    }
  ],
  "meta": { "total": 1, "limit": 10 }
}`}</pre>
        </div>

        <h2 id="sdk-params">SDK parameters</h2>

        <div className="param-wrap">
          <table className="param-table">
            <thead>
              <tr>
                {['Parameter','Type','Required','Description'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['token',   'string', true,  'Your API token from the dashboard'],
                ['version', 'string', false, 'API version. Defaults to "v3"'],
                ['timeout', 'number', false, 'Request timeout in ms. Default 30000'],
                ['retries', 'number', false, 'Auto-retry count on 5xx errors. Default 3'],
                ['baseUrl', 'string', false, 'Override base URL (for self-hosted)'],
              ].map(([p,t,req,d]) => (
                <tr key={p as string}>
                  <td><code>{p}</code></td>
                  <td><span className="param-type">{t}</span></td>
                  <td><span className={req ? 'badge-req' : 'badge-opt'}>{req ? 'Required' : 'Optional'}</span></td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout kind="warning">
          <strong>Rate limits</strong>
          Free plan: 1,000 requests/day. Pro: 100,000/day. Hit the limit? You'll get a <code>429</code> with a <code>Retry-After</code> header — never a silent failure.
        </Callout>

        <h2 id="nextsteps">Next steps</h2>
        <ul>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('quickstart')}}>Quickstart guide</a> — live in 3 minutes</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('api-overview')}}>API Reference</a> — full endpoint docs</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-deploy')}}>Deployment guide</a> — Vercel, Netlify, CI/CD</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-sso')}}>SSO & Access</a> — private docs, team access</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('changelog')}}>Changelog</a> — what's new in v3.0</li>
        </ul>

      </div>
    </div>
  );
}
