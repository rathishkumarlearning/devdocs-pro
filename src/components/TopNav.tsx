import { useState, useEffect } from 'react';

interface Props {
  onMenuClick: () => void;
  menuOpen: boolean;
  theme: string;
  onThemeToggle: () => void;
  onSearch: (q: string) => void;
}

export default function TopNav({ onMenuClick, menuOpen, theme, onThemeToggle, onSearch }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      height: 'var(--nav-h)',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 18px',
      background: scrolled ? 'rgba(10,10,15,.95)' : 'rgba(10,10,15,.75)',
      backdropFilter: 'saturate(180%) blur(22px)',
      WebkitBackdropFilter: 'saturate(180%) blur(22px)',
      borderBottom: '1px solid var(--border)',
      transition: 'background .3s',
    }}>
      {/* hamburger */}
      <button onClick={onMenuClick} style={{
        width: 34, height: 34, borderRadius: 8, background: 'transparent',
        border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4,
        cursor: 'pointer', flexShrink: 0, transition: 'background .2s',
      }}
        onMouseOver={e => (e.currentTarget.style.background = 'var(--bg3)')}
        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: 'block', width: 14, height: 1.5,
            background: 'var(--text2)', borderRadius: 2,
            transition: 'all .3s',
            transform: menuOpen
              ? i === 0 ? 'translateY(5.5px) rotate(45deg)'
              : i === 2 ? 'translateY(-5.5px) rotate(-45deg)' : 'scaleX(0)'
              : 'none',
            opacity: menuOpen && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      {/* logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>⚡</div>
        <span style={{
          fontWeight: 700, fontSize: 15, letterSpacing: '-.02em',
          background: 'linear-gradient(90deg, var(--text) 0%, var(--text2) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>DevDocs Pro</span>
      </a>

      {/* divider */}
      <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />

      {/* version */}
      <span style={{
        fontSize: 11, fontWeight: 500,
        background: 'rgba(41,151,255,.12)', color: 'var(--accent)',
        border: '1px solid rgba(41,151,255,.25)',
        borderRadius: 980, padding: '3px 10px', flexShrink: 0,
        display: window.innerWidth < 640 ? 'none' : 'flex',
      }}>v3.0</span>

      {/* search */}
      <div style={{
        flex: 1, maxWidth: 440,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '7px 12px', cursor: 'text',
      }}>
        <svg width="14" height="14" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search docs…"
          onChange={e => onSearch(e.target.value)}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            font: '500 13px/1 Inter, sans-serif', color: 'var(--text)', minWidth: 0,
          }}
        />
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {['⌘','K'].map(k => (
            <span key={k} style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '1px 5px',
              font: '500 10px/1.4 JetBrains Mono, monospace', color: 'var(--text3)',
            }}>{k}</span>
          ))}
        </div>
      </div>

      {/* right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <button onClick={onThemeToggle} style={{
          width: 32, height: 32, borderRadius: 8, background: 'transparent',
          border: '1px solid var(--border)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          transition: 'all .2s',
        }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <a href="https://github.com/rathishkumarlearning/devdocs-pro" target="_blank" style={{
          fontSize: 12, fontWeight: 600,
          background: 'var(--accent)', color: '#fff',
          borderRadius: 980, padding: '7px 16px',
          display: window.innerWidth < 900 ? 'none' : 'flex',
          transition: 'all .2s',
        }}>Get started</a>
      </div>
    </nav>
  );
}
