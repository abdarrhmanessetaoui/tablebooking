import { useState } from 'react'
import { Clock, Users } from 'lucide-react'

const DARK  = '#2b2118'
const GOLD  = '#c8a97e'
const CREAM = '#faf8f5'

const DAYS_SHORT  = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const DAYS_FULL   = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MONTHS_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const STATUS = {
  Confirmed: { border: '#2b2118', bg: '#f0f0ed', text: '#2b2118', dot: '#2b2118' },
  Pending:   { border: GOLD,      bg: '#fdf6ec', text: '#a8834e', dot: GOLD      },
  Cancelled: { border: '#d4b8a0', bg: '#faf8f5', text: '#9a8070', dot: '#c8b49a' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.Pending
  const LABELS = { Confirmed: 'Confirmée', Pending: 'En attente', Cancelled: 'Annulée' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px',
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: 9, fontWeight: 800, color: s.text,
      textTransform: 'uppercase', letterSpacing: '0.1em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {LABELS[status] || status}
    </span>
  )
}

function ReservationCard({ r, compact = false }) {
  const s = STATUS[r.status] || STATUS.Pending
  if (compact) {
    return (
      <div style={{
        padding: '4px 8px',
        background: s.bg,
        borderLeft: `2px solid ${s.dot}`,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: s.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {r.start_time} · {r.name}
          </span>
        </div>
      </div>
    )
  }
  return (
    <div style={{
      padding: '14px 16px',
      background: s.bg,
      borderLeft: `3px solid ${s.dot}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <StatusBadge status={r.status} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#aaa' }}>
          <Clock size={11} strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 700 }}>{r.start_time}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: DARK, marginBottom: 6, letterSpacing: '-0.2px' }}>
        {r.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#aaa' }}>
        <Users size={11} strokeWidth={2.5} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>{r.guests} personne{r.guests !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

/* ── DAY ── */
function DayView({ date, getByDate }) {
  const reservations = getByDate(date)
  const hours = Array.from({ length: 10 }, (_, i) => `${(i + 10).toString().padStart(2, '0')}:00`)

  return (
    <div style={{ background: '#fff', border: `1.5px solid rgba(43,33,24,0.1)` }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: `2px solid ${DARK}`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: DARK, letterSpacing: '-0.5px' }}>
            {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>
          {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Time slots */}
      {hours.map(hour => {
        const slotRes = reservations.filter(r => r.start_time?.startsWith(hour.slice(0, 2)))
        return (
          <div key={hour} style={{
            display: 'flex', gap: 20,
            padding: '12px 24px',
            borderBottom: '1px solid rgba(43,33,24,0.06)',
          }}>
            <div style={{ width: 48, flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.3)', paddingTop: 2 }}>
              {hour}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {slotRes.length === 0
                ? <div style={{ height: 24 }} />
                : slotRes.map(r => <ReservationCard key={r.id} r={r} />)
              }
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
        @media(min-width:768px){ .wk-grid { display: grid !important; } .wk-mobile { display: none !important; } }
        @media(max-width:767px){ .wk-grid { display: none !important; } .wk-mobile { display: block !important; } }
      `}</style>

      {/* Mobile */}
      <div className="wk-mobile">
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const count   = getByDate(day).length
            const active  = activeDay === i
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{
                flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '10px 14px',
                background: active ? DARK : '#fff',
                border: `1.5px solid ${active ? DARK : isToday ? GOLD : 'rgba(43,33,24,0.12)'}`,
                color: active ? '#fff' : isToday ? GOLD : DARK,
                cursor: 'pointer', transition: 'all 0.13s',
                fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.15em', marginBottom: 4 }}>{DAYS_SHORT[i]}</span>
                <span style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{day.getDate()}</span>
                {count > 0 && (
                  <span style={{
                    marginTop: 5, width: 18, height: 18,
                    background: active ? GOLD : 'rgba(43,33,24,0.08)',
                    color: active ? DARK : DARK,
                    fontSize: 9, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                  }}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
        <div style={{ border: `1.5px solid rgba(43,33,24,0.1)` }}>
          <div style={{ padding: '14px 20px', borderBottom: `2px solid ${DARK}` }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: DARK }}>
              {DAYS_FULL[activeDay]}, {weekDays[activeDay]?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div style={{ padding: 16 }}>
            {(() => {
              const res = getByDate(weekDays[activeDay])
              return res.length === 0
                ? <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, fontWeight: 700, color: 'rgba(43,33,24,0.2)' }}>Aucune réservation</div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{res.map(r => <ReservationCard key={r.id} r={r} />)}</div>
            })()}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="wk-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {weekDays.map((day, i) => {
          const isToday      = day.toDateString() === today
          const reservations = getByDate(day)
          return (
            <div key={i} style={{
              border: `${isToday ? 2 : 1}px solid ${isToday ? GOLD : 'rgba(43,33,24,0.1)'}`,
              background: '#fff',
            }}>
              <div style={{
                padding: '12px',
                borderBottom: `${isToday ? 2 : 1}px solid ${isToday ? GOLD : 'rgba(43,33,24,0.06)'}`,
                background: isToday ? '#fdf6ec' : '#fff',
              }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', color: isToday ? GOLD : 'rgba(43,33,24,0.3)', marginBottom: 4 }}>
                  {DAYS_SHORT[i]}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: isToday ? GOLD : DARK, lineHeight: 1 }}>
                  {day.getDate()}
                </div>
                {reservations.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: isToday ? GOLD : 'rgba(43,33,24,0.4)' }}>
                    {reservations.length} rés.
                  </div>
                )}
              </div>
              <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 160 }}>
                {reservations.length === 0
                  ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 18, color: 'rgba(43,33,24,0.1)', fontWeight: 900 }}>—</div>
                  : reservations.map(r => <ReservationCard key={r.id} r={r} compact />)
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
    <div style={{ border: `1.5px solid rgba(43,33,24,0.1)`, background: '#fff' }}>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `2px solid ${DARK}` }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{
            padding: '12px 8px', textAlign: 'center',
            fontSize: 9, fontWeight: 900, color: 'rgba(43,33,24,0.4)', letterSpacing: '0.18em',
          }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {monthDays.map(({ date, current }, i) => {
          const isToday      = date.toDateString() === today
          const reservations = getByDate(date)
          return (
            <div key={i} onClick={() => { setCurrentDate(date); setView('day') }} style={{
              borderBottom: '1px solid rgba(43,33,24,0.06)',
              borderRight: '1px solid rgba(43,33,24,0.06)',
              padding: 8, minHeight: 100, cursor: 'pointer',
              opacity: current ? 1 : 0.3,
              background: isToday ? '#fdf6ec' : '#fff',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = CREAM }}
            onMouseLeave={e => { e.currentTarget.style.background = isToday ? '#fdf6ec' : '#fff' }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%', marginBottom: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isToday ? GOLD : 'transparent',
                fontSize: 12, fontWeight: 800,
                color: isToday ? '#fff' : current ? DARK : '#aaa',
              }}>
                {date.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {reservations.slice(0, 2).map(r => <ReservationCard key={r.id} r={r} compact />)}
                {reservations.length > 2 && (
                  <span style={{ fontSize: 9, fontWeight: 800, color: GOLD, paddingLeft: 4 }}>
                    +{reservations.length - 2} de plus
                  </span>
                )}
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
      {MONTHS_FULL.map((month, i) => {
        const reservations    = getByMonth(currentDate.getFullYear(), i)
        const isCurrentMonth  = new Date().getMonth() === i && new Date().getFullYear() === currentDate.getFullYear()
        const [hov, setHov]   = useState(false)
        const confirmed = reservations.filter(r => r.status === 'Confirmed').length
        const pending   = reservations.filter(r => r.status === 'Pending').length
        const cancelled = reservations.filter(r => r.status === 'Cancelled').length

        return (
          <div key={i}
            onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), i, 1)); setView('month') }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              padding: '20px',
              border: `${isCurrentMonth ? 2 : 1}px solid ${isCurrentMonth ? GOLD : hov ? 'rgba(43,33,24,0.2)' : 'rgba(43,33,24,0.1)'}`,
              background: hov ? CREAM : '#fff',
              cursor: 'pointer', transition: 'all 0.13s',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: isCurrentMonth ? GOLD : 'rgba(43,33,24,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              {month}
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: DARK, lineHeight: 1, letterSpacing: '-2px', marginBottom: 8 }}>
              {reservations.length}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.4)', marginBottom: 12 }}>
              réservation{reservations.length !== 1 ? 's' : ''}
            </div>
            {reservations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {confirmed > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                  <span style={{ color: 'rgba(43,33,24,0.5)' }}>Confirmées</span>
                  <span style={{ color: DARK, fontWeight: 900 }}>{confirmed}</span>
                </div>}
                {pending > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                  <span style={{ color: 'rgba(43,33,24,0.5)' }}>En attente</span>
                  <span style={{ color: GOLD, fontWeight: 900 }}>{pending}</span>
                </div>}
                {cancelled > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                  <span style={{ color: 'rgba(43,33,24,0.5)' }}>Annulées</span>
                  <span style={{ color: '#c8b49a', fontWeight: 900 }}>{cancelled}</span>
                </div>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── MAIN ── */
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