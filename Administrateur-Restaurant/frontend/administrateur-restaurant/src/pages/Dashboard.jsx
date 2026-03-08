import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, CheckCircle, Clock, XCircle, ClipboardList, ArrowRight } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp     from '../components/Dashboard/FadeUp'
import Spinner    from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'
import { exportPDF } from '../utils/exportPDF'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const GREEN     = '#4a7c59'
const GREEN_BG  = '#f0f7f2'
const AMBER     = '#c8a97e'
const AMBER_BG  = '#fdf6ec'
const RED       = '#b94040'
const RED_BG    = '#fdf0f0'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <span style={{ fontVariantNumeric:'tabular-nums' }}>{time.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
}

/* ── Donut ── */
function Donut({ confirmed, pending, cancelled, size=100 }) {
  const total = confirmed + pending + cancelled
  const r = 15, circ = 2 * Math.PI * r
  const pct = v => (v / Math.max(total,1)) * circ
  const slices = [
    { v: confirmed, color: GREEN  },
    { v: pending,   color: AMBER  },
    { v: cancelled, color: RED    },
  ]
  let offset = 0
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="#ede8e2" strokeWidth="5.5" />
        {total === 0
          ? <circle cx="18" cy="18" r={r} fill="none" stroke="#ede8e2" strokeWidth="5.5" />
          : slices.map((s,i) => {
              if (s.v === 0) return null
              const el = (
                <circle key={i} cx="18" cy="18" r={r} fill="none"
                  stroke={s.color} strokeWidth="5.5"
                  strokeDasharray={`${pct(s.v)} ${circ - pct(s.v)}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += pct(s.v)
              return el
            })
        }
      </svg>
      {/* Centre label */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:13, fontWeight:900, color:DARK, fontVariantNumeric:'tabular-nums' }}>{total}</span>
      </div>
    </div>
  )
}

/* ── Bar chart (horizontal) ── */
function BarGroup({ confirmed, pending, cancelled }) {
  const total = Math.max(confirmed + pending + cancelled, 1)
  const bars = [
    { label:'Confirmées', value:confirmed, color:GREEN,  bg:GREEN_BG },
    { label:'En attente', value:pending,   color:AMBER,  bg:AMBER_BG },
    { label:'Annulées',   value:cancelled, color:RED,    bg:RED_BG   },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
      {bars.map(b => {
        const pct = Math.round((b.value / total) * 100)
        return (
          <div key={b.label}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:11, fontWeight:800, color:b.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{b.label}</span>
              <span style={{ fontSize:11, fontWeight:900, color:DARK, fontVariantNumeric:'tabular-nums' }}>{b.value}</span>
            </div>
            <div style={{ height:6, background:'#f0ebe4', borderRadius:3, overflow:'hidden' }}>
              <ProgressBar pct={pct} color={b.color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProgressBar({ pct, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 300); return () => clearTimeout(t) }, [pct])
  return <div style={{ height:'100%', width:`${w}%`, background:color, borderRadius:3, transition:'width 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
}

/* ── Tiny sparkline ── */
function Spark({ value, color = DARK, w = 72, h = 28 }) {
  const seed = Math.max(value, 1)
  const raw  = Array.from({length:7},(_,i) => Math.max(0, seed * (0.5 + 0.5 * Math.sin(i * 1.7 + seed % 5))))
  raw[6] = seed
  const max = Math.max(...raw, 1)
  const pts = raw.map((v,i) => `${(i/(raw.length-1))*w},${h - (v/max)*(h-5)-2}`).join(' ')
  const lastX = w, lastY = h - (seed/max)*(h-5)-2
  return (
    <svg width={w} height={h} style={{ display:'block', flexShrink:0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx={lastX} cy={lastY} r="2.8" fill={color} />
    </svg>
  )
}

/* ── Stat card ── */
function StatCard({ icon:Icon, value, label, color, bg, delay=0, total=0, spark=true }) {
  const n   = useCountUp(value, 750, delay)
  const pct = total > 0 ? Math.round((value/total)*100) : null
  return (
    <div style={{ background:bg, padding:'16px 20px', borderRadius:2, borderTop:`3px solid ${color}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Icon size={16} strokeWidth={2.2} color={color} />
          <span style={{ fontSize:11, fontWeight:800, color, textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</span>
        </div>
        {spark && <Spark value={value} color={color} />}
      </div>
      <p style={{ margin:'10px 0 0', fontSize:'clamp(32px,3.5vw,48px)', fontWeight:900, color:DARK, letterSpacing:'-2px', fontVariantNumeric:'tabular-nums', lineHeight:1, fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
      {pct !== null && (
        <div style={{ marginTop:8, height:3, background:'#e8e0d8', borderRadius:2, overflow:'hidden' }}>
          <ProgressBar pct={pct} color={color} />
        </div>
      )}
    </div>
  )
}

function HeroNum({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{ margin:0, fontSize:'clamp(72px,10vw,140px)', fontWeight:900, color:DARK, lineHeight:0.85, fontVariantNumeric:'tabular-nums', letterSpacing:'-5px', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
  )
}

function Btn({ children, onClick, primary, disabled, icon:Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov?DARK:GOLD) : (hov?GOLD:DARK)
  const color = primary ? (hov?GOLD:DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', background:bg, border:'none', color, fontSize:13, fontWeight:800, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'background 0.15s,color 0.15s', fontFamily:'inherit', letterSpacing:'-0.2px', whiteSpace:'nowrap' }}
    >
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

function Section({ text, sub }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,30px)', fontWeight:900, color:DARK, letterSpacing:'-1px', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{text}</h2>
      {sub && <p style={{ margin:'4px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>{sub}</p>}
    </div>
  )
}

/* ── Day block: hero + donut + bars + cards ── */
function DayBlock({ total, confirmed, pending, cancelled, label, btnLabel, onBtn, delay=0 }) {
  const n = useCountUp(total, 900, delay)
  return (
    <div>
      {/* Row 1: big number + donut + bar chart */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:32, alignItems:'center', marginBottom:24 }}>
        {/* Hero */}
        <div style={{ minWidth:120 }}>
          <p style={{ margin:0, fontSize:'clamp(64px,9vw,120px)', fontWeight:900, color:DARK, lineHeight:0.85, fontVariantNumeric:'tabular-nums', letterSpacing:'-4px', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
          <p style={{ margin:'10px 0 16px', fontSize:13, fontWeight:800, color:DARK }}>{label}</p>
          <Btn icon={ArrowRight} primary onClick={onBtn}>{btnLabel}</Btn>
        </div>
        {/* Donut */}
        <Donut confirmed={confirmed} pending={pending} cancelled={cancelled} size={90} />
        {/* Bar chart */}
        <BarGroup confirmed={confirmed} pending={pending} cancelled={cancelled} />
      </div>
      {/* Row 2: stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        <StatCard icon={CheckCircle} value={confirmed} label="Confirmées" color={GREEN} bg={GREEN_BG} delay={delay+40}  total={total} />
        <StatCard icon={Clock}       value={pending}   label="En attente" color={AMBER} bg={AMBER_BG} delay={delay+70}  total={total} />
        <StatCard icon={XCircle}     value={cancelled} label="Annulées"   color={RED}   bg={RED_BG}   delay={delay+100} total={total} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const navigate                           = useNavigate()
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  const today = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})
  const go    = f => navigate('/reservations',{state:f})

  async function handleRefresh() { setRefreshing(true); try{await refetch()}finally{setRefreshing(false)} }
  async function handleExportPDF() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s) })
      exportPDF(stats)
    } catch(e){console.error(e)} finally{setExporting(false)}
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        .wrap { max-width:980px; margin:0 auto; padding:clamp(24px,4vw,52px) clamp(20px,3.5vw,44px); }
        .hr   { height:2px; background:${DARK}; margin:44px 0; }
        @media(max-width:500px){ .cards-3 { grid-template-columns:1fr !important; } }
        @media(max-width:640px){ .cards-3 { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:420px){ .month-grid { flex-direction:column !important; } }
      `}</style>

      <div className="wrap">

        {/* Topbar */}
        <FadeUp delay={0}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:48 }}>
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,42px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>Tableau de bord</h1>
              <p style={{ margin:'7px 0 0', fontSize:13, fontWeight:700, color:GOLD, textTransform:'capitalize' }}>{today}&nbsp;·&nbsp;<LiveClock /></p>
            </div>
            <div style={{ display:'flex', gap:3 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>{refreshing?'Actualisation…':'Actualiser'}</Btn>
              <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>{exporting?'Génération…':'Exporter PDF'}</Btn>
            </div>
          </div>
        </FadeUp>

        {/* Aujourd'hui */}
        <FadeUp delay={40}>
          <Section text="Aujourd'hui" sub="Réservations du jour" />
          <DayBlock
            total={stats.today} confirmed={stats.today_confirmed}
            pending={stats.today_pending} cancelled={stats.today_cancelled}
            label="réservations aujourd'hui" btnLabel="Voir aujourd'hui"
            onBtn={() => go({filterDate:TODAY_DATE})} delay={60}
          />
        </FadeUp>

        <div className="hr" />

        {/* Demain */}
        <FadeUp delay={200}>
          <Section text="Demain" sub="Planning du lendemain" />
          <DayBlock
            total={stats.tomorrow} confirmed={stats.tomorrow_confirmed??0}
            pending={stats.tomorrow_pending??0} cancelled={stats.tomorrow_cancelled??0}
            label="réservations demain" btnLabel="Voir demain"
            onBtn={() => go({filterDate:TOMORROW_DATE})} delay={220}
          />
        </FadeUp>

        <div className="hr" />

        {/* Ce mois */}
        <FadeUp delay={360}>
          <Section text="Ce mois" sub="Bilan mensuel des réservations" />
          <DayBlock
            total={stats.total} confirmed={stats.confirmed}
            pending={stats.pending} cancelled={stats.cancelled}
            label="réservations ce mois" btnLabel="Voir tout le mois"
            onBtn={() => go({})} delay={380}
          />
        </FadeUp>

        {error && <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}