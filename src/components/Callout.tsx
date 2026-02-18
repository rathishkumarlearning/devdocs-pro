type Kind = 'note' | 'tip' | 'warning' | 'danger';

const config: Record<Kind, { icon: string; title: string; bg: string; border: string; }> = {
  note:    { icon:'💡', title:'Note',    bg:'rgba(41,151,255,.06)',   border:'rgba(41,151,255,.2)' },
  tip:     { icon:'✅', title:'Tip',     bg:'rgba(48,209,88,.06)',    border:'rgba(48,209,88,.2)' },
  warning: { icon:'⚠️', title:'Warning', bg:'rgba(255,214,10,.06)',   border:'rgba(255,214,10,.2)' },
  danger:  { icon:'🚨', title:'Danger',  bg:'rgba(255,69,58,.06)',    border:'rgba(255,69,58,.2)' },
};

interface Props { kind: Kind; children: React.ReactNode; }

export default function Callout({ kind, children }: Props) {
  const c = config[kind];
  return (
    <div style={{
      display:'flex', gap:14, padding:'16px 20px', borderRadius: 10,
      margin:'20px 0', border:`1px solid ${c.border}`,
      background: c.bg,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
      <div style={{ fontSize: 14, lineHeight: 1.65, color:'rgba(255,255,255,.7)' }}>
        <strong style={{ display:'block', marginBottom: 4, fontSize: 11, fontWeight: 700, letterSpacing:'.06em', textTransform:'uppercase' }}>
          {c.title}
        </strong>
        {children}
      </div>
    </div>
  );
}
