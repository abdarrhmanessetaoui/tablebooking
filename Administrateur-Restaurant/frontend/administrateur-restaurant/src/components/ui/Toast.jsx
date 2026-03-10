import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Trash2, X } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

let _show = null
export function confirm(options) {
  return new Promise(resolve => {
    if (_show) _show({ ...options, resolve })
  })
}

export default function ConfirmDialog() {
  const [dialog, setDialog] = useState(null)

  const show = useCallback((d) => setDialog(d), [])
  useEffect(() => { _show = show; return () => { _show = null } }, [show])

  if (!dialog) return null

  const isDanger = dialog.type === 'danger'

  function handle(result) {
    dialog.resolve(result)
    setDialog(null)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(43,33,24,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      animation: 'fadeIn 0.15s ease',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} } @keyframes popIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }`}</style>

      <div style={{
        background: '#fff', width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px rgba(43,33,24,0.2)',
        animation: 'popIn 0.18s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: DARK, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isDanger
              ? <Trash2 size={16} color="#f87171" strokeWidth={2.5} />
              : <AlertCircle size={16} color={GOLD} strokeWidth={2.5} />
            }
            <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
              {dialog.title || 'Confirmation'}
            </span>
          </div>
          <button onClick={() => handle(false)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
          }}>
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 22px 18px' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: DARK, lineHeight: 1.6 }}>
            {dialog.message}
          </p>
          {dialog.sub && (
            <p style={{ margin: '8px 0 0', fontSize: 12, fontWeight: 600, color: '#aaa' }}>
              {dialog.sub}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 22px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => handle(false)} style={{
            padding: '10px 20px', background: '#f5f0eb', border: 'none',
            fontSize: 13, fontWeight: 800, color: DARK,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#ede5d8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f5f0eb'}
          >
            Annuler
          </button>
          <button onClick={() => handle(true)} style={{
            padding: '10px 20px',
            background: isDanger ? '#b94040' : DARK,
            border: 'none',
            fontSize: 13, fontWeight: 800,
            color: isDanger ? '#fff' : GOLD,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = isDanger ? '#991b1b' : '#3d2d1e'}
            onMouseLeave={e => e.currentTarget.style.background = isDanger ? '#b94040' : DARK}
          >
            {dialog.confirmLabel || 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}