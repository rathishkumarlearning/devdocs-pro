import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function Introduction({ onNavigate }: { onNavigate: (id: string) => void }) {
  const quickLinks = [
    { icon:'⚡', label:'Quickstart', desc:'Ship your first docs in 3 min', id:'quickstart', color:'rgba(41,151,255,.1)' },
    { icon:'🔑', label:'Authentication', desc:'Bearer tokens, API keys, OAuth', id:'authentication', color:'rgba(191,90,242,.1)' },
    { icon:'📦', label:'TypeScript SDK', desc:'Fully typed, zero config', id:'sdk-ts', color:'rgba(48,209,88,.1)' },
    { icon:'🔌', label:'REST API', desc:'Full API reference with examples', id:'api-overview', color:'rgba(255,214,10,.1)' },
    { icon:'🚀', label:'Deploy', desc:'Vercel, Netlify, self-hosted', id:'guide-deploy', color:'rgba(255,69,58,.1)' },
    { icon:'🗂️', label:'Versioning', desc:'Multiple API versions, side-by-side', id:'versioning', color:'rgba(100,210,255,.1)' },
  ];

  return (
    <div className="animate-fadeUp">
      {/* hero banner */}
      <div style={{
        background:'linear-gradient(135deg,rgba(41,151,255,.08),rgba(94,92,230,.06),rgba(191,90,242,.05))',
        border:'1px solid var(--border)', borderRadius: 16,
        padding:'40px 36px', marginBottom: 40, position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:'-50%', right:'-20%', width:'60%', height:'200%', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(41,151,255,.1) 0%,transparent 60%)',
          pointerEvents:'none',
        }}/>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent)', marginBottom:12 }}>
          Getting Started
        </p>
        <h1 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1.1, marginBottom:14 }}>
          Welcome to DevDocs Pro
        </h1>
        <p style={{ fontSize:16, color:'var(--text2)', lineHeight:1.65, maxWidth:520, marginBottom:24 }}>
          The documentation platform that makes beautiful, searchable, production-grade API docs effortless. Up and running in 3 minutes.
        </p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button onClick={() => onNavigate('quickstart')} style={{
            display:'flex', alignItems:'center', gap:6,
            background:'var(--accent)', color:'#fff', fontSize:14, fontWeight:600,
            padding:'10px 20px', borderRadius:980, border:'none', cursor:'pointer', transition:'all .2s',
          }}>Quickstart guide →</button>
          <button onClick={() => onNavigate('api-overview')} style={{
            display:'flex', alignItems:'center', gap:6,
            background:'var(--bg3)', color:'var(--text2)', fontSize:14, fontWeight:500,
            padding:'10px 20px', borderRadius:980, border:'1px solid var(--border)', cursor:'pointer', transition:'all .2s',
          }}>API Reference</button>
        </div>
      </div>

      {/* quick links */}
      <div style={{ display:'grid', gap:10, gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', marginBottom:40 }}>
        {quickLinks.map(q => (
          <button key={q.id} onClick={() => onNavigate(q.id)} style={{
            background:'var(--bg2)', border:'1px solid var(--border)', borderRadius: 10,
            padding:'18px 20px', textAlign:'left', cursor:'pointer',
            display:'flex', alignItems:'flex-start', gap:14,
            transition:'all .25s', outline:'none',
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-h)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ width:38, height:38, borderRadius:9, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, background: q.color }}>{q.icon}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:650, color:'var(--text)', marginBottom:4 }}>{q.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)', lineHeight:1.5 }}>{q.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* prose */}
      <h2 id="overview" style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'0 0 16px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>Overview</h2>
      <p style={{ fontSize:15, lineHeight:1.75, color:'var(--text2)', marginBottom:16 }}>
        DevDocs Pro is a <strong style={{ color:'var(--text)' }}>documentation-as-code platform</strong> that auto-generates beautiful, searchable API docs from your OpenAPI spec. It handles hosting, versioning, search, and SDK generation — so you focus on building, not documenting.
      </p>

      <Callout kind="note">
        Looking for the changelog? Check out <a href="#" style={{ color:'var(--accent)', textDecoration:'underline', textUnderlineOffset:3 }}>What's new in v3.0</a> for full details on semantic search and the new Bento layout engine.
      </Callout>

      <h2 id="howitworks" style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'48px 0 16px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>How it works</h2>
      <p style={{ fontSize:15, lineHeight:1.75, color:'var(--text2)', marginBottom:24 }}>
        Connect your spec, configure your project, and deploy. DevDocs Pro parses your OpenAPI / AsyncAPI file and generates a fully interactive portal.
      </p>

      {/* steps */}
      {[
        { n:1, title:'Connect your spec', desc:'Point to your openapi.json or openapi.yaml — local or remote URL. Supports OpenAPI 3.0, 3.1, and AsyncAPI 2.x.' },
        { n:2, title:'Configure your project', desc:'Set your project name, theme, custom domain, and access controls in devdocs.config.ts. Sane defaults mean you rarely need to touch it.' },
        { n:3, title:'Deploy anywhere', desc:'Push to production with devdocs deploy. Supports Vercel, Netlify, Cloudflare Pages, or any Node.js host.' },
      ].map(s => (
        <div key={s.n} style={{ display:'flex', gap:20, padding:'20px 0', borderBottom:'1px solid var(--border)' }}>
          <div style={{
            width:30, height:30, flexShrink:0, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:700, color:'#fff',
            background:'linear-gradient(135deg,var(--accent),var(--accent2))',
          }}>{s.n}</div>
          <div style={{ paddingTop:4 }}>
            <h4 style={{ fontSize:15, fontWeight:650, color:'var(--text)', marginBottom:6 }}>{s.title}</h4>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, margin:0 }}>{s.desc}</p>
          </div>
        </div>
      ))}

      <h2 id="installation" style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'48px 0 16px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>Installation</h2>

      <CodeBlock
        tabs={[
          { label:'npm',  code:'npm install -g @devdocs/cli\nnpm install @devdocs/sdk' },
          { label:'pnpm', code:'pnpm add -g @devdocs/cli\npnpm add @devdocs/sdk' },
          { label:'yarn', code:'yarn global add @devdocs/cli\nyarn add @devdocs/sdk' },
          { label:'bun',  code:'bun add -g @devdocs/cli\nbun add @devdocs/sdk' },
        ]}
      />

      <h2 id="authentication" style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'48px 0 16px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>Authentication</h2>
      <p style={{ fontSize:15, lineHeight:1.75, color:'var(--text2)', marginBottom:16 }}>
        All API requests require a Bearer token. Generate yours from the <a href="#" style={{ color:'var(--accent)', textDecoration:'underline', textUnderlineOffset:3 }}>dashboard</a>.
      </p>

      <CodeBlock
        filename="auth.ts"
        language="TypeScript"
        code={`import { DevDocs } from '@devdocs/sdk'

// Initialize with your API token
const client = new DevDocs({
  token: process.env.DEVDOCS_TOKEN,   // required
  version: 'v3',                      // default: latest
  timeout: 10_000,                    // ms, default: 30s
  retries: 3,                         // auto-retry on 5xx
})`}
      />

      <Callout kind="tip">
        Store your token in an environment variable. Never commit it to source control. Use <code style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'.85em', background:'var(--code)', color:'var(--accent3)', padding:'2px 6px', borderRadius:5 }}>.env.local</code> locally and your CI/CD secret manager in production.
      </Callout>

      <h2 id="firstcall" style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'48px 0 16px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>Your first API call</h2>

      <CodeBlock
        filename="example.ts"
        language="TypeScript"
        code={`// List all projects
const projects = await client.projects.list({ limit: 10 })
console.log(projects.data) // Project[]

// Fetch a specific page
const page = await client.pages.get('proj_abc123', 'getting-started')
console.log(page.title)   // "Getting Started"

// Search across all docs
const results = await client.search.query({
  q: 'authentication',
  limit: 5,
  projectId: 'proj_abc123'
})
results.data.forEach(r => console.log(r.title, r.score))`}
      />

      {/* response preview */}
      <div style={{ background:'#0d1117', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, overflow:'hidden', margin:'16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', background:'rgba(48,209,88,.05)', borderBottom:'1px solid rgba(48,209,88,.12)', fontSize:12, fontWeight:600 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--success)' }}/>
          <span style={{ color:'var(--success)' }}>200 OK</span>
          <span style={{ marginLeft:'auto', fontWeight:400, color:'rgba(255,255,255,.25)', fontSize:11 }}>12ms</span>
        </div>
        <pre style={{ padding:'16px 20px', fontFamily:'JetBrains Mono,monospace', fontSize:12, lineHeight:1.85, color:'#a6adc8', overflowX:'auto' }}>
{`{
  "data": [
    {
      "id":    "proj_abc123",
      "name":  "My API Docs",
      "slug":  "my-api-docs",
      "pages": 24,
      "plan":  "pro"
    }
  ],
  "meta": { "total": 1, "limit": 10 }
}`}
        </pre>
      </div>

      {/* prev/next */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:64, paddingTop:32, borderTop:'1px solid var(--border)' }}>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px 18px', cursor:'pointer', transition:'all .2s' }}>
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:500, marginBottom:5 }}>← Previous</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Overview</div>
        </div>
        <button onClick={() => onNavigate('quickstart')} style={{
          background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px 18px',
          cursor:'pointer', transition:'all .2s', textAlign:'right', outline:'none',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-h)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:500, marginBottom:5 }}>Next →</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Quickstart Guide</div>
        </button>
      </div>
    </div>
  );
}
