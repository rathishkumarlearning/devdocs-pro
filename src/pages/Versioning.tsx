import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function Versioning({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Core Concepts</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Versioning
          <span style={{ marginLeft:12, fontSize:13, fontWeight:600, background:'rgba(245,166,35,.15)', color:'var(--gold)', border:'1px solid var(--gold-border)', borderRadius:980, padding:'2px 10px', verticalAlign:'middle' }}>New</span>
        </h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          Ship breaking changes without breaking your readers. DevDocs Pro lets you maintain multiple documentation versions simultaneously, with a version switcher built right into the navbar.
        </p>

        {/* Version model overview */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:12, marginBottom:36 }}>
          {[
            { icon:'🌿', label:'Branch-based',  val:'One git branch per version' },
            { icon:'🔗', label:'Permalinks',     val:'Stable URLs per version' },
            { icon:'🏷️', label:'Latest alias',   val:'Always points to current' },
            { icon:'🗂️', label:'Fallback pages', val:'Inherit from parent version' },
          ].map(f => (
            <div key={f.label} style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'14px 16px' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{f.icon}</div>
              <div style={{ fontSize:12, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px' }}>{f.label}</div>
              <div style={{ fontSize:13, color:'var(--text1)', fontWeight:700, marginTop:2 }}>{f.val}</div>
            </div>
          ))}
        </div>

        {/* ── How Versioning Works ── */}
        <h2 id="how-it-works">How Versioning Works</h2>
        <p>
          DevDocs versions map to <strong>git branches</strong>. Each version is a snapshot of your documentation at a point in time. When you push to a version branch, only that version's content updates.
        </p>

        <CodeBlock language="bash" code={`# Version branches follow the pattern: docs/vX.Y
docs/v1      → /v1/ prefix in URL
docs/v2      → /v2/ prefix in URL
main         → /latest/ (always current)`} />

        <p>
          Readers can switch between versions using the version dropdown in the top navigation. The <code>latest</code> alias always resolves to your most recently published version.
        </p>

        {/* ── Creating a Version ── */}
        <h2 id="create-version">Creating a New Version</h2>

        <h3>Step 1 — Create the branch</h3>
        <CodeBlock language="bash" code={`# Branch from your current docs
git checkout -b docs/v2 main
git push origin docs/v2`} />

        <h3>Step 2 — Register the version</h3>
        <p>Add the version to <code>devdocs.config.ts</code>:</p>

        <CodeBlock language="typescript" code={`export default defineConfig({
  name: 'My Product Docs',
  versions: [
    {
      label: 'v2.x',            // Display name in switcher
      branch: 'docs/v2',        // Git branch to pull from
      slug: 'v2',               // URL prefix → /v2/...
      default: true,            // Mark as the current default
    },
    {
      label: 'v1.x',
      branch: 'docs/v1',
      slug: 'v1',
      archived: true,           // Shows "Archived" badge in switcher
    },
  ],
});`} />

        <h3>Step 3 — Deploy</h3>
        <CodeBlock language="bash" code={`devdocs deploy --version v2

# DevDocs builds the v2 branch and makes it live at:
# https://docs.myproduct.com/v2/`} />

        <Callout kind="tip">
          Set <code>default: true</code> on only one version at a time. The default version is what users see when they visit the root URL (e.g., <code>docs.myproduct.com/introduction</code>).
        </Callout>

        {/* ── URL Structure ── */}
        <h2 id="urls">URL Structure</h2>
        <p>Versioned URLs follow a predictable pattern:</p>

        <div style={{ overflowX:'auto', marginBottom:24 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['URL','Resolves to','Notes'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--text3)', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { url:'/introduction',         to:'Default version', note:'Canonical URL for latest' },
                { url:'/v2/introduction',      to:'v2 branch',       note:'Permanent, stable URL' },
                { url:'/v1/introduction',       to:'v1 branch',       note:'Old content still accessible' },
                { url:'/latest/introduction',  to:'Default version', note:'"latest" alias always redirects' },
              ].map(row => (
                <tr key={row.url} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'8px 12px' }}><code style={{ color:'var(--gold)' }}>{row.url}</code></td>
                  <td style={{ padding:'8px 12px' }}>{row.to}</td>
                  <td style={{ padding:'8px 12px', color:'var(--text3)' }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Page Inheritance ── */}
        <h2 id="inheritance">Page Inheritance (Fallback)</h2>
        <p>
          Not every page needs to change between versions. Use <strong>inheritance</strong> to fall back to a parent version's content automatically. Only override what's different.
        </p>

        <CodeBlock language="typescript" code={`// devdocs.config.ts
versions: [
  { label: 'v2.x', branch: 'docs/v2', slug: 'v2', default: true },
  {
    label: 'v1.x',
    branch: 'docs/v1',
    slug: 'v1',
    fallback: 'v2',   // Pages missing in v1 fall back to v2 content
  },
]`} />

        <p>Example: if <code>docs/v1/authentication.mdx</code> doesn't exist, DevDocs serves <code>docs/v2/authentication.mdx</code> with a banner:</p>

        <div style={{ background:'rgba(245,166,35,.08)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'12px 16px', fontSize:13, color:'var(--text2)', marginBottom:24 }}>
          <strong style={{ color:'var(--gold)' }}>📄 This page applies to v2.x and above.</strong><br />
          You are viewing documentation for v1.x. The page you requested is identical across versions — showing the v2 version.
        </div>

        {/* ── Deprecating a Version ── */}
        <h2 id="deprecate">Deprecating &amp; Archiving</h2>
        <p>When a version is no longer actively supported, mark it as <code>archived</code>:</p>

        <CodeBlock language="typescript" code={`{
  label: 'v1.x (EOL)',
  branch: 'docs/v1',
  slug: 'v1',
  archived: true,         // Shows banner + "Archived" badge
  archivedMessage: 'v1 reached end-of-life on Jan 1, 2025. Please upgrade to v2.',
}`} />

        <p>Archived versions still exist at their URLs — they're just clearly labelled as outdated. To fully remove a version:</p>

        <CodeBlock language="bash" code={`devdocs version remove v1

# ⚠️ This permanently removes /v1/* from your published site.
# The git branch is NOT deleted — you keep source history.`} />

        <Callout kind="danger">
          Removing a published version breaks any inbound links to <code>/v1/...</code>. Set up redirects before removing: <code>devdocs redirects add "/v1/*" "/v2/:splat"</code>
        </Callout>

        {/* ── Version Switcher ── */}
        <h2 id="switcher">Version Switcher UI</h2>
        <p>DevDocs automatically injects a version switcher into the navigation bar when two or more versions are configured. The switcher:</p>
        <ul>
          <li>Shows version labels in descending order (latest first)</li>
          <li>Highlights the currently viewed version</li>
          <li>Preserves the current page path when switching (falls back to the version root if the page doesn't exist)</li>
          <li>Shows <strong>Archived</strong> badges for EOL versions</li>
        </ul>

        <p>To customise the switcher order:</p>

        <CodeBlock language="typescript" code={`versions: [
  // Listed top-to-bottom in switcher in this order
  { label: 'v3.x (Latest)', branch: 'docs/v3', slug: 'v3', default: true },
  { label: 'v2.x',          branch: 'docs/v2', slug: 'v2' },
  { label: 'v1.x',          branch: 'docs/v1', slug: 'v1', archived: true },
]`} />

        {/* ── API + CLI ── */}
        <h2 id="api-cli">Versions via API &amp; CLI</h2>
        <p>Manage versions programmatically:</p>

        <CodeBlock tabs={[
          { label:'CLI', code:`# List versions
devdocs version list

# Create
devdocs version create --label "v3.x" --branch docs/v3 --slug v3 --default

# Set default
devdocs version set-default v3

# Archive
devdocs version archive v1` },
          { label:'TypeScript', code:`import { DevDocs } from '@devdocs/sdk';
const client = new DevDocs({ token: process.env.DEVDOCS_TOKEN });

// List versions
const versions = await client.versions.list({ projectId: 'proj_abc' });

// Create a version
const v3 = await client.versions.create({
  projectId: 'proj_abc',
  label: 'v3.x',
  branch: 'docs/v3',
  slug: 'v3',
  default: true,
});

// Archive old version
await client.versions.update('ver_v1', { archived: true });` },
        ]} />

        {/* ── Best Practices ── */}
        <h2 id="best-practices">Best Practices</h2>

        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
          {[
            { icon:'✅', tip:'Use semantic version slugs', detail:'v1, v2, v3 — keep them short and predictable for your users.' },
            { icon:'✅', tip:'Freeze old versions before branching', detail:'Run devdocs build --version v1 and commit the lock file to prevent future builds from changing old content.' },
            { icon:'✅', tip:'Set up redirects when releasing a new major', detail:'Use devdocs redirects to send old v1 URLs → v2, reducing 404s from external links.' },
            { icon:'✅', tip:'Use page inheritance liberally', detail:"Only 20–30% of pages usually change between majors. Let the rest fall back — don't duplicate content." },
            { icon:'⚠️', tip:'Avoid too many live versions', detail:'Supporting 4+ concurrent versions is a maintenance burden. Archive EOL versions promptly.' },
          ].map(b => (
            <div key={b.tip} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'12px 16px', display:'flex', gap:12 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{b.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{b.tip}</div>
                <div style={{ fontSize:13, color:'var(--text3)' }}>{b.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Next steps ── */}
        <div style={{ marginTop:40, padding:'20px 24px', background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-xl)' }}>
          <div style={{ fontWeight:700, marginBottom:12, color:'var(--gold)' }}>Next up</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { id:'search',       label:'Search API →',       desc:'Index and query your versioned docs' },
              { id:'guide-deploy', label:'Deployment Guide →', desc:'CI/CD setup for multi-version builds' },
              { id:'api-projects', label:'Projects API →',     desc:'Manage versions programmatically' },
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
