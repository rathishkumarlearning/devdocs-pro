import { useState } from 'react';

interface Tab { label: string; code: string; }
interface Props {
  filename?: string;
  language?: string;
  code?: string;
  tabs?: Tab[];
}

function tokenize(code: string): string {
  return code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(\/\/.*$)/gm, '<span style="color:#636366;font-style:italic">$1</span>')
    .replace(/(#.*$)/gm, '<span style="color:#636366;font-style:italic">$1</span>')
    .replace(/'([^']*)'/g, '<span style="color:#a6e3a1">\'$1\'</span>')
    .replace(/"([^"]*)"/g, '<span style="color:#a6e3a1">"$1"</span>')
    .replace(/`([^`]*)`/g, '<span style="color:#a6e3a1">`$1`</span>')
    .replace(/\b(import|export|from|const|let|var|function|return|await|async|new|class|if|else|for|while|of|in|true|false|null|undefined|type|interface|extends)\b/g,
      '<span style="color:#cba6f7">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#fab387">$1</span>')
    .replace(/(\w+)(?=\()/g, '<span style="color:#89dceb">$1</span>');
}

export default function CodeBlock({ filename, language, code, tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentCode = tabs ? tabs[activeTab].code : (code ?? '');

  const copy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#1c1c24',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 12, overflow: 'hidden', margin: '20px 0',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(255,255,255,.03)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        {filename && <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize: 11, color:'rgba(255,255,255,.3)' }}>{filename}</span>}
        <div style={{ display:'flex', alignItems:'center', gap: 10, marginLeft: 'auto' }}>
          {language && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color:'rgba(41,151,255,.7)' }}>{language}</span>}
          <button onClick={copy} style={{
            fontSize: 11, fontWeight: 500, padding:'4px 12px', borderRadius: 980,
            background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.5)',
            border:'1px solid rgba(255,255,255,.08)', cursor:'pointer',
            fontFamily:'Inter,sans-serif', transition:'all .2s',
          }}>{copied ? 'Copied ✓' : 'Copy'}</button>
        </div>
      </div>

      {/* tabs */}
      {tabs && (
        <div style={{
          display:'flex', background:'rgba(255,255,255,.02)',
          borderBottom:'1px solid rgba(255,255,255,.07)',
          overflowX:'auto',
        }}>
          {tabs.map((t, i) => (
            <button key={t.label} onClick={() => setActiveTab(i)} style={{
              padding:'8px 16px', fontSize: 12, fontWeight: 500,
              color: activeTab === i ? '#2997ff' : 'rgba(255,255,255,.4)',
              borderBottom: activeTab === i ? '2px solid #2997ff' : '2px solid transparent',
              marginBottom: -1, background:'none', border:'none',
              cursor:'pointer', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap', flexShrink: 0,
              transition:'all .2s',
            }}>{t.label}</button>
          ))}
        </div>
      )}

      {/* code */}
      <pre style={{
        padding:'20px', overflowX:'auto',
        fontFamily:'JetBrains Mono,monospace', fontSize: 13, lineHeight: 1.9,
        color:'#cdd6f4', WebkitOverflowScrolling:'touch',
      }} dangerouslySetInnerHTML={{ __html: tokenize(currentCode) }} />
    </div>
  );
}
