import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const VIEWS = ['day', 'week', 'month', 'year']
const VIEW_LABELS = { day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année' }

function NavBtn({ onClick, children, active, gold }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px 14px',
        background: gold
          ? (active ? GOLD : hov ? GOLD : 'transparent')
          : (hov ? 'rgba(200,169,126,0.08)' : 'transparent'),
        border: gold ? 'none' : `1.5px solid ${hov ? 'rgba(200,169,126,0.3)' : 'rgba(43,33,24,0.12)'}`,
        color: gold
          ? (active ? DARK : hov ? DARK : 'rgba(43,33,24,0.35)')
          : (hov ? GOLD : DARK),
        cursor: 'pointer',
        transition: 'all 0.13s',
        fontFamily: 'inherit',
        fontSize: 12, fontWeight: 800,
      }}
    >
      {children}
    </button>
  )
}

export default function CalendarNav({ view, setView, navLabel, navigate, goToday, currentDate }) {
  const isToday = new Date().toDateString() === currentDate.toDateString()
  const [hovPrev, setHovPrev] = useState(false)
  const [hovNext, setHovNext] = useState(false)

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap',
      alignItems: 'center', justifyContent: 'space-between',
      gap: 12, marginBottom: 32,
    }}>

      {/* Left — navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

        {/* Prev */}
        <button
          onClick={() => navigate('prev')}
          onMouseEnter={() => setHovPrev(true)}
          onMouseLeave={() => setHovPrev(false)}
          style={{
            width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovPrev ? DARK : '#fff',
            border: `1.5px solid ${hovPrev ? DARK : 'rgba(43,33,24,0.15)'}`,
            color: hovPrev ? '#fff' : DARK,
            cursor: 'pointer', transition: 'all 0.13s',
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* Label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 18px',
          border: '1.5px solid rgba(43,33,24,0.12)',
          background: '#fff',
          minWidth: 200, justifyContent: 'center',
        }}>
          <CalendarDays size={14} strokeWidth={2} color={GOLD} />
          <span style={{ fontSize: 14, fontWeight: 800, color: DARK, letterSpacing: '-0.3px' }}>
            {navLabel()}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={() => navigate('next')}
          onMouseEnter={() => setHovNext(true)}
          onMouseLeave={() => setHovNext(false)}
          style={{
            width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovNext ? DARK : '#fff',
            border: `1.5px solid ${hovNext ? DARK : 'rgba(43,33,24,0.15)'}`,
            color: hovNext ? '#fff' : DARK,
            cursor: 'pointer', transition: 'all 0.13s',
          }}
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>

        {/* Today */}
        {!isToday && (() => {
          const [h, setH] = useState(false)
          return (
            <button
              onClick={goToday}
              onMouseEnter={() => setH(true)}
              onMouseLeave={() => setH(false)}
              style={{
                padding: '9px 16px',
                background: h ? DARK : '#fff',
                border: `1.5px solid ${h ? DARK : 'rgba(43,33,24,0.15)'}`,
                color: h ? '#fff' : DARK,
                fontSize: 12, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.13s',
                fontFamily: 'inherit',
              }}
            >
              Aujourd'hui
            </button>
          )
        })()}
      </div>

      {/* Right — view switcher */}
      <div style={{
        display: 'flex', alignItems: 'center',
        border: '1.5px solid rgba(43,33,24,0.12)',
        background: '#fff',
        overflow: 'hidden',
      }}>
        {VIEWS.map((v, i) => {
          const [h, setH] = useState(false)
          const active = view === v
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              onMouseEnter={() => setH(true)}
              onMouseLeave={() => setH(false)}
              style={{
                padding: '9px 16px',
                background: active ? DARK : h ? 'rgba(43,33,24,0.05)' : 'transparent',
                color: active ? '#fff' : h ? DARK : 'rgba(43,33,24,0.45)',
                fontSize: 12, fontWeight: 800,
                border: 'none',
                borderLeft: i > 0 ? '1px solid rgba(43,33,24,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.13s',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {VIEW_LABELS[v]}
            </button>
          )
        })}
      </div>

    </div>
  )
}