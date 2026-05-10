import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, Users, CalendarOff } from 'lucide-react'
import { DARK, LIGHT_BROWN, BORDER, CREAM, WHITE, RED, GREEN, AMBER, RADIUS } from '../../styles/dashboard/tokens'

const STATUS_KEYS = {
  Confirmed: 'status_confirmed',
  Pending:   'status_pending',
  Cancelled: 'status_cancelled',
}

function Badge({ status }) {
  const { t } = useTranslation()
  const keyRef = STATUS_KEYS[status] || 'status_pending'
  
  const colors = {
    Confirmed: { bg: GREEN, color: WHITE },
    Pending:   { bg: AMBER, color: WHITE },
    Cancelled: { bg: RED,   color: WHITE },
  }
  const s = colors[status] || colors.Pending

  return (
    <span style={{ 
      display: 'inline-flex', alignItems: 'center', 
      padding: '4px 10px', background: s.bg, borderRadius: RADIUS.sm, 
      fontSize: '11px', fontWeight: '800', color: s.color, 
      textTransform: 'uppercase', letterSpacing: '0.04em',
      whiteSpace: 'nowrap' 
    }}>
      {t(keyRef)}
    </span>
  )
}

function ResRow({ r, last }) {
  const { t } = useTranslation()
  const styles = {
    Confirmed: { dot: GREEN },
    Pending:   { dot: AMBER },
    Cancelled: { dot: RED },
  }
  const s = styles[r.status] || styles.Pending

  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: '1fr auto', 
      borderBottom: last ? 'none' : `1px solid ${BORDER}`,
      background: WHITE,
      cursor: 'pointer'
    }}
    >
      <div style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 10 }}><Badge status={r.status} /></div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: DARK, marginBottom: 8 }}>{r.name}</div>
        {r.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: DARK }}>{r.phone}</span>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 6 }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: DARK, fontFamily: "'Poppins', sans-serif" }}>{r.start_time}</span>
      </div>
    </div>
  )
}

