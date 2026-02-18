import { useState } from 'react';
import { NAV } from '../data/docs';

interface Props { open:boolean; activePage:string; onNavigate:(id:string)=>void; onClose:()=>void; }

export default function Sidebar({ open, activePage, onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string,boolean>>({});

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      {/* brand repeat for mobile */}
      <div style={{ display:'flex', alignItems:'center', gap:9, padding:'4px 4px 16px', borderBottom:'1px solid var(--border)', marginBottom:12 }}>
        <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,var(--gold),#e8890c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, boxShadow:'var(--glow-gold)' }}>⬡</div>
        <span style={{ fontWeight:800, fontSize:14, letterSpacing:'-.02em' }}>DevDocs Pro</span>
        <span style={{ marginLeft:'auto', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:980, background:'var(--gold-dim)', color:'var(--gold)', border:'1px solid var(--gold-border)' }}>v3.0</span>
      </div>

      {NAV.map(section => (
        <div key={section.title} style={{ marginBottom:4 }}>
          <button
            className={`sb-section-btn${collapsed[section.title] ? ' collapsed' : ''}`}
            onClick={() => setCollapsed(c => ({ ...c, [section.title]: !c[section.title] }))}
          >
            {section.title}
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {!collapsed[section.title] && (
            <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:4 }}>
              {section.items.map(item => {
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={`sb-item${active ? ' active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <div className="sb-dot" />
                    {item.label}
                    {item.badge && (
                      <span className={`sb-item-badge badge-${item.badge}`}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* bottom help card */}
      <div style={{ margin:'20px 4px 0', background:'var(--gold-dim)', border:'1px solid var(--gold-border)', borderRadius:12, padding:'14px 14px' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--gold)', marginBottom:4 }}>Need help?</div>
        <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5, marginBottom:10 }}>Join 50K developers in our community.</div>
        <a href="https://github.com/rathishkumarlearning/devdocs-pro" target="_blank" style={{ display:'block', fontSize:12, fontWeight:600, color:'#000', background:'linear-gradient(135deg,var(--gold),#e8890c)', borderRadius:980, padding:'6px 14px', textAlign:'center', transition:'all .2s' }}>
          GitHub →
        </a>
      </div>
    </aside>
  );
}
