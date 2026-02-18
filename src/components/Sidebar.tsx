import { useState } from 'react';
import { NAV } from '../data/docs';

interface Props {
  open: boolean;
  activePage: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

export default function Sidebar({ open, activePage, onNavigate, onClose }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) =>
    setCollapsed(c => ({ ...c, [title]: !c[title] }));

  const handleNav = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 1060) onClose();
  };

  return (
    <>
      {/* overlay */}
      {open && window.innerWidth < 1060 && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 399,
          background: 'rgba(0,0,0,.6)',
          backdropFilter: 'blur(4px)',
        }} />
      )}

      {/* sidebar */}
      <aside style={{
        width: 'var(--sb-w)', flexShrink: 0,
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--border)',
        position: 'fixed', top: 'var(--nav-h)', left: 0, bottom: 0,
        overflowY: 'auto', overflowX: 'hidden',
        padding: '20px 10px 40px',
        transform: open || window.innerWidth >= 1060 ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .28s cubic-bezier(.16,1,.3,1)',
        zIndex: 400,
        scrollbarWidth: 'thin',
      }}>
        {NAV.map(section => (
          <div key={section.title} style={{ marginBottom: 6 }}>
            {/* section header */}
            <button
              onClick={() => toggle(section.title)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 10px', borderRadius: 7,
                background: 'none', border: 'none', cursor: 'pointer',
                font: '600 11px/1 Inter, sans-serif',
                letterSpacing: '.08em', textTransform: 'uppercase',
                color: 'var(--text3)', transition: 'all .2s',
              }}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'none'; }}
            >
              {section.title}
              <svg
                width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                style={{ transition: 'transform .2s', transform: collapsed[section.title] ? 'rotate(-90deg)' : 'none', flexShrink: 0 }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {/* items */}
            {!collapsed[section.title] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 4 }}>
                {section.items.map(item => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 10px', borderRadius: 7, width: '100%',
                        background: isActive ? 'rgba(41,151,255,.1)' : 'none',
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        font: `${isActive ? 500 : 450} 13px/1 Inter, sans-serif`,
                        color: isActive ? 'var(--accent)' : 'var(--text2)',
                        transition: 'all .18s',
                        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      }}
                      onMouseOver={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg3)'; }}}
                      onMouseOut={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'none'; }}}
                    >
                      {item.label}
                      {item.badge && (
                        <span style={{
                          marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                          padding: '2px 7px', borderRadius: 980,
                          background: item.badge === 'new' ? 'rgba(41,151,255,.15)' : 'rgba(191,90,242,.15)',
                          color: item.badge === 'new' ? 'var(--accent)' : 'var(--accent3)',
                        }}>{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </aside>
    </>
  );
}
