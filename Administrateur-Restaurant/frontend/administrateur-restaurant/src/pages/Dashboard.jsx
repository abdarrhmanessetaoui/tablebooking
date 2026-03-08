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

/* ── Donut — fully dynamic, animated ── */
function DonutChart({ confirmed, pending, cancelled, size = 110 }) {
  const total = confirmed + pending + cancelled
  const r = 14, circ = 2 * Math.PI * r
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t) }, [total])

  if (total === 0) return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#ede8e2" strokeWidth="5" />
      <text x="18" y="20" textAnchor="middle" fontSize="5" fontWeight="900" fill="#ccc">0</text>
    </svg>
  )

  const slices = [
    { value: confirmed, color: DARK      },
    { value: pending,   color: GOLD      },
    { value: cancelled, color: '#d4b896' },
  ]

  let cumOffset = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="#ede8e2" strokeWidth="5" />
        {slices.map((s, i) => {
          if (s.value === 0) return null
          const arc = (s.value / total) * circ
          const off = cumOffset
          cumOffset += arc
          return (
            <circle key={i} cx="18" cy="18" r={r} fill="none"
              stroke={s.color} strokeWidth="5"
              strokeDasharray={`${ready ? arc : 0} ${circ}`}
              strokeDashoffset={-off}
              style={{ transition: `stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s` }}
            />
          )
        })}
      </svg>
      {/* Centre */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize: size < 90 ? 9 : 11, fontWeight: 900, color: DARK, lineHeight: 1 }}>{total}</span>
        <span style={{ fontSize: 7, fontWeight: 700, color: GOLD_DARK, letterSpacing: '0.04em', marginTop: 1 }}>TOTAL</span>
      </div>
    </div>
  )
}

/* ── Progress bar — animated, dynamic ── */
function ProgressBar({ value, total, color = DARK }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 350); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 3, background: '#ede8e2', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 2, transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 700, color: '#bbb' }}>{pct}%</p>
    </div>
  )
}

/* ── Sparkline — dynamic from real ratio ── */
function Sparkline({ value, total, color = DARK, width = 72, height = 28 }) {
  // Build deterministic points based on real ratio and value
  const ratio = total > 0 ? value / total : 0
  const base  = [0.4, 0.55, 0.45, 0.6, ratio * 0.8, ratio * 0.9, ratio]
  const max   = Math.max(...base, 0.01)
  const pts   = base.map((v, i) => {
    const x = (i / (base.length - 1)) * width
    const y = height - (v / max) * (height - 5) - 2
    return `${x},${y}`
  }).join(' ')
  const lastY = height - (ratio / max) * (height - 5) - 2

  return (
    <svg width={width} height={height} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      <circle cx={width} cy={lastY} r="2.4" fill={color} />
    </svg>
  )
}

