import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { DARK, LIGHT_BROWN } from './constants'

export default function Section({ icon: Icon, title, action, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ background: '#fff', border: `4px solid ${DARK}`, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '12px 16px',
          background: DARK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          {Icon && <Icon size={14} strokeWidth={2.5} color={LIGHT_BROWN} style={{ flexShrink: 0 }} />}
          <span style={{
            fontSize: 11,
            fontWeight: 900,
            color: LIGHT_BROWN,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
          {open
            ? <ChevronUp size={14} strokeWidth={2.5} color={LIGHT_BROWN} />
            : <ChevronDown size={14} strokeWidth={2.5} color={LIGHT_BROWN} />
          }
        </div>
      </div>
      {open && <div style={{ padding: 'clamp(16px,3vw,28px)' }}>{children}</div>}
    </div>
  )
}
