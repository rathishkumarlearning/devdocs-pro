import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function SearchApiDocs({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Core Concepts</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Search API</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          DevDocs Pro ships with a built-in full-text and semantic search engine. Every page is automatically indexed at build time — no external Algolia setup required.
        </p>

        {/* Feature pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:36 }}>
          {[
            { icon:'⚡', val:'< 50 ms',     label:'P95 query latency' },
            { icon:'🧠', val:'Semantic',    label:'Vector search included' },
            { icon:'🔍', val:'Full-text',   label:'BM25 ranking' },
            { icon:'🌍', val:'i18n-ready',  label:'Multi-language support' },
          ].map(p => (
            <div key={p.label} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:980, padding:'6px 14px', fontSize:13 }}>
              <span>{p.icon}</span>
              <strong style={{ color:'var(--gold)' }}>{p.val}</strong>
              <span style={{ color:'var(--text3)' }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* ── How Search Works ── */}
        <h2 id="how-it-works">How Search Works</h2>
        <p>
          Every time you deploy, DevDocs crawls your content, chunks it into index segments, and builds two indexes in parallel:
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
          {[
            { title:'Full-text (BM25)', icon:'📄', points:['Exact keyword matching','Heading / title boost','Stop-word removal & stemming','Instant — no ML inference'] },
            { title:'Semantic (Vector)', icon:'🧠', points:['Embedding-based similarity','Finds synonyms & paraphrases','Handles "how do I X" queries','Powered by DevDocs Embed model'] },
          ].map(col => (
            <div key={col.title} style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'16px 18px' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{col.icon}</div>
              <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>{col.title}</div>
              {col.points.map(p => (
                <div key={p} style={{ fontSize:13, color:'var(--text2)', display:'flex', gap:6, marginBottom:4 }}>
                  <span style={{ color:'var(--gold)' }}>•</span>{p}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p>
          Results are merged using Reciprocal Rank Fusion (RRF), so you get the best of both approaches in every query.
        </p>

        {/* ── Quick Start ── */}
        <h2 id="quickstart">Quick Start</h2>
        <p>Search works out of the box — the ⌘K modal is pre-wired. To query search from your own UI or backend:</p>

        <CodeBlock tabs={[
          { label:'REST', code:`curl https://api.devdocspro.io/v1/search \\
  -H "Authorization: Bearer $DEVDOCS_TOKEN" \\
  -G \\
  --data-urlencode "q=how to deploy to vercel" \\
  --data-urlencode "projectId=proj_abc123" \\
  --data-urlencode "version=latest" \\
  --data-urlencode "limit=5"` },
          { label:'TypeScript', code:`import { DevDocs } from '@devdocs/sdk';

const client = new DevDocs({ token: process.env.DEVDOCS_TOKEN });

const results = await client.search.query({
  projectId: 'proj_abc123',
  q: 'how to deploy to vercel',
  version: 'latest',
  limit: 5,
});

for (const hit of results.hits) {
  console.log(hit.title, hit.url, hit.snippet);
}` },
          { label:'Python', code:`from devdocs import DevDocs

client = DevDocs(token=os.environ["DEVDOCS_TOKEN"])

results = client.search.query(
    project_id="proj_abc123",
    q="how to deploy to vercel",
    version="latest",
    limit=5,
)

for hit in results.hits:
    print(hit.title, hit.url, hit.snippet)` },
        ]} />

        {/* ── Response Format ── */}
        <h2 id="response">Response Format</h2>

        <CodeBlock language="json" code={`{
  "query": "how to deploy to vercel",
  "version": "latest",
  "total": 42,
  "hits": [
    {
      "id": "page_abc123",
      "title": "Deployment Guide",
      "slug": "/guide-deploy",
      "section": "Guides",
      "snippet": "Deploy to <mark>Vercel</mark> in one command: <code>devdocs deploy --platform vercel</code>",
      "score": 0.94,
      "breadcrumb": ["Guides", "Deployment"],
      "lastUpdated": "2025-11-12T14:30:00Z"
    },
    {
      "id": "page_def456",
      "title": "Quickstart",
      "slug": "/quickstart",
      "section": "Getting Started",
      "snippet": "Step 4 — Deploy: Push your docs live to <mark>Vercel</mark>…",
      "score": 0.87,
      "breadcrumb": ["Getting Started", "Quickstart"],
      "lastUpdated": "2025-10-01T09:00:00Z"
    }
  ],
  "facets": {
    "section": { "Getting Started": 3, "Guides": 5, "API Reference": 2 }
  },
  "took_ms": 23
}`} />

        {/* ── Query Parameters ── */}
        <h2 id="parameters">Query Parameters</h2>

        <div style={{ overflowX:'auto', marginBottom:24 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Parameter','Type','Required','Default','Description'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--text3)', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { p:'q',            t:'string',  req:'✅', def:'—',       d:'The search query string' },
                { p:'projectId',    t:'string',  req:'✅', def:'—',       d:'Target project ID' },
                { p:'version',      t:'string',  req:'❌', def:'latest',  d:'Doc version to search' },
                { p:'limit',        t:'number',  req:'❌', def:'10',      d:'Max results to return (1–50)' },
                { p:'offset',       t:'number',  req:'❌', def:'0',       d:'Pagination offset' },
                { p:'mode',         t:'string',  req:'❌', def:'hybrid',  d:"'full-text' | 'semantic' | 'hybrid'" },
                { p:'section',      t:'string',  req:'❌', def:'—',       d:'Filter to a specific nav section' },
                { p:'highlight',    t:'boolean', req:'❌', def:'true',    d:'Include <mark> tags in snippets' },
                { p:'snippetLen',   t:'number',  req:'❌', def:'160',     d:'Characters in each snippet' },
              ].map(row => (
                <tr key={row.p} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'8px 12px' }}><code style={{ color:'var(--gold)' }}>{row.p}</code></td>
                  <td style={{ padding:'8px 12px', color:'var(--text3)' }}>{row.t}</td>
                  <td style={{ padding:'8px 12px' }}>{row.req}</td>
                  <td style={{ padding:'8px 12px', color:'var(--text3)', fontStyle:'italic' }}>{row.def}</td>
                  <td style={{ padding:'8px 12px' }}>{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Autocomplete ── */}
        <h2 id="autocomplete">Autocomplete &amp; Suggestions</h2>
        <p>Use the <code>/suggest</code> endpoint for lightweight type-ahead queries (titles only, no chunking):</p>

        <CodeBlock language="bash" code={`curl "https://api.devdocspro.io/v1/search/suggest?q=dep&projectId=proj_abc" \\
  -H "Authorization: Bearer $DEVDOCS_TOKEN"

# Response:
# {
#   "suggestions": [
#     { "title": "Deployment Guide",  "slug": "/guide-deploy" },
#     { "title": "Deprecation Policy","slug": "/changelog#deprecation" }
#   ]
# }`} />

        <Callout kind="tip">
          The ⌘K modal uses this endpoint for instant-feel suggestions. At &lt; 5 ms median latency, it works well without debouncing.
        </Callout>

        {/* ── Custom Index Config ── */}
        <h2 id="indexing">Controlling What Gets Indexed</h2>
        <p>Fine-tune indexing from <code>devdocs.config.ts</code>:</p>

        <CodeBlock language="typescript" code={`export default defineConfig({
  search: {
    provider: 'devdocs',

    // Exclude pages from search results
    exclude: [
      '/changelog',      // exact slug
      '/internal/*',     // glob — all internal/* pages
    ],

    // Boost certain sections (multiplier applied to BM25 score)
    boost: {
      'Getting Started': 1.5,
      'API Reference':   1.2,
    },

    // Custom stop words (merged with default English list)
    stopWords: ['myproduct', 'mycompany'],

    // Max snippet length
    snippetLen: 200,
  },
});`} />

        {/* ── External Search ── */}
        <h2 id="external">Using Algolia Instead</h2>
        <p>Prefer to use Algolia's DocSearch? Switch the provider:</p>

        <CodeBlock language="typescript" code={`search: {
  provider: 'algolia',
  algolia: {
    appId:     'XXXXXXXXXX',
    apiKey:    'your-public-search-key',  // ← public key only, never admin
    indexName: 'my_product_docs',
  },
}`} />

        <Callout kind="note">
          Algolia DocSearch is <strong>free for open-source projects</strong>. Apply at <code>docsearch.algolia.com</code>. For commercial projects use Algolia's paid tier or stick with the built-in DevDocs search.
        </Callout>

        {/* ── Rate Limits ── */}
        <h2 id="rate-limits">Rate Limits</h2>

        <div style={{ overflowX:'auto', marginBottom:24 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Plan','Query / min','Suggest / min','Index size'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--text3)', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { plan:'Free',       q:'60',   s:'300',  i:'10 k pages' },
                { plan:'Pro',        q:'600',  s:'3 000', i:'100 k pages' },
                { plan:'Enterprise', q:'∞',    s:'∞',    i:'Unlimited' },
              ].map(row => (
                <tr key={row.plan} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'8px 12px', fontWeight:600, color:'var(--gold)' }}>{row.plan}</td>
                  <td style={{ padding:'8px 12px' }}>{row.q}</td>
                  <td style={{ padding:'8px 12px' }}>{row.s}</td>
                  <td style={{ padding:'8px 12px' }}>{row.i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>Rate limit headers are included in every response:</p>

        <CodeBlock language="bash" code={`X-RateLimit-Limit:     60
X-RateLimit-Remaining: 57
X-RateLimit-Reset:     1706745600   # Unix timestamp
Retry-After:           12           # Only present when rate limited (429)`} />

        {/* ── Analytics ── */}
        <h2 id="analytics">Search Analytics</h2>
        <p>DevDocs tracks what users search for, what they click, and what they abandon. Access this in <strong>Project → Analytics → Search</strong>:</p>
        <ul>
          <li><strong>Top queries</strong> — what people search most</li>
          <li><strong>Zero-result queries</strong> — content gaps to fill</li>
          <li><strong>Click-through rate</strong> — which results people actually use</li>
          <li><strong>Query volume over time</strong> — see if your docs are growing</li>
        </ul>

        <Callout kind="tip">
          Sort by <strong>zero-result queries</strong> to find content your users need but your docs don't cover yet. That's your highest-ROI writing backlog.
        </Callout>

        {/* ── Next steps ── */}
        <div style={{ marginTop:40, padding:'20px 24px', background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-xl)' }}>
          <div style={{ fontWeight:700, marginBottom:12, color:'var(--gold)' }}>Next up</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { id:'api-search', label:'Search API Reference →', desc:'Full REST reference with all endpoints' },
              { id:'sdk-ts',     label:'TypeScript SDK →',       desc:'Search via the official client library' },
              { id:'api-overview', label:'API Overview →',       desc:'Authentication & base URLs' },
            ].map(l => (
              <button key={l.id} onClick={() => onNavigate(l.id)}
                style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'10px 14px', textAlign:'left', cursor:'pointer', display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ color:'var(--gold)', fontWeight:700, fontSize:14 }}>{l.label}</span>
                <span style={{ color:'var(--text3)', fontSize:13 }}>{l.desc}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
