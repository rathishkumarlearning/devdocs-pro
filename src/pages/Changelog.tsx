interface ChangelogEntry {
  version:  string;
  date:     string;
  tag:      'major' | 'minor' | 'patch';
  summary:  string;
  changes:  { kind: 'added' | 'improved' | 'fixed' | 'deprecated' | 'breaking'; text: string }[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    version: 'v3.0.0',
    date:    'February 2026',
    tag:     'major',
    summary: 'The biggest release yet — complete design system overhaul, real-time search, and full SDK regeneration pipeline.',
    changes: [
      { kind:'breaking',   text:'Removed legacy v1 REST endpoints — migrate to v3 API via the migration guide.' },
      { kind:'breaking',   text:'devdocs.config.js renamed to devdocs.config.ts — TypeScript-first from now on.' },
      { kind:'added',      text:'Golden Diamond design system — #f5a623 accent, dark-first with full light mode support.' },
      { kind:'added',      text:'Real-time search powered by a dedicated indexing pipeline (sub-50ms p95 latency).' },
      { kind:'added',      text:'SDK auto-generation for 12 languages from a single OpenAPI spec (TypeScript, Python, Go, Rust, Java, C#, Ruby, PHP, Swift, Kotlin, Dart, Elixir).' },
      { kind:'added',      text:'Changelog page (you\'re looking at it) — auto-generated from GitHub Releases.' },
      { kind:'added',      text:'Webhook delivery dashboard with retries, failure insights, and per-event replay.' },
      { kind:'improved',   text:'Build times down 60% — incremental compilation with module-level caching.' },
      { kind:'improved',   text:'Sidebar UX — collapsible sections, visual grouping, smooth animations.' },
      { kind:'improved',   text:'Mobile experience fully overhauled — 100/100 Lighthouse on mobile.' },
      { kind:'fixed',      text:'Code block tab state now persists across page navigations within the same session.' },
      { kind:'fixed',      text:'TOC active-section tracking works correctly on pages with sticky headers.' },
    ],
  },
  {
    version: 'v2.5.0',
    date:    'October 2025',
    tag:     'minor',
    summary: 'Versioning, SSO, and a dramatically improved CI/CD workflow — plus the first taste of custom theming.',
    changes: [
      { kind:'added',      text:'Multi-version docs — host v1 and v2 simultaneously with a version picker in the top nav.' },
      { kind:'added',      text:'SSO support via SAML 2.0 and OIDC — Azure AD, Okta, Google Workspace tested.' },
      { kind:'added',      text:'Custom domain support with automatic TLS provisioning via Let\'s Encrypt.' },
      { kind:'added',      text:'GitHub Actions integration — devdocs deploy now works natively in CI pipelines.' },
      { kind:'added',      text:'Per-page visibility rules — hide pages from public view without removing them.' },
      { kind:'improved',   text:'Search now includes code block content and parameter descriptions.' },
      { kind:'improved',   text:'Response preview blocks render with live syntax highlighting.' },
      { kind:'improved',   text:'CLI now shows a rich deploy summary with page count and live URL.' },
      { kind:'fixed',      text:'Resolved race condition in concurrent page builds affecting large specs.' },
      { kind:'fixed',      text:'Light mode colour contrast issues fixed across callout components.' },
      { kind:'deprecated', text:'devdocs publish command deprecated — use devdocs deploy instead.' },
    ],
  },
  {
    version: 'v2.0.0',
    date:    'April 2025',
    tag:     'major',
    summary: 'v2 launched DevDocs Pro as a hosted platform — moving from a static generator to a full documentation cloud.',
    changes: [
      { kind:'breaking',   text:'Local file-based config replaced by hosted project dashboard.' },
      { kind:'breaking',   text:'Custom CSS is now scoped per-project — global overrides require the new Theme API.' },
      { kind:'added',      text:'Hosted cloud platform — no more self-managed servers required.' },
      { kind:'added',      text:'Team management — invite collaborators with role-based access (Admin / Editor / Viewer).' },
      { kind:'added',      text:'Analytics dashboard — page views, search queries, and reader geography.' },
      { kind:'added',      text:'Callout components — Note, Tip, Warning, Danger — in Markdown and MDX.' },
      { kind:'added',      text:'Code block tabs — show npm / pnpm / yarn / bun alternatives side-by-side.' },
      { kind:'added',      text:'OpenAPI import wizard — paste a URL or upload a file, we handle the rest.' },
      { kind:'improved',   text:'Documentation rendering speed improved 4× vs v1 through streaming HTML.' },
      { kind:'improved',   text:'Parameter tables now auto-expand enum values inline.' },
      { kind:'fixed',      text:'$ref resolution now handles circular references without hanging the build.' },
      { kind:'fixed',      text:'Markdown tables render correctly on mobile viewports.' },
    ],
  },
];

