import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock,
  XCircle, CalendarDays, ClipboardList, ArrowRight,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'
import { exportPDF } from '../utils/exportPDF'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

/* ── Live clock ── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

function Label({ text }) {
  return (
    <p style={{ margin:'0 0 22px', fontSize:11, fontWeight:900, color:DARK, letterSpacing:'0.28em', textTransform:'uppercase' }}>
      {text}
    </p>
  )
}

function HeroNum({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{
      margin:0, fontSize:'clamp(96px,13vw,196px)', fontWeight:900,
      color:DARK, lineHeight:0.85, fontVariantNumeric:'tabular-nums',
      letterSpacing:'-6px', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui",
    }}>
      {n}
    </p>
  )
}

function Stat({ value, label, gold=false, delay=0, icon:Icon }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      {Icon && <Icon size={30} strokeWidth={2} color={gold ? GOLD : DARK} style={{ marginBottom:16, display:'block' }} />}
      <p style={{
        margin:0, fontSize:'clamp(48px,5.5vw,76px)', fontWeight:900,
        color: gold ? GOLD : DARK, lineHeight:1,
        fontVariantNumeric:'tabular-nums', letterSpacing:'-2.5px',
        fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin:'10px 0 0', fontSize:14, fontWeight:700, color:DARK }}>{label}</p>
    </div>
  )
}

function Link({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:7, background:'none', border:'none', padding:0, fontSize:14, fontWeight:800, color: hov ? GOLD_DARK : GOLD, cursor:'pointer', fontFamily:'inherit', transition:'color 0.13s' }}>
      {children} <ArrowRight size={15} strokeWidth={2.5} />
    </button>
  )
}

function Btn({ children, onClick, primary, disabled, icon:Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:'flex', alignItems:'center', gap:9, padding:'14px 26px',
        background: primary ? (hov ? GOLD_DARK : GOLD) : (hov ? GOLD : DARK),
        border:'none', color: primary ? DARK : '#fff',
        fontSize:14, fontWeight:800, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition:'background 0.15s',
        fontFamily:'inherit', letterSpacing:'-0.2px', whiteSpace:'nowrap',
      }}>
      {Icon && <Icon size={16} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const navigate                           = useNavigate()
  const [refreshing, setRefreshing]        = useState(false)
  const [exporting,  setExporting]         = useState(false)

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday:'long', day:'numeric', month:'long',
  })

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch() } finally { setRefreshing(false) }
  }

  async function handleExportPDF() {
    setExporting(true)
    try {
      // Load jsPDF dynamically if not already loaded
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = resolve
          s.onerror = reject
          document.head.appendChild(s)
        })
      }
      exportPDF(stats)
    } catch(e) {
      console.error('PDF error:', e)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap   { max-width:1060px; margin:0 auto; padding:clamp(32px,5vw,64px) clamp(28px,4vw,56px); }
        .topbar { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:56px; }
        .tbtns  { display:flex; gap:3px; }
        .three  { display:grid; grid-template-columns:repeat(3,1fr); gap:0; }
        .two    { display:grid; grid-template-columns:repeat(2,1fr); gap:0; }
        .hr     { height:2px; background:${DARK}; margin:48px 0; }
        @media(max-width:680px){ .two { grid-template-columns:1fr; } .two > * { margin-bottom:32px; } }
        @media(max-width:520px){
          .three { grid-template-columns:1fr; } .three > * { margin-bottom:32px; }
          .tbtns { width:100%; } .tbtns button { flex:1; justify-content:center; }
        }
      `}</style>

      <div className="wrap">

        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-1.5px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'10px 0 0', fontSize:14, fontWeight:700, color:GOLD, textTransform:'capitalize' }}>
                {today}&nbsp;·&nbsp;<LiveClock />
              </p>
            </div>
            <div className="tbtns">
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={40}>
          <Label text="Aujourd'hui — total" />
          <HeroNum value={stats.today} />
          <p style={{ margin:'18px 0 0', fontSize:15, fontWeight:700, color:DARK }}>
            réservations aujourd'hui&emsp;
            <Link onClick={() => navigate('/reservations')}>Voir tout</Link>
          </p>
        </FadeUp>

        <div className="hr" />

        <FadeUp delay={110}>
          <Label text="Détail du jour" />
          <div className="three">
            <Stat icon={CheckCircle} value={stats.today_confirmed} label="Confirmées"  delay={110} />
            <Stat icon={Clock}       value={stats.today_pending}   label="En attente"  gold delay={145} />
            <Stat icon={XCircle}     value={stats.today_cancelled} label="Annulées"    delay={180} />
          </div>
        </FadeUp>

        <div className="hr" />

        <FadeUp delay={230}>
          <Label text="À venir" />
          <div className="two">
            <div>
              <Stat icon={CalendarDays} value={stats.tomorrow} label="Demain" gold delay={230} />
              <div style={{ marginTop:18 }}>
                <Link onClick={() => navigate('/calendar')}>Voir le planning</Link>
              </div>
            </div>
            <Stat icon={ClipboardList} value={stats.total} label="Total ce mois" delay={265} />
          </div>
        </FadeUp>

        <div className="hr" />

        <FadeUp delay={310}>
          <Label text="Ce mois — détail" />
          <div className="three">
            <Stat icon={CheckCircle} value={stats.confirmed} label="Confirmées"  delay={310} />
            <Stat icon={Clock}       value={stats.pending}   label="En attente"  gold delay={340} />
            <Stat icon={XCircle}     value={stats.cancelled} label="Annulées"    delay={370} />
          </div>
        </FadeUp>

        {error && <p style={{ marginTop:32, fontSize:14, fontWeight:700, color:GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}