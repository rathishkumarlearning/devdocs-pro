import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function PagesContent({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Core Concepts</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Pages &amp; Content</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          DevDocs Pro uses <strong>MDX</strong> — Markdown + JSX — as its content format. Write in plain Markdown, embed interactive React components, and DevDocs handles the rest.
        </p>

        {/* Stat pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:36 }}>
          {[
            { icon:'📝', val:'MDX 3.x',       label:'Content format' },
            { icon:'⚡', val:'< 50 ms',        label:'Avg build per page' },
            { icon:'🔍', val:'Auto-indexed',   label:'Full-text search' },
            { icon:'🌙', val:'Dark / Light',   label:'Theme aware code' },
          ].map(p => (
            <div key={p.label} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:980, padding:'6px 14px', fontSize:13 }}>
              <span>{p.icon}</span>
              <strong style={{ color:'var(--gold)' }}>{p.val}</strong>
              <span style={{ color:'var(--text3)' }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* ── Anatomy of a Page ── */}
        <h2 id="anatomy">Anatomy of a Page</h2>
        <p>Every <code>.mdx</code> file begins with a <strong>frontmatter</strong> block, then your content:</p>

        <CodeBlock language="markdown" code={`---
title: "Getting Started"
description: "Set up your first DevDocs project in under 5 minutes"
slug: getting-started          # URL slug (defaults to filename)
version: latest                # Version tag (optional)
badge: new                     # 'new' | 'beta' | 'deprecated'
editUrl: https://github.com/acme/docs/edit/main/docs/getting-started.mdx
---

# Getting Started

Welcome to **My Product**. This guide walks you through initial setup.

## Prerequisites

- Node.js ≥ 18
- An API key from your [dashboard](https://app.myproduct.com)

<Callout kind="tip">
  New users get a **free 30-day trial** — no credit card required.
</Callout>

\`\`\`bash
npm install @myproduct/sdk
\`\`\``} />

        {/* ── Frontmatter Reference ── */}
        <h2 id="frontmatter">Frontmatter Reference</h2>

        <div style={{ overflowX:'auto', marginBottom:24 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Field','Type','Default','Description'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--text3)', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { f:'title',       t:'string',          d:'Filename',  desc:'Page title (H1 + <title> tag)' },
                { f:'description', t:'string',          d:'—',         desc:'Meta description for SEO' },
                { f:'slug',        t:'string',          d:'filename',  desc:'URL slug override' },
                { f:'version',     t:'string',          d:'latest',    desc:'Which version this page belongs to' },
                { f:'badge',       t:'new|beta|deprecated', d:'—',     desc:'Sidebar badge' },
                { f:'order',       t:'number',          d:'0',         desc:'Manual sort order in sidebar' },
                { f:'hidden',      t:'boolean',         d:'false',     desc:'Exclude from sidebar & search' },
                { f:'editUrl',     t:'string (URL)',    d:'auto',      desc:'"Edit this page" link override' },
                { f:'toc',         t:'boolean',         d:'true',      desc:'Show table of contents' },
              ].map(row => (
                <tr key={row.f} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'8px 12px' }}><code style={{ color:'var(--gold)' }}>{row.f}</code></td>
                  <td style={{ padding:'8px 12px', color:'var(--text3)' }}>{row.t}</td>
                  <td style={{ padding:'8px 12px', color:'var(--text3)', fontStyle:'italic' }}>{row.d}</td>
                  <td style={{ padding:'8px 12px' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── MDX Components ── */}
        <h2 id="components">Built-in MDX Components</h2>
        <p>DevDocs ships a component library you can use anywhere in your <code>.mdx</code> files without an import:</p>

        <h3 id="callout">Callout</h3>
        <p>Four variants: <code>tip</code>, <code>info</code>, <code>warning</code>, <code>danger</code>.</p>

        <CodeBlock language="jsx" code={`<Callout kind="warning">
  This API is deprecated as of v3.0. Use the new endpoint instead.
</Callout>

<Callout kind="tip" title="Pro Tip">
  Hold <kbd>⌘ K</kbd> anywhere to open the command palette.
</Callout>`} />

        <h3 id="codeblock">CodeBlock</h3>
        <p>Tabbed code blocks with syntax highlighting, copy button, and line highlights:</p>

        <CodeBlock language="jsx" code={`<CodeBlock tabs={[
  { label: 'npm',  code: 'npm install @devdocs/sdk' },
  { label: 'pnpm', code: 'pnpm add @devdocs/sdk'    },
  { label: 'bun',  code: 'bun add @devdocs/sdk'     },
]} />

{/* Or a single block with highlights */}
<CodeBlock language="typescript" highlight="3-5" code={\`
const client = new DevDocs({
  projectId: 'proj_abc123',
  token: process.env.DEVDOCS_TOKEN,  // highlighted
  version: 'latest',                 // highlighted
  timeout: 5000,                     // highlighted
});
\`} />`} />

        <h3 id="steps">Steps</h3>
        <p>Numbered step-by-step guides that render as a visual stepper:</p>

        <CodeBlock language="jsx" code={`<Steps>
  <Step title="Install the SDK">
    \`npm install @devdocs/sdk\`
  </Step>
  <Step title="Initialise the client">
    Create a \`devdocs.ts\` file and initialise the client with your token.
  </Step>
  <Step title="Make your first call">
    \`await client.pages.list({ projectId: 'proj_abc' })\`
  </Step>
</Steps>`} />

        <h3 id="tabs">Tabs</h3>
        <p>Sync tabs across the page (great for language switchers):</p>

        <CodeBlock language="jsx" code={`<Tabs group="language">
  <Tab label="TypeScript">
    \`\`\`typescript
    const page = await client.pages.get('page_123');
    \`\`\`
  </Tab>
  <Tab label="Python">
    \`\`\`python
    page = client.pages.get("page_123")
    \`\`\`
  </Tab>
  <Tab label="Go">
    \`\`\`go
    page, err := client.Pages.Get("page_123")
    \`\`\`
  </Tab>
</Tabs>`} />

        <h3 id="api-playground">ApiPlayground</h3>
        <p>Embed a live, try-it-now API widget directly in your reference pages:</p>

        <CodeBlock language="jsx" code={`<ApiPlayground
  method="GET"
  path="/v1/projects/{projectId}/pages"
  params={[
    { name: 'projectId', in: 'path',  required: true,  type: 'string' },
    { name: 'version',   in: 'query', required: false, type: 'string' },
    { name: 'limit',     in: 'query', required: false, type: 'number', default: 20 },
  ]}
/>`} />

        {/* ── File Naming ── */}
        <h2 id="naming">File Naming & URLs</h2>
        <p>DevDocs maps filenames to URLs automatically. The rules:</p>
        <ul>
          <li><code>docs/introduction.mdx</code> → <code>/introduction</code></li>
          <li><code>docs/api/overview.mdx</code> → <code>/api/overview</code></li>
          <li><code>docs/api/index.mdx</code> → <code>/api</code> (index files become the section root)</li>
          <li>Use kebab-case: <code>getting-started.mdx</code> → <code>/getting-started</code></li>
        </ul>

        <Callout kind="note">
          Override any URL with the <code>slug</code> frontmatter field. Slugs must be unique within a version.
        </Callout>

        {/* ── Images & Assets ── */}
        <h2 id="assets">Images &amp; Assets</h2>
        <p>Put static assets in the <code>public/</code> directory and reference them with absolute paths:</p>

        <CodeBlock language="markdown" code={`![Architecture diagram](/diagrams/architecture.png)

{/* Or as a React component for more control */}
<img
  src="/screenshots/dashboard.png"
  alt="DevDocs dashboard"
  style={{ borderRadius: 8, border: '1px solid var(--border)' }}
/>`} />

        <p>For external images, use the <code>Image</code> component which automatically applies lazy-loading and blur placeholders:</p>

        <CodeBlock language="jsx" code={`<Image
  src="https://cdn.acme.com/hero.png"
  alt="Hero"
  width={1200}
  height={630}
  priority
/>`} />

        {/* ── Linking Between Pages ── */}
        <h2 id="links">Linking Between Pages</h2>
        <p>Internal links use the page <code>slug</code> — DevDocs validates them at build time and flags broken links:</p>

        <CodeBlock language="markdown" code={`See the [Authentication guide](/authentication) for token setup.

[TypeScript SDK reference](/sdk-ts#installation) links to a heading anchor.`} />

        <Callout kind="warning">
          Broken internal links fail the build. Run <code>devdocs check</code> locally before pushing to catch them early.
        </Callout>

        {/* ── Page Variables ── */}
        <h2 id="variables">Content Variables</h2>
        <p>Inject dynamic values into content using the <code>{`{{variable}}`}</code> syntax or the <code>useDocsMeta</code> hook:</p>

        <CodeBlock language="jsx" code={`{/* In devdocs.config.ts */}
variables: {
  sdkVersion: '3.4.1',
  apiBase:    'https://api.devdocspro.io/v1',
}

{/* In .mdx files */}
Install version **\`{{sdkVersion}}\`** or later.

The base URL for all requests is \`{{apiBase}}\`.`} />

        {/* ── Linting ── */}
        <h2 id="linting">Content Linting</h2>
        <p>Run <code>devdocs lint</code> to check for common issues:</p>

        <CodeBlock language="bash" code={`devdocs lint

# Output:
# ✅  docs/introduction.mdx          — OK
# ⚠️   docs/api/overview.mdx:14      — Missing alt text on image
# ❌  docs/guides/deploy.mdx:32      — Broken link → /installation#step-5 (anchor not found)
#
# 1 error, 1 warning`} />

        {/* ── Next steps ── */}
        <div style={{ marginTop:40, padding:'20px 24px', background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-xl)' }}>
          <div style={{ fontWeight:700, marginBottom:12, color:'var(--gold)' }}>Next up</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { id:'versioning', label:'Versioning →',       desc:'Maintain v1 and v2 docs side-by-side' },
              { id:'search',     label:'Search API →',       desc:'Full-text and semantic search for your docs' },
              { id:'sdk-ts',     label:'TypeScript SDK →',   desc:'Programmatically create and update pages' },
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
