import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  CalendarDays, ClipboardList, ArrowRight, TrendingUp,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp     from '../components/Dashboard/FadeUp'
import Spinner    from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'
import { exportPDF } from '../utils/exportPDF'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

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

function HeroNum({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{
      margin: 0,
      fontSize: 'clamp(80px,11vw,160px)',
      fontWeight: 900,
      color: DARK,
      lineHeight: 0.85,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-5px',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
    }}>
      {n}
    </p>
  )
}

// Compact horizontal stat pill
function StatPill({ icon: Icon, value, label, gold = false, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 20px',
      background: gold ? '#fdf6ec' : '#faf8f5',
      borderLeft: `3px solid ${gold ? GOLD : DARK}`,
    }}>
      <Icon size={18} strokeWidth={2} color={gold ? GOLD_DARK : DARK} style={{ flexShrink: 0 }} />
      <div>
        <p style={{
          margin: 0,
          fontSize: 'clamp(28px,3vw,40px)',
          fontWeight: 900,
          color: gold ? GOLD_DARK : DARK,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-1.5px',
          fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
        }}>
          {n}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

// Big hero stat (for confirmed this month)
function HeroStat({ value, label, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      <p style={{
        margin: 0,
        fontSize: 'clamp(64px,8vw,112px)',
        fontWeight: 900,
        color: DARK,
        lineHeight: 0.9,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-3px',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin: '12px 0 0', fontSize: 14, fontWeight: 800, color: GOLD_DARK, letterSpacing: '-0.2px' }}>{label}</p>
    </div>
  )
}

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '13px 24px',
        background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', letterSpacing: '-0.2px', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

function SectionTitle({ text, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        margin: 0, fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 900,
        color: DARK, letterSpacing: '-1px', lineHeight: 1,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {text}
      </h2>
      {sub && <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD }}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const navigate                           = useNavigate()
  const [refreshing, setRefreshing]        = useState(false)
  const [exporting,  setExporting]         = useState(false)

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch() } finally { setRefreshing(false) }
  }

  async function handleExportPDF() {
    setExporting(true)
    try {
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = resolve; s.onerror = reject
          document.head.appendChild(s)
        })
      }
      exportPDF(stats)
    } catch(e) { console.error('PDF error:', e) }
    finally { setExporting(false) }
  }

  const go = (filters) => navigate('/reservations', { state: filters })

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap { max-width:1000px; margin:0 auto; padding:clamp(28px,4vw,56px) clamp(24px,3.5vw,48px); }
        .hr   { height:2px; background:${DARK}; margin:44px 0; }
        .pills { display:flex; flex-direction:column; gap:8px; }
        @media(max-width:560px){ .day-grid { flex-direction:column !important; } }
      `}</style>

      <div className="wrap">

        {/* ── Topbar ── */}
        <FadeUp delay={0}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:52 }}>
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'8px 0 0', fontSize:14, fontWeight:700, color:GOLD, textTransform:'capitalize' }}>
                {today}&nbsp;·&nbsp;<LiveClock />
              </p>
            </div>
            <div style={{ display:'flex', gap:3 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── AUJOURD'HUI ── */}
        <FadeUp delay={40}>
          <SectionTitle text="Aujourd'hui" sub="Réservations du jour" />
          <div className="day-grid" style={{ display:'flex', gap:48, alignItems:'flex-start' }}>
            {/* Left: hero */}
            <div style={{ flexShrink:0 }}>
              <HeroNum value={stats.today} />
              <p style={{ margin:'14px 0 20px', fontSize:15, fontWeight:800, color:DARK, letterSpacing:'-0.2px' }}>
                réservations aujourd'hui
              </p>
              <Btn icon={ArrowRight} primary onClick={() => go({ filterDate: TODAY_DATE })}>
                Voir aujourd'hui
              </Btn>
            </div>
            {/* Right: pills */}
            <div className="pills" style={{ flex:1, paddingTop:6 }}>
              <StatPill icon={CheckCircle} value={stats.today_confirmed} label="Confirmées"  delay={100} />
              <StatPill icon={Clock}       value={stats.today_pending}   label="En attente"  gold delay={130} />
              <StatPill icon={XCircle}     value={stats.today_cancelled} label="Annulées"    delay={160} />
            </div>
          </div>
        </FadeUp>

        <div className="hr" />

        {/* ── DEMAIN ── */}
        <FadeUp delay={200}>
          <SectionTitle text="Demain" sub="Planning du lendemain" />
          <div className="day-grid" style={{ display:'flex', gap:48, alignItems:'flex-start' }}>
            {/* Left: hero */}
            <div style={{ flexShrink:0 }}>
              <HeroNum value={stats.tomorrow} />
              <p style={{ margin:'14px 0 20px', fontSize:15, fontWeight:800, color:DARK, letterSpacing:'-0.2px' }}>
                réservations demain
              </p>
              <Btn icon={ArrowRight} primary onClick={() => go({ filterDate: TOMORROW_DATE })}>
                Voir demain
              </Btn>
            </div>
            {/* Right: pills */}
            <div className="pills" style={{ flex:1, paddingTop:6 }}>
              <StatPill icon={CheckCircle} value={stats.tomorrow_confirmed ?? 0} label="Confirmées"  delay={220} />
              <StatPill icon={Clock}       value={stats.tomorrow_pending   ?? 0} label="En attente"  gold delay={250} />
              <StatPill icon={XCircle}     value={stats.tomorrow_cancelled ?? 0} label="Annulées"    delay={280} />
            </div>
          </div>
        </FadeUp>

        <div className="hr" />

        {/* ── CE MOIS ── */}
        <FadeUp delay={330}>
          <SectionTitle text="Ce mois" sub="Bilan mensuel des réservations" />
          <div className="day-grid" style={{ display:'flex', gap:48, alignItems:'flex-start' }}>
            {/* Left: confirmed hero */}
            <div style={{ flexShrink:0 }}>
              <HeroStat value={stats.confirmed} label="Confirmées ce mois" delay={330} />
            </div>
            {/* Right: pills */}
            <div className="pills" style={{ flex:1, paddingTop:6 }}>
              <StatPill icon={ClipboardList} value={stats.total}     label="Total ce mois"      delay={350} />
              <StatPill icon={Clock}         value={stats.pending}   label="En attente ce mois" gold delay={375} />
              <StatPill icon={XCircle}       value={stats.cancelled} label="Annulées ce mois"   delay={400} />
            </div>
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:GOLD }}>Erreur — {error}</p>
        )}
      </div>
    </div>
  )
}