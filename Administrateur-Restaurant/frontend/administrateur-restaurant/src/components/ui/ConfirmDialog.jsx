import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DARK, LIGHT_BROWN, WHITE, BORDER, RADIUS, DARK_LIGHT
} from '../../styles/dashboard/tokens'

let _show = null
export function confirm(options) {
  return new Promise(resolve => {
    if (_show) _show({ ...options, resolve })
  })
}

export default function ConfirmDialog() {
  const { t } = useTranslation()
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
      background: 'rgba(66,52,40,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      animation: 'fadeIn 0.15s ease',
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div style={{
        background: WHITE, width: '100%', maxWidth: 400,
        borderRadius: RADIUS.sm,
        border: `1px solid ${BORDER}`,
        animation: 'popIn 0.18s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isDanger
              ? <Trash2 size={16} color="#DC2626" strokeWidth={2.5} />
              : <AlertCircle size={16} color={LIGHT_BROWN} strokeWidth={2.5} />
            }
            <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>
              {dialog.title || t('confirmation')}
            </span>
          </div>
          <button onClick={() => handle(false)} style={{
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: DARK_LIGHT,
          }}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '0 24px 24px' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: DARK_LIGHT, lineHeight: 1.6 }}>
            {dialog.message}
          </p>
          {dialog.sub && (
            <p style={{ margin: '8px 0 0', fontSize: 12, fontWeight: 500, color: DARK_LIGHT, opacity: 0.7 }}>
              {dialog.sub}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => handle(false)} style={{
            padding: '10px 16px', background: WHITE, border: `1px solid ${BORDER}`,
            borderRadius: RADIUS.sm,
            fontSize: 13, fontWeight: 600, color: DARK,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {dialog.cancelLabel || t('cancel_btn')}
          </button>
          <button onClick={() => handle(true)} style={{
            padding: '10px 16px',
            background: isDanger ? '#DC2626' : DARK,
            border: 'none',
            borderRadius: RADIUS.sm,
            fontSize: 13, fontWeight: 600,
            color: WHITE,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {dialog.confirmLabel || t('confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}
