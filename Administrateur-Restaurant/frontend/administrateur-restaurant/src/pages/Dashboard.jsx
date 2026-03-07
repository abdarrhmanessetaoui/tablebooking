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

function Label({ text, sub }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        margin: 0,
        fontSize: 'clamp(28px,3.5vw,42px)',
        fontWeight: 900,
        color: DARK,
        letterSpacing: '-1.2px',
        lineHeight: 1,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {text}
      </h2>
      {sub && (
        <p style={{ margin:'8px 0 0', fontSize:13, fontWeight:700, color:GOLD, letterSpacing:'-0.1px' }}>
          {sub}
        </p>
      )}
    </div>
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
      <p style={{ margin:'12px 0 0', fontSize:16, fontWeight:800, color:DARK, letterSpacing:'-0.3px' }}>{label}</p>
    </div>
  )
}

function Link({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'none', border: 'none', padding: '4px 0',
        fontSize: 14, fontWeight: 800,
        color: hov ? GOLD_DARK : GOLD,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'color 0.15s',
        position: 'relative',
      }}
    >
      {/* sliding underline */}
      <span style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 2, background: GOLD,
        width: hov ? '100%' : '0%',
        transition: 'width 0.22s cubic-bezier(0.22,1,0.36,1)',
      }} />
      {children}
      {/* arrow slides right on hover */}
      <span style={{
        display: 'flex', alignItems: 'center',
        transform: hov ? 'translateX(5px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <ArrowRight size={15} strokeWidth={2.5} />
      </span>
    </button>
  )
}

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '14px 26px',
        background: primary ? (hov ? GOLD_DARK : GOLD) : (hov ? GOLD : DARK),
        border: 'none',
        color: primary ? DARK : '#fff',
        fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        /* lift + shadow on hover */
        transform: hov && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov && !disabled
          ? primary
            ? `0 8px 24px rgba(200,169,126,0.45)`
            : `0 8px 24px rgba(43,33,24,0.35)`
          : 'none',
        transition: 'background 0.15s, transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s',
        fontFamily: 'inherit', letterSpacing: '-0.2px', whiteSpace: 'nowrap',
      }}
    >
      {/* icon spins slightly on hover for Refresh */}
      <span style={{
        display: 'flex', alignItems: 'center',
        transform: hov && !disabled ? 'rotate(20deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {Icon && <Icon size={16} strokeWidth={2.2} />}
      </span>
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
              <h1 style={{ margin:0, fontSize:'clamp(30px,4.5vw,48px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'10px 0 0', fontSize:15, fontWeight:700, color:GOLD, textTransform:'capitalize' }}>
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
          <Label text="Aujourd'hui" sub="Total des réservations du jour" />
          <HeroNum value={stats.today} />
          <p style={{ margin:'18px 0 0', fontSize:17, fontWeight:800, color:DARK, letterSpacing:'-0.3px' }}>
            réservations aujourd'hui&emsp;
            <Link onClick={() => navigate('/reservations')}>Voir tout</Link>
          </p>
        </FadeUp>

        <div className="hr" />

        <FadeUp delay={110}>
          <Label text="Détail du jour" sub="Confirmées · En attente · Annulées" />
          <div className="three">
            <Stat icon={CheckCircle} value={stats.today_confirmed} label="Confirmées"  delay={110} />
            <Stat icon={Clock}       value={stats.today_pending}   label="En attente"  gold delay={145} />
            <Stat icon={XCircle}     value={stats.today_cancelled} label="Annulées"    delay={180} />
          </div>
        </FadeUp>

        <div className="hr" />

        <FadeUp delay={230}>
          <Label text="À venir" sub="Demain et total du mois" />
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
          <Label text="Ce mois" sub="Bilan mensuel des réservations" />
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