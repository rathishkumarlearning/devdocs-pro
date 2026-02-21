import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function Projects({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Core Concepts</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Projects</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          A <strong>Project</strong> is the top-level container for all your documentation. Everything — pages, versions, members, domains — lives inside a project.
        </p>

        {/* Feature cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:36 }}>
          {[
            { icon:'📁', label:'File System', val:'Mirrors your repo structure' },
            { icon:'🌐', label:'Custom Domain', val:'Publish on your own URL' },
            { icon:'🔐', label:'Access Control', val:'Per-project RBAC' },
            { icon:'📊', label:'Analytics', val:'Built-in page view metrics' },
          ].map(f => (
            <div key={f.label} style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'14px 16px' }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{f.icon}</div>
              <div style={{ fontSize:12, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px' }}>{f.label}</div>
              <div style={{ fontSize:13, color:'var(--text1)', fontWeight:700, marginTop:2 }}>{f.val}</div>
            </div>
          ))}
        </div>

        {/* ── What Is a Project ── */}
        <h2 id="what-is">What is a Project?</h2>
        <p>
          In DevDocs Pro, a <strong>project</strong> maps 1-to-1 with a documentation site. If you maintain docs for multiple products, each product gets its own project. Projects are isolated — separate members, separate API keys, separate domains.
        </p>
        <p>A project contains:</p>
        <ul>
          <li><strong>Pages</strong> — your MDX content files</li>
          <li><strong>Versions</strong> — snapshot branches (v1, v2, latest)</li>
          <li><strong>Config</strong> — <code>devdocs.config.ts</code> at the repo root</li>
          <li><strong>Members</strong> — contributors with role-based access</li>
          <li><strong>Tokens</strong> — API keys scoped to the project</li>
        </ul>

        {/* ── Creating a Project ── */}
        <h2 id="create">Creating a Project</h2>

        <h3>Via CLI (recommended)</h3>
        <p>Run <code>devdocs init</code> inside an empty directory or an existing repo:</p>

        <CodeBlock language="bash" code={`mkdir my-docs && cd my-docs
devdocs init

# Prompts:
#   Project name   → my-product-docs
#   Visibility     → public | private
#   Framework      → React / Next.js / Astro / plain HTML
#   Git remote     → https://github.com/acme/my-docs
#
# Creates:
#   devdocs.config.ts
#   docs/introduction.mdx
#   .devdocs/  (internal cache — git-ignored)`} />

        <h3>Via Dashboard</h3>
        <p>Log in to <strong>app.devdocspro.io → New Project</strong>. Fill in the project name and connect your GitHub repo. DevDocs detects <code>devdocs.config.ts</code> automatically on first push.</p>

        <Callout kind="tip">
          For monorepos, use the <code>root</code> field in config to point at the docs sub-directory:<br />
          <code>{`root: 'packages/docs'`}</code>
        </Callout>

        {/* ── Config File ── */}
        <h2 id="config">devdocs.config.ts</h2>
        <p>This file is the single source of truth for your project settings:</p>

        <CodeBlock language="typescript" code={`import { defineConfig } from '@devdocs/core';

export default defineConfig({
  // Project metadata
  name: 'My Product Docs',
  slug: 'my-product',           // Used in the API + subdomain
  logo: '/public/logo.svg',
  favicon: '/public/favicon.ico',

  // Content
  root: 'docs',                 // Where your .mdx files live
  defaultVersion: 'latest',

  // Navigation (auto-generated if omitted)
  nav: [
    { title: 'Getting Started', items: ['introduction', 'quickstart'] },
    { title: 'API Reference',   items: ['api-overview', 'api-auth']   },
  ],

  // Theme overrides
  theme: {
    primaryColor: '#f5a623',
    font: 'Inter',
    codeFont: 'JetBrains Mono',
    darkMode: true,
  },

  // Search
  search: {
    provider: 'devdocs',        // 'devdocs' | 'algolia' | 'custom'
    placeholder: 'Search docs…',
  },

  // Analytics
  analytics: {
    provider: 'devdocs',        // 'devdocs' | 'gtm' | 'plausible'
    gtmId: undefined,
  },
});`} />

        <Callout kind="note">
          All config fields except <code>name</code> and <code>slug</code> are optional. DevDocs applies sensible defaults for everything else.
        </Callout>

        {/* ── Project Structure ── */}
        <h2 id="structure">Project Structure</h2>
        <p>A typical DevDocs project looks like this:</p>

        <CodeBlock language="bash" code={`my-docs/
├── devdocs.config.ts        ← project config
├── docs/
│   ├── introduction.mdx
│   ├── quickstart.mdx
│   ├── api/
│   │   ├── overview.mdx
│   │   └── reference.mdx
│   └── guides/
│       └── deployment.mdx
├── public/
│   ├── logo.svg
│   └── og-image.png
└── package.json`} />

        <p>You can nest pages arbitrarily deep. DevDocs builds the sidebar tree from directory structure unless you supply an explicit <code>nav</code> in config.</p>

        {/* ── Members & Roles ── */}
        <h2 id="members">Members &amp; Roles</h2>
        <p>Every project has a team. Roles control what each person can do:</p>

        <div style={{ overflowX:'auto', marginBottom:24 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Role','Can Read','Can Write','Can Deploy','Can Manage'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'var(--text3)', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { role:'Owner',   r:'✅', w:'✅', d:'✅', m:'✅' },
                { role:'Admin',   r:'✅', w:'✅', d:'✅', m:'❌' },
                { role:'Editor',  r:'✅', w:'✅', d:'❌', m:'❌' },
                { role:'Viewer',  r:'✅', w:'❌', d:'❌', m:'❌' },
              ].map(row => (
                <tr key={row.role} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'8px 12px', fontWeight:600, color:'var(--gold)' }}>{row.role}</td>
                  <td style={{ padding:'8px 12px' }}>{row.r}</td>
                  <td style={{ padding:'8px 12px' }}>{row.w}</td>
                  <td style={{ padding:'8px 12px' }}>{row.d}</td>
                  <td style={{ padding:'8px 12px' }}>{row.m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>Invite members via the dashboard or CLI:</p>

        <CodeBlock language="bash" code={`devdocs team add alice@acme.com --role editor
devdocs team list
devdocs team remove alice@acme.com`} />

        {/* ── API Keys ── */}
        <h2 id="api-keys">Project API Keys</h2>
        <p>
          API keys are scoped per project. Generate them from <strong>Project Settings → API Tokens</strong>, or via CLI:
        </p>

        <CodeBlock language="bash" code={`devdocs token create --name "CI Deploy" --scope deploy
# → dp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

devdocs token list
devdocs token revoke dp_live_xxxx`} />

        <Callout kind="warning">
          Store tokens in environment variables — never commit them to git. Use <code>DEVDOCS_TOKEN</code> as the conventional env name.
        </Callout>

        {/* ── Deleting ── */}
        <h2 id="delete">Deleting a Project</h2>
        <p>
          Projects can be deleted from <strong>Project Settings → Danger Zone</strong>. Deletion is <strong>permanent</strong> — all pages, versions, and analytics are removed. Export your content first with:
        </p>

        <CodeBlock language="bash" code={`devdocs export --output ./backup-$(date +%Y%m%d).zip`} />

        <Callout kind="danger">
          Deleted projects cannot be recovered. The subdomain is released immediately and may be claimed by another user.
        </Callout>

        {/* ── Next steps ── */}
        <div style={{ marginTop:40, padding:'20px 24px', background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-xl)' }}>
          <div style={{ fontWeight:700, marginBottom:12, color:'var(--gold)' }}>Next up</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { id:'pages',      label:'Pages & Content →', desc:'Learn how to write and organise your MDX docs' },
              { id:'versioning', label:'Versioning →',      desc:'Maintain multiple doc versions in parallel' },
              { id:'api-projects', label:'Projects API →',  desc:'Manage projects programmatically' },
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
