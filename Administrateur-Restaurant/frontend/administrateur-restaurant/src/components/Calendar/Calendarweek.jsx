import { useState } from 'react'
import { Clock, Users } from 'lucide-react'

const DARK  = '#2b2118'
const GOLD  = '#c8a97e'
const CREAM = '#faf8f5'
const GOLD_BG = '#fdf6ec'

const DAYS_SHORT  = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const DAYS_FULL   = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MONTHS_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const STATUS = {
  Confirmed: { bg: CREAM,   border: DARK, text: DARK, dot: DARK,  label: 'Confirmée'  },
  Pending:   { bg: GOLD_BG, border: GOLD, text: GOLD, dot: GOLD,  label: 'En attente' },
  Cancelled: { bg: '#fff',  border: 'rgba(43,33,24,0.2)', text: 'rgba(43,33,24,0.4)', dot: 'rgba(43,33,24,0.3)', label: 'Annulée' },
}

function Badge({ status }) {
  const s = STATUS[status] || STATUS.Pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px',
      background: s.bg, border: `1.5px solid ${s.border}`,
      fontSize: 9, fontWeight: 900, color: s.text,
      letterSpacing: '0.15em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
      {s.label}
    </span>
  )
}

function Card({ r, compact }) {
  const s = STATUS[r.status] || STATUS.Pending
  if (compact) return (
    <div style={{
      padding: '5px 8px',
      background: s.bg,
      borderLeft: `3px solid ${s.dot}`,
    }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: s.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
        {r.start_time} · {r.name}
      </span>
    </div>
  )
  return (
    <div style={{ padding: '16px 20px', background: s.bg, borderLeft: `3px solid ${s.dot}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Badge status={r.status} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={12} strokeWidth={2.5} color={GOLD} />
          <span style={{ fontSize: 12, fontWeight: 800, color: DARK }}>{r.start_time}</span>
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color: DARK, marginBottom: 8, letterSpacing: '-0.4px' }}>{r.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Users size={12} strokeWidth={2.5} color={GOLD} />
        <span style={{ fontSize: 12, fontWeight: 700, color: DARK }}>{r.guests} personne{r.guests !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

/* ── DAY ── */
function DayView({ date, getByDate }) {
  const reservations = getByDate(date)
  const hours = Array.from({ length: 10 }, (_, i) => `${(i + 10).toString().padStart(2,'0')}:00`)
  return (
    <div style={{ border: `1.5px solid ${DARK}` }}>
      <div style={{ padding: '20px 28px', borderBottom: `2px solid ${DARK}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: DARK, letterSpacing: '-1px', textTransform: 'capitalize' }}>
            {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: GOLD }}>
          {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
        </span>
      </div>
      {hours.map(hour => {
        const res = reservations.filter(r => r.start_time?.startsWith(hour.slice(0,2)))
        return (
          <div key={hour} style={{ display: 'flex', gap: 24, padding: '14px 28px', borderBottom: '1px solid rgba(43,33,24,0.07)' }}>
            <div style={{ width: 48, flexShrink: 0, fontSize: 12, fontWeight: 800, color: GOLD, paddingTop: 2 }}>{hour}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {res.length === 0 ? <div style={{ height: 28 }} /> : res.map(r => <Card key={r.id} r={r} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── WEEK ── */
function WeekView({ weekDays, getByDate }) {
  const today = new Date().toDateString()
  const [activeDay, setActiveDay] = useState(() => {
    const i = weekDays.findIndex(d => d.toDateString() === today)
    return i >= 0 ? i : 0
  })
  return (
    <>
      <style>{`
        .wk-mobile { display: none; }
        .wk-desktop { display: grid; }
        @media(max-width:767px){ .wk-mobile { display: block; } .wk-desktop { display: none !important; } }
      `}</style>

      {/* Mobile */}
      <div className="wk-mobile">
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const count   = getByDate(day).length
            const active  = activeDay === i
            const [h, setH] = useState(false)
            return (
              <button key={i} onClick={() => setActiveDay(i)}
                onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
                style={{
                  flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '10px 16px',
                  background: active ? DARK : h ? CREAM : '#fff',
                  border: `2px solid ${active ? DARK : isToday ? GOLD : 'rgba(43,33,24,0.15)'}`,
                  cursor: 'pointer', transition: 'all 0.13s', fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', color: active ? GOLD : isToday ? GOLD : 'rgba(43,33,24,0.4)', marginBottom: 4 }}>{DAYS_SHORT[i]}</span>
                <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, color: active ? '#fff' : DARK }}>{day.getDate()}</span>
                {count > 0 && <span style={{ marginTop: 5, fontSize: 10, fontWeight: 900, color: active ? GOLD : 'rgba(43,33,24,0.4)' }}>{count}</span>}
              </button>
            )
          })}
        </div>
        <div style={{ border: `1.5px solid ${DARK}` }}>
          <div style={{ padding: '16px 20px', borderBottom: `2px solid ${DARK}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: DARK, letterSpacing: '-0.5px', textTransform: 'capitalize' }}>
              {DAYS_FULL[activeDay]}, {weekDays[activeDay]?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: GOLD }}>{getByDate(weekDays[activeDay]).length} rés.</span>
          </div>
          <div style={{ padding: 16 }}>
            {(() => {
              const res = getByDate(weekDays[activeDay])
              return res.length === 0
                ? <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 14, fontWeight: 900, color: 'rgba(43,33,24,0.2)' }}>Aucune réservation</div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{res.map(r => <Card key={r.id} r={r} />)}</div>
            })()}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="wk-desktop" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today
          const res     = getByDate(day)
          return (
            <div key={i} style={{
              border: `${isToday ? 2 : 1}px solid ${isToday ? GOLD : 'rgba(43,33,24,0.12)'}`,
              background: '#fff',
            }}>
              <div style={{
                padding: '12px 10px',
                borderBottom: `${isToday ? 2 : 1}px solid ${isToday ? GOLD : 'rgba(43,33,24,0.08)'}`,
                background: isToday ? GOLD_BG : '#fff',
              }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: isToday ? GOLD : 'rgba(43,33,24,0.35)', marginBottom: 6 }}>{DAYS_SHORT[i]}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: isToday ? GOLD : DARK, lineHeight: 1, letterSpacing: '-1px' }}>{day.getDate()}</div>
                {res.length > 0 && <div style={{ marginTop: 5, fontSize: 11, fontWeight: 800, color: isToday ? GOLD : DARK }}>{res.length} rés.</div>}
              </div>
              <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 160 }}>
                {res.length === 0
                  ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 20, fontWeight: 900, color: 'rgba(43,33,24,0.1)' }}>—</div>
                  : res.map(r => <Card key={r.id} r={r} compact />)
                }
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── MONTH ── */
function MonthView({ monthDays, currentDate, getByDate, setCurrentDate, setView }) {
  const today = new Date().toDateString()
  return (
    <div style={{ border: `1.5px solid ${DARK}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: `2px solid ${DARK}` }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ padding: '12px 8px', textAlign: 'center', fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {monthDays.map(({ date, current }, i) => {
          const isToday = date.toDateString() === today
          const res     = getByDate(date)
          const [h, setH] = useState(false)
          return (
            <div key={i}
              onClick={() => { setCurrentDate(date); setView('day') }}
              onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
              style={{
                borderBottom: '1px solid rgba(43,33,24,0.07)', borderRight: '1px solid rgba(43,33,24,0.07)',
                padding: 8, minHeight: 100, cursor: 'pointer',
                opacity: current ? 1 : 0.3,
                background: isToday ? GOLD_BG : h ? CREAM : '#fff',
                transition: 'background 0.12s',
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', marginBottom: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isToday ? GOLD : 'transparent',
                fontSize: 13, fontWeight: 900,
                color: isToday ? '#fff' : DARK,
              }}>{date.getDate()}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {res.slice(0,2).map(r => <Card key={r.id} r={r} compact />)}
                {res.length > 2 && <span style={{ fontSize: 10, fontWeight: 800, color: GOLD, paddingLeft: 4 }}>+{res.length - 2} de plus</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── YEAR ── */
function YearView({ currentDate, getByMonth, setCurrentDate, setView }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px,1fr))', gap: 6 }}>
      {MONTHS_FULL.map((month, i) => {
        const res            = getByMonth(currentDate.getFullYear(), i)
        const isCurrent      = new Date().getMonth() === i && new Date().getFullYear() === currentDate.getFullYear()
        const [h, setH]      = useState(false)
        const confirmed      = res.filter(r => r.status === 'Confirmed').length
        const pending        = res.filter(r => r.status === 'Pending').length
        const cancelled      = res.filter(r => r.status === 'Cancelled').length
        return (
          <div key={i}
            onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), i, 1)); setView('month') }}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
              padding: '22px 20px',
              border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? GOLD : h ? DARK : 'rgba(43,33,24,0.12)'}`,
              background: h ? CREAM : '#fff',
              cursor: 'pointer', transition: 'all 0.13s',
            }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: isCurrent ? GOLD : 'rgba(43,33,24,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
              {month}
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, color: DARK, lineHeight: 1, letterSpacing: '-2px', marginBottom: 4 }}>
              {res.length}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 16 }}>
              réservation{res.length !== 1 ? 's' : ''}
            </div>
            {res.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid rgba(43,33,24,0.08)`, paddingTop: 12 }}>
                {confirmed > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.5)' }}>Confirmées</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: DARK }}>{confirmed}</span>
                  </div>
                )}
                {pending > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.5)' }}>En attente</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: GOLD }}>{pending}</span>
                  </div>
                )}
                {cancelled > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.5)' }}>Annulées</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: 'rgba(43,33,24,0.35)' }}>{cancelled}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CalendarWeek({ view, weekDays, monthDays, currentDate, setCurrentDate, setView, getByDate, getByMonth }) {
  return (
    <div>
      {view === 'day'   && <DayView   date={currentDate} getByDate={getByDate} />}
      {view === 'week'  && <WeekView  weekDays={weekDays} getByDate={getByDate} />}
      {view === 'month' && <MonthView monthDays={monthDays} currentDate={currentDate} getByDate={getByDate} setCurrentDate={setCurrentDate} setView={setView} />}
      {view === 'year'  && <YearView  currentDate={currentDate} getByMonth={getByMonth} setCurrentDate={setCurrentDate} setView={setView} />}
    </div>
  )
}