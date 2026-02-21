import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function Installation({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Getting Started</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Installation</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          Get DevDocs Pro running in under 60 seconds. Supports Node.js 18+, Bun, and Deno.
        </p>

        {/* Requirements banner */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:32 }}>
          {[
            { icon:'🟩', label:'Node.js', val:'≥ 18.0' },
            { icon:'🔷', label:'TypeScript', val:'≥ 5.0' },
            { icon:'📦', label:'Package mgr', val:'npm / pnpm / yarn / bun' },
            { icon:'🐙', label:'Git', val:'Any version' },
          ].map(r => (
            <div key={r.label} style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'14px 16px' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{r.icon}</div>
              <div style={{ fontSize:12, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px' }}>{r.label}</div>
              <div style={{ fontSize:13, color:'var(--text1)', fontWeight:700, marginTop:2 }}>{r.val}</div>
            </div>
          ))}
        </div>

        {/* ── Step 1 ── */}
        <h2 id="install-cli">Step 1 — Install the CLI</h2>
        <p>The DevDocs CLI is the primary tool for initialising projects, previewing locally, and deploying. Install it globally once:</p>

        <CodeBlock tabs={[
          { label:'npm',  code:'npm install -g @devdocs/cli' },
          { label:'pnpm', code:'pnpm add -g @devdocs/cli' },
          { label:'yarn', code:'yarn global add @devdocs/cli' },
          { label:'bun',  code:'bun add -g @devdocs/cli' },
        ]} />

        <p>Verify the install:</p>

        <CodeBlock language="bash" code={`devdocs --version
# → DevDocs CLI v3.4.1`} />

        <Callout kind="tip">
          Prefer not to install globally? Use <code>npx @devdocs/cli</code> (or <code>pnpm dlx</code> / <code>bunx</code>) — it always runs the latest version.
        </Callout>

        {/* ── Step 2 ── */}
        <h2 id="install-sdk">Step 2 — Install the SDK</h2>
        <p>Add the SDK as a project dependency to interact with the DevDocs API from your code:</p>

        <CodeBlock tabs={[
          { label:'npm',  code:'npm install @devdocs/sdk' },
          { label:'pnpm', code:'pnpm add @devdocs/sdk' },
          { label:'yarn', code:'yarn add @devdocs/sdk' },
          { label:'bun',  code:'bun add @devdocs/sdk' },
        ]} />

        <p>The SDK is fully typed — no <code>@types</code> package required.</p>

        {/* ── Step 3 ── */}
        <h2 id="init-project">Step 3 — Initialise your project</h2>
        <p>Run <code>init</code> inside your repository to scaffold the config file:</p>

        <CodeBlock language="bash" code={`cd my-api
devdocs init`} />

        <p>The CLI will ask a few questions:</p>

        <div className="response-block">
          <pre style={{ color:'var(--text2)', lineHeight:1.8 }}>{`? Project name  › My API Docs
? OpenAPI spec URL or path  › ./openapi.yaml
? Choose a theme  › Golden (default)
? Custom domain (optional)  › docs.myapi.io

✅  devdocs.config.ts created
✅  .devdocsignore created
✅  Ready. Run \`devdocs dev\` to preview.`}</pre>
        </div>

        {/* ── Step 4 ── */}
        <h2 id="config-file">Step 4 — Review devdocs.config.ts</h2>
        <p>The generated config file covers all common options:</p>

        <CodeBlock filename="devdocs.config.ts" language="TypeScript" code={`import { defineConfig } from '@devdocs/sdk'

export default defineConfig({
  name:    'My API Docs',
  version: 'v3',

  // Source — OpenAPI 3.x or AsyncAPI 2.x
  spec: './openapi.yaml',   // local path or URL

  // Branding
  theme: {
    primary: '#f5a623',
    logo:    './assets/logo.svg',
    favicon: './assets/favicon.ico',
  },

  // Optional: custom domain
  domain: 'docs.myapi.io',

  // SDK generation (auto on deploy)
  sdks: ['typescript', 'python', 'go'],

  // Navigation groups (override auto-generated)
  nav: [
    { title: 'Getting Started', pages: ['introduction', 'quickstart', 'authentication'] },
    { title: 'API Reference',   pages: 'auto' },   // auto from spec
    { title: 'SDKs',            pages: ['sdk-ts', 'sdk-python', 'sdk-go'] },
  ],
})`} />

        <Callout kind="note">
          The <code>spec</code> field accepts a local file path or any public URL. Remote specs are fetched at build time and cached — perfect for CI pipelines.
        </Callout>

        {/* ── Step 5 ── */}
        <h2 id="local-preview">Step 5 — Preview locally</h2>
        <p>Fire up the dev server. It hot-reloads when your spec or config changes:</p>

        <CodeBlock language="bash" code={`devdocs dev

# Output:
# ▶  DevDocs Dev Server
# ✅  Spec loaded  — 47 endpoints, 12 schemas
# 🌐  Listening on http://localhost:4000
# 📡  Watching openapi.yaml for changes…`} />

        <p>Open <code>http://localhost:4000</code> — you'll see your live documentation portal.</p>

        {/* ── Troubleshooting ── */}
        <h2 id="troubleshooting">Troubleshooting</h2>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            {
              q: 'Command not found: devdocs',
              a: 'Your global npm bin directory is not in PATH. Run npm config get prefix and add the /bin subfolder to your shell profile.',
            },
            {
              q: 'Spec parse error on openapi.yaml',
              a: 'Validate your spec with `npx @stoplight/spectral-cli lint openapi.yaml`. DevDocs requires valid OpenAPI 3.0 or 3.1.',
            },
            {
              q: 'Port 4000 already in use',
              a: 'Pass --port to the dev command: devdocs dev --port 4001',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'16px 18px' }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>⚠ {q}</div>
              <div style={{ color:'var(--text2)', fontSize:13, lineHeight:1.7 }}>{a}</div>
            </div>
          ))}
        </div>

        <h2 id="next">Next steps</h2>
        <ul>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('authentication')}}>Set up authentication</a> — protect private docs</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('quickstart')}}>Quickstart guide</a> — deploy in 3 minutes</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-deploy')}}>Deployment options</a> — Vercel, Netlify, self-hosted</li>
        </ul>

      </div>
    </div>
  );
}
