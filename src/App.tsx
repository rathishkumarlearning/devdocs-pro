import { useState, useEffect, useCallback } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Introduction from './pages/Introduction';
import { NAV } from './data/docs';

// placeholder for pages not yet built
function ComingSoon({ id }: { id: string }) {
  const section = NAV.flatMap(s => s.items).find(i => i.id === id);
  return (
    <div className="animate-fadeUp" style={{ paddingTop: 20 }}>
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:16, padding:'60px 40px', textAlign:'center',
      }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
        <h2 style={{ fontSize:24, fontWeight:700, marginBottom:8 }}>{section?.label ?? id}</h2>
        <p style={{ color:'var(--text2)', fontSize:15 }}>
          This page is being built by the Command Center.<br/>
          <strong style={{ color:'var(--accent)' }}>@Kevinsureshbot</strong> &amp; <strong style={{ color:'var(--accent3)' }}>@Sofiasureshbot</strong> are working on it now.
        </p>
      </div>
    </div>
  );
}

function TOC({ activePage }: { activePage: string }) {
  const [activeId, setActiveId] = useState('');
  const headings = activePage === 'introduction'
    ? ['overview','howitworks','installation','authentication','firstcall']
    : [];

  useEffect(() => {
    const handler = () => {
      let found = '';
      headings.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) found = id;
      });
      setActiveId(found);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [activePage]);

  if (!headings.length) return null;
  const labels: Record<string,string> = {
    overview:'Overview', howitworks:'How it works', installation:'Installation',
    authentication:'Authentication', firstcall:'Your first API call',
  };
  return (
    <div style={{
      width:220, flexShrink:0,
      position:'sticky', top:'var(--nav-h)',
      height:'calc(100vh - var(--nav-h))',
      overflowY:'auto', padding:'32px 16px 32px 8px',
    }}>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.09em', textTransform:'uppercase', color:'var(--text3)', marginBottom:12, paddingLeft:8 }}>
        On this page
      </div>
      {headings.map(id => (
        <a key={id} href={`#${id}`} style={{
          display:'block', fontSize:12, padding:'5px 8px', borderRadius:5,
          borderLeft:`2px solid ${activeId === id ? 'var(--accent)' : 'transparent'}`,
          background: activeId === id ? 'rgba(41,151,255,.06)' : 'transparent',
          color: activeId === id ? 'var(--accent)' : 'var(--text3)',
          lineHeight:1.4, transition:'all .18s', textDecoration:'none',
        }}
          onMouseOver={e => { if (activeId !== id) { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg3)'; }}}
          onMouseOut={e => { if (activeId !== id) { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent'; }}}
        >{labels[id]}</a>
      ))}
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('introduction');
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark'|'light'>(() =>
    (localStorage.getItem('theme') as 'dark'|'light') || 'dark'
  );
  const [, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() =>
    setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  const navigate = useCallback((id: string) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div data-theme={theme}>
      <TopNav
        onMenuClick={() => setMenuOpen(o => !o)}
        menuOpen={menuOpen}
        theme={theme}
        onThemeToggle={toggleTheme}
        onSearch={setQuery}
      />

      <div style={{ display:'flex', paddingTop:'var(--nav-h)', minHeight:'100vh' }}>
        <Sidebar
          open={menuOpen}
          activePage={activePage}
          onNavigate={navigate}
          onClose={() => setMenuOpen(false)}
        />

        {/* main */}
        <main style={{
          flex:1, minWidth:0,
          marginLeft: window.innerWidth >= 1060 ? 'var(--sb-w)' : 0,
        }}>
          <div style={{ maxWidth:780, margin:'0 auto', padding:'48px 24px 80px' }}>
            {/* breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text3)', marginBottom:28, flexWrap:'wrap' }}>
              {['Docs', 'Getting Started', NAV.flatMap(s=>s.items).find(i=>i.id===activePage)?.label ?? activePage]
                .map((crumb, i, arr) => (
                  <span key={crumb} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ color: i === arr.length-1 ? 'var(--text2)' : 'var(--text3)' }}>{crumb}</span>
                    {i < arr.length-1 && <span style={{ fontSize:10 }}>›</span>}
                  </span>
                ))}
            </div>

            {activePage === 'introduction'
              ? <Introduction onNavigate={navigate} />
              : <ComingSoon id={activePage} />
            }
          </div>
        </main>

        {/* TOC — desktop only */}
        <div style={{ display: window.innerWidth >= 1280 ? 'block' : 'none' }}>
          <TOC activePage={activePage} />
        </div>
      </div>
    </div>
  );
}
