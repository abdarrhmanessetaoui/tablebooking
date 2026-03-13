import { useState } from 'react'
import { Clock, Users, CalendarOff } from 'lucide-react'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const CREAM   = '#faf8f5'
const GOLD_BG = '#fdf6ec'

const DAYS_SHORT  = ['LUN','MAR','MER','JEU','VEN','SAM','DIM']
const DAYS_FULL   = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
const MONTHS_FULL = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

const STATUS = {
  Confirmed: { bg: '#f0f7f0', border: '#16a34a', text: '#2d6a2d', dot: '#16a34a', label: 'Confirmée'  },
  Pending:   { bg: '#fdf6ec', border: '#c8a97e', text: '#a8834e', dot: '#c8a97e', label: 'En attente' },
  Cancelled: { bg: '#fdf0f0', border: '#dc2626', text: '#b94040', dot: '#dc2626', label: 'Annulée'    },
}

function Badge({ status }) {
  const s = STATUS[status] || STATUS.Pending
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', background:s.bg, border:`1.5px solid ${s.border}`, fontSize:9, fontWeight:900, color:s.text, letterSpacing:'0.15em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
      {s.label}
    </span>
  )
}

function ResRow({ r, last }) {
  const s = STATUS[r.status] || STATUS.Pending
  return (
    <div style={{ display:'grid', gridTemplateColumns:'3px 1fr auto', borderBottom: last ? 'none' : '1px solid rgba(43,33,24,0.07)' }}>
      <div style={{ background: s.dot }} />
      <div style={{ padding:'18px 20px', background:s.bg }}>
        <div style={{ marginBottom:10 }}><Badge status={r.status} /></div>
        <div style={{ fontSize:'clamp(15px,2vw,18px)', fontWeight:900, color:DARK, letterSpacing:'-0.5px', marginBottom:8 }}>{r.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Users size={12} strokeWidth={2.5} color={GOLD} />
            <span style={{ fontSize:12, fontWeight:700, color:DARK }}>{r.guests} personne{r.guests!==1?'s':''}</span>
          </div>
          {r.phone && <span style={{ fontSize:12, fontWeight:600, color:'rgba(43,33,24,0.4)' }}>{r.phone}</span>}
        </div>
      </div>
      <div style={{ padding:'18px 20px', background:s.bg, display:'flex', alignItems:'flex-start', justifyContent:'flex-end', gap:6, flexShrink:0 }}>
        <Clock size={13} strokeWidth={2.5} color={GOLD} style={{ marginTop:2 }} />
        <span style={{ fontSize:15, fontWeight:900, color:DARK, letterSpacing:'-0.5px', whiteSpace:'nowrap' }}>{r.start_time}</span>
      </div>
    </div>
  )
}

function CompactCard({ r }) {
  const s = STATUS[r.status] || STATUS.Pending
  return (
    <div style={{ borderLeft:`3px solid ${s.dot}`, background:s.bg, padding:'5px 8px', overflow:'hidden' }}>
      <span style={{ fontSize:11, fontWeight:800, color:s.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' }}>
        {r.start_time} · {r.name}
      </span>
    </div>
  )
}

function Empty({ msg = 'Aucune réservation' }) {
  return (
    <div style={{ padding:'56px 0', textAlign:'center' }}>
      <CalendarOff size={38} color='rgba(43,33,24,0.12)' strokeWidth={1.5} style={{ display:'block', margin:'0 auto 14px' }} />
      <p style={{ margin:0, fontSize:14, fontWeight:900, color:'rgba(43,33,24,0.2)' }}>{msg}</p>
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
  const hours = Object.keys(groups).sort()
  const confirmed = reservations.filter(r => r.status === 'Confirmed').length
  const pending   = reservations.filter(r => r.status === 'Pending').length
  const cancelled = reservations.filter(r => r.status === 'Cancelled').length

  return (
    <div style={{ border:`2px solid ${DARK}` }}>
      {/* Header */}
      <div style={{ padding:'20px 24px', background:DARK, display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
        <div>
          <h3 style={{ margin:'0 0 4px', fontSize:'clamp(15px,2.2vw,20px)', fontWeight:900, color:'#fff', letterSpacing:'-0.6px', textTransform:'capitalize' }}>
            {date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </h3>
          <span style={{ fontSize:13, fontWeight:800, color:GOLD }}>{reservations.length} réservation{reservations.length!==1?'s':''}</span>
        </div>
        {reservations.length > 0 && (
          <div style={{ display:'flex', gap:20 }}>
            {confirmed>0 && <div style={{ textAlign:'center' }}><div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-1px' }}>{confirmed}</div><div style={{ fontSize:9, fontWeight:800, color:'rgba(200,169,126,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>Conf.</div></div>}
            {pending>0   && <div style={{ textAlign:'center' }}><div style={{ fontSize:22, fontWeight:900, color:GOLD,  lineHeight:1, letterSpacing:'-1px' }}>{pending}</div><div style={{ fontSize:9, fontWeight:800, color:'rgba(200,169,126,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>Att.</div></div>}
            {cancelled>0 && <div style={{ textAlign:'center' }}><div style={{ fontSize:22, fontWeight:900, color:'rgba(255,255,255,0.3)', lineHeight:1, letterSpacing:'-1px' }}>{cancelled}</div><div style={{ fontSize:9, fontWeight:800, color:'rgba(200,169,126,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3 }}>Ann.</div></div>}
          </div>
        )}
      </div>
      {reservations.length === 0 ? <Empty /> : hours.map((h, hi) => (
        <div key={h}>
          <div style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 24px', background:'#fff', borderTop: hi>0 ? `2px solid ${DARK}` : '1px solid rgba(43,33,24,0.08)' }}>
            <span style={{ fontSize:13, fontWeight:900, color:GOLD, minWidth:44 }}>{h}:00</span>
            <div style={{ flex:1, height:1, background:'rgba(43,33,24,0.07)' }} />
            <span style={{ fontSize:11, fontWeight:800, color:'rgba(43,33,24,0.3)' }}>{groups[h].length} rés.</span>
          </div>
          {groups[h].map((r, i) => <ResRow key={r.id} r={r} last={i===groups[h].length-1} />)}
        </div>
      ))}
    </div>
  )
}

/* ══ WEEK ══ */
function WeekView({ weekDays, getByDate }) {
  const today    = new Date().toDateString()
  const todayIdx = weekDays.findIndex(d => d.toDateString() === today)
  const [activeDay, setActiveDay] = useState(todayIdx >= 0 ? todayIdx : 0)

  return (
    <>
      <style>{`
        .wk-mobile  { display: none; }
        .wk-desktop { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
        @media(max-width:900px){ .wk-mobile { display: block; } .wk-desktop { display: none !important; } }
      `}</style>

      {/* Mobile — tabbed */}
      <div className="wk-mobile">
        <div style={{ display:'flex', gap:3, marginBottom:12, overflowX:'auto', paddingBottom:4, WebkitOverflowScrolling:'touch' }}>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const active  = activeDay === i
            const count   = getByDate(day).length
            return (
              <button key={i} onClick={() => setActiveDay(i)}
                style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 14px', gap:3, background: active ? DARK : '#fff', border:`2px solid ${active ? DARK : isToday ? GOLD : 'rgba(43,33,24,0.15)'}`, color: active ? '#fff' : DARK, cursor:'pointer', transition:'all 0.13s', fontFamily:'inherit' }}>
                <span style={{ fontSize:8, fontWeight:900, letterSpacing:'0.2em', color: active ? GOLD : isToday ? GOLD : 'rgba(43,33,24,0.4)' }}>{DAYS_SHORT[i]}</span>
                <span style={{ fontSize:20, fontWeight:900, lineHeight:1 }}>{day.getDate()}</span>
                {count > 0 && <span style={{ fontSize:10, fontWeight:900, color:GOLD }}>{count}</span>}
              </button>
            )
          })}
        </div>
        <div style={{ border:`2px solid ${DARK}` }}>
          <div style={{ padding:'14px 20px', background:DARK, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:14, fontWeight:900, color:'#fff', letterSpacing:'-0.4px', textTransform:'capitalize' }}>
              {DAYS_FULL[activeDay]}, {weekDays[activeDay]?.toLocaleDateString('fr-FR', { day:'numeric', month:'long' })}
            </span>
            <span style={{ fontSize:12, fontWeight:800, color:GOLD }}>{getByDate(weekDays[activeDay]).length} rés.</span>
          </div>
          {(() => {
            const res = getByDate(weekDays[activeDay])
            return res.length === 0 ? <Empty /> : res.map((r, i) => <ResRow key={r.id} r={r} last={i===res.length-1} />)
          })()}
        </div>
      </div>

      {/* Desktop — 7 columns */}
      <div className="wk-desktop">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === today
          const res     = getByDate(day)
          return (
            <div key={i} style={{ border:`${isToday?2:1}px solid ${isToday?GOLD:'rgba(43,33,24,0.12)'}` }}>
              <div style={{ padding:'12px 10px', background: isToday ? GOLD : DARK }}>
                <div style={{ fontSize:8, fontWeight:900, letterSpacing:'0.2em', color: isToday ? DARK : GOLD, marginBottom:5 }}>{DAYS_SHORT[i]}</div>
                <div style={{ fontSize:22, fontWeight:900, color: isToday ? DARK : '#fff', lineHeight:1, letterSpacing:'-1px' }}>{day.getDate()}</div>
                {res.length > 0 && <div style={{ marginTop:4, fontSize:10, fontWeight:800, color: isToday ? DARK : GOLD }}>{res.length} rés.</div>}
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
  const [hovIdx, setHovIdx] = useState(null)

  return (
    <div style={{ border:`2px solid ${DARK}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:DARK }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ padding:'10px 4px', textAlign:'center', fontSize:9, fontWeight:900, color:GOLD, letterSpacing:'0.15em' }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
        {monthDays.map(({ date, current }, i) => {
          const isToday = date.toDateString() === today
          const res     = getByDate(date)
          const hov     = hovIdx === i
          return (
            <div key={i}
              onClick={() => { setCurrentDate(date); setView('day') }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)}
              style={{ borderBottom:'1px solid rgba(43,33,24,0.07)', borderRight:'1px solid rgba(43,33,24,0.07)', padding:6, minHeight:88, cursor:'pointer', opacity: current ? 1 : 0.3, background: isToday ? GOLD_BG : hov ? CREAM : '#fff', transition:'background 0.12s' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', marginBottom:5, display:'flex', alignItems:'center', justifyContent:'center', background: isToday ? GOLD : 'transparent', fontSize:12, fontWeight:900, color: isToday ? '#fff' : DARK }}>
                {date.getDate()}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {res.slice(0,2).map(r => <CompactCard key={r.id} r={r} />)}
                {res.length > 2 && <span style={{ fontSize:10, fontWeight:900, color:GOLD, paddingLeft:4 }}>+{res.length-2} de plus</span>}
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
  const [hovIdx, setHovIdx] = useState(null)
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
            onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)}
            style={{ padding:'20px 18px', border:`${isCurrent?2:1}px solid ${isCurrent?GOLD:hov?DARK:'rgba(43,33,24,0.12)'}`, background: isCurrent ? GOLD_BG : hov ? CREAM : '#fff', cursor:'pointer', transition:'all 0.13s' }}>
            <div style={{ fontSize:9, fontWeight:900, color: isCurrent?GOLD:'rgba(43,33,24,0.35)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:10 }}>{month}</div>
            <div style={{ fontSize:40, fontWeight:900, color:DARK, lineHeight:1, letterSpacing:'-2px', marginBottom:4 }}>{res.length}</div>
            <div style={{ fontSize:12, fontWeight:700, color:GOLD, marginBottom: res.length>0?14:0 }}>réservation{res.length!==1?'s':''}</div>
            {res.length > 0 && (
              <div style={{ borderTop:'1px solid rgba(43,33,24,0.08)', paddingTop:12, display:'flex', flexDirection:'column', gap:5 }}>
                {confirmed>0 && <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:11, fontWeight:700, color:'rgba(43,33,24,0.5)' }}>Confirmées</span><span style={{ fontSize:15, fontWeight:900, color:DARK }}>{confirmed}</span></div>}
                {pending>0   && <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:11, fontWeight:700, color:'rgba(43,33,24,0.5)' }}>En attente</span><span style={{ fontSize:15, fontWeight:900, color:GOLD }}>{pending}</span></div>}
                {cancelled>0 && <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:11, fontWeight:700, color:'rgba(43,33,24,0.5)' }}>Annulées</span><span style={{ fontSize:15, fontWeight:900, color:'rgba(43,33,24,0.28)' }}>{cancelled}</span></div>}
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
      {view==='day'   && <DayView   date={currentDate} getByDate={getByDate} />}
      {view==='week'  && <WeekView  weekDays={weekDays} getByDate={getByDate} />}
      {view==='month' && <MonthView monthDays={monthDays} currentDate={currentDate} getByDate={getByDate} setCurrentDate={setCurrentDate} setView={setView} />}
      {view==='year'  && <YearView  currentDate={currentDate} getByMonth={getByMonth} setCurrentDate={setCurrentDate} setView={setView} />}
    </div>
  )
}