import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp     from '../components/Dashboard/FadeUp'
import Spinner    from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'
import { exportPDF } from '../utils/exportPDF'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const GOLD_BG   = '#fdf6ec'
const DARK_BG   = '#faf8f5'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ── Live clock ── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <span style={{ fontVariantNumeric:'tabular-nums' }}>{time.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
}

/* ── Animated progress bar ── */
function Bar({ pct, color, height = 4 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 400); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{ height, background:'#ede8e2', borderRadius:2, overflow:'hidden', marginTop:6 }}>
      <div style={{ height:'100%', width:`${w}%`, background:color, borderRadius:2, transition:'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  )
}

/* ── Donut SVG — DARK/GOLD palette ── */
function Donut({ confirmed, pending, cancelled, size=96 }) {
  const total = confirmed + pending + cancelled
  const r = 14, circ = 2 * Math.PI * r
  const colors = [DARK, GOLD, '#d4b896']
  const vals   = [confirmed, pending, cancelled]
  let off = 0
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t) }, [])

  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="#ede8e2" strokeWidth="5" />
        {total > 0 && vals.map((v, i) => {
          if (v === 0) { off += (v/total)*circ; return null }
          const dash = animated ? (v/total)*circ : 0
          const el = (
            <circle key={i} cx="18" cy="18" r={r} fill="none"
              stroke={colors[i]} strokeWidth="5"
              strokeDasharray={`${(v/total)*circ} ${circ}`}
              strokeDashoffset={-off}
              style={{ transition:'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)', transitionDelay:`${i*0.15}s` }}
            />
          )
          off += (v/total)*circ
          return el
        })}
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:11, fontWeight:900, color:DARK, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{total}</span>
        <span style={{ fontSize:8, fontWeight:700, color:GOLD_DARK, letterSpacing:'0.05em' }}>TOTAL</span>
      </div>
    </div>
  )
}

