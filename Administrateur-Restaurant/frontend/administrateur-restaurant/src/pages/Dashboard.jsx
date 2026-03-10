import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'

import useDashboardStats  from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo  from '../hooks/useRestaurantInfo'
import FadeUp             from '../components/Dashboard/FadeUp'
import Spinner            from '../components/Dashboard/Spinner'
import useCountUp         from '../hooks/Dashboard/useCountUp'
import { exportPDF }      from '../utils/exportPDF'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const GOLD_BG   = '#fdf6ec'
const CREAM     = '#faf8f5'

/* ── Status colors ── */
const GREEN    = '#1e7a4a'
const GREEN_LT = '#f0faf5'
const RED      = '#b94040'
const RED_LT   = '#fdf0f0'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ── Live clock ── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return <span style={{ fontVariantNumeric:'tabular-nums' }}>{t.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
}

/* ── Donut ── */
function Donut({ c, p, a, size = 110 }) {
  const total = c + p + a
  const r = 13, circ = 2 * Math.PI * r
  const segs = [
    { v: c, color: GREEN },
    { v: p, color: GOLD  },
    { v: a, color: RED   },
  ]
  let off = 0
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e8e0d6" strokeWidth="4.5" />
        {total > 0 && segs.map((s, i) => {
          if (!s.v) { off += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el = (
            <circle key={i} cx="18" cy="18" r={r} fill="none"
              stroke={s.color} strokeWidth="4.5"
              strokeDasharray={`${arc} ${circ}`}
              strokeDashoffset={-off}
              style={{ transition:`stroke-dasharray 0.9s ease ${i * 0.1}s` }}
            />
          )
          off += arc; return el
        })}
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 }}>
        <span style={{ fontSize:12, fontWeight:900, color:DARK, lineHeight:1 }}>{total}</span>
        <span style={{ fontSize:7, fontWeight:800, color:GOLD_DARK, textTransform:'uppercase', letterSpacing:'0.06em' }}>total</span>
      </div>
    </div>
  )
}

/* ── Animated bar ── */
function AnimBar({ pct, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { const id = setTimeout(() => setW(pct), 500); return () => clearTimeout(id) }, [pct])
  return (
    <div style={{ height:8, background:'#e8e0d6', overflow:'hidden', marginTop:10 }}>
      <div style={{ height:'100%', width:`${w}%`, background:color, transition:'width 1s ease' }} />
    </div>
  )
}

