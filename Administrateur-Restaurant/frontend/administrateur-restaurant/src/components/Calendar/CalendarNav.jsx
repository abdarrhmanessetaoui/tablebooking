import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

const VIEWS       = ['day', 'week', 'month', 'year']
const VIEW_LABELS = { day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année' }

function ArrowBtn({ onClick, children }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: h ? DARK : '#fff',
        border: `2px solid ${h ? DARK : 'rgba(43,33,24,0.18)'}`,
        color: h ? '#fff' : DARK,
        cursor: 'pointer', transition: 'all 0.13s',
      }}>
      {children}
    </button>
  )
}

export default function CalendarNav({ view, setView, navLabel, navigate, goToday, currentDate }) {
  const isToday = new Date().toDateString() === currentDate.toDateString()
  const [hToday, setHToday] = useState(false)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 32 }}>

      {/* Left — navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ArrowBtn onClick={() => navigate('prev')}><ChevronLeft size={16} strokeWidth={2.5} /></ArrowBtn>

        {/* Label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '10px 20px',
          border: `2px solid ${DARK}`,
          background: '#fff',
          minWidth: 210, justifyContent: 'center',
        }}>
          <CalendarDays size={14} strokeWidth={2.5} color={GOLD} />
          <span style={{ fontSize: 14, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
            {navLabel()}
          </span>
        </div>

        <ArrowBtn onClick={() => navigate('next')}><ChevronRight size={16} strokeWidth={2.5} /></ArrowBtn>

        {/* Today */}
        {!isToday && (
          <button onClick={goToday}
            onMouseEnter={() => setHToday(true)} onMouseLeave={() => setHToday(false)}
            style={{
              padding: '10px 18px',
              background: hToday ? GOLD : '#fff',
              border: `2px solid ${hToday ? GOLD : 'rgba(43,33,24,0.18)'}`,
              color: hToday ? DARK : DARK,
              fontSize: 12, fontWeight: 900,
              cursor: 'pointer', transition: 'all 0.13s',
              fontFamily: 'inherit', letterSpacing: '0.02em',
            }}>
            Aujourd'hui
          </button>
        )}
      </div>

      {/* Right — view switcher */}
      <div style={{ display: 'flex', border: `2px solid ${DARK}`, overflow: 'hidden' }}>
        {VIEWS.map((v, i) => {
          const [h, setH] = useState(false)
          const active    = view === v
          return (
            <button key={v} onClick={() => setView(v)}
              onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
              style={{
                padding: '10px 18px',
                background: active ? DARK : h ? '#fdf6ec' : '#fff',
                color: active ? '#fff' : h ? GOLD : DARK,
                fontSize: 12, fontWeight: 900,
                border: 'none',
                borderLeft: i > 0 ? `1px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(43,33,24,0.12)'}` : 'none',
                cursor: 'pointer', transition: 'all 0.13s',
                fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
              {VIEW_LABELS[v]}
            </button>
          )
        })}
      </div>

    </div>
  )
}