/* ── Stat pill ── */
function StatPill({ icon: Icon, value, label, gold = false, delay = 0, total = 0 }) {
  const n = useCountUp(value, 750, delay)
  const c = gold ? GOLD_DARK : DARK
  return (
    <div style={{ padding: '14px 18px', background: gold ? '#fdf6ec' : '#faf8f5', borderLeft: `3px solid ${gold ? GOLD : DARK}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon size={15} strokeWidth={2.2} color={c} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 'clamp(22px,2.5vw,34px)', fontWeight: 900, color: c, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px', fontFamily: "'Plus Jakarta Sans',system-ui" }}>{n}</p>
            <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
          </div>
        </div>
        <Sparkline value={value} total={total} color={gold ? GOLD : DARK} />
      </div>
      {total > 0 && <ProgressBar value={value} total={total} color={gold ? GOLD : DARK} />}
    </div>
  )
}

function HeroNum({ value, delay = 60 }) {
  const n = useCountUp(value, 900, delay)
  return (
    <p style={{ margin: 0, fontSize: 'clamp(72px,10vw,140px)', fontWeight: 900, color: DARK, lineHeight: 0.85, fontVariantNumeric: 'tabular-nums', letterSpacing: '-5px', fontFamily: "'Plus Jakarta Sans',system-ui" }}>{n}</p>
  )
}

function HeroStat({ value, label, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      <p style={{ margin: 0, fontSize: 'clamp(64px,8vw,108px)', fontWeight: 900, color: DARK, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums', letterSpacing: '-3px', fontFamily: "'Plus Jakarta Sans',system-ui" }}>{n}</p>
      <p style={{ margin: '10px 0 0', fontSize: 13, fontWeight: 800, color: GOLD_DARK }}>{label}</p>
    </div>
  )
}

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK), border: 'none', color: primary ? (hov ? GOLD : DARK) : '#fff', fontSize: 13, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'background 0.15s,color 0.15s', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

function SectionTitle({ text, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 900, color: DARK, letterSpacing: '-1px', fontFamily: "'Plus Jakarta Sans',system-ui" }}>{text}</h2>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: GOLD }}>{sub}</p>}
    </div>
  )
}

function Dot({ color }) {
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 6, flexShrink: 0 }} />
}

export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const navigate                           = useNavigate()
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const go    = f => navigate('/reservations', { state: f })

  async function handleRefresh() { setRefreshing(true); try { await refetch() } finally { setRefreshing(false) } }
  async function handleExportPDF() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = res; s.onerror = rej; document.head.appendChild(s)
      })
      exportPDF(stats)
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        .wrap { max-width: 1020px; margin: 0 auto; padding: clamp(28px,4vw,56px) clamp(20px,3.5vw,48px); }
        .hr   { height: 2px; background: ${DARK}; margin: 48px 0; }

        /* Left+right sections */
        .day-grid { display: flex; gap: 48px; align-items: flex-start; }
        .day-left { flex-shrink: 0; width: 220px; }
        .day-right { flex: 1; display: flex; flex-direction: column; gap: 8px; }

        /* Donut row */
        .donut-row { display: flex; align-items: center; gap: 14px; margin: 20px 0; }
        .donut-legend { display: flex; flex-direction: column; gap: 6px; }
        .donut-legend p { margin: 0; font-size: 11px; font-weight: 700; display: flex; align-items: center; }

        /* Topbar */
        .topbar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 52px; }
        .topbar-btns { display: flex; gap: 3px; }

        /* Responsive */
        @media (max-width: 700px) {
          .day-grid  { flex-direction: column; gap: 28px; }
          .day-left  { width: 100%; }
          .donut-row { flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
          .topbar-btns { width: 100%; }
          .topbar-btns button { flex: 1; justify-content: center; }
          .hr { margin: 36px 0; }
        }
      `}</style>

      <div className="wrap">

        {/* Topbar */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: DARK, letterSpacing: '-2px', lineHeight: 1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: GOLD, textTransform: 'capitalize' }}>
                {today}&nbsp;·&nbsp;<LiveClock />
              </p>
            </div>
            <div className="topbar-btns">
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
          <div className="day-grid">
            <div className="day-left">
              <HeroNum value={stats.today} delay={60} />
              <p style={{ margin: '12px 0 0', fontSize: 14, fontWeight: 800, color: DARK }}>réservations aujourd'hui</p>
              <div className="donut-row">
                <DonutChart confirmed={stats.today_confirmed} pending={stats.today_pending} cancelled={stats.today_cancelled} />
                <div className="donut-legend">
                  <p style={{ color: DARK }}><Dot color={DARK} />Confirmées</p>
                  <p style={{ color: GOLD_DARK }}><Dot color={GOLD} />En attente</p>
                  <p style={{ color: '#a08060' }}><Dot color="#d4b896" />Annulées</p>
                </div>
              </div>
              <Btn icon={ArrowRight} primary onClick={() => go({ filterDate: TODAY_DATE })}>
                Voir aujourd'hui
              </Btn>
            </div>
            <div className="day-right">
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
          <div className="day-grid">
            <div className="day-left">
              <HeroNum value={stats.tomorrow} delay={220} />
              <p style={{ margin: '12px 0 0', fontSize: 14, fontWeight: 800, color: DARK }}>réservations demain</p>
              <div className="donut-row">
                <DonutChart confirmed={stats.tomorrow_confirmed ?? 0} pending={stats.tomorrow_pending ?? 0} cancelled={stats.tomorrow_cancelled ?? 0} />
                <div className="donut-legend">
                  <p style={{ color: DARK }}><Dot color={DARK} />Confirmées</p>
                  <p style={{ color: GOLD_DARK }}><Dot color={GOLD} />En attente</p>
                  <p style={{ color: '#a08060' }}><Dot color="#d4b896" />Annulées</p>
                </div>
              </div>
              <Btn icon={ArrowRight} primary onClick={() => go({ filterDate: TOMORROW_DATE })}>
                Voir demain
              </Btn>
            </div>
            <div className="day-right">
              <StatPill icon={CheckCircle} value={stats.tomorrow_confirmed ?? 0} label="Confirmées" delay={240} total={stats.tomorrow} />
              <StatPill icon={Clock}       value={stats.tomorrow_pending   ?? 0} label="En attente" gold delay={270} total={stats.tomorrow} />
              <StatPill icon={XCircle}     value={stats.tomorrow_cancelled ?? 0} label="Annulées"   delay={300} total={stats.tomorrow} />
            </div>
          </div>
        </FadeUp>

        <div className="hr" />

        {/* ── CE MOIS ── */}
        <FadeUp delay={330}>
          <SectionTitle text="Ce mois" sub="Bilan mensuel des réservations" />
          <div className="day-grid">
            <div className="day-left">
              <HeroStat value={stats.confirmed} label="Confirmées ce mois" delay={330} />
              <div className="donut-row">
                <DonutChart confirmed={stats.confirmed} pending={stats.pending} cancelled={stats.cancelled} />
                <div className="donut-legend">
                  <p style={{ color: DARK }}><Dot color={DARK} />Confirmées</p>
                  <p style={{ color: GOLD_DARK }}><Dot color={GOLD} />En attente</p>
                  <p style={{ color: '#a08060' }}><Dot color="#d4b896" />Annulées</p>
                </div>
              </div>
            </div>
            <div className="day-right">
              <StatPill icon={ClipboardList} value={stats.total}     label="Total ce mois"      delay={350} />
              <StatPill icon={Clock}         value={stats.pending}   label="En attente ce mois" gold delay={375} total={stats.total} />
              <StatPill icon={XCircle}       value={stats.cancelled} label="Annulées ce mois"   delay={400} total={stats.total} />
            </div>
          </div>
        </FadeUp>

        {error && <p style={{ marginTop: 32, fontSize: 13, fontWeight: 700, color: GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}