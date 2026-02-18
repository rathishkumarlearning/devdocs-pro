type Kind = 'note' | 'tip' | 'warning' | 'danger';

const cfg: Record<Kind, { icon:string; label:string }> = {
  note:    { icon:'💡', label:'Note'    },
  tip:     { icon:'✅', label:'Tip'     },
  warning: { icon:'⚠️', label:'Warning' },
  danger:  { icon:'🚨', label:'Danger'  },
};

export default function Callout({ kind, children }: { kind:Kind; children:React.ReactNode }) {
  const c = cfg[kind];
  return (
    <div className={`callout callout-${kind}`}>
      <span className="callout-icon">{c.icon}</span>
      <div className="callout-body">
        <strong>{c.label}</strong>
        {children}
      </div>
    </div>
  );
}