function CompactCard({ r }) {
  const styles = {
    Confirmed: { dot: GREEN, color: '#166534' },
    Pending:   { dot: AMBER, color: '#92400E' },
    Cancelled: { dot: RED, color: '#991B1B' },
  }
  const s = styles[r.status] || styles.Pending
  return (
    <div style={{ 
      background: WHITE, 
      padding: '6px 10px', borderRadius: RADIUS.sm, border: `1px solid ${BORDER}`,
      overflow: 'hidden'
    }}>
      <span style={{ fontSize: '11px', fontWeight: '600', color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
        <span style={{ color: LIGHT_BROWN, fontWeight: '700', marginRight: 4 }}>{r.start_time}</span>
        {r.name}
      </span>
    </div>
  )
}

function Empty() {
  const { t } = useTranslation()
  return (
    <div style={{ padding: '64px 0', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: DARK }}>{t('no_reservations_found')}</p>
    </div>
  )
}

/* ══ DAY ══ */
function DayView({ date, getByDate }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const reservations = getByDate(date)
  const groups = {}
  reservations.forEach(r => {
    const h = r.start_time?.slice(0,2) || '??'
    if (!groups[h]) groups[h] = []
    groups[h].push(r)
  })
  const hours     = Object.keys(groups).sort()
  const confirmed = reservations.filter(r => r.status === 'Confirmed').length
  const pending   = reservations.filter(r => r.status === 'Pending').length
  const cancelled = reservations.filter(r => r.status === 'Cancelled').length
  
  return (
    <div style={{ background: WHITE, borderRadius: RADIUS.sm, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <div style={{ padding: '24px 32px', background: WHITE, borderBottom: `1px solid ${BORDER}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: DARK, fontFamily: "'Poppins', sans-serif", textTransform: 'capitalize' }}>
            {date.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
        </div>

      </div>
      
      {reservations.length === 0 ? <Empty /> : hours.map((h, hi) => (
        <div key={h}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 32px', 
            background: WHITE, borderTop: hi > 0 ? `1px solid ${BORDER}` : 'none',
            borderBottom: `1px solid ${BORDER}`
          }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: LIGHT_BROWN }}>{h}:00</span>
          </div>
          {groups[h].map((r, i) => <ResRow key={r.id} r={r} last={i === groups[h].length - 1} />)}
        </div>
      ))}
    </div>
  )
}

/* ══ WEEK ══ */
function WeekView({ weekDays, getByDate, onDayChange }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const today = new Date().toDateString()
  const todayIdx = weekDays.findIndex(d => d.toDateString() === today)
  const [activeDay, setActiveDay] = useState(todayIdx >= 0 ? todayIdx : 0)

  const daysShort = Array.from({ length: 7 }, (_, i) => 
    new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(new Date(2024, 0, i + 1))
  ).map(s => s.replace('.', ''))

  const daysFull = Array.from({ length: 7 }, (_, i) => 
    new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, i + 1))
  )

  function selectDay(i) {
    setActiveDay(i)
    if (onDayChange) onDayChange(weekDays[i])
  }

  return (
    <>
      <style>{`
        .wk-mobile  { display: none; }
        .wk-desktop { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
        @media(max-width:900px){ .wk-mobile { display: block; } .wk-desktop { display: none !important; } }
      `}</style>

      <div className="wk-mobile">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const active  = activeDay === i
            const count   = getByDate(day).length
            return (
              <button key={i} onClick={() => selectDay(i)}
                style={{ 
                  flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  minWidth: '64px', padding: '12px 0', gap: 4, 
                  background: active ? LIGHT_BROWN : WHITE, 
                  border: `1px solid ${active ? LIGHT_BROWN : isToday ? LIGHT_BROWN : BORDER}`, 
                  borderRadius: RADIUS.sm,
                  color: active ? WHITE : DARK, 
                  cursor: 'pointer', transition: 'none', fontFamily: 'inherit'
                }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: active ? WHITE : DARK, textTransform: 'uppercase' }}>{daysShort[i]}</span>
                <span style={{ fontSize: '20px', fontWeight: '800' }}>{day.getDate()}</span>
                {count > 0 && <span style={{ fontSize: '10px', fontWeight: '800', color: active ? WHITE : LIGHT_BROWN }}>{count}</span>}
              </button>
            )
          })}
        </div>
        <div style={{ background: WHITE, borderRadius: RADIUS.sm, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: WHITE, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: DARK, fontFamily: "'Poppins', sans-serif", textTransform: 'capitalize' }}>
              {daysFull[activeDay]}, {weekDays[activeDay]?.toLocaleDateString(lang, { day: 'numeric', month: 'long' })}
            </span>
          </div>
          {(() => {
            const res = getByDate(weekDays[activeDay])
            return res.length === 0 ? <Empty /> : res.map((r, i) => <ResRow key={r.id} r={r} last={i === res.length - 1} />)
          })()}
        </div>
      </div>

      <div className="wk-desktop">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today
          const res     = getByDate(day)
          return (
            <div key={i} style={{ 
              background: WHITE, borderRadius: RADIUS.sm, border: `1px solid ${isToday ? LIGHT_BROWN : BORDER}`, 
              overflow: 'hidden'
            }}>
              <div style={{ padding: '14px 12px', background: isToday ? LIGHT_BROWN : DARK, textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: '700', color: isToday ? WHITE : 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase' }}>{daysShort[i]}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: isToday ? WHITE : WHITE, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>{day.getDate()}</div>
              </div>
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: '180px', background: WHITE }}>
                {res.length === 0
                  ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: '20px', fontWeight: '700', color: BORDER }}> </div>
                  : res.map(r => <CompactCard key={r.id} r={r} />)}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ══ MONTH ══ */
function MonthView({ monthDays, currentDate, getByDate, setCurrentDate, setView }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const today = new Date().toDateString()

  const daysShort = Array.from({ length: 7 }, (_, i) => 
    new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(new Date(2024, 0, i + 1))
  ).map(s => s.replace('.', ''))

  return (
    <div style={{ background: WHITE, borderRadius: RADIUS.sm, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: DARK }}>
        {daysShort.map(d => (
          <div key={d} style={{ padding: '12px 4px', textAlign: 'center', fontSize: '10px', fontWeight: '700', color: LIGHT_BROWN, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {monthDays.map(({ date, current }, i) => {
          const isToday = date.toDateString() === today
          const res     = getByDate(date)
          const hov     = hovIdx === i
          return (
            <div key={i}
              onClick={() => { setCurrentDate(date); setView('day') }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)}
              style={{ 
                borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, 
                padding: '8px', minHeight: '100px', cursor: 'pointer', opacity: current ? 1 : 0.3, 
                background: isToday ? CREAM : hov ? CREAM : WHITE, transition: 'background 0.2s' 
              }}>
              <div style={{ 
                marginBottom: 8, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '13px', fontWeight: '900', color: isToday ? LIGHT_BROWN : DARK,
                fontFamily: "'Poppins', sans-serif",
                textDecoration: isToday ? 'underline' : 'none'
              }}>
                {date.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {res.slice(0, 3).map(r => <CompactCard key={r.id} r={r} />)}
                {res.length > 3 && <span style={{ fontSize: '10px', fontWeight: '700', color: LIGHT_BROWN, paddingLeft: 4 }}>+{res.length - 3} {t('more')}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══ YEAR ══ */
function YearView({ currentDate, getByMonth, setCurrentDate, setView }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const [hovIdx, setHovIdx] = useState(null)

  const monthsFull = Array.from({ length: 12 }, (_, i) => 
    new Intl.DateTimeFormat(lang, { month: 'long' }).format(new Date(2024, i, 1))
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {monthsFull.map((month, i) => {
        const res       = getByMonth(currentDate.getFullYear(), i)
        const isCurrent = new Date().getMonth() === i && new Date().getFullYear() === currentDate.getFullYear()
        const hov       = hovIdx === i
        const confirmed = res.filter(r => r.status === 'Confirmed').length
        const pending   = res.filter(r => r.status === 'Pending').length
        const cancelled = res.filter(r => r.status === 'Cancelled').length
        return (
          <div key={i}
            onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), i, 1)); setView('month') }}
            style={{ 
              padding: '24px', background: WHITE, borderRadius: RADIUS.sm, 
              border: `1px solid ${isCurrent ? LIGHT_BROWN : BORDER}`, 
              cursor: 'pointer', transition: 'none'
            }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: isCurrent ? LIGHT_BROWN : DARK, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{month}</div>
            <div style={{ fontSize: '42px', fontWeight: '700', color: DARK, fontFamily: "'Poppins', sans-serif", lineHeight: 1, letterSpacing: '-1px', marginBottom: 6 }}>{res.length}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function CalendarWeek({ view, weekDays, monthDays, currentDate, setCurrentDate, setView, getByDate, getByMonth, onDayChange }) {
  return (
    <div style={{ paddingBottom: '40px' }}>
      {view === 'day'   && <DayView   date={currentDate} getByDate={getByDate} />}
      {view === 'week'  && <WeekView  weekDays={weekDays} getByDate={getByDate} onDayChange={onDayChange} />}
      {view === 'month' && <MonthView monthDays={monthDays} currentDate={currentDate} getByDate={getByDate} setCurrentDate={setCurrentDate} setView={setView} />}
      {view === 'year'  && <YearView  currentDate={currentDate} getByMonth={getByMonth} setCurrentDate={setCurrentDate} setView={setView} />}
    </div>
  )
}
