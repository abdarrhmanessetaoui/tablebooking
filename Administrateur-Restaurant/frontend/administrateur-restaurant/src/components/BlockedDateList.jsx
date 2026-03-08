import { useState } from 'react'
import { Trash2, CalendarOff } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function UnblockBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px',
        background: hov ? '#b94040' : DARK,
        border: 'none', color: '#fff',
        fontSize: 13, fontWeight: 800,
        cursor: 'pointer',
        transition: 'background 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}>
      <Trash2 size={14} strokeWidth={2.2} />
      Débloquer
    </button>
  )
}

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
}

export default function BlockedDateList({ blockedDates, handleUnblock }) {
  if (!blockedDates || blockedDates.length === 0) {
    return (
      <div style={{ padding:'64px 0', textAlign:'center' }}>
        <CalendarOff size={44} color='#d8d0c8' strokeWidth={1.5} style={{ display:'block', margin:'0 auto 18px' }} />
        <p style={{ margin:0, fontSize:17, fontWeight:900, color:'#c8bfb4' }}>Aucune date bloquée</p>
        <p style={{ margin:'6px 0 0', fontSize:13, fontWeight:600, color:'#d8d0c8' }}>
          Bloquez des dates pour les rendre indisponibles aux clients.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr auto',
        padding:'13px 24px', background:DARK,
      }}>
        <span style={{ fontSize:10, fontWeight:900, color:GOLD, letterSpacing:'0.2em', textTransform:'uppercase' }}>
          Date bloquée
        </span>
        <span style={{ fontSize:10, fontWeight:900, color:GOLD, letterSpacing:'0.2em', textTransform:'uppercase' }}>
          Action
        </span>
      </div>

      {/* Rows */}
      {blockedDates.map((d, i) => (
        <div key={d.date ?? i} style={{
          display:'grid', gridTemplateColumns:'1fr auto',
          padding:'20px 24px',
          background: i % 2 === 0 ? '#fff' : '#faf8f5',
          borderBottom:'1px solid #ece6de',
          alignItems:'center',
        }}>
          <span style={{ fontSize:15, fontWeight:700, color:DARK, letterSpacing:'-0.2px' }}>
            {formatDate(d.date)}
          </span>
          <UnblockBtn onClick={() => handleUnblock(d.date)} />
        </div>
      ))}
    </div>
  )
}