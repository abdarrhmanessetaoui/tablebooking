import { useState } from 'react'


const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const CREAM   = '#faf8f5'
const GOLD_BG = '#fdf6ec'

const DAYS_SHORT  = ['LUN','MAR','MER','JEU','VEN','SAM','DIM']
const DAYS_FULL   = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
const MONTHS_FULL = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

const STATUS = {
  Confirmed: { bg: '#00A651', text: '#fff', label: 'Confirmée'  },
  Pending:   { bg: '#c8a97e', text: '#fff', label: 'En attente' },
  Cancelled: { bg: '#FF0000', text: '#fff', label: 'Annulée'    },
}

function Badge({ status }) {
  const s = STATUS[status] || STATUS.Pending
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 12px', background:s.bg, fontSize:9, fontWeight:900, color:s.text, letterSpacing:'0.15em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
      {s.label}
    </span>
  )
}

function ResRow({ r, last }) {
  const s = STATUS[r.status] || STATUS.Pending
  return (
    <div style={{ display:'grid', gridTemplateColumns:'4px 1fr auto', borderBottom: last ? 'none' : '1px solid rgba(43,33,24,0.07)' }}>
      <div style={{ background: s.bg }} />
      <div style={{ padding:'18px 20px', background:'#fff' }}>
        <div style={{ marginBottom:10 }}><Badge status={r.status} /></div>
        <div style={{ fontSize:'clamp(15px,2vw,18px)', fontWeight:900, color:DARK, letterSpacing:'-0.5px', marginBottom:8 }}>{r.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, fontWeight:800, color:DARK }}>{r.guests} personne{r.guests!==1?'s':''}</span>
          {r.phone && <span style={{ fontSize:12, fontWeight:700, color:GOLD }}>{r.phone}</span>}
        </div>
      </div>
      <div style={{ padding:'18px 20px', background:'#fff', display:'flex', alignItems:'flex-start', justifyContent:'flex-end', gap:6, flexShrink:0 }}>
        <span style={{ fontSize:15, fontWeight:900, color:DARK, letterSpacing:'-0.5px', whiteSpace:'nowrap' }}>{r.start_time}</span>
      </div>
    </div>
  )
}

