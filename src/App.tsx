import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Introduction from './pages/Introduction';
import Quickstart from './pages/Quickstart';
import ApiReference from './pages/ApiReference';
import Changelog from './pages/Changelog';
import Installation from './pages/Installation';
import Authentication from './pages/Authentication';
import SdkTypeScript from './pages/SdkTypeScript';
import DeploymentGuide from './pages/DeploymentGuide';
import Projects from './pages/Projects';
import PagesContent from './pages/PagesContent';
import Versioning from './pages/Versioning';
import SearchApiDocs from './pages/SearchApiDocs';
import SearchModal from './components/SearchModal';
import { NAV } from './data/docs';
import { COPY } from './data/copy';
import { api } from './services/api';

const PAGE_ORDER = NAV.flatMap(s => s.items.map(i => i.id));

function getAdjacentPages(id: string) {
  const idx = PAGE_ORDER.indexOf(id);
  const prev = idx > 0 ? PAGE_ORDER[idx-1] : null;
  const next = idx < PAGE_ORDER.length-1 ? PAGE_ORDER[idx+1] : null;
  const label = (pid: string) => NAV.flatMap(s=>s.items).find(i=>i.id===pid)?.label ?? pid;
  return { prev, next, prevLabel: prev?label(prev):'', nextLabel: next?label(next):'' };
}

const PAGE_TOC: Record<string, {id:string;label:string}[]> = {
  introduction: [
    { id:'overview',label:'Overview' },{ id:'howitworks',label:'How it works' },
    { id:'installation',label:'Installation' },{ id:'authentication',label:'Authentication' },
    { id:'firstcall',label:'First API call' },{ id:'sdk-params',label:'SDK parameters' },
    { id:'nextsteps',label:'Next steps' },
  ],
  changelog: [],
  quickstart:   [{ id:'step-1',label:'Step 1 — Install' },{ id:'step-2',label:'Step 2 — Initialize' },{ id:'step-3',label:'Step 3 — Preview' },{ id:'step-4',label:'Step 4 — Deploy' }],
  'api-overview': [{ id:'base-url',label:'Base URL' },{ id:'auth',label:'Authentication' },{ id:'endpoints',label:'Endpoints' },{ id:'error-codes',label:'Error codes' }],
  installation: [
    { id:'install-cli',label:'Install CLI' },{ id:'install-sdk',label:'Install SDK' },
    { id:'init-project',label:'Init project' },{ id:'config-file',label:'Config file' },
    { id:'local-preview',label:'Local preview' },{ id:'troubleshooting',label:'Troubleshooting' },
  ],
  authentication: [
    { id:'api-key',label:'API Key' },{ id:'token-scopes',label:'Token scopes' },
    { id:'oauth',label:'OAuth 2.0' },{ id:'oauth-code',label:'Auth Code + PKCE' },
    { id:'oauth-cc',label:'Client Credentials' },{ id:'sso',label:'SSO & SAML' },
    { id:'token-refresh',label:'Token refresh' },{ id:'auth-errors',label:'Error codes' },
  ],
  'sdk-ts': [
    { id:'installation',label:'Installation' },{ id:'init',label:'Initialisation' },
    { id:'projects',label:'Projects' },{ id:'pages',label:'Pages' },
    { id:'search',label:'Search' },{ id:'versioning',label:'Versioning' },
    { id:'webhooks',label:'Webhooks' },{ id:'errors',label:'Error handling' },
    { id:'pagination',label:'Pagination' },
  ],
  'guide-deploy': [
    { id:'build',label:'Build step' },{ id:'vercel',label:'Vercel' },
    { id:'netlify',label:'Netlify' },{ id:'cloudflare',label:'Cloudflare Pages' },
    { id:'docker',label:'Docker' },{ id:'node-server',label:'Node.js' },
    { id:'cicd',label:'CI / CD' },{ id:'custom-domain',label:'Custom domains' },
  ],
  projects: [
    { id:'what-is',  label:'What is a Project?' },
    { id:'create',   label:'Creating a Project' },
    { id:'config',   label:'devdocs.config.ts' },
    { id:'structure',label:'Project Structure' },
    { id:'members',  label:'Members & Roles' },
    { id:'api-keys', label:'API Keys' },
    { id:'delete',   label:'Deleting a Project' },
  ],
  pages: [
    { id:'anatomy',    label:'Anatomy of a Page' },
    { id:'frontmatter',label:'Frontmatter Reference' },
    { id:'components', label:'Built-in Components' },
    { id:'naming',     label:'File Naming & URLs' },
    { id:'assets',     label:'Images & Assets' },
    { id:'links',      label:'Linking Between Pages' },
    { id:'variables',  label:'Content Variables' },
    { id:'linting',    label:'Content Linting' },
  ],
  versioning: [
    { id:'how-it-works',   label:'How Versioning Works' },
    { id:'create-version', label:'Creating a Version' },
    { id:'urls',           label:'URL Structure' },
    { id:'inheritance',    label:'Page Inheritance' },
    { id:'deprecate',      label:'Archiving Versions' },
    { id:'switcher',       label:'Version Switcher UI' },
    { id:'api-cli',        label:'API & CLI' },
    { id:'best-practices', label:'Best Practices' },
  ],
  search: [
    { id:'how-it-works', label:'How Search Works' },
    { id:'quickstart',   label:'Quick Start' },
    { id:'response',     label:'Response Format' },
    { id:'parameters',   label:'Query Parameters' },
    { id:'autocomplete', label:'Autocomplete' },
    { id:'indexing',     label:'Controlling Indexing' },
    { id:'external',     label:'Using Algolia' },
    { id:'rate-limits',  label:'Rate Limits' },
    { id:'analytics',    label:'Search Analytics' },
  ],
};

