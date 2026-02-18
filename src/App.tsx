import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Introduction from './pages/Introduction';
import Quickstart from './pages/Quickstart';
import ApiReference from './pages/ApiReference';
import SearchModal from './components/SearchModal';
import { NAV } from './data/docs';
import { COPY } from './data/copy';

/* ── all pages ordered for prev/next ─────────────────────── */
const PAGE_ORDER = NAV.flatMap(s => s.items.map(i => i.id));

function getAdjacentPages(id: string) {
  const idx = PAGE_ORDER.indexOf(id);
  const prev = idx > 0 ? PAGE_ORDER[idx-1] : null;
  const next = idx < PAGE_ORDER.length-1 ? PAGE_ORDER[idx+1] : null;
  const label = (pid: string) => NAV.flatMap(s=>s.items).find(i=>i.id===pid)?.label ?? pid;
  return { prev, next, prevLabel: prev ? label(prev) : '', nextLabel: next ? label(next) : '' };
}

/* ── TOC data per page ───────────────────────────────────── */
const PAGE_TOC: Record<string, { id:string; label:string }[]> = {
  introduction: [
    { id:'overview',      label:'Overview' },
    { id:'howitworks',    label:'How it works' },
    { id:'installation',  label:'Installation' },
    { id:'authentication',label:'Authentication' },
    { id:'firstcall',     label:'First API call' },
    { id:'sdk-params',    label:'SDK parameters' },
    { id:'nextsteps',     label:'Next steps' },
  ],
  quickstart: [
    { id:'step-1', label:'Step 1 — Install' },
    { id:'step-2', label:'Step 2 — Initialize' },
    { id:'step-3', label:'Step 3 — Preview' },
    { id:'step-4', label:'Step 4 — Deploy' },
  ],
  'api-overview': [
    { id:'base-url',    label:'Base URL' },
    { id:'auth',        label:'Authentication' },
    { id:'endpoints',   label:'Endpoints' },
    { id:'error-codes', label:'Error codes' },
  ],
};

