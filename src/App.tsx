import { useState, useEffect, useCallback, useRef } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Introduction from './pages/Introduction';
import Quickstart from './pages/Quickstart';
import ApiReference from './pages/ApiReference';
import { NAV } from './data/docs';
import { COPY } from './data/copy';

/* ── placeholder for unbuilt pages ──────────────────────────────── */
function ComingSoon({ id }: { id: string }) {
  const found = NAV.flatMap(s => s.items).find(i => i.id === id);
  return (
    <div className="animate-fadeUp" style={{ paddingTop:20 }}>
      <div style={{
        background:'var(--surface)', border:'1px solid var(--border)',
        borderRadius:20, padding:'60px 40px', textAlign:'center',
      }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
        <h2 style={{ fontSize:24, fontWeight:700, marginBottom:10 }}>{found?.label ?? id}</h2>
        <p style={{ color:'var(--text2)', fontSize:15, lineHeight:1.7 }}>
          This page is in progress.<br/>
          <strong style={{ color:'var(--accent)' }}>Kevin</strong> is designing it,{' '}
          <strong style={{ color:'var(--accent3)' }}>Sofia</strong> is writing the copy,{' '}
          and <strong style={{ color:'var(--success)' }}>Ethan</strong> ships it once both review.
        </p>
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:24, flexWrap:'wrap' }}>
          {['Kevin ✓ Design', 'Sofia ✓ Copy', 'Ethan → Build'].map((t,i) => (
            <span key={t} style={{
              padding:'5px 14px', borderRadius:980, fontSize:12, fontWeight:500,
              background: ['rgba(41,151,255,.1)','rgba(191,90,242,.1)','rgba(48,209,88,.1)'][i],
              color:       ['var(--accent)','var(--accent3)','var(--success)'][i],
              border:`1px solid ${['rgba(41,151,255,.2)','rgba(191,90,242,.2)','rgba(48,209,88,.2)'][i]}`,
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TOC ────────────────────────────────────────────────────────── */
const PAGE_TOC: Record<string, {id:string; label:string; level?:number}[]> = {
  introduction: [
    { id:'overview',       label:'Overview' },
    { id:'howitworks',     label:'How it works' },
    { id:'installation',   label:'Installation' },
    { id:'authentication', label:'Authentication' },
    { id:'firstcall',      label:'Your first API call' },
  ],
  quickstart: [
    { id:'step-1', label:'Step 1 — Install' },
    { id:'step-2', label:'Step 2 — Initialize' },
    { id:'step-3', label:'Step 3 — Preview' },
    { id:'step-4', label:'Step 4 — Deploy' },
  ],
  'api-overview': [
    { id:'base-url',     label:'Base URL' },
    { id:'auth',         label:'Authentication' },
    { id:'endpoints',    label:'Endpoints' },
    { id:'error-codes',  label:'Error codes' },
  ],
};

function TOC({ activePage }: { activePage: string }) {
  const [activeId, setActiveId] = useState('');
  const items = PAGE_TOC[activePage] ?? [];

  useEffect(() => {
    if (!items.length) return;
    const handler = () => {
      let found = '';
      items.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) found = id;
      });
      setActiveId(found);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [activePage]);

  if (!items.length) return null;

  return (
    <div style={{
      width:220, flexShrink:0, position:'sticky', top:'var(--nav-h)',
      height:'calc(100vh - var(--nav-h))', overflowY:'auto',
      padding:'32px 0 32px 16px',
    }}>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.09em', textTransform:'uppercase', color:'var(--text3)', marginBottom:12 }}>
        On this page
      </div>
      {items.map(({ id, label, level }) => (
        <a key={id} href={`#${id}`} style={{
          display:'block', fontSize:12, padding:`5px ${level === 3 ? '8px 5px 20px' : '8px'}`,
          borderRadius:6, marginBottom:1,
          borderLeft:`2px solid ${activeId === id ? 'var(--accent)' : 'transparent'}`,
          background: activeId === id ? 'rgba(41,151,255,.07)' : 'transparent',
          color: activeId === id ? 'var(--accent)' : 'var(--text3)',
          lineHeight:1.45, transition:'all .18s', textDecoration:'none',
        }}
          onMouseOver={e => { if (activeId!==id) { e.currentTarget.style.color='var(--text2)'; e.currentTarget.style.background='var(--bg3)'; }}}
          onMouseOut={e => { if (activeId!==id) { e.currentTarget.style.color='var(--text3)'; e.currentTarget.style.background='transparent'; }}}
        >{label}</a>
      ))}
    </div>
  );
}

/* ── BREADCRUMB helper ──────────────────────────────────────────── */
function Breadcrumb({ activePage }: { activePage: string }) {
  const section = NAV.find(s => s.items.some(i => i.id === activePage));
  const item    = NAV.flatMap(s => s.items).find(i => i.id === activePage);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text3)', marginBottom:28, flexWrap:'wrap' }}>
      {['Docs', section?.title ?? 'Overview', item?.label ?? activePage].map((crumb, i, arr) => (
        <span key={crumb} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color: i===arr.length-1 ? 'var(--text2)' : 'inherit' }}>{crumb}</span>
          {i < arr.length-1 && <span style={{ fontSize:10, opacity:.6 }}>›</span>}
        </span>
      ))}
    </div>
  );
}

/* ── APP ────────────────────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState('introduction');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [isDesktop, setIsDesktop]   = useState(window.innerWidth >= 1060);
  const [theme, setTheme]           = useState<'dark'|'light'>(
    () => (localStorage.getItem('theme') as 'dark'|'light') || 'dark'
  );
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1060);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const navigate = useCallback((id: string) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'introduction':  return <Introduction onNavigate={navigate} />;
      case 'quickstart':    return <Quickstart   onNavigate={navigate} />;
      case 'api-overview':  return <ApiReference onNavigate={navigate} />;
      default:              return <ComingSoon   id={activePage} />;
    }
  };

  return (
    <div data-theme={theme} style={{ minHeight:'100vh' }}>
      <TopNav
        onMenuClick={() => setMenuOpen(o => !o)}
        menuOpen={menuOpen}
        theme={theme}
        onThemeToggle={() => setTheme(t => t==='dark' ? 'light' : 'dark')}
        onSearch={() => {}}
      />

      <div style={{ display:'flex', paddingTop:'var(--nav-h)' }}>
        <Sidebar
          open={menuOpen}
          activePage={activePage}
          onNavigate={navigate}
          onClose={() => setMenuOpen(false)}
        />

        {/* spacer for fixed sidebar on desktop */}
        {isDesktop && <div style={{ width:'var(--sb-w)', flexShrink:0 }} />}

        {/* main content */}
        <main ref={mainRef} style={{ flex:1, minWidth:0 }}>
          <div style={{ maxWidth:760, margin:'0 auto', padding:'44px 24px 80px' }}>
            <Breadcrumb activePage={activePage} />
            {renderPage()}
          </div>
        </main>

        {/* right TOC — only on wide screens */}
        {isDesktop && window.innerWidth >= 1280 && <TOC activePage={activePage} />}
      </div>

      {/* footer */}
      <footer style={{
        background:'var(--bg2)', borderTop:'1px solid var(--border)',
        padding:'40px 24px', textAlign:'center',
        marginLeft: isDesktop ? 'var(--sb-w)' : 0,
      }}>
        <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>⚡ DevDocs Pro</div>
        <div style={{ fontSize:13, color:'var(--text3)' }}>{COPY.footer.tagline}</div>
        <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:16, flexWrap:'wrap' }}>
          {['GitHub','Changelog','Status','Privacy'].map(l => (
            <a key={l} href="#" style={{ fontSize:13, color:'var(--text3)', transition:'color .2s' }}
              onMouseOver={e => e.currentTarget.style.color='var(--accent)'}
              onMouseOut={e => e.currentTarget.style.color='var(--text3)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
