import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

export default function Authentication({ onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">
      <div className="prose">

        <div className="page-hero-tag">⬡ Getting Started</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Authentication</h1>
        <p style={{ color:'var(--text2)', fontSize:15, marginTop:0, marginBottom:32 }}>
          Every DevDocs API request must be authenticated. We support API keys, OAuth 2.0, and SSO — pick what fits your stack.
        </p>

        {/* Auth method cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:32 }}>
          {[
            { icon:'🔑', label:'API Key',  desc:'Fastest. Great for CI/CD and server-side.', rec:true },
            { icon:'🔐', label:'OAuth 2.0',desc:'Best for user-facing apps.', rec:false },
            { icon:'🏢', label:'SSO / SAML',desc:'Enterprise teams & private portals.', rec:false },
          ].map(m => (
            <div key={m.label} style={{
              background:'var(--surface)',
              border: m.rec ? '1px solid var(--gold)' : '1px solid var(--border)',
              borderRadius:'var(--r-lg)',
              padding:'18px 16px',
              position:'relative',
            }}>
              {m.rec && (
                <div style={{ position:'absolute', top:10, right:12, background:'var(--gold)', color:'#000', fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:4, letterSpacing:'.5px' }}>RECOMMENDED</div>
              )}
              <div style={{ fontSize:22, marginBottom:8 }}>{m.icon}</div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{m.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)', lineHeight:1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* ── API Key ── */}
        <h2 id="api-key">API Key (Bearer token)</h2>
        <p>Generate your token from the <strong>Settings → API Keys</strong> section of the dashboard. Tokens are scoped to a workspace and can be restricted by IP, expiry, and permission level.</p>

        <CodeBlock filename="curl" language="bash" code={`curl https://api.devdocs.io/v3/projects \\
  -H "Authorization: Bearer $DEVDOCS_TOKEN"`} />

        <CodeBlock filename="TypeScript SDK" language="TypeScript" code={`import { DevDocs } from '@devdocs/sdk'

const client = new DevDocs({ token: process.env.DEVDOCS_TOKEN })

const projects = await client.projects.list()
console.log(projects.data)`} />

        <Callout kind="tip">
          Store tokens in environment variables — never hardcode them. On Vercel use <strong>Environment Variables</strong>, on GitHub Actions use <strong>Secrets</strong>.
        </Callout>

        {/* Token scopes table */}
        <h3 id="token-scopes">Token scopes</h3>
        <p>When creating a token you can restrict it to specific permissions:</p>

        <div className="param-wrap">
          <table className="param-table">
            <thead>
              <tr>{['Scope','Allows','Typical use'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                ['read',        'GET all resources',              'Public read-only integrations'],
                ['write',       'POST / PATCH resources',         'CI/CD publishing pipelines'],
                ['admin',       'Full access including deletion', 'Workspace admin scripts'],
                ['search:read', 'Search API only',               'Embedded search widgets'],
                ['webhooks',    'Manage webhook subscriptions',  'Event-driven pipelines'],
              ].map(([sc,al,use]) => (
                <tr key={sc as string}>
                  <td><code>{sc}</code></td>
                  <td style={{ color:'var(--text2)' }}>{al}</td>
                  <td style={{ color:'var(--text2)' }}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── OAuth 2.0 ── */}
        <h2 id="oauth">OAuth 2.0</h2>
        <p>Use OAuth when building integrations that act on behalf of users. We support the <strong>Authorization Code</strong> flow (with PKCE) and <strong>Client Credentials</strong> for machine-to-machine.</p>

        <h3 id="oauth-code">Authorization Code + PKCE</h3>

        <CodeBlock filename="step-1-redirect.ts" language="TypeScript" code={`import crypto from 'node:crypto'

const verifier  = crypto.randomBytes(32).toString('base64url')
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')

const authUrl = new URL('https://auth.devdocs.io/oauth/authorize')
authUrl.searchParams.set('client_id',             'YOUR_CLIENT_ID')
authUrl.searchParams.set('redirect_uri',          'https://your-app.io/callback')
authUrl.searchParams.set('response_type',         'code')
authUrl.searchParams.set('scope',                 'read write')
authUrl.searchParams.set('code_challenge',        challenge)
authUrl.searchParams.set('code_challenge_method', 'S256')

// Redirect user → authUrl.toString()`} />

        <CodeBlock filename="step-2-exchange.ts" language="TypeScript" code={`// Exchange the code for a token
const res = await fetch('https://auth.devdocs.io/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type:    'authorization_code',
    client_id:     'YOUR_CLIENT_ID',
    redirect_uri:  'https://your-app.io/callback',
    code:          callbackCode,
    code_verifier: verifier,
  }),
})

const { access_token, refresh_token, expires_in } = await res.json()
// → use access_token as Bearer token`} />

        <h3 id="oauth-cc">Client Credentials (machine-to-machine)</h3>

        <CodeBlock filename="m2m.ts" language="TypeScript" code={`const res = await fetch('https://auth.devdocs.io/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type:    'client_credentials',
    client_id:     process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    scope:         'read write',
  }),
})

const { access_token } = await res.json()
const client = new DevDocs({ token: access_token })`} />

        {/* ── SSO ── */}
        <h2 id="sso">SSO & SAML (Enterprise)</h2>
        <p>Enterprise plans support SAML 2.0 and OIDC single sign-on. Users authenticate via your identity provider (Okta, Azure AD, Google Workspace) and are mapped to DevDocs workspaces automatically.</p>

        <div style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'20px 24px' }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>📋 SSO Setup Checklist</div>
          <ul style={{ margin:0, paddingLeft:20, color:'var(--text2)', fontSize:14, lineHeight:2 }}>
            <li>Contact <a href="mailto:enterprise@devdocs.io">enterprise@devdocs.io</a> to enable SSO on your plan</li>
            <li>Provide your IdP metadata URL (SAML) or discovery URL (OIDC)</li>
            <li>Configure the DevDocs ACS URL in your identity provider</li>
            <li>Map IdP groups to DevDocs roles (<code>admin</code>, <code>editor</code>, <code>viewer</code>)</li>
            <li>Test with a non-admin account before enabling org-wide</li>
          </ul>
        </div>

        <Callout kind="warning">
          SAML assertions must be signed. Unsigned responses are rejected by default. Ensure your IdP is configured to sign both the response and the assertion.
        </Callout>

        {/* ── Token refresh ── */}
        <h2 id="token-refresh">Token refresh</h2>
        <p>OAuth access tokens expire in 1 hour. Use the refresh token to get a new one without re-authentication:</p>

        <CodeBlock filename="refresh.ts" language="TypeScript" code={`const res = await fetch('https://auth.devdocs.io/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type:    'refresh_token',
    client_id:     process.env.CLIENT_ID!,
    refresh_token: storedRefreshToken,
  }),
})

const { access_token, refresh_token } = await res.json()
// Store new tokens — refresh tokens rotate on each use`} />

        {/* ── Error codes ── */}
        <h2 id="auth-errors">Auth error codes</h2>

        <div className="param-wrap">
          <table className="param-table">
            <thead>
              <tr>{['Code','Meaning','Fix'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                ['401','Missing or invalid Bearer token','Pass a valid token in the Authorization header'],
                ['403','Insufficient scope','Re-generate your token with the required scope(s)'],
                ['401 invalid_grant','Refresh token expired or used','Restart the OAuth flow to get a fresh refresh token'],
                ['429','Rate limit on auth endpoint','Implement exponential backoff — max 10 req/min on /oauth/token'],
              ].map(([c,m,f]) => (
                <tr key={c as string}>
                  <td><code>{c}</code></td>
                  <td style={{ color:'var(--text2)' }}>{m}</td>
                  <td style={{ color:'var(--text2)' }}>{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="next">Next steps</h2>
        <ul>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('api-overview')}}>API Reference</a> — explore all endpoints</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('sdk-ts')}}>TypeScript SDK</a> — typed client with built-in auth</li>
          <li><a href="#" onClick={e=>{e.preventDefault();onNavigate('guide-sso')}}>SSO & Access Control</a> — team and enterprise setup</li>
        </ul>

      </div>
    </div>
  );
}