/* ── Coming soon placeholder ─────────────────────────────── */
function ComingSoon({ id }: { id:string }) {
  const item = NAV.flatMap(s=>s.items).find(i=>i.id===id);
  return (
    <div className="animate-up">
      <div style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-xl)', padding:'56px 36px', textAlign:'center', marginTop:20 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10, color:'var(--text)' }}>{item?.label ?? id}</h2>
        <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.7 }}>
          This page is in progress — all three of us are working on it.<br/>
          <strong style={{ color:'var(--gold)' }}>Kevin</strong> is designing,{' '}
          <strong style={{ color:'#a78bfa' }}>Sofia</strong> is writing,{' '}
          <strong style={{ color:'var(--green)' }}>Ethan</strong> ships when both approve.
        </p>
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:24, flexWrap:'wrap' }}>
          {[['Kevin ✓','rgba(245,166,35,.12)','var(--gold)'],
            ['Sofia ✓','rgba(139,92,246,.12)','#a78bfa'],
            ['Ethan →','rgba(16,185,129,.12)','var(--green)']
          ].map(([t,bg,c]) => (
            <span key={t} style={{ padding:'5px 14px', borderRadius:980, fontSize:12, fontWeight:600, background:bg, color:c, border:`1px solid ${c}33` }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TOC ─────────────────────────────────────────────────── */
function TOC({ activePage }: { activePage:string }) {
  const [activeId, setActiveId] = useState('');
  const items = PAGE_TOC[activePage] ?? [];

  useEffect(() => {
    if (!items.length) return;
    const handler = () => {
      let found = '';
      items.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) found = id;
      });
      setActiveId(found);
    };
    window.addEventListener('scroll', handler, { passive:true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [activePage]);

  if (!items.length) return <div style={{ width:210, flexShrink:0 }} />;

  return (
    <div className="toc" style={{ display:'none' }} ref={(el) => {
      if (el) el.style.display = window.innerWidth >= 1280 ? 'block' : 'none';
    }}>
      <div className="toc-title">On this page</div>
      {items.map(({ id, label }) => (
        <a key={id} href={`#${id}`} className={`toc-link${activeId===id?' active':''}`}>{label}</a>
      ))}
    </div>
  );
}

/* ── TopNav ──────────────────────────────────────────────── */
function TopNav({ menuOpen, onMenu, theme, onTheme, onSearchOpen }: { menuOpen:boolean; onMenu:()=>void; theme:string; onTheme:()=>void; onSearchOpen:()=>void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className="topnav" style={{ background: scrolled ? (theme==='dark' ? 'rgba(12,14,20,.97)' : 'rgba(248,249,252,.97)') : undefined }}>
      <button className={`nav-menu${menuOpen?' open':''}`} onClick={onMenu} aria-label="Menu">
        <span/><span/><span/>
      </button>
      <a href="/" className="nav-brand">
        <div className="nav-brand-icon">⬡</div>
        <span>DevDocs Pro</span>
      </a>
      <div style={{ width:1, height:20, background:'var(--border)', flexShrink:0, display:'none' }} className="nav-divider" />
      <div className="nav-search" style={{ display:'none', cursor:'pointer' }} id="navSearch" onClick={onSearchOpen}>
        <svg width="13" height="13" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Search docs…" readOnly style={{ cursor:'pointer' }} />
        <span style={{ fontSize:10, color:'var(--text3)', flexShrink:0, fontFamily:'JetBrains Mono,monospace' }}>⌘K</span>
      </div>
      <div className="nav-actions">
        <button className="nav-icon-btn" onClick={onTheme} title="Toggle theme">
          {theme==='dark' ? '🌙' : '☀️'}
        </button>
        <a href="https://github.com/rathishkumarlearning/devdocs-pro" target="_blank"
           className="nav-btn-primary" id="navCta" style={{ display:'none' }}>
          GitHub →
        </a>
      </div>
    </nav>
  );
}

/* ── BottomNav ───────────────────────────────────────────── */
function BottomNav({ activePage, onNavigate }: { activePage:string; onNavigate:(id:string)=>void }) {
  const { prev, next, prevLabel, nextLabel } = getAdjacentPages(activePage);
  return (
    <div className="bottom-nav">
      {prev ? (
        <button className="bottom-nav-btn" onClick={() => onNavigate(prev)}>
          <span className="bottom-nav-icon">←</span>
          <div><div className="label">Previous</div><div className="title">{prevLabel}</div></div>
        </button>
      ) : <div style={{ flex:1 }} />}
      {next ? (
        <button className="bottom-nav-btn next" onClick={() => onNavigate(next)}>
          <div><div className="label">Next</div><div className="title">{nextLabel}</div></div>
          <span className="bottom-nav-icon">→</span>
        </button>
      ) : <div style={{ flex:1 }} />}
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────────── */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) setPct(Math.min(100, (window.scrollY / total) * 100));
    };
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width:`${pct}%` }} />
    </div>
  );
}

/* ── Breadcrumb ──────────────────────────────────────────── */
function Breadcrumb({ activePage }: { activePage:string }) {
  const section = NAV.find(s => s.items.some(i => i.id===activePage));
  const item    = NAV.flatMap(s=>s.items).find(i=>i.id===activePage);
  return (
    <div className="breadcrumb">
      {['Docs', section?.title ?? '', item?.label ?? ''].filter(Boolean).map((c, i, arr) => (
        <span key={c} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color: i===arr.length-1 ? 'var(--text2)' : 'inherit' }}>{c}</span>
          {i < arr.length-1 && <span className="sep">›</span>}
        </span>
      ))}
    </div>
  );
}