/* ── Horizontal bar chart ── */
function BarChart({ confirmed, pending, cancelled }) {
  const total = Math.max(confirmed + pending + cancelled, 1)
  const rows = [
    { label:'Confirmées', v:confirmed, color:DARK  },
    { label:'En attente', v:pending,   color:GOLD  },
    { label:'Annulées',   v:cancelled, color:'#d4b896' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1, minWidth:0 }}>
      {rows.map(r => (
        <div key={r.label}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
            <span style={{ fontSize:10, fontWeight:800, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.1em' }}>{r.label}</span>
            <span style={{ fontSize:14, fontWeight:900, color:DARK, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
          </div>
          <Bar pct={Math.round((r.v/total)*100)} color={r.color} height={5} />
        </div>
      ))}
    </div>
  )
}

/* ── Stat pill with sparkline ── */
function StatPill({ icon:Icon, value, label, gold=false, delay=0, total=0 }) {
  const n   = useCountUp(value, 750, delay)
  const pct = total > 0 ? Math.round((value/total)*100) : 0
  const color = gold ? GOLD_DARK : DARK
  const bg    = gold ? GOLD_BG   : DARK_BG

  // Simple sparkline based on value
  const pts = Array.from({length:7}, (_,i) => {
    const v = Math.max(0, value * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(i*1.4 + value%7))))
    return v
  })
  pts[6] = value
  const max = Math.max(...pts, 1)
  const svgPts = pts.map((v,i) => `${(i/6)*56},${22-(v/max)*18}`).join(' ')

  return (
    <div style={{ background:bg, padding:'14px 18px', borderLeft:`3px solid ${color}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
          <Icon size={14} strokeWidth={2.2} color={color} style={{ flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:800, color:'#999', textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap' }}>{label}</span>
        </div>
        {/* Sparkline */}
        <svg width="58" height="24" style={{ flexShrink:0, opacity:0.6 }}>
          <polyline points={svgPts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="56" cy={22-(value/max)*18} r="2.2" fill={color} />
        </svg>
      </div>
      <p style={{ margin:'8px 0 0', fontSize:'clamp(26px,3vw,40px)', fontWeight:900, color, fontVariantNumeric:'tabular-nums', lineHeight:1, letterSpacing:'-1.5px', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
      {total > 0 && (
        <>
          <Bar pct={pct} color={color} height={3} />
          <span style={{ fontSize:9, fontWeight:700, color:'#bbb', marginTop:2, display:'block' }}>{pct}%</span>
        </>
      )}
    </div>
  )
}

function HeroNum({ value, delay=60 }) {
  const n = useCountUp(value, 900, delay)
  return (
    <p style={{ margin:0, fontSize:'clamp(68px,9vw,128px)', fontWeight:900, color:DARK, lineHeight:0.85, fontVariantNumeric:'tabular-nums', letterSpacing:'-5px', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
  )
}

function Btn({ children, onClick, primary, disabled, icon:Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', background:primary?(hov?DARK:GOLD):(hov?GOLD:DARK), border:'none', color:primary?(hov?GOLD:DARK):'#fff', fontSize:13, fontWeight:800, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'background 0.15s,color 0.15s', fontFamily:'inherit', whiteSpace:'nowrap' }}
    >
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

function SectionHead({ text, sub }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,30px)', fontWeight:900, color:DARK, letterSpacing:'-1px', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{text}</h2>
      {sub && <p style={{ margin:'4px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>{sub}</p>}
    </div>
  )
}

/* ── Reusable day section ── */
function DaySection({ total, confirmed, pending, cancelled, sublabel, btnLabel, onBtn, delay }) {
  return (
    <>
      {/* Top row: hero number + donut + bar chart */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:28, alignItems:'center', marginBottom:20 }}>
        <div style={{ flexShrink:0 }}>
          <HeroNum value={total} delay={delay} />
          <p style={{ margin:'10px 0 16px', fontSize:13, fontWeight:800, color:DARK }}>{sublabel}</p>
          <Btn icon={ArrowRight} primary onClick={onBtn}>{btnLabel}</Btn>
        </div>
        {/* Chart area */}
        <div style={{ display:'flex', gap:20, flex:1, minWidth:200, alignItems:'center' }}>
          <Donut confirmed={confirmed} pending={pending} cancelled={cancelled} size={88} />
          <BarChart confirmed={confirmed} pending={pending} cancelled={cancelled} />
        </div>
      </div>
      {/* Bottom: 3 pills */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        <StatPill icon={CheckCircle} value={confirmed} label="Confirmées" delay={delay+40}  total={total} />
        <StatPill icon={Clock}       value={pending}   label="En attente" gold delay={delay+70}  total={total} />
        <StatPill icon={XCircle}     value={cancelled} label="Annulées"   delay={delay+100} total={total} />
      </div>
    </>
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
        .dash-wrap { max-width:960px; margin:0 auto; padding:clamp(24px,4vw,52px) clamp(20px,3.5vw,44px); }
        .dash-hr   { height:2px; background:${DARK}; margin:44px 0; }
        @media(max-width:600px){
          .pills-3 { grid-template-columns:1fr !important; }
          .chart-area { flex-direction:column !important; }
        }
        @media(max-width:420px){
          .day-top { flex-direction:column !important; }
        }
      `}</style>

      <div className="dash-wrap">

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
          <SectionHead text="Aujourd'hui" sub="Réservations du jour" />
          <DaySection
            total={stats.today} confirmed={stats.today_confirmed}
            pending={stats.today_pending} cancelled={stats.today_cancelled}
            sublabel="réservations aujourd'hui" btnLabel="Voir aujourd'hui"
            onBtn={() => go({filterDate:TODAY_DATE})} delay={60}
          />
        </FadeUp>

        <div className="dash-hr" />

        {/* Demain */}
        <FadeUp delay={200}>
          <SectionHead text="Demain" sub="Planning du lendemain" />
          <DaySection
            total={stats.tomorrow} confirmed={stats.tomorrow_confirmed??0}
            pending={stats.tomorrow_pending??0} cancelled={stats.tomorrow_cancelled??0}
            sublabel="réservations demain" btnLabel="Voir demain"
            onBtn={() => go({filterDate:TOMORROW_DATE})} delay={220}
          />
        </FadeUp>

        <div className="dash-hr" />

        {/* Ce mois */}
        <FadeUp delay={360}>
          <SectionHead text="Ce mois" sub="Bilan mensuel des réservations" />
          <DaySection
            total={stats.total} confirmed={stats.confirmed}
            pending={stats.pending} cancelled={stats.cancelled}
            sublabel="réservations ce mois" btnLabel="Voir tout le mois"
            onBtn={() => go({})} delay={380}
          />
        </FadeUp>

        {error && <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}