import { useState } from 'react'
import { Trash2, CalendarOff } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function UnblockBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 18px',
        background: hov ? '#b94040' : DARK,
        border: 'none', color: '#fff',
        fontSize: 12, fontWeight: 800,
        cursor: 'pointer',
        transition: 'background 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}
    >
      <Trash2 size={13} strokeWidth={2.2} />
      Débloquer
    </button>
  )
}

function formatDate(d) {
  if (!d) return null
  const date = new Date(d)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

// Try every possible field name the API could use
function getStartDate(bd) {
  return bd.start_date ?? bd.startDate ?? bd.date ?? bd.blocked_date ?? bd.from ?? bd.from_date ?? null
}
function getEndDate(bd) {
  return bd.end_date ?? bd.endDate ?? bd.to ?? bd.to_date ?? bd.until ?? null
}
function getReason(bd) {
  return bd.reason ?? bd.note ?? bd.description ?? bd.motif ?? null
}

export default function BlockedDateList({ blockedDates, handleUnblock }) {

  if (!blockedDates || blockedDates.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <CalendarOff size={36} color='#d8d0c8' strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#c8bfb4' }}>Aucune date bloquée</p>
        <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 600, color: '#d8d0c8' }}>Bloquez des dates pour les rendre indisponibles.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
        padding: '11px 20px', background: DARK, gap: 16,
      }}>
        {['Date de début', 'Date de fin', 'Raison', ''].map((h, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {blockedDates.map((bd, i) => {
        if (i === 0) console.log('🔍 RAW blocked date object:', JSON.stringify(bd, null, 2))
        const start  = formatDate(getStartDate(bd))
        const end    = formatDate(getEndDate(bd)) || start
        const reason = getReason(bd)
        return (
          <div key={bd.id ?? i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
            padding: '16px 20px',
            background: i % 2 === 0 ? '#fff' : '#faf8f5',
            borderBottom: '1px solid #ece6de',
            gap: 16, alignItems: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
              {start || <span style={{ color:'#c8bfb4', fontStyle:'italic', fontWeight:600 }}>Date inconnue</span>}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
              {end   || <span style={{ color:'#c8bfb4', fontStyle:'italic', fontWeight:600 }}>—</span>}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: reason ? GOLD : '#c8bfb4', fontStyle: reason ? 'normal' : 'italic' }}>
              {reason || 'Aucune raison'}
            </span>
            <UnblockBtn onClick={() => handleUnblock(bd.id)} />
          </div>
        )
      })}

    </div>
  )
}