/* ── APP ─────────────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState('introduction');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme]           = useState<'dark'|'light'>(() =>
    (localStorage.getItem('theme') as 'dark'|'light') || 'dark'
  );
  const [isDesktop, setIsDesktop]   = useState(window.innerWidth >= 1060);
  const isWide                      = window.innerWidth >= 1280;
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 1060);
    window.addEventListener('resize', h);
    // show/hide search and CTA based on width
    const applyWidth = () => {
      const s = document.getElementById('navSearch');
      const c = document.getElementById('navCta');
      if (s) s.style.display = window.innerWidth >= 600 ? 'flex' : 'none';
      if (c) c.style.display = window.innerWidth >= 900 ? 'flex' : 'none';
    };
    applyWidth();
    window.addEventListener('resize', applyWidth);
    return () => { window.removeEventListener('resize', h); window.removeEventListener('resize', applyWidth); };
  }, []);

  // ⌘K to open search
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o => !o); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const navigate = useCallback((id: string) => {
    setActivePage(id);
    window.scrollTo({ top:0, behavior:'smooth' });
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'introduction': return <Introduction onNavigate={navigate} />;
      case 'quickstart':   return <Quickstart   onNavigate={navigate} />;
      case 'api-overview': return <ApiReference onNavigate={navigate} />;
      default:             return <ComingSoon   id={activePage} />;
    }
  };

  const idx  = PAGE_ORDER.indexOf(activePage);
  const prog = Math.round(((idx + 1) / PAGE_ORDER.length) * 100);

  return (
    <div data-theme={theme}>
      {searchOpen && <SearchModal onNavigate={navigate} onClose={() => setSearchOpen(false)} />}
      <TopNav menuOpen={menuOpen} onMenu={() => setMenuOpen(o=>!o)} theme={theme} onTheme={() => setTheme(t=>t==='dark'?'light':'dark')} onSearchOpen={() => setSearchOpen(true)} />
      <ProgressBar />

      <div className="layout">
        {/* overlay */}
        <div className={`sidebar-overlay${menuOpen?' show':''}`} onClick={() => setMenuOpen(false)} />

        <Sidebar
          open={menuOpen || isDesktop}
          activePage={activePage}
          onNavigate={id => { navigate(id); setMenuOpen(false); }}
          onClose={() => setMenuOpen(false)}
        />

        {isDesktop && <div style={{ width:'var(--sb-w)', flexShrink:0 }} />}

        <main ref={mainRef} className="main">
          {/* course progress (educative style) */}
          <div style={{
            background:'var(--bg2)', borderBottom:'1px solid var(--border)',
            padding:'8px 20px', display:'flex', alignItems:'center', gap:12, fontSize:12, color:'var(--text3)',
          }}>
            <span>Course progress</span>
            <div style={{ flex:1, height:4, background:'var(--bg3)', borderRadius:2, maxWidth:200, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${prog}%`, background:'linear-gradient(90deg,var(--gold),#e8890c)', borderRadius:2, transition:'width .4s' }} />
            </div>
            <span style={{ color:'var(--gold)', fontWeight:600 }}>{prog}%</span>
            <span style={{ marginLeft:'auto' }}>{idx+1} of {PAGE_ORDER.length} pages</span>
          </div>

          <div className="content">
            <Breadcrumb activePage={activePage} />
            {renderPage()}
          </div>
        </main>

        {isWide && <TOC activePage={activePage} />}
      </div>

      <footer className="footer" style={{ marginLeft: isDesktop ? 'var(--sb-w)' : 0 }}>
        <div className="footer-logo">⬡ DevDocs Pro</div>
        <div className="footer-tagline">{COPY.footer.tagline}</div>
        <div className="footer-links">
          {['GitHub','Changelog','Status','Privacy','Terms'].map(l =>
            <a key={l} href="#">{l}</a>
          )}
        </div>
      </footer>

      <BottomNav activePage={activePage} onNavigate={navigate} />
    </div>
  );
}