function ComingSoon({ id }: { id:string }) {
  const item = NAV.flatMap(s=>s.items).find(i=>i.id===id);
  return (
    <div className="animate-up">
      <div style={{ background:'var(--surface)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-xl)', padding:'56px 36px', textAlign:'center', marginTop:20 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>{item?.label ?? id}</h2>
        <p style={{ color:'var(--text2)', fontSize:14, lineHeight:1.7 }}>
          This page is in progress — all three of us are on it.<br/>
          <strong style={{ color:'var(--gold)' }}>Kevin</strong> is designing · <strong style={{ color:'#a78bfa' }}>Sofia</strong> is writing · <strong style={{ color:'var(--green)' }}>Ethan</strong> ships when approved.
        </p>
      </div>
    </div>
  );
}

function TOC({ activePage }: { activePage:string }) {
  const [activeId, setActiveId] = useState('');
  const items = PAGE_TOC[activePage] ?? [];
  useEffect(() => {
    if (!items.length) return;
    const h = () => {
      let found = '';
      items.forEach(({ id }) => { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop-130) found = id; });
      setActiveId(found);
    };
    window.addEventListener('scroll', h, { passive:true }); h();
    return () => window.removeEventListener('scroll', h);
  }, [activePage]);
  if (!items.length) return null;
  return (
    <div className="toc">
      <div className="toc-title">On this page</div>
      {items.map(({ id, label }) => (
        <a key={id} href={`#${id}`} className={`toc-link${activeId===id?' active':''}`}>{label}</a>
      ))}
    </div>
  );
}

function Breadcrumb({ activePage }: { activePage:string }) {
  const section = NAV.find(s=>s.items.some(i=>i.id===activePage));
  const item    = NAV.flatMap(s=>s.items).find(i=>i.id===activePage);
  return (
    <div className="breadcrumb">
      {['Docs', section?.title??'', item?.label??''].filter(Boolean).map((c, i, arr) => (
        <span key={c} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color: i===arr.length-1?'var(--text2)':'inherit' }}>{c}</span>
          {i<arr.length-1 && <span className="sep">›</span>}
        </span>
      ))}
    </div>
  );
}

function BottomNav({ activePage, onNavigate }: { activePage:string; onNavigate:(id:string)=>void }) {
  const { prev, next, prevLabel, nextLabel } = getAdjacentPages(activePage);
  return (
    <div className="bottom-nav">
      {prev
        ? <button className="bottom-nav-btn" onClick={() => onNavigate(prev)}>
            <span className="bottom-nav-icon">←</span>
            <div><div className="label">Previous</div><div className="title">{prevLabel}</div></div>
          </button>
        : <div style={{ flex:1 }} />}
      {next
        ? <button className="bottom-nav-btn next" onClick={() => onNavigate(next)}>
            <div><div className="label">Next</div><div className="title">{nextLabel}</div></div>
            <span className="bottom-nav-icon">→</span>
          </button>
        : <div style={{ flex:1 }} />}
    </div>
  );
}

function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => { const t = document.body.scrollHeight-window.innerHeight; if (t>0) setPct(Math.min(100,(window.scrollY/t)*100)); };
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>;
}

