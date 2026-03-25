import { useState, useEffect, useCallback } from 'react'


const TYPES = {
  success: { bg: '#00A651', border: '#00A651', color: '#fff' },
  error:   { bg: '#FF0000', border: '#FF0000', color: '#fff' },
  warning: { bg: '#c8a97e', border: '#c8a97e', color: '#fff' },
  info:    { bg: '#2b2118', border: '#2b2118', color: '#fff' },
}

let _addToast = null

export function toast(message, type = 'success', duration = 3000) {
  if (_addToast) _addToast({ message, type, duration, id: Date.now() + Math.random() })
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const add = useCallback((t) => {
    setToasts(prev => [...prev, t])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), t.duration)
  }, [])

  useEffect(() => {
    _addToast = add
    return () => { _addToast = null }
  }, [add])

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      <style>{`
        @media (max-width: 600px) { .toast-item { width: calc(100vw - 48px) !important; } }
      `}</style>
      {toasts.map(t => {
        const cfg  = TYPES[t.type] || TYPES.info
        return (
          <div key={t.id} className="toast-item" style={{
            pointerEvents: 'all',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            minWidth: 280, maxWidth: 380,
            fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
          }}>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 900, color: cfg.color, lineHeight: 1.4 }}>
              {t.message}
            </span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{
                background: 'none', border: `1px solid ${cfg.color}`, cursor: 'pointer',
                padding: '4px 8px', display: 'flex', flexShrink: 0,
                color: cfg.color, fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
            >
              OK
            </button>
          </div>
        )
      })}
    </div>
  )
}