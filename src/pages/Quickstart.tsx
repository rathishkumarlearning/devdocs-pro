import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function Quickstart({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent)', marginBottom:12 }}>
          Getting Started
        </p>
        <h1 style={{ fontSize:'clamp(28px,4vw,40px)', fontWeight:800, letterSpacing:'-.03em', lineHeight:1.1, marginBottom:14 }}>
          Ship docs in 3 minutes.
        </h1>
        <p style={{ fontSize:16, color:'var(--text2)', lineHeight:1.65, maxWidth:560 }}>
          From zero to a fully interactive, searchable API portal — faster than a standup meeting.
        </p>
      </div>

      <Callout kind="tip">
        Already have an OpenAPI spec? Jump straight to Step 2. You're basically done.
      </Callout>

      {/* Step 1 */}
      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Step 1 — Install
      </h2>
      <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.75, marginBottom:16 }}>
        Install the CLI globally and the SDK as a project dependency.
      </p>
      <CodeBlock tabs={[
        { label:'npm',  code:'npm install -g @devdocs/cli\nnpm install @devdocs/sdk' },
        { label:'pnpm', code:'pnpm add -g @devdocs/cli\npnpm add @devdocs/sdk' },
        { label:'yarn', code:'yarn global add @devdocs/cli\nyarn add @devdocs/sdk' },
        { label:'bun',  code:'bun add -g @devdocs/cli\nbun add @devdocs/sdk' },
      ]} />

      {/* Step 2 */}
      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Step 2 — Initialize
      </h2>
      <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.75, marginBottom:16 }}>
        Run <code style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'.85em', background:'var(--code)', color:'var(--accent3)', padding:'2px 6px', borderRadius:5 }}>devdocs init</code> in your project root. It auto-detects your spec file.
      </p>
      <CodeBlock filename="terminal" code={`devdocs init --token sk_live_your_token_here

# Output:
✓ Found openapi.yaml
✓ Project created: my-api-docs (proj_abc123)
✓ Config written to devdocs.config.ts
→ Run devdocs dev to preview locally`} />

      <CodeBlock filename="devdocs.config.ts" language="TypeScript" code={`import { defineConfig } from '@devdocs/sdk'

export default defineConfig({
  project: 'proj_abc123',
  spec: './openapi.yaml',       // or a remote URL
  title: 'My API Docs',
  theme: 'dark',                // 'dark' | 'light' | 'auto'
  // customDomain: 'docs.myapp.com',
})`} />

      {/* Step 3 */}
      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Step 3 — Preview locally
      </h2>
      <CodeBlock filename="terminal" code={`devdocs dev

# Your docs are live at http://localhost:3000
✓ Watching for spec changes…`} />

      {/* Step 4 */}
      <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.02em', color:'var(--text)', margin:'40px 0 14px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
        Step 4 — Deploy
      </h2>
      <CodeBlock filename="terminal" code={`devdocs deploy --prod

✓ Building docs…
✓ Optimizing assets…
✓ Deployed to https://docs.yourapp.com
↗ 24 pages · 1.2MB · 340ms build time`} />

      <Callout kind="note">
        Need CI/CD? Add <code style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'.85em', background:'var(--code)', color:'var(--accent3)', padding:'2px 6px', borderRadius:5 }}>devdocs deploy --prod</code> to your GitHub Actions workflow. See the{' '}
        <a href="#" style={{ color:'var(--accent)', textDecoration:'underline', textUnderlineOffset:3 }}>CI/CD integration guide →</a>
      </Callout>

      {/* prev/next */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:64, paddingTop:32, borderTop:'1px solid var(--border)' }}>
        <button onClick={() => onNavigate('introduction')} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 18px', cursor:'pointer', textAlign:'left', outline:'none', transition:'all .2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--border-h)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
        >
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:500, marginBottom:5 }}>← Previous</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Introduction</div>
        </button>
        <button onClick={() => onNavigate('installation')} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 18px', cursor:'pointer', textAlign:'right', outline:'none', transition:'all .2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--border-h)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
        >
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:500, marginBottom:5 }}>Next →</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>Installation</div>
        </button>
      </div>
    </div>
  );
}
