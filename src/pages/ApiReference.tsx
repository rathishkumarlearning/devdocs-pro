import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

const ENDPOINTS = [
  { method:'GET',    path:'/v3/projects',                  desc:'List all documentation projects',        badge:'Public' },
  { method:'POST',   path:'/v3/projects',                  desc:'Create a new documentation project',     badge:'Pro+' },
  { method:'GET',    path:'/v3/projects/:id',              desc:'Get a specific project by ID',           badge:'Auth' },
  { method:'GET',    path:'/v3/projects/:id/pages',        desc:'Fetch all pages in a project',           badge:'Paginated' },
  { method:'POST',   path:'/v3/projects/:id/pages',        desc:'Create a new page',                      badge:'Auth' },
  { method:'PUT',    path:'/v3/projects/:id/pages/:slug',  desc:'Update an existing page',                badge:'Auth' },
  { method:'DELETE', path:'/v3/projects/:id',              desc:'Permanently delete a project',           badge:'⚠ Final' },
  { method:'POST',   path:'/v3/search',                    desc:'Semantic full-text search across docs',  badge:'Semantic' },
];

const METHOD_STYLE: Record<string,{ bg:string; color:string }> = {
  GET:    { bg:'rgba(48,209,88,.12)',   color:'#30d158' },
  POST:   { bg:'rgba(41,151,255,.12)',  color:'#2997ff' },
  PUT:    { bg:'rgba(255,214,10,.12)',  color:'#ffd60a' },
  DELETE: { bg:'rgba(255,69,58,.12)',   color:'#ff453a' },
  PATCH:  { bg:'rgba(191,90,242,.12)', color:'#bf5af2' },
};

export default function ApiReference({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom:40 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent)', marginBottom:12 }}>
          API Reference
        </p>
        <h1 style={{ fontSize:'clamp(28px,4vw,40px)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1.1, marginBottom:14 }}>
          Clean. Predictable. Fast.
        </h1>
        <p style={{ fontSize:16, color:'var(--text2)', lineHeight:1.65, maxWidth:560 }}>
          REST all the way. Bearer auth on every request. Consistent responses, sensible errors.
        </p>
      </div>

      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'0 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Base URL
      </h2>
      <CodeBlock code="https://api.devdocs.pro/v3" />

      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Authentication
      </h2>
      <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.75, marginBottom:16 }}>
        Pass your API token as a Bearer token in the <code style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'.85em', background:'var(--code)', color:'var(--accent3)', padding:'2px 6px', borderRadius:5 }}>Authorization</code> header.
      </p>
      <CodeBlock filename="request.ts" language="TypeScript" code={`const res = await fetch('https://api.devdocs.pro/v3/projects', {
  headers: {
    'Authorization': \`Bearer \${process.env.DEVDOCS_TOKEN}\`,
    'Content-Type': 'application/json',
  }
})`} />

      <Callout kind="warning">
        Keep your API token secret. Never expose it in client-side code or commit it to version control. Rotate it immediately if compromised.
      </Callout>

      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Endpoints
      </h2>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {ENDPOINTS.map((ep, i) => {
          const ms = METHOD_STYLE[ep.method] ?? METHOD_STYLE.GET;
          return (
            <div key={i} style={{
              background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12,
              padding:'16px 20px', transition:'all .2s',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-a)'; e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                <span style={{
                  fontFamily:'JetBrains Mono,monospace', fontSize:11, fontWeight:700,
                  padding:'3px 10px', borderRadius:6, letterSpacing:'.04em',
                  background: ms.bg, color: ms.color, flexShrink:0,
                }}>{ep.method}</span>
                <code style={{
                  fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'var(--text)',
                  wordBreak:'break-all',
                }}>{ep.path}</code>
                <span style={{
                  marginLeft:'auto', fontSize:11, fontWeight:500, flexShrink:0,
                  padding:'3px 10px', borderRadius:980,
                  background:'rgba(255,255,255,.05)', color:'var(--text3)',
                  border:'1px solid var(--border)',
                }}>{ep.badge}</span>
              </div>
              <div style={{ fontSize:13, color:'var(--text3)', paddingLeft:2 }}>{ep.desc}</div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Error codes
      </h2>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr>
              {['Code','Meaning','When'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'8px 14px', fontSize:11, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text3)', borderBottom:'1px solid var(--border)', background:'var(--bg2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['200','OK','Request succeeded'],
              ['201','Created','Resource created successfully'],
              ['400','Bad Request','Invalid parameters or body'],
              ['401','Unauthorized','Missing or invalid Bearer token'],
              ['403','Forbidden','Token valid but lacks permission'],
              ['404','Not Found','Resource does not exist'],
              ['429','Too Many Requests','Rate limit exceeded — check Retry-After header'],
              ['500','Server Error','Something broke on our end'],
            ].map(([code, meaning, when]) => (
              <tr key={code} style={{ borderBottom:'1px solid var(--border)' }}
                onMouseOver={e => (e.currentTarget.style.background='var(--bg3)')}
                onMouseOut={e => (e.currentTarget.style.background='transparent')}
              >
                <td style={{ padding:'11px 14px' }}><code style={{ fontFamily:'JetBrains Mono,monospace', color:'var(--accent)', fontSize:12 }}>{code}</code></td>
                <td style={{ padding:'11px 14px', color:'var(--text)' }}>{meaning}</td>
                <td style={{ padding:'11px 14px', color:'var(--text2)' }}>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* prev/next */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:64, paddingTop:32, borderTop:'1px solid var(--border)' }}>
        <button onClick={() => onNavigate('search')} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 18px', cursor:'pointer', textAlign:'left', outline:'none', transition:'all .2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--border-h)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
        >
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:500, marginBottom:5 }}>← Previous</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Search API</div>
        </button>
        <button onClick={() => onNavigate('api-projects')} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 18px', cursor:'pointer', textAlign:'right', outline:'none', transition:'all .2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--border-h)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
        >
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:500, marginBottom:5 }}>Next →</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Projects API</div>
        </button>
      </div>
    </div>
  );
}
