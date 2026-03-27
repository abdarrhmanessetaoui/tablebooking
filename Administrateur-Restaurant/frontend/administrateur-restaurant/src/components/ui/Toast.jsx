import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const TYPES = {
  success: { bg: '#ffffff', border: '#16A34A', color: '#16A34A', icon: CheckCircle, dot: '#16A34A' },
  error:   { bg: '#ffffff', border: '#DC2626', color: '#DC2626', icon: XCircle,     dot: '#DC2626' },
  warning: { bg: '#ffffff', border: '#C8A97E', color: '#a8834e', icon: AlertCircle, dot: '#C8A97E' },
  info:    { bg: '#ffffff', border: '#C8A97E', color: '#a8834e', icon: AlertCircle, dot: '#C8A97E' },
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
        @keyframes toastIn { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
        @media (max-width: 600px) { .toast-item { width: calc(100vw - 48px) !important; } }
      `}</style>
      {toasts.map(t => {
        const cfg  = TYPES[t.type] || TYPES.info
        const Icon = cfg.icon
        return (
          <div key={t.id} className="toast-item" style={{
            pointerEvents: 'all',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: cfg.bg,
            border: `4px solid ${cfg.border}`,
            borderLeft: `6px solid ${cfg.dot}`,
            boxShadow: '0 4px 20px rgba(66,52,40,0.12)',
            minWidth: 280, maxWidth: 380,
            animation: 'toastIn 0.22s ease',
            fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
          }}>
            <Icon size={15} color={cfg.dot} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: cfg.color, lineHeight: 1.4 }}>
              {t.message}
            </span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 2, display: 'flex', flexShrink: 0,
                color: cfg.color, opacity: 0.5,
              }}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
