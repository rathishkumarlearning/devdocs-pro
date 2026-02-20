import type { ReactNode } from 'react';
import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

function PlatformCard({ icon, name, time, badge, children }: {
  icon:string; name:string; time:string; badge?:string; children:ReactNode
}) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'20px 24px', marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <span style={{ fontSize:28 }}>{icon}</span>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontWeight:800, fontSize:16 }}>{name}</span>
            {badge && (
              <span style={{ background:'rgba(245,166,35,.15)', color:'var(--gold)', border:'1px solid var(--gold-border)', borderRadius:4, fontSize:10, fontWeight:800, padding:'2px 6px', letterSpacing:'.5px' }}>{badge}</span>
            )}
          </div>
          <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>⏱ Deploy in ~{time}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function DeploymentGuide({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Guides</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Deployment</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          Ship your documentation to production. DevDocs works everywhere — Vercel, Netlify, Cloudflare Pages, Docker, or your own server.
        </p>

        {/* Platform picker */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10, marginBottom:36 }}>
          {[
            { icon:'▲', name:'Vercel',    anchor:'vercel' },
            { icon:'🌿', name:'Netlify',   anchor:'netlify' },
            { icon:'☁️', name:'Cloudflare',anchor:'cloudflare' },
            { icon:'🐳', name:'Docker',    anchor:'docker' },
            { icon:'🖥',  name:'Node',     anchor:'node-server' },
            { icon:'🔄', name:'CI / CD',   anchor:'cicd' },
          ].map(p => (
            <a key={p.name} href={`#${p.anchor}`} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:6,
              background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:'var(--r-lg)', padding:'14px 10px',
              textDecoration:'none', color:'var(--text1)',
              fontSize:13, fontWeight:600, transition:'border-color .15s',
            }}>
              <span style={{ fontSize:22 }}>{p.icon}</span>
              {p.name}
            </a>
          ))}
        </div>

        {/* ── Build step ── */}
        <h2 id="build">Before you deploy — build your docs</h2>
        <p>DevDocs generates a static site from your spec and config. Run the build command once before any deploy:</p>

        <CodeBlock language="bash" code={`devdocs build

# Output:
# ✅  OpenAPI spec loaded — 47 endpoints, 12 schemas
# ✅  Pages generated    — 24 docs pages
# ✅  SDKs generated     — TypeScript, Python, Go
# ✅  Search index built — 1,840 entries
# 📦  Output:  ./dist  (2.1 MB, 31 files)`} />

        <Callout kind="note">
          The <code>./dist</code> folder contains a pure static site — no server required. Drop it on any CDN or static host and you're done.
        </Callout>

        {/* ── Vercel ── */}
        <h2 id="vercel">Vercel</h2>

        <PlatformCard icon="▲" name="Vercel" time="2 min" badge="RECOMMENDED">
          <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.7, marginTop:0 }}>
            Zero config. Push to GitHub → Vercel builds and deploys automatically. Free tier is generous enough for most projects.
          </p>

          <CodeBlock filename="vercel.json" language="json" code={`{
  "buildCommand": "devdocs build",
  "outputDirectory": "dist",
  "framework": null
}`} />

          <CodeBlock filename="Deploy via CLI" language="bash" code={`npm install -g vercel
vercel --prod`} />

          <Callout kind="tip">
            Set <code>DEVDOCS_TOKEN</code> in Vercel's <strong>Environment Variables</strong> tab (Settings → Environment Variables). It's automatically available at build time.
          </Callout>
        </PlatformCard>

        {/* ── Netlify ── */}
        <h2 id="netlify">Netlify</h2>

        <PlatformCard icon="🌿" name="Netlify" time="3 min">
          <CodeBlock filename="netlify.toml" language="toml" code={`[build]
  command       = "devdocs build"
  publish       = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200`} />

          <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.7 }}>Push to your repo — Netlify picks up <code>netlify.toml</code> automatically. Or deploy manually:</p>

          <CodeBlock language="bash" code={`npm install -g netlify-cli
devdocs build
netlify deploy --prod --dir=dist`} />
        </PlatformCard>

        {/* ── Cloudflare ── */}
        <h2 id="cloudflare">Cloudflare Pages</h2>

        <PlatformCard icon="☁️" name="Cloudflare Pages" time="3 min">
          <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.7, marginTop:0 }}>
            Global CDN with 200+ edge locations. Great for performance-sensitive public docs.
          </p>

          <div style={{ background:'var(--bg2)', borderRadius:'var(--r-lg)', padding:'16px 18px', fontSize:13, color:'var(--text2)', lineHeight:1.8 }}>
            <strong style={{ color:'var(--text1)' }}>Dashboard setup:</strong><br />
            1. Go to <strong>Cloudflare Pages → Create a project</strong><br />
            2. Connect your GitHub/GitLab repo<br />
            3. Build command: <code>devdocs build</code><br />
            4. Output directory: <code>dist</code><br />
            5. Add <code>DEVDOCS_TOKEN</code> under <strong>Environment variables</strong><br />
            6. Click <strong>Save and Deploy</strong>
          </div>
        </PlatformCard>

        {/* ── Docker ── */}
        <h2 id="docker">Docker</h2>

        <PlatformCard icon="🐳" name="Docker" time="5 min">
          <CodeBlock filename="Dockerfile" language="dockerfile" code={`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx devdocs build

# Production — serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`} />

          <CodeBlock filename="nginx.conf" language="nginx" code={`server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets aggressively
  location ~* \\.(js|css|woff2|png|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}`} />

          <CodeBlock language="bash" code={`docker build -t my-docs .
docker run -p 8080:80 my-docs
# → http://localhost:8080`} />
        </PlatformCard>

        {/* ── Node server ── */}
        <h2 id="node-server">Node.js / Express</h2>

        <PlatformCard icon="🖥" name="Node.js server" time="5 min">
          <CodeBlock filename="serve.ts" language="TypeScript" code={`import express from 'express'
import path from 'node:path'

const app  = express()
const PORT = process.env.PORT ?? 4000
const DIST = path.join(import.meta.dirname, 'dist')

// Serve static assets
app.use(express.static(DIST, {
  maxAge: '1y',
  immutable: true,
  index: false,
}))

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'))
})

app.listen(PORT, () => console.log(\`Docs live at http://localhost:\${PORT}\`))`} />

          <CodeBlock language="bash" code={`devdocs build
node serve.js`} />
        </PlatformCard>

        {/* ── CI/CD ── */}
        <h2 id="cicd">CI / CD Integration</h2>

        <h3 id="github-actions">GitHub Actions</h3>

        <CodeBlock filename=".github/workflows/deploy.yml" language="yaml" code={`name: Deploy Docs

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Build DevDocs
        env:
          DEVDOCS_TOKEN: \${{ secrets.DEVDOCS_TOKEN }}
        run: npx devdocs build

      # Deploy to Vercel
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token \$VERCEL_TOKEN`} />

        <h3 id="gitlab-ci">GitLab CI</h3>

        <CodeBlock filename=".gitlab-ci.yml" language="yaml" code={`stages:
  - build
  - deploy

build-docs:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npx devdocs build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy-docs:
  stage: deploy
  script:
    - npx netlify-cli deploy --prod --dir=dist
  environment:
    name: production
    url: https://docs.myapi.io
  only:
    - main`} />

        <Callout kind="warning">
          Never store secrets (<code>DEVDOCS_TOKEN</code>, deployment tokens) in your repo. Always use your CI/CD platform's secrets/environment variables.
        </Callout>

        {/* ── Custom domains ── */}
        <h2 id="custom-domain">Custom domains</h2>

        <p>Once deployed, point your domain to the host by adding a CNAME record:</p>

        <div className="param-wrap">
          <table className="param-table">
            <thead>
              <tr>{['Platform','DNS type','Value'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                ['Vercel',    'CNAME', 'cname.vercel-dns.com'],
                ['Netlify',   'CNAME', 'your-site.netlify.app'],
                ['Cloudflare','CNAME', 'your-site.pages.dev (proxy on)'],
              ].map(([p,t,v]) => (
                <tr key={p as string}>
                  <td>{p}</td>
                  <td><code>{t}</code></td>
                  <td><code style={{ fontSize:11 }}>{v}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>Then update <code>devdocs.config.ts</code>:</p>

        <CodeBlock filename="devdocs.config.ts" language="TypeScript" code={`export default defineConfig({
  domain: 'docs.myapi.io',  // ← add this
  // ... rest of config
})`} />

        <h2 id="next">Next steps</h2>
        <ul>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-ci')}}>CI/CD Integration</a> — automated deploys on every push</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-custom')}}>Custom Domains</a> — full DNS walkthrough</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-sso')}}>SSO & Access Control</a> — private docs for teams</li>
        </ul>

      </div>
    </div>
  );
}
