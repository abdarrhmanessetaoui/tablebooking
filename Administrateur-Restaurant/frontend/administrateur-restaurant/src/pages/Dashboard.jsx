import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  ClipboardList, ArrowRight,
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

/* ── Donut chart (SVG) ── */
function DonutChart({ confirmed, pending, cancelled, size = 110 }) {
  const total = confirmed + pending + cancelled
  if (total === 0) return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke="#f0ebe4" strokeWidth="5" />
    </svg>
  )

  const r = 14
  const circ = 2 * Math.PI * r
  const pct = (v) => (v / total) * circ

  const slices = [
    { value: confirmed, color: DARK,      offset: 0 },
    { value: pending,   color: GOLD,      offset: pct(confirmed) },
    { value: cancelled, color: '#e0b0b0', offset: pct(confirmed) + pct(pending) },
  ]

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke="#f0ebe4" strokeWidth="5" />
      {slices.map((s, i) => s.value > 0 && (
        <circle key={i} cx="18" cy="18" r={r} fill="none"
          stroke={s.color} strokeWidth="5"
          strokeDasharray={`${pct(s.value)} ${circ - pct(s.value)}`}
          strokeDashoffset={-s.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  )
}

/* ── Sparkline (SVG) — last 7 days trend simulation ── */
function Sparkline({ value, color = DARK, width = 80, height = 32 }) {
  // Generate a plausible sparkline based on value
  const seed = value || 1
  const points = Array.from({ length: 7 }, (_, i) => {
    const v = Math.max(0, seed * (0.4 + 0.6 * Math.sin(i * 1.3 + seed) * 0.5 + 0.5 * Math.random()))
    return Math.round(v)
  })
  points[6] = seed

  const max = Math.max(...points, 1)
  const pts = points.map((v, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - (v / max) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      {/* Last point dot */}
      {(() => {
        const lastX = width
        const lastY = height - (seed / max) * (height - 4) - 2
        return <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      })()}
    </svg>
  )
}

/* ── Progress bar ── */
function ProgressBar({ value, total, color = DARK }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 3, background: '#f0ebe4', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${width}%`,
          background: color, borderRadius: 2,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 700, color: '#bbb' }}>{pct}%</p>
    </div>
  )
}

/* ── Stat pill with progress ── */
function StatPill({ icon: Icon, value, label, gold = false, delay = 0, total = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div style={{
      padding: '14px 18px',
      background: gold ? '#fdf6ec' : '#faf8f5',
      borderLeft: `3px solid ${gold ? GOLD : DARK}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon size={16} strokeWidth={2} color={gold ? GOLD_DARK : DARK} style={{ flexShrink: 0 }} />
          <div>
            <p style={{
              margin: 0,
              fontSize: 'clamp(24px,2.8vw,36px)',
              fontWeight: 900,
              color: gold ? GOLD_DARK : DARK,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-1px',
              fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
            }}>
              {n}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {label}
            </p>
          </div>
        </div>
        <Sparkline value={value} color={gold ? GOLD : DARK} />
      </div>
      {total > 0 && <ProgressBar value={value} total={total} color={gold ? GOLD : DARK} />}
    </div>
  )
}

function HeroNum({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{
      margin: 0, fontSize: 'clamp(80px,11vw,148px)', fontWeight: 900,
      color: DARK, lineHeight: 0.85, fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-5px', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
    }}>
      {n}
    </p>
  )
}

function HeroStat({ value, label, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      <p style={{
        margin: 0, fontSize: 'clamp(64px,8vw,112px)', fontWeight: 900,
        color: DARK, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-3px', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin: '10px 0 0', fontSize: 13, fontWeight: 800, color: GOLD_DARK }}>{label}</p>
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
        fontSize: 13, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'background 0.15s, color 0.15s',
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
      {sub && <p style={{ margin: '5px 0 0', fontSize: 12, fontWeight: 700, color: GOLD }}>{sub}</p>}
    </div>
  )
}

/* ── Legend dot ── */
function Dot({ color }) {
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 5 }} />
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
        .wrap { max-width:1000px; margin:0 auto; padding:clamp(24px,4vw,52px) clamp(20px,3.5vw,44px); }
        .hr   { height:2px; background:${DARK}; margin:44px 0; }
        .pills { display:flex; flex-direction:column; gap:8px; }
        @media(max-width:580px){ .day-grid { flex-direction:column !important; } .day-grid .left { min-width:unset !important; } }
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
          <div className="day-grid" style={{ display:'flex', gap:40, alignItems:'flex-start' }}>
            {/* Left */}
            <div className="left" style={{ flexShrink:0, minWidth:200 }}>
              <HeroNum value={stats.today} />
              <p style={{ margin:'12px 0 18px', fontSize:14, fontWeight:800, color:DARK }}>réservations aujourd'hui</p>
              {/* Donut */}
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                <DonutChart confirmed={stats.today_confirmed} pending={stats.today_pending} cancelled={stats.today_cancelled} />
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:DARK }}><Dot color={DARK} />Confirmées</p>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:GOLD_DARK }}><Dot color={GOLD} />En attente</p>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:'#b06060' }}><Dot color="#e0b0b0" />Annulées</p>
                </div>
              </div>
              <Btn icon={ArrowRight} primary onClick={() => go({ filterDate: TODAY_DATE })}>
                Voir aujourd'hui
              </Btn>
            </div>
            {/* Right: pills */}
            <div className="pills" style={{ flex:1, paddingTop:4 }}>
              <StatPill icon={CheckCircle} value={stats.today_confirmed} label="Confirmées" delay={100} total={stats.today} />
              <StatPill icon={Clock}       value={stats.today_pending}   label="En attente" gold delay={130} total={stats.today} />
              <StatPill icon={XCircle}     value={stats.today_cancelled} label="Annulées"   delay={160} total={stats.today} />
            </div>
          </div>
        </FadeUp>

        <div className="hr" />

        {/* ── DEMAIN ── */}
        <FadeUp delay={200}>
          <SectionTitle text="Demain" sub="Planning du lendemain" />
          <div className="day-grid" style={{ display:'flex', gap:40, alignItems:'flex-start' }}>
            <div className="left" style={{ flexShrink:0, minWidth:200 }}>
              <HeroNum value={stats.tomorrow} />
              <p style={{ margin:'12px 0 18px', fontSize:14, fontWeight:800, color:DARK }}>réservations demain</p>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                <DonutChart confirmed={stats.tomorrow_confirmed ?? 0} pending={stats.tomorrow_pending ?? 0} cancelled={stats.tomorrow_cancelled ?? 0} />
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:DARK }}><Dot color={DARK} />Confirmées</p>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:GOLD_DARK }}><Dot color={GOLD} />En attente</p>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:'#b06060' }}><Dot color="#e0b0b0" />Annulées</p>
                </div>
              </div>
              <Btn icon={ArrowRight} primary onClick={() => go({ filterDate: TOMORROW_DATE })}>
                Voir demain
              </Btn>
            </div>
            <div className="pills" style={{ flex:1, paddingTop:4 }}>
              <StatPill icon={CheckCircle} value={stats.tomorrow_confirmed ?? 0} label="Confirmées" delay={220} total={stats.tomorrow} />
              <StatPill icon={Clock}       value={stats.tomorrow_pending   ?? 0} label="En attente" gold delay={250} total={stats.tomorrow} />
              <StatPill icon={XCircle}     value={stats.tomorrow_cancelled ?? 0} label="Annulées"   delay={280} total={stats.tomorrow} />
            </div>
          </div>
        </FadeUp>

        <div className="hr" />

        {/* ── CE MOIS ── */}
        <FadeUp delay={330}>
          <SectionTitle text="Ce mois" sub="Bilan mensuel des réservations" />
          <div className="day-grid" style={{ display:'flex', gap:40, alignItems:'flex-start' }}>
            <div className="left" style={{ flexShrink:0, minWidth:200 }}>
              <HeroStat value={stats.confirmed} label="Confirmées ce mois" delay={330} />
              <div style={{ marginTop:20 }}>
                <DonutChart confirmed={stats.confirmed} pending={stats.pending} cancelled={stats.cancelled} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:10 }}>
                <p style={{ margin:0, fontSize:11, fontWeight:700, color:DARK }}><Dot color={DARK} />Confirmées</p>
                <p style={{ margin:0, fontSize:11, fontWeight:700, color:GOLD_DARK }}><Dot color={GOLD} />En attente</p>
                <p style={{ margin:0, fontSize:11, fontWeight:700, color:'#b06060' }}><Dot color="#e0b0b0" />Annulées</p>
              </div>
            </div>
            <div className="pills" style={{ flex:1, paddingTop:4 }}>
              <StatPill icon={ClipboardList} value={stats.total}     label="Total ce mois"      delay={350} />
              <StatPill icon={Clock}         value={stats.pending}   label="En attente ce mois" gold delay={375} total={stats.total} />
              <StatPill icon={XCircle}       value={stats.cancelled} label="Annulées ce mois"   delay={400} total={stats.total} />
            </div>
          </div>
        </FadeUp>

        {error && <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}