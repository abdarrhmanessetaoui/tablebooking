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
        cursor: 'pointer', transition: 'all 0.13s', flexShrink: 0,
      }}>
      {children}
    </button>
  )
}

export default function CalendarNav({ view, setView, navLabel, navigate, goToday, currentDate }) {
  const isToday   = new Date().toDateString() === currentDate.toDateString()
  const [hToday, setHToday] = useState(false)
  const [hViews, setHViews] = useState(null)

  return (
    <>
      <style>{`
        .cnav { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 28px; }
        .cnav-left  { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .cnav-label { display: flex; align-items: center; gap: 9px; padding: 10px 16px; border: 2px solid ${DARK}; background: #fff; min-width: 0; }
        .cnav-views { display: flex; border: 2px solid ${DARK}; overflow: hidden; }
        .cnav-views button { padding: 10px 14px; border: none; background: #fff; color: ${DARK}; font-size: 11px; font-weight: 900; cursor: pointer; transition: all 0.13s; font-family: inherit; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
        @media(max-width:600px){
          .cnav { flex-direction: column; align-items: flex-start; }
          .cnav-label { min-width: 140px; }
          .cnav-views { width: 100%; }
          .cnav-views button { flex: 1; padding: 10px 8px; font-size: 10px; }
        }
        @media(max-width:360px){
          .cnav-views button { padding: 10px 4px; font-size: 9px; letter-spacing: 0; }
        }
      `}</style>

      <div className="cnav">
        {/* Left — nav arrows + label + today */}
        <div className="cnav-left">
          <ArrowBtn onClick={() => navigate('prev')}><ChevronLeft size={16} strokeWidth={2.5} /></ArrowBtn>

          <div className="cnav-label">
            <CalendarDays size={13} strokeWidth={2.5} color={GOLD} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
              {navLabel()}
            </span>
          </div>

          <ArrowBtn onClick={() => navigate('next')}><ChevronRight size={16} strokeWidth={2.5} /></ArrowBtn>

          {!isToday && (
            <button onClick={goToday}
              onMouseEnter={() => setHToday(true)} onMouseLeave={() => setHToday(false)}
              style={{ padding: '10px 16px', background: hToday ? GOLD : '#fff', border: `2px solid ${hToday ? GOLD : 'rgba(43,33,24,0.18)'}`, color: DARK, fontSize: 11, fontWeight: 900, cursor: 'pointer', transition: 'all 0.13s', fontFamily: 'inherit', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              Aujourd'hui
            </button>
          )}
        </div>

        {/* Right — view switcher */}
        <div className="cnav-views">
          {VIEWS.map((v, i) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                borderLeft: i > 0 ? `1px solid ${view === v ? 'rgba(255,255,255,0.15)' : 'rgba(43,33,24,0.12)'}` : 'none',
                background: view === v ? DARK : '#fff',
                color: view === v ? '#fff' : DARK,
              }}>
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}