/* ── Stat card ── */
function StatCard({ icon:Icon, value, label, variant='dark', delay=0, total=0 }) {
  const n   = useCountUp(value, 700, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : 0

  const V = {
    green: { bg: GREEN_LT, border: GREEN,    text: GREEN    },
    gold:  { bg: GOLD_BG,  border: GOLD,     text: GOLD_DARK },
    red:   { bg: RED_LT,   border: RED,      text: RED      },
    dark:  { bg: CREAM,    border: DARK,     text: DARK     },
  }
  const s = V[variant] || V.dark

  return (
    <div style={{ background:s.bg, padding:'20px 18px', borderTop:`3px solid ${s.border}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <Icon size={13} strokeWidth={2.5} color={s.text} />
        <span style={{ fontSize:10, fontWeight:900, color:s.text, textTransform:'uppercase', letterSpacing:'0.12em', opacity:0.85 }}>{label}</span>
      </div>
      <p style={{ margin:0, fontSize:'clamp(28px,3vw,42px)', fontWeight:900, color:s.text, letterSpacing:'-1.5px', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{n}</p>
      {total > 0 && (
        <>
          <AnimBar pct={pct} color={s.border} />
          <span style={{ fontSize:9, fontWeight:800, color:s.text, marginTop:4, display:'block', opacity:0.65 }}>{pct}%</span>
        </>
      )}
    </div>
  )
}

/* ── Hero counter ── */
function Hero({ value, delay=0 }) {
  const n = useCountUp(value, 800, delay)
  return (
    <p style={{ margin:0, fontSize:'clamp(80px,10vw,136px)', fontWeight:900, color:DARK, lineHeight:0.85, letterSpacing:'-5px', fontVariantNumeric:'tabular-nums', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
  )
}

/* ── Button ── */
function Btn({ children, onClick, primary, disabled, icon:Icon, full }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', justifyContent: full ? 'center' : 'flex-start', gap:8, padding:'13px 24px', background:bg, border:'none', color, fontSize:13, fontWeight:800, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'background 0.15s,color 0.15s', fontFamily:'inherit', whiteSpace:'nowrap', width: full ? '100%' : 'auto' }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

/* ── Section heading ── */
function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom:32 }}>
      <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>{title}</h2>
      <p style={{ margin:'5px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>{sub}</p>
    </div>
  )
}

/* ── Legend ── */
const LEGEND = [
  { label:'Confirmées', color: GREEN },
  { label:'En attente', color: GOLD  },
  { label:'Annulées',   color: RED   },
]
function Legend() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {LEGEND.map(x => (
        <div key={x.label} style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:x.color, flexShrink:0 }} />
          <span style={{ fontSize:11, fontWeight:800, color:DARK }}>{x.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Reservations mini-table ── */
function MiniTable({ reservations, onViewAll }) {
  if (!reservations || reservations.length === 0) return null

  const STATUS = {
    Confirmed: { label:'Confirmée',  bg: GREEN_LT, color: GREEN },
    Pending:   { label:'En attente', bg: GOLD_BG,  color: GOLD_DARK },
    Cancelled: { label:'Annulée',    bg: RED_LT,   color: RED  },
  }

  return (
    <div style={{ marginTop:32, border:`2px solid ${DARK}` }}>
      {/* table header */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', background:DARK, padding:'11px 18px', gap:16 }}>
        <span style={{ fontSize:9, fontWeight:900, color:GOLD, textTransform:'uppercase', letterSpacing:'0.15em' }}>Client</span>
        <span style={{ fontSize:9, fontWeight:900, color:GOLD, textTransform:'uppercase', letterSpacing:'0.15em' }}>Heure</span>
        <span style={{ fontSize:9, fontWeight:900, color:GOLD, textTransform:'uppercase', letterSpacing:'0.15em' }}>Statut</span>
      </div>

      {/* rows */}
      {reservations.slice(0, 5).map((r, i) => {
        const s = STATUS[r.status] || STATUS.Pending
        return (
          <div key={r.id ?? i}
            style={{ display:'grid', gridTemplateColumns:'1fr auto auto', padding:'12px 18px', gap:16, alignItems:'center', background: i % 2 === 0 ? '#fff' : CREAM, borderTop:`1px solid rgba(43,33,24,0.07)` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:900, color:DARK, letterSpacing:'-0.3px' }}>{r.name}</div>
              {r.guests && <div style={{ fontSize:11, fontWeight:700, color:'rgba(43,33,24,0.45)', marginTop:1 }}>{r.guests} pers.</div>}
            </div>
            <span style={{ fontSize:13, fontWeight:900, color:DARK, fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>{r.start_time}</span>
            <span style={{ fontSize:10, fontWeight:900, color:s.color, background:s.bg, padding:'4px 10px', whiteSpace:'nowrap', letterSpacing:'0.05em' }}>
              {s.label}
            </span>
          </div>
        )
      })}

      {/* footer — voir tout */}
      <button onClick={onViewAll}
        style={{ width:'100%', padding:'13px 18px', background:DARK, border:'none', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'inherit', borderTop:`2px solid ${DARK}` }}>
        <span>Voir toutes les réservations</span>
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ── Full section block ── */
function Section({ delay, title, sub, heroVal, heroDelay, subLabel, c, p, a, onView, filterDate, miniRes }) {
  const navigate = useNavigate()
  const go = () => navigate('/reservations', { state: filterDate ? { filterDate } : {} })

  return (
    <FadeUp delay={delay}>
      <SectionHead title={title} sub={sub} />
      <div className="db-section">

        {/* Left */}
        <div>
          <Hero value={heroVal} delay={heroDelay} />
          <p style={{ margin:'10px 0 24px', fontSize:13, fontWeight:800, color:'rgba(43,33,24,0.45)' }}>{subLabel}</p>
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28 }}>
            <Donut c={c} p={p} a={a} size={110} />
            <Legend />
          </div>
          <Btn icon={ArrowRight} primary onClick={go}>Voir les réservations</Btn>
        </div>

        {/* Right */}
        <div>
          <div className="db-cards">
            <StatCard icon={CheckCircle} value={c} label="Confirmées" variant="green" delay={heroDelay+30} total={c+p+a} />
            <StatCard icon={Clock}       value={p} label="En attente" variant="gold"  delay={heroDelay+60} total={c+p+a} />
            <StatCard icon={XCircle}     value={a} label="Annulées"   variant="red"   delay={heroDelay+90} total={c+p+a} />
          </div>
          <MiniTable reservations={miniRes} onViewAll={go} />
        </div>

      </div>
    </FadeUp>
  )
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info }                           = useRestaurantInfo()

  /* mini tables — fetch reservations for today / tomorrow */
  const [todayRes,    setTodayRes]    = useState([])
  const [tomorrowRes, setTomorrowRes] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const h     = { Authorization: `Bearer ${token}` }
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomorrowRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })

  async function handleRefresh() { setRefreshing(true); try { await refetch() } finally { setRefreshing(false) } }
  async function handleExportPDF() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res,rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s) })
      exportPDF(stats)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .db-wrap    { max-width:1100px; margin:0 auto; padding:clamp(24px,4vw,52px) clamp(16px,3.5vw,48px); }
        .db-hr      { height:2px; background:${DARK}; margin:52px 0; }
        .db-section { display:grid; grid-template-columns:260px 1fr; gap:48px; align-items:start; }
        .db-cards   { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        @media(max-width:900px)  { .db-section { grid-template-columns:1fr; gap:28px; } }
        @media(max-width:560px)  { .db-cards { grid-template-columns:1fr 1fr; } }
        @media(max-width:400px)  {
          .db-cards { grid-template-columns:1fr; }
          .db-topbtns { flex-direction:column; width:100%; }
          .db-topbtns button { justify-content:center; }
        }
      `}</style>

      <div className="db-wrap">

        {/* ── PAGE TITLE ── */}
        <FadeUp delay={0}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:20 }}>
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'7px 0 0', fontSize:13, fontWeight:700, color:GOLD, textTransform:'capitalize' }}>
                {today}&nbsp;·&nbsp;<LiveClock />
              </p>
            </div>
            <div className="db-topbtns" style={{ display:'flex', gap:3 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>{refreshing?'Actualisation…':'Actualiser'}</Btn>
              <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>{exporting?'Génération…':'Exporter PDF'}</Btn>
            </div>
          </div>
          <div style={{ height:2, background:DARK, margin:'20px 0 52px' }} />
        </FadeUp>

        {/* ── AUJOURD'HUI ── */}
        <Section
          delay={50}
          title="Aujourd'hui"
          sub="Réservations du jour"
          heroVal={stats.today}
          heroDelay={70}
          subLabel="réservations aujourd'hui"
          c={stats.today_confirmed}
          p={stats.today_pending}
          a={stats.today_cancelled}
          filterDate={TODAY_DATE}
          miniRes={todayRes}
        />

        <div className="db-hr" />

        {/* ── DEMAIN ── */}
        <Section
          delay={200}
          title="Demain"
          sub="Planning du lendemain"
          heroVal={stats.tomorrow}
          heroDelay={220}
          subLabel="réservations demain"
          c={stats.tomorrow_confirmed ?? 0}
          p={stats.tomorrow_pending   ?? 0}
          a={stats.tomorrow_cancelled ?? 0}
          filterDate={TOMORROW_DATE}
          miniRes={tomorrowRes}
        />

        <div className="db-hr" />

        {/* ── CE MOIS ── */}
        <Section
          delay={360}
          title="Ce mois"
          sub="Bilan mensuel des réservations"
          heroVal={stats.total}
          heroDelay={380}
          subLabel="réservations ce mois"
          c={stats.confirmed}
          p={stats.pending}
          a={stats.cancelled}
          filterDate={null}
          miniRes={[]}
        />

        {error && <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}