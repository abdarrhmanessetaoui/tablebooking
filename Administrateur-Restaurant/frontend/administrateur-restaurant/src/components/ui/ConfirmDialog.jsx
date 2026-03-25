

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
      background: '#1a120b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>


      <div style={{
        background: '#fff', width: '100%', maxWidth: 400,
        border: `3px solid ${DARK}`,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: DARK, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
            {dialog.title || 'Confirmation'}
          </span>
          <button onClick={() => handle(false)} style={{
            background: 'none', border: `1px solid ${GOLD}`,
            padding: '4px 10px',
            fontSize: 10, fontWeight: 900,
            cursor: 'pointer', color: GOLD,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            fontFamily: 'inherit'
          }}>
            Fermer
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
        <div style={{ padding: '0 22px 20px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => handle(false)} style={{
            padding: '12px 24px', background: '#F5F5F5', border: 'none',
            fontSize: 12, fontWeight: 900, color: DARK,
            cursor: 'pointer', fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            Annuler
          </button>
          <button onClick={() => handle(true)} style={{
            padding: '12px 24px',
            background: isDanger ? '#FF0000' : DARK,
            border: 'none',
            fontSize: 12, fontWeight: 900,
            color: isDanger ? '#fff' : GOLD,
            cursor: 'pointer', fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            {dialog.confirmLabel || 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}