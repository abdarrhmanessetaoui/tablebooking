import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const TYPES = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', icon: CheckCircle, dot: '#16a34a' },
  error:   { bg: '#fef2f2', border: '#fecaca', color: '#991b1b', icon: XCircle,     dot: '#dc2626' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: AlertCircle, dot: '#c8a97e' },
  info:    { bg: '#fdf6ec', border: '#e8d8b0', color: '#a8834e', icon: AlertCircle, dot: '#c8a97e' },
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
            border: `1.5px solid ${cfg.border}`,
            borderLeft: `4px solid ${cfg.dot}`,
            boxShadow: '0 4px 20px rgba(43,33,24,0.12)',
            minWidth: 280, maxWidth: 380,
            animation: 'toastIn 0.22s ease',
            fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
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