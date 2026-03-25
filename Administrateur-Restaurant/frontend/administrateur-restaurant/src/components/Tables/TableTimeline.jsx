
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.10)'
const GREEN     = '#16A34A'

const STATUS = {
  Confirmed: { bg: '#16A34A', border: '#86efac', text: '#fff', label: 'Confirmée'  },
  Pending:   { bg: '#b45309', border: '#fcd34d', text: '#fff', label: 'En attente' },
}

// ── Helpers ────────────────────────────────────────────────────────
function toDecimal(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h + (m || 0) / 60
}

function decimalToTime(dec) {
  const h = Math.floor(dec % 24)
  const m = Math.round((dec - Math.floor(dec)) * 60)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}

function formatShort(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function formatMonthYear(y, m) {
  return new Date(y, m, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function toISO(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

function getOpenHours(allOH, iso) {
  if (!allOH?.length || !iso) return { hS: 11, hE: 23 }
  const jsDay = new Date(iso + 'T00:00:00').getDay()
  let lo = Infinity, hi = -Infinity
  allOH.forEach(oh => {
    const s = oh.openhours?.[jsDay] ?? oh.openhours?.[0]
    if (!s) return
    const a = parseInt(s.h1 ?? 11) + parseInt(s.m1 ?? 0) / 60
    const b = parseInt(s.h2 ?? 23) + parseInt(s.m2 ?? 0) / 60
    if (a < lo) lo = a
    if (b > hi) hi = b
  })
  if (!isFinite(lo)) return { hS: 11, hE: 23 }
  return { hS: Math.max(0, Math.floor(lo)), hE: Math.min(24, Math.ceil(hi)) }
}

function getDur(services, name) {
  if (!name) return 1
  const s = services.find(x => x.name === name)
  return s?.duration ? Math.max(15/60, parseInt(s.duration) / 60) : 1
}

// Returns left% and width% — NO minimum on width% so real duration is respected
function getPos(startT, endT, hS, hE) {
  const s = toDecimal(startT)
  if (s === null) return null
  const e  = toDecimal(endT) ?? (s + 1)
  const tH = hE - hS
  if (tH <= 0) return null
  const l = ((s - hS) / tH) * 100
  const w = ((e - s)  / tH) * 100
  return { l: Math.max(0, l), w: Math.max(0, Math.min(w, 100 - Math.max(0, l))), wPct: w }
}

function buildLanes(reservations, services) {
  const sorted = [...reservations].sort(
    (a, b) => (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )
  const ends = []
  return sorted.map(r => {
    const s   = toDecimal(r.start_time) ?? 0
    const dur = getDur(services, r.service)
    const e   = r.end_time ? (toDecimal(r.end_time) ?? (s + dur)) : (s + dur)
    let lane  = ends.findIndex(x => x <= s + 0.005)
    if (lane === -1) lane = ends.length
    ends[lane] = e
    return { ...r, _e: e, lane }
  })
}

// ── Mini Calendar ──────────────────────────────────────────────────
function MiniCal({ value, onChange }) {
  const today   = new Date(); today.setHours(0,0,0,0)
  const init    = value ? new Date(value + 'T00:00:00') : today
  const todayISO = today.toISOString().slice(0,10)
  const [cur, setCur] = useState({ y: init.getFullYear(), m: init.getMonth() })

  const DAYS  = ['L','M','M','J','V','S','D']
  const dim   = (y,m) => new Date(y,m+1,0).getDate()
  const first = (y,m) => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1 }

  const cells = []
  for (let i=0; i<first(cur.y,cur.m); i++) cells.push(null)
  for (let d=1; d<=dim(cur.y,cur.m); d++) cells.push(d)

  return (
    <div style={{ background: '#fff', border: `3px solid ${DARK}`, userSelect: 'none' }}>
      {/* Header */}
      <div style={{ background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 8px' }}>
        <button onClick={() => setCur(c => c.m===0?{y:c.y-1,m:11}:{y:c.y,m:c.m-1})}
          style={{ background:DARK, border:`2px solid ${GOLD}`, cursor:'pointer', padding:'4px 10px', display:'flex', fontSize:10, fontWeight:900, color:GOLD }}>
          PRÉC
        </button>
        <span style={{ fontSize:12, fontWeight:900, color:'#fff', textTransform:'capitalize' }}>
          {formatMonthYear(cur.y, cur.m)}
        </span>
        <button onClick={() => setCur(c => c.m===11?{y:c.y+1,m:0}:{y:c.y,m:c.m+1})}
          style={{ background:DARK, border:`2px solid ${GOLD}`, cursor:'pointer', padding:'4px 10px', display:'flex', fontSize:10, fontWeight:900, color:GOLD }}>
          SUIV
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#eee', borderBottom:`2px solid ${DARK}` }}>
        {DAYS.map((d,i) => (
          <div key={i} style={{ padding:'6px 0', textAlign:'center', fontSize:9, fontWeight:900, color:DARK }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const iso  = toISO(cur.y, cur.m, day)
          const isSel = iso === value
          const isTdy = iso === todayISO
          return (
            <button key={day} onClick={() => onChange(iso)}
              style={{
                padding:'6px 0', border:'none',
                background: isSel ? DARK : isTdy ? GOLD : '#fff',
                color: isSel ? GOLD : DARK,
                fontSize:11, fontWeight: 900,
                cursor:'pointer', textAlign:'center',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Today shortcut */}
      <div style={{ padding:'8px', borderTop:`2px solid ${DARK}` }}>
        <button
          onClick={() => { onChange(todayISO); setCur({ y:today.getFullYear(), m:today.getMonth() }) }}
          style={{ width:'100%', padding:'8px', background: DARK, border:`none`, fontSize:11, fontWeight:900, color: GOLD, cursor:'pointer', fontFamily:'inherit' }}
        >
          AUJOURD'HUI
        </button>
      </div>
    </div>
  )
}



// ── Reservation block ──────────────────────────────────────────────
// KEY FIX: uses minWidth in px so even 15-min slots are always readable
function Block({ res, laneCount, laneIdx, hS, hE, services }) {
  const dur     = getDur(services, res.service)
  const sD      = toDecimal(res.start_time) ?? 0
  const eD      = res.end_time ? (toDecimal(res.end_time) ?? (sD + dur)) : (sD + dur)
  const pos     = getPos(res.start_time, decimalToTime(eD), hS, hE)
  if (!pos) return null

  const sc       = STATUS[res.status] ?? STATUS.Pending
  const rowPctH  = 84 / laneCount
  const topPct   = laneCount === 1 ? 50 : laneIdx * (100 / laneCount) + (100 / laneCount - rowPctH) / 2

  return (
    <div
      style={{
        position:       'absolute',
        left:           `${pos.l.toFixed(4)}%`,
        width:          `${pos.w.toFixed(4)}%`,
        top:            laneCount === 1 ? '50%' : `${topPct}%`,
        transform:      laneCount === 1 ? 'translateY(-50%)' : 'none',
        height:         laneCount === 1 ? '72%' : `${rowPctH}%`,
        minHeight:      22,
        background:     sc.bg,
        borderLeft:     `3px solid ${sc.border}`,
        display:        'flex',
        alignItems:     'center',
        padding:        '0 8px',
        overflow:       'hidden',
        cursor:         'default',
        zIndex:         laneIdx + 2,
        gap:            4,
        whiteSpace:     'nowrap',
      }}
    >

      <span style={{ fontSize:10, fontWeight:900, color:sc.text }}>
        {res.customer_name}
      </span>
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────
function Row({ row, isLast, hS, hE, hours, totalH, services, isToday }) {
  const hasRes    = row.reservations.length > 0
  const laned     = buildLanes(row.reservations, services)
  const laneCount = laned.length > 0 ? Math.max(...laned.map(r => r.lane)) + 1 : 1
  const rowH      = Math.max(50, laneCount * 44)

  // Measure track width in px for accurate block sizing
  const [trackPx, setTrackPx] = useState(0)
  const trackRef = (el) => { if (el) setTrackPx(el.getBoundingClientRect().width) }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'90px 1fr', borderBottom:isLast?'none':`1px solid ${BORDER}`, minHeight:rowH }}>

      {/* Table label */}
      <div style={{ padding:'0 10px', borderRight:`1px solid rgba(43,33,24,0.09)`, display:'flex', alignItems:'center', gap:7, background:'#fff', flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:900, color:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, minWidth:0 }}>
          {row.table_name}
        </span>
        {hasRes && (
          <span style={{ fontSize:9, fontWeight:900, padding:'1px 4px', background:DARK, color:GOLD, flexShrink:0 }}>
            {row.reservations.length}
          </span>
        )}
      </div>

      {/* Track */}
      <div ref={trackRef} style={{ position:'relative', overflow:'visible', background:hasRes?'#fff':'#fafaf8', minHeight:rowH }}>

        {hours.map((h,i) => (
          <div key={`bg${h}`} style={{ position:'absolute', left:`${(i/totalH)*100}%`, width:`${(1/totalH)*100}%`, top:0, bottom:0, background:i%2===0?'transparent':'rgba(43,33,24,0.012)', pointerEvents:'none' }} />
        ))}
        {hours.map((h,i) => i>0 && (
          <div key={`hl${h}`} style={{ position:'absolute', left:`${(i/totalH)*100}%`, top:0, bottom:0, width:1, background:'rgba(43,33,24,0.07)', pointerEvents:'none' }} />
        ))}
        {hours.map((h,i) => (
          <div key={`hh${h}`} style={{ position:'absolute', left:`${((i+0.5)/totalH)*100}%`, top:'55%', bottom:0, width:1, background:'rgba(43,33,24,0.03)', pointerEvents:'none' }} />
        ))}

        {isToday && (() => {
          const dec = new Date().getHours() + new Date().getMinutes() / 60
          if (dec < hS || dec > hE) return null
          return (
            <div style={{ position:'absolute', left:`${((dec-hS)/totalH)*100}%`, top:0, bottom:0, width:1, background:RED, zIndex:40, pointerEvents:'none' }} />
          )
        })()}

        {!hasRes && (
          <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:8, fontWeight:900, color:'rgba(43,33,24,0.06)', letterSpacing:'0.35em', textTransform:'uppercase', pointerEvents:'none', userSelect:'none' }}>
            libre
          </span>
        )}

        {laned.map(res => (
          <Block key={res.id} res={res} laneCount={laneCount} laneIdx={res.lane} hS={hS} hE={hE} services={services} trackPx={trackPx} />
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function TableTimeline({ controlledDate = null }) {
  const { timeline, loading, error, date, setDate, allOH, services } = useTablesTimeline()
  const today   = new Date().toISOString().slice(0, 10)
  const isToday = date === today

  useEffect(() => {
    if (controlledDate && controlledDate !== date) setDate(controlledDate)
  }, [controlledDate]) // eslint-disable-line

  const { hS, hE } = useMemo(() => getOpenHours(allOH, date), [allOH, date])
  const totalH   = Math.max(1, hE - hS)
  const hours    = Array.from({ length: hE - hS }, (_, i) => hS + i)
  const totalRes = timeline.reduce((s, t) => s + t.reservations.length, 0)

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tl-root  { display:flex; gap:12px; align-items:flex-start; }
        .tl-side  { width:190px; flex-shrink:0; }
        .tl-main  { flex:1; min-width:0; overflow-x:auto; }
        .tl-inner { min-width:440px; border:2px solid ${DARK}; overflow:hidden; }
        @media(max-width:640px){
          .tl-root  { flex-direction:column; }
          .tl-side  { width:100%; }
          .tl-inner { min-width:380px; }
        }
      `}</style>

      {error && (
        <div style={{ marginBottom:10, padding:'10px 14px', background:'#fef2f2', borderLeft:`3px solid ${RED}`, fontSize:12, fontWeight:700, color:RED }}>
          {error}
        </div>
      )}

      <div className="tl-root">

        {/* ── Sidebar calendar ── */}
        <div className="tl-side">
          <MiniCal value={date} onChange={setDate} />
          <div style={{ marginTop:8, padding:'7px 10px', background:DARK, display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ fontSize:11, fontWeight:900, color:'#fff', textTransform:'capitalize', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {formatShort(date)}
            </span>
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="tl-main">
          <div className="tl-inner">

            {/* Hour header */}
            <div style={{ display:'grid', gridTemplateColumns:'90px 1fr', background:DARK }}>
              <div style={{ padding:'7px 10px', borderRight:`1px solid rgba(200,169,126,0.15)`, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:9, fontWeight:900, color:GOLD, letterSpacing:'0.18em', textTransform:'uppercase' }}>Table</span>
              </div>
              <div style={{ position:'relative', height:30, overflowX:'hidden' }}>
                {hours.map((h,i) => {
                  const isNow = isToday && new Date().getHours()===h
                  return (
                    <div key={h} style={{ position:'absolute', left:`${(i/totalH)*100}%`, width:`${(1/totalH)*100}%`, top:0, bottom:0, display:'flex', alignItems:'center', paddingLeft:4, borderLeft:i>0?'1px solid rgba(200,169,126,0.1)':'none', background:isNow?'rgba(239,68,68,0.1)':'transparent' }}>
                      <span style={{ fontSize:9, fontWeight:isNow?900:500, color:isNow?RED:'rgba(200,169,126,0.55)', whiteSpace:'nowrap' }}>
                        {String(h%24).padStart(2,'0')}h
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {loading && (
              <div style={{ padding:'40px 0', textAlign:'center', background:'#fff' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', border:`3px solid ${BORDER}`, borderTopColor:GOLD, animation:'spin 0.8s linear infinite', margin:'0 auto 10px' }} />
                <p style={{ margin:0, fontSize:12, fontWeight:700, color:'rgba(43,33,24,0.3)' }}>Chargement…</p>
              </div>
            )}

            {!loading && timeline.length===0 && (
              <div style={{ padding:'40px 24px', textAlign:'center', background:'#fff' }}>
                <p style={{ margin:'0 0 4px', fontSize:13, fontWeight:900, color:DARK }}>Aucune table configurée</p>
                <p style={{ margin:0, fontSize:11, fontWeight:600, color:'rgba(43,33,24,0.3)' }}>Ajoutez des tables dans la section Tables.</p>
              </div>
            )}

            {!loading && timeline.length>0 && totalRes===0 && (
              <div style={{ padding:'10px 14px', background:'#fdf6ec', borderBottom:`1px solid rgba(200,169,126,0.18)`, display:'flex', alignItems:'center', gap:9 }}>
                <p style={{ margin:0, fontSize:12, fontWeight:900, color:DARK }}>
                  Aucune réservation {isToday?"aujourd'hui":`le ${formatShort(date)}`}
                  <span style={{ fontWeight:600, color:GOLD_DARK, marginLeft:8 }}>
                    · {timeline.length} table{timeline.length>1?'s':''} libre{timeline.length>1?'s':''}
                  </span>
                </p>
              </div>
            )}

            {!loading && timeline.map((row,i) => (
              <Row key={row.table_id} row={row} isLast={i===timeline.length-1} hS={hS} hE={hE} hours={hours} totalH={totalH} services={services} isToday={isToday} />
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}