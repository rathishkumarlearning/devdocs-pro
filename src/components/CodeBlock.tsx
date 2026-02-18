import { useState } from 'react';

interface Tab { label: string; code: string; }
interface Props {
  filename?: string;
  language?: string;
  code?: string;
  tabs?: Tab[];
}

function highlight(code: string) {
  const escaped = code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return escaped
    .replace(/(\/\/[^\n]*|#[^\n]*)/g,    '<span style="color:#5c6370;font-style:italic">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#a6e3a1">$1</span>')
    .replace(/\b(import|export|from|const|let|var|function|return|await|async|new|class|if|else|for|while|of|in|true|false|null|undefined|type|interface|extends|default)\b/g, '<span style="color:#cba6f7">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g,     '<span style="color:#fab387">$1</span>')
    .replace(/(\w+)(?=\()/g,             '<span style="color:#89dceb">$1</span>');
}

export default function CodeBlock({ filename, language, code, tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied]       = useState(false);
  const current = tabs ? tabs[activeTab].code : (code ?? '');

  const copy = () => {
    navigator.clipboard.writeText(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="codeblock">
      {/* header */}
      <div className="codeblock-head">
        <div className="cb-dots">
          {['#ff5f57','#febc2e','#28c840'].map(c =>
            <div key={c} className="cb-dot" style={{ background:c }} />
          )}
        </div>
        {filename && <span className="cb-filename">{filename}</span>}
        {language && <span className="cb-lang" style={{ marginLeft: filename ? 0 : 'auto' }}>{language}</span>}
        <button className="cb-copy" onClick={copy} style={{ marginLeft:'auto' }}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>

      {/* tabs */}
      {tabs && (
        <div className="cb-tabs">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              className={`cb-tab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >{t.label}</button>
          ))}
        </div>
      )}

      {/* code */}
      <pre dangerouslySetInnerHTML={{ __html: highlight(current) }} />
    </div>
  );
}