function CompactCard({ r }) {
  const s = STATUS[r.status] || STATUS.Pending
  return (
    <div style={{ borderLeft:`3px solid ${s.bg}`, background:'#f9f7f4', padding:'5px 8px', overflow:'hidden' }}>
      <span style={{ fontSize:11, fontWeight:800, color:DARK, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' }}>
        {r.start_time} · {r.name}
      </span>
    </div>
  )
}

function Empty({ msg = 'Aucune réservation' }) {
  return (
    <div style={{ padding:'56px 0', textAlign:'center' }}>
      <p style={{ margin:0, fontSize:14, fontWeight:900, color:DARK, opacity: 0.2 }}>{msg}</p>
    </div>
  )
}

/* ══ DAY ══ */
function DayView({ date, getByDate }) {
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
    <div style={{ border:`2px solid ${DARK}` }}>
      <div style={{ padding:'20px 24px', background:DARK, display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
        <div>
          <h3 style={{ margin:'0 0 4px', fontSize:'clamp(15px,2.2vw,20px)', fontWeight:900, color:'#fff', letterSpacing:'-0.6px', textTransform:'capitalize' }}>
            {date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </h3>
          <span style={{ fontSize:13, fontWeight:800, color:GOLD }}>{reservations.length} Reservationervation{reservations.length!==1?'s':''}</span>
        </div>
        {reservations.length > 0 && (
          <div style={{ display:'flex', gap:20 }}>
            {confirmed>0 && <div style={{ textAlign:'center' }}><div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-1px' }}>{confirmed}</div><div style={{ fontSize:9, fontWeight:800, color:'rgba(200,169,126,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>Confirmée</div></div>}
            {pending>0   && <div style={{ textAlign:'center' }}><div style={{ fontSize:22, fontWeight:900, color:GOLD, lineHeight:1, letterSpacing:'-1px' }}>{pending}</div><div style={{ fontSize:9, fontWeight:800, color:'rgba(200,169,126,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>Attente</div></div>}
            {cancelled>0 && <div style={{ textAlign:'center' }}><div style={{ fontSize:22, fontWeight:900, color:'rgba(255,255,255,0.3)', lineHeight:1, letterSpacing:'-1px' }}>{cancelled}</div><div style={{ fontSize:9, fontWeight:800, color:'rgba(200,169,126,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>Ann.</div></div>}
          </div>
        )}
      </div>
      {reservations.length === 0 ? <Empty /> : hours.map((h, hi) => (
        <div key={h}>
          <div style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 24px', background:'#fff', borderTop: hi>0 ? `2px solid ${DARK}` : '1px solid rgba(43,33,24,0.08)' }}>
            <span style={{ fontSize:13, fontWeight:900, color:GOLD, minWidth:44 }}>{h}:00</span>
            <div style={{ flex:1, height:1, background:'rgba(43,33,24,0.07)' }} />
            <span style={{ fontSize:11, fontWeight:800, color:'rgba(43,33,24,0.3)' }}>{groups[h].length} Reservation</span>
          </div>
          {groups[h].map((r, i) => <ResRow key={r.id} r={r} last={i===groups[h].length-1} />)}
        </div>
      ))}
    </div>
  )
}

/* ══ WEEK ══ */
// ── onDayChange is NEW — called whenever the active day tab changes
function WeekView({ weekDays, getByDate, onDayChange }) {
  const today    = new Date().toDateString()
  const todayIdx = weekDays.findIndex(d => d.toDateString() === today)
  const [activeDay, setActiveDay] = useState(todayIdx >= 0 ? todayIdx : 0)

  // ── NEW: notify parent when day changes
  function selectDay(i) {
    setActiveDay(i)
    if (onDayChange) onDayChange(weekDays[i])
  }

  return (
    <>
      <style>{`
        .wk-mobile  { display: none; }
        .wk-desktop { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
        @media(max-width:900px){ .wk-mobile { display: block; } .wk-desktop { display: none !important; } }
      `}</style>

      <div className="wk-mobile">
        <div style={{ display:'flex', gap:3, marginBottom:12, overflowX:'auto', paddingBottom:4, WebkitOverflowScrolling:'touch' }}>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const active  = activeDay === i
            const count   = getByDate(day).length
            return (
              <button key={i} onClick={() => selectDay(i)}
                style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 14px', gap:3, background: active ? DARK : '#FFFFFF', border:`2px solid ${active ? DARK : isToday ? GOLD : DARK}`, color: active ? GOLD : DARK, cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ fontSize:8, fontWeight:900, letterSpacing:'0.2em', color: active ? GOLD : isToday ? GOLD : 'rgba(43,33,24,0.4)' }}>{DAYS_SHORT[i]}</span>
                <span style={{ fontSize:20, fontWeight:900, lineHeight:1 }}>{day.getDate()}</span>
                {count > 0 && <span style={{ fontSize:10, fontWeight:900, color: active ? GOLD : GOLD }}>{count}</span>}
              </button>
            )
          })}
        </div>
        <div style={{ border:`2px solid ${DARK}` }}>
          <div style={{ padding:'14px 20px', background:DARK, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:14, fontWeight:900, color:'#fff', letterSpacing:'-0.4px', textTransform:'capitalize' }}>
              {DAYS_FULL[activeDay]}, {weekDays[activeDay]?.toLocaleDateString('fr-FR', { day:'numeric', month:'long' })}
            </span>
            <span style={{ fontSize:12, fontWeight:800, color:GOLD }}>{getByDate(weekDays[activeDay]).length} Reservation.</span>
          </div>
          {(() => {
            const res = getByDate(weekDays[activeDay])
            return res.length === 0 ? <Empty /> : res.map((r, i) => <ResRow key={r.id} r={r} last={i===res.length-1} />)
          })()}
        </div>
      </div>

      <div className="wk-desktop">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today
          const res     = getByDate(day)
          return (
            <div key={i} style={{ border:`${isToday?2:1}px solid ${isToday?GOLD:'rgba(43,33,24,0.12)'}` }}>
              <div style={{ padding:'12px 10px', background: isToday ? GOLD : DARK }}>
                <div style={{ fontSize:8, fontWeight:900, letterSpacing:'0.2em', color: isToday ? DARK : GOLD, marginBottom:5 }}>{DAYS_SHORT[i]}</div>
                <div style={{ fontSize:22, fontWeight:900, color: isToday ? DARK : '#fff', lineHeight:1, letterSpacing:'-1px' }}>{day.getDate()}</div>
                {res.length > 0 && <div style={{ marginTop:4, fontSize:10, fontWeight:800, color: isToday ? DARK : GOLD }}>{res.length} Reservation.</div>}
              </div>
              <div style={{ padding:6, display:'flex', flexDirection:'column', gap:3, minHeight:140, background:'#fff' }}>
                {res.length === 0
                  ? <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flex:1, fontSize:18, fontWeight:900, color:'rgba(43,33,24,0.08)' }}>—</div>
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
  const today = new Date().toDateString()

  return (
    <div style={{ border:`2px solid ${DARK}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:DARK }}>
        {['LUN','MAR','MER','JEU','VEN','SAM','DIM'].map(d => (
          <div key={d} style={{ padding:'10px 4px', textAlign:'center', fontSize:9, fontWeight:900, color:GOLD, letterSpacing:'0.15em' }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
        {monthDays.map(({ date, current }, i) => {
          const isToday = date.toDateString() === today
          const res     = getByDate(date)
            return (
              <div key={i}
                onClick={() => { setCurrentDate(date); setView('day') }}
                style={{ borderBottom:`2px solid ${DARK}`, borderRight:`2px solid ${DARK}`, padding:6, minHeight:88, cursor:'pointer', opacity: current ? 1 : 0.3, background: isToday ? GOLD : '#FFFFFF' }}>
                <div style={{ width:26, height:26, borderRadius:0, marginBottom:5, display:'flex', alignItems:'center', justifyContent:'center', background: isToday ? DARK : 'transparent', fontSize:12, fontWeight:900, color: isToday ? GOLD : DARK }}>
                  {date.getDate()}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {res.slice(0,2).map(r => <CompactCard key={r.id} r={r} />)}
                  {res.length > 2 && <span style={{ fontSize:10, fontWeight:900, color: isToday ? DARK : GOLD, paddingLeft:4 }}>+{res.length-2}</span>}
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
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:6 }}>
      {MONTHS_FULL.map((month, i) => {
        const res       = getByMonth(currentDate.getFullYear(), i)
        const isCurrent = new Date().getMonth() === i && new Date().getFullYear() === currentDate.getFullYear()
        const hov       = hovIdx === i
        const confirmed = res.filter(r => r.status === 'Confirmed').length
        const pending   = res.filter(r => r.status === 'Pending').length
        const cancelled = res.filter(r => r.status === 'Cancelled').length
        return (
          <div key={i}
            onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), i, 1)); setView('month') }}
            style={{ padding:'20px 18px', border:`2px solid ${DARK}`, background: isCurrent ? GOLD : '#FFFFFF', cursor:'pointer' }}>
            <div style={{ fontSize:9, fontWeight:900, color: isCurrent ? DARK : GOLD, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10 }}>{month}</div>
            <div style={{ fontSize:40, fontWeight:900, color: isCurrent ? DARK : DARK, lineHeight:1, letterSpacing:'-2px', marginBottom:4 }}>{res.length}</div>
            <div style={{ fontSize:12, fontWeight:900, color: isCurrent ? DARK : GOLD }}>{res.length} RÉS.</div>
          </div>
        )
      })}
    </div>
  )
}

// ── onDayChange is NEW prop threaded from Calendar page
export default function CalendarWeek({ view, weekDays, monthDays, currentDate, setCurrentDate, setView, getByDate, getByMonth, onDayChange }) {
  return (
    <div>
      {view==='day'   && <DayView   date={currentDate} getByDate={getByDate} />}
      {view==='week'  && <WeekView  weekDays={weekDays} getByDate={getByDate} onDayChange={onDayChange} />}
      {view==='month' && <MonthView monthDays={monthDays} currentDate={currentDate} getByDate={getByDate} setCurrentDate={setCurrentDate} setView={setView} />}
      {view==='year'  && <YearView  currentDate={currentDate} getByMonth={getByMonth} setCurrentDate={setCurrentDate} setView={setView} />}
    </div>
  )
}