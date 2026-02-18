import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import type { SearchResult } from '../services/api';

interface Props {
  onNavigate: (id: string) => void;
  onClose: () => void;
}

export default function SearchModal({ onNavigate, onClose }: Props) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive]   = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.search(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [query]);

  // keyboard nav
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a+1, results.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a-1, 0)); }
    if (e.key === 'Enter' && results[active]) {
      onNavigate(results[active].id);
      onClose();
    }
    if (e.key === 'Escape') onClose();
  }, [results, active, onNavigate, onClose]);

  const SECTION_COLOR: Record<string, string> = {
    'Getting Started': 'var(--gold)',
    'API Reference':   'var(--blue-light)',
    'SDKs':            'var(--green)',
    'Guides':          '#a78bfa',
  };

  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:700,
        background:'rgba(0,0,0,.72)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'80px 20px 20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width:'100%', maxWidth:580,
        background:'var(--surface)', borderRadius:'var(--r-xl)',
        border:'1px solid var(--gold-border)',
        overflow:'hidden',
        boxShadow:'var(--shadow-lg), var(--glow-gold)',
        animation:'fadeUp .2s cubic-bezier(.16,1,.3,1) both',
      }}>
        {/* search input */}
        <div style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'14px 18px',
          borderBottom:'1px solid var(--border)',
        }}>
          <svg width="16" height="16" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={handleKey}
            placeholder="Search documentation…"
            style={{
              flex:1, background:'none', border:'none', outline:'none',
              font:'500 15px/1 Inter, sans-serif', color:'var(--text)',
            }}
          />
          {loading && <div style={{ width:14, height:14, border:'2px solid var(--gold)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .6s linear infinite' }} />}
          <kbd style={{
            background:'var(--bg3)', border:'1px solid var(--border)',
            borderRadius:6, padding:'2px 7px', fontSize:11,
            fontFamily:'JetBrains Mono,monospace', color:'var(--text3)',
            cursor:'pointer',
          }} onClick={onClose}>Esc</kbd>
        </div>

        {/* results */}
        <div style={{ maxHeight:360, overflowY:'auto' }}>
          {results.length > 0 ? results.map((r, i) => (
            <button
              key={r.id}
              onClick={() => { onNavigate(r.id); onClose(); }}
              style={{
                width:'100%', display:'flex', alignItems:'flex-start', gap:12,
                padding:'13px 18px', background: i===active ? 'var(--bg3)' : 'transparent',
                border:'none', cursor:'pointer', textAlign:'left',
                borderBottom:'1px solid var(--border)', transition:'background .15s',
              }}
              onMouseOver={() => setActive(i)}
            >
              <div style={{
                width:32, height:32, borderRadius:8, flex:'0 0 32px',
                background:'var(--gold-dim)', border:'1px solid var(--gold-border)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, color:'var(--gold)',
              }}>📄</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:650, color:'var(--text)', marginBottom:3 }}>{r.title}</div>
                <div style={{ fontSize:12, color:'var(--text3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.description}</div>
              </div>
              <span style={{
                fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:980, flexShrink:0, alignSelf:'center',
                color: SECTION_COLOR[r.section] ?? 'var(--text3)',
                background: 'var(--bg3)', border:`1px solid ${SECTION_COLOR[r.section] ?? 'var(--border)'}33`,
              }}>{r.section}</span>
            </button>
          )) : query ? (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--text3)', fontSize:14 }}>
              No results for "<strong style={{ color:'var(--text2)' }}>{query}</strong>"
            </div>
          ) : (
            <div style={{ padding:'24px 20px' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:10 }}>Quick links</div>
              {['introduction','quickstart','api-overview','sdk-ts'].map(id => {
                const label: Record<string,string> = { introduction:'Introduction', quickstart:'Quickstart', 'api-overview':'API Reference', 'sdk-ts':'TypeScript SDK' };
                return (
                  <button key={id} onClick={() => { onNavigate(id); onClose(); }} style={{
                    width:'100%', display:'flex', alignItems:'center', gap:10,
                    padding:'9px 10px', borderRadius:8, background:'none', border:'none',
                    cursor:'pointer', textAlign:'left', transition:'background .15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background='var(--bg3)'}
                    onMouseOut={e => e.currentTarget.style.background='none'}
                  >
                    <span style={{ color:'var(--gold)', fontSize:13 }}>→</span>
                    <span style={{ fontSize:13, color:'var(--text2)' }}>{label[id]}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{
          display:'flex', alignItems:'center', gap:16, padding:'10px 18px',
          borderTop:'1px solid var(--border)', background:'var(--bg3)',
          fontSize:11, color:'var(--text3)',
        }}>
          {[['↑↓','Navigate'],['↵','Select'],['Esc','Close']].map(([k, a]) => (
            <span key={a} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <kbd style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:4, padding:'1px 6px', fontFamily:'JetBrains Mono,monospace', fontSize:11 }}>{k}</kbd>
              {a}
            </span>
          ))}
          <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4 }}>
            Powered by <strong style={{ color:'var(--gold)' }}>Sofia's API</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