export default function App() {
  const [activePage, setActivePage] = useState('introduction');
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [apiOnline,  setApiOnline]  = useState<boolean|null>(null);
  const [isDesktop,  setIsDesktop]  = useState(window.innerWidth >= 1060);
  const [theme, setTheme]           = useState<'dark'|'light'>(() =>
    (localStorage.getItem('theme') as 'dark'|'light') || 'dark'
  );
  const mainRef = useRef<HTMLElement>(null);

  // Check backend health
  useEffect(() => {
    api.health().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, []);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o=>!o); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 1060);
    window.addEventListener('resize', h);
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

  const navigate = useCallback((id: string) => {
    setActivePage(id);
    window.scrollTo({ top:0, behavior:'smooth' });
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'introduction':  return <Introduction    onNavigate={navigate} />;
      case 'quickstart':    return <Quickstart      onNavigate={navigate} />;
      case 'api-overview':  return <ApiReference    onNavigate={navigate} />;
      case 'changelog':     return <Changelog       onNavigate={navigate} />;
      case 'installation':  return <Installation    onNavigate={navigate} />;
      case 'authentication':return <Authentication  onNavigate={navigate} />;
      case 'sdk-ts':        return <SdkTypeScript   onNavigate={navigate} />;
      case 'guide-deploy':  return <DeploymentGuide onNavigate={navigate} />;
      case 'projects':      return <Projects         onNavigate={navigate} />;
      case 'pages':         return <PagesContent     onNavigate={navigate} />;
      case 'versioning':    return <Versioning       onNavigate={navigate} />;
      case 'search':        return <SearchApiDocs    onNavigate={navigate} />;
      default:              return <ComingSoon        id={activePage} />;
    }
  };

  const idx  = PAGE_ORDER.indexOf(activePage);
  const prog = Math.round(((idx+1) / PAGE_ORDER.length) * 100);
  const isWide = window.innerWidth >= 1280;

  return (
    <div data-theme={theme}>

      {/* ── Top Nav ── */}
      <nav className="topnav">
        <button className={`nav-menu${menuOpen?' open':''}`} onClick={() => setMenuOpen(o=>!o)}>
          <span/><span/><span/>
        </button>
        <a href="/" className="nav-brand">
          <div className="nav-brand-icon">⬡</div>
          <span>DevDocs Pro</span>
        </a>
        <div style={{ width:1, height:20, background:'var(--border)', flexShrink:0, margin:'0 4px' }} />

        {/* Clickable search bar → opens modal */}
        <button onClick={() => setSearchOpen(true)} className="nav-search" id="navSearch" style={{ cursor:'text', textAlign:'left' }}>
          <svg width="13" height="13" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span style={{ flex:1, fontSize:13, color:'var(--text3)', fontWeight:500 }}>Search docs…</span>
          <div style={{ display:'flex', gap:3 }}>
            {['⌘','K'].map(k => <span key={k} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:4, padding:'1px 5px', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'var(--text3)' }}>{k}</span>)}
          </div>
        </button>

        <div className="nav-actions">
          {/* API status indicator */}
          {apiOnline !== null && (
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color: apiOnline ? 'var(--green)' : '#ff453a', background: apiOnline ? 'rgba(16,185,129,.1)' : 'rgba(255,69,58,.1)', border:`1px solid ${apiOnline ? 'rgba(16,185,129,.25)' : 'rgba(255,69,58,.25)'}`, borderRadius:980, padding:'4px 10px', flexShrink:0 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background: apiOnline ? 'var(--green)' : '#ff453a', animation: apiOnline ? 'pulse 2s infinite' : 'none' }} />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>API {apiOnline ? 'Live' : 'Offline'}</span>
            </div>
          )}
          <button className="nav-icon-btn" onClick={() => setTheme(t => t==='dark'?'light':'dark')}>
            {theme==='dark' ? '🌙' : '☀️'}
          </button>
          <a href="https://github.com/rathishkumarlearning/devdocs-pro" target="_blank"
             className="nav-btn-primary" id="navCta" style={{ display:'none' }}>
            GitHub →
          </a>
        </div>
      </nav>

      <ProgressBar />

      <div className="layout">
        <div className={`sidebar-overlay${menuOpen?' show':''}`} onClick={() => setMenuOpen(false)} />

        <Sidebar
          open={menuOpen || isDesktop}
          activePage={activePage}
          onNavigate={id => { navigate(id); setMenuOpen(false); }}
          onClose={() => setMenuOpen(false)}
        />

        {isDesktop && <div style={{ width:'var(--sb-w)', flexShrink:0 }} />}

        <main ref={mainRef} className="main">
          {/* Educative-style course progress strip */}
          <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'8px 20px', display:'flex', alignItems:'center', gap:12, fontSize:12, color:'var(--text3)', flexWrap:'wrap' }}>
            <span style={{ flexShrink:0 }}>Progress</span>
            <div style={{ flex:1, height:4, background:'var(--bg3)', borderRadius:2, maxWidth:180, minWidth:60, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${prog}%`, background:'linear-gradient(90deg,var(--gold),#e8890c)', borderRadius:2, transition:'width .4s' }} />
            </div>
            <span style={{ color:'var(--gold)', fontWeight:700, flexShrink:0 }}>{prog}%</span>
            <span style={{ marginLeft:'auto', flexShrink:0 }}>Page {idx+1} of {PAGE_ORDER.length}</span>
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
          {['GitHub','Changelog','Status','Privacy','Terms'].map(l => <a key={l} href="#">{l}</a>)}
        </div>
      </footer>

      <BottomNav activePage={activePage} onNavigate={navigate} />

      {/* ⌘K Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={id => { navigate(id); setSearchOpen(false); }} />

    </div>
  );
}