const KIND_META: Record<ChangelogEntry['changes'][0]['kind'], { label:string; color:string; bg:string }> = {
  added:      { label:'Added',      color:'#34d399', bg:'rgba(16,185,129,.12)'  },
  improved:   { label:'Improved',   color:'#60a5fa', bg:'rgba(37,99,235,.12)'   },
  fixed:      { label:'Fixed',      color:'#a78bfa', bg:'rgba(139,92,246,.12)'  },
  deprecated: { label:'Deprecated', color:'var(--gold)', bg:'rgba(245,166,35,.12)' },
  breaking:   { label:'Breaking',   color:'#f87171', bg:'rgba(255,69,58,.12)'   },
};

const TAG_META: Record<ChangelogEntry['tag'], { label:string; color:string; bg:string; border:string }> = {
  major: { label:'Major',  color:'#f87171',      bg:'rgba(255,69,58,.12)',  border:'rgba(255,69,58,.3)'  },
  minor: { label:'Minor',  color:'var(--gold)',   bg:'var(--gold-dim)',      border:'var(--gold-border)'  },
  patch: { label:'Patch',  color:'#60a5fa',      bg:'rgba(37,99,235,.12)', border:'rgba(37,99,235,.25)' },
};

export default function Changelog({ onNavigate: _onNavigate }: { onNavigate:(id:string)=>void }) {
  return (
    <div className="animate-up">

      {/* ── Hero ── */}
      <div className="page-hero" style={{ marginBottom:36 }}>
        <div className="page-hero-tag">✦ Release Notes</div>
        <h1 style={{ background:'linear-gradient(135deg,var(--gold) 0%,#ffd27d 40%,var(--text) 80%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          Changelog
        </h1>
        <p>Every meaningful change to DevDocs Pro, in reverse chronological order. We follow <a href="https://semver.org" target="_blank" style={{ color:'var(--gold)' }}>Semantic Versioning</a>.</p>
      </div>

      {/* ── Entries ── */}
      <div className="changelog-list">
        {ENTRIES.map((entry, idx) => {
          const tag = TAG_META[entry.tag];
          const grouped = entry.changes.reduce<Record<string, typeof entry.changes>>((acc, c) => {
            if (!acc[c.kind]) acc[c.kind] = [];
            acc[c.kind].push(c);
            return acc;
          }, {});

          return (
            <div key={entry.version} className="changelog-entry animate-up" style={{ animationDelay:`${idx * 0.06}s` }}>
              {/* Timeline connector */}
              <div className="changelog-timeline">
                <div className="changelog-dot" style={{ background:entry.tag === 'major' ? 'var(--gold)' : entry.tag === 'minor' ? '#60a5fa' : '#a78bfa', boxShadow:`0 0 12px ${entry.tag === 'major' ? 'rgba(245,166,35,.5)' : 'rgba(37,99,235,.4)'}` }} />
                {idx < ENTRIES.length - 1 && <div className="changelog-line" />}
              </div>

              {/* Card */}
              <div className="changelog-card">
                {/* Header */}
                <div className="changelog-header">
                  <div className="changelog-version-badge" style={{ background:'linear-gradient(135deg,var(--gold),#e8890c)', color:'#000' }}>
                    {entry.version}
                  </div>
                  <span className="changelog-tag-badge" style={{ color:tag.color, background:tag.bg, border:`1px solid ${tag.border}` }}>
                    {tag.label}
                  </span>
                  <span className="changelog-date">{entry.date}</span>
                </div>

                <p className="changelog-summary">{entry.summary}</p>

                {/* Changes grouped by kind */}
                <div className="changelog-changes">
                  {(Object.keys(KIND_META) as Array<keyof typeof KIND_META>).map(kind => {
                    const items = grouped[kind];
                    if (!items || items.length === 0) return null;
                    const meta = KIND_META[kind];
                    return (
                      <div key={kind} className="changelog-group">
                        <div className="changelog-group-label" style={{ color:meta.color, background:meta.bg }}>
                          {meta.label}
                        </div>
                        <ul className="changelog-items">
                          {items.map((c, i) => (
                            <li key={i} className="changelog-item">
                              <span className="changelog-item-dot" style={{ background:meta.color }} />
                              {c.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="prose" style={{ marginTop:48, paddingTop:32, borderTop:'1px solid var(--border)' }}>
        <p style={{ fontSize:13, color:'var(--text3)', textAlign:'center' }}>
          For older releases, see the{' '}
          <a href="https://github.com/rathishkumarlearning/devdocs-pro/releases" target="_blank" style={{ color:'var(--gold)' }}>
            GitHub Releases page
          </a>
          . This changelog is maintained by the DevDocs Pro team.
        </p>
      </div>

    </div>
  );
}
