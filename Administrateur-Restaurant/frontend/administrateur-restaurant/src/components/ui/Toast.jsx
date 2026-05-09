import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react'
import {
  DARK, LIGHT_BROWN, WHITE, BORDER, RADIUS, DARK_LIGHT, AMBER, GREEN, RED
} from '../../styles/dashboard/tokens'

const TYPES = {
  success: { bg: GREEN, color: WHITE },
  error:   { bg: RED,   color: WHITE },
  warning: { bg: AMBER, color: WHITE },
  info:    { bg: DARK,  color: WHITE },
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
        @keyframes toastIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @media (max-width: 600px) { .toast-item { width: calc(100vw - 48px) !important; } }
      `}</style>
      {toasts.map(t => {
        const cfg = TYPES[t.type] || TYPES.info
        return (
          <div key={t.id} className="toast-item" style={{
            pointerEvents: 'all',
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            background: cfg.bg,
            border: 'none',
            borderRadius: RADIUS.sm,
            minWidth: 240, maxWidth: 380,
            animation: 'toastIn 0.22s ease',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: cfg.color, lineHeight: 1.4 }}>
              {t.message}
            </span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 2, display: 'flex', flexShrink: 0,
                color: cfg.color, opacity: 0.8,
              }}
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
