import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  CalendarDays, ArrowRight, TrendingUp, Users,
  ChevronRight, Sparkles,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { getToken }      from '../utils/auth'

/* ── Design tokens ── */
const T = {
  dark:      '#2b2118',
  darkMid:   '#3d2d1e',
  gold:      '#c8a97e',
  goldDk:    '#a8834e',
  goldLight: '#f5ebe0',
  cream:     '#faf7f4',
  white:     '#ffffff',
  green:     '#166534',
  greenBg:   '#f0fdf4',
  greenBdr:  '#bbf7d0',
  red:       '#991b1b',
  redBg:     '#fef2f2',
  redBdr:    '#fecaca',
  amber:     '#92400e',
  amberBg:   '#fffbeb',
  amberBdr:  '#fde68a',
  border:    'rgba(43,33,24,0.08)',
  muted:     'rgba(43,33,24,0.4)',
  subtle:    'rgba(43,33,24,0.15)',
}

const TODAY    = new Date().toISOString().slice(0, 10)
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ── Live clock ── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const date = t.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const time = t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: 'capitalize' }}>{date}</span>
      <span style={{ fontSize: 11, color: T.subtle }}>·</span>
      <span style={{
        fontSize: 13, fontWeight: 900, color: T.gold,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '0.03em',
      }}>{time}</span>
    </div>
  )
}

/* ── Count up ── */
function Num({ value, size = 48, color = T.dark }) {
  const n = useCountUp(value, 800, 100)
  return (
    <span style={{
      fontSize: size, fontWeight: 900, color,
      lineHeight: 1, letterSpacing: '-2px',
      fontVariantNumeric: 'tabular-nums',
    }}>{n}</span>
  )
}

/* ── Donut ── */
function Donut({ c, p, a, size = 88 }) {
  const total = (c + p + a) || 1
  const pct   = Math.round((c / total) * 100)
  const r     = 32, circ = 2 * Math.PI * r
  const segs  = [
    { v: c, color: '#16a34a' },
    { v: p, color: T.gold   },
    { v: a, color: '#dc2626' },
  ]
  let offset = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke={T.goldLight} strokeWidth="8" />
        {segs.map((s, i) => {
          if (!s.v) { offset += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el = (
            <circle key={i} cx="40" cy="40" r={r} fill="none"
              stroke={s.color} strokeWidth="8"
              strokeDasharray={`${arc} ${circ}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: `stroke-dasharray 1s ease ${i * 0.15}s` }}
            />
          )
          offset += arc; return el
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: T.dark, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 8, fontWeight: 700, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>conf.</span>
      </div>
    </div>
  )
}

/* ── Progress bar ── */
function ProgressBar({ value, total, color }) {
  const [w, setW] = useState(0)
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 500)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, background: T.goldLight, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${w}%`,
          background: color, borderRadius: 99,
          transition: 'width 0.9s cubic-bezier(0.34,1.2,0.64,1)',
        }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, display: 'block', marginTop: 4 }}>{pct}%</span>
    </div>
  )
}

/* ── Status badge ── */
function Badge({ status }) {
  const M = {
    Confirmed: { label: 'Confirmée',  bg: T.greenBg,  color: T.green, dot: '#16a34a' },
    Pending:   { label: 'En attente', bg: T.amberBg,  color: T.amber, dot: T.gold    },
    Cancelled: { label: 'Annulée',    bg: T.redBg,    color: T.red,   dot: '#dc2626' },
  }
  const s = M[status] || M.Pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 99,
      background: s.bg, fontSize: 10, fontWeight: 700, color: s.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

/* ── Metric card ── */
function MetricCard({ icon: Icon, value, label, sub, bg, color, border, delay = 0, total = 0 }) {
  return (
    <div style={{
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 16,
      padding: '20px 18px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: T.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 1px 4px ${border}`,
        }}>
          <Icon size={16} color={color} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <Num value={value} size={38} color={color} />
      {sub && <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color, opacity: 0.7 }}>{sub}</p>}
      {total > 0 && <ProgressBar value={value} total={total} color={color} />}
    </div>
  )
}

/* ── Reservation row ── */
function ResRow({ r, i }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        gap: 12,
        padding: '14px 20px',
        background: hov ? T.cream : (i % 2 === 0 ? T.white : '#fdfcfb'),
        borderBottom: `1px solid ${T.border}`,
        alignItems: 'center',
        transition: 'background 0.15s',
        cursor: 'default',
      }}
    >
      {/* Name + phone */}
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: T.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.name || '—'}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 600, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.phone || r.email || '—'}
        </p>
      </div>

      {/* Time */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: T.dark, fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</p>
        <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 600, color: T.muted }}>{r.date}</p>
      </div>

      {/* Guests */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: T.goldLight, borderRadius: 8,
        padding: '4px 8px', flexShrink: 0,
      }}>
        <Users size={11} color={T.goldDk} strokeWidth={2} />
        <span style={{ fontSize: 12, fontWeight: 900, color: T.goldDk }}>{r.guests}</span>
      </div>

      {/* Service — hidden on small */}
      <span className="hide-sm" style={{ fontSize: 11, fontWeight: 700, color: T.muted, flexShrink: 0 }}>
        {r.service || '—'}
      </span>

      {/* Status */}
      <Badge status={r.status} />
    </div>
  )
}

/* ── Reservations table ── */
function ResTable({ reservations, onViewAll }) {
  if (!reservations?.length) return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: T.goldLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <CalendarDays size={24} color={T.gold} strokeWidth={1.5} />
      </div>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: T.dark, opacity: 0.3 }}>Aucune réservation</p>
      <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: T.muted }}>pour cette période</p>
    </div>
  )

  return (
    <div>
      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        gap: 12,
        padding: '10px 20px',
        background: T.dark,
      }}>
        {['Client', 'Heure', 'Couverts', 'Service', 'Statut'].map((h, i) => (
          <span key={i} className={i === 3 ? 'hide-sm' : ''} style={{
            fontSize: 9, fontWeight: 900, color: T.gold,
            textTransform: 'uppercase', letterSpacing: '0.15em',
            textAlign: i > 0 ? 'right' : 'left',
          }}>{h}</span>
        ))}
      </div>

      {reservations.slice(0, 8).map((r, i) => <ResRow key={r.id ?? i} r={r} i={i} />)}

      <button
        onClick={onViewAll}
        style={{
          width: '100%', padding: '14px 20px',
          background: T.cream, border: 'none',
          color: T.darkMid, fontSize: 12, fontWeight: 800,
          cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'inherit', letterSpacing: '0.06em',
          borderTop: `1.5px solid ${T.border}`,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.goldLight}
        onMouseLeave={e => e.currentTarget.style.background = T.cream}
      >
        Voir toutes les réservations
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ── Tab content ── */
function TabContent({ tab, stats, reservations, onViewAll }) {
  const isToday    = tab === 'today'
  const isTomorrow = tab === 'tomorrow'

  const c = isToday ? stats.today_confirmed        : isTomorrow ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed    ?? 0
  const p = isToday ? stats.today_pending          : isTomorrow ? (stats.tomorrow_pending   ?? 0) : stats.pending      ?? 0
  const a = isToday ? stats.today_cancelled        : isTomorrow ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled    ?? 0
  const n = isToday ? stats.today                  : isTomorrow ? (stats.tomorrow           ?? 0) : stats.total        ?? 0
  const total = c + p + a

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Hero overview */}
      <div style={{
        background: T.white,
        borderRadius: 20,
        border: `1.5px solid ${T.border}`,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(43,33,24,0.06)',
      }}>
        {/* Dark header strip */}
        <div style={{ background: T.dark, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'block', boxShadow: '0 0 0 3px rgba(74,222,128,0.2)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Vue d'ensemble
            </span>
          </div>
          <button onClick={onViewAll} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.25)',
            borderRadius: 8, padding: '6px 12px',
            color: T.gold, fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', letterSpacing: '0.06em', transition: 'all 0.15s',
          }}>
            Tout voir <ChevronRight size={12} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <div className="overview-grid">

            {/* Big number */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <Num value={n} size="clamp(64px,10vw,96px)" color={T.dark} />
                <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: T.muted }}>
                  réservation{n !== 1 ? 's' : ''}
                </p>
              </div>
              <Donut c={c} p={p} a={a} size={88} />
            </div>

            {/* 3 metric cards */}
            <div className="metric-grid">
              <MetricCard icon={CheckCircle} value={c} label="Confirmées" bg={T.greenBg} color={T.green} border={T.greenBdr} total={total} delay={50} />
              <MetricCard icon={Clock}       value={p} label="En attente" bg={T.amberBg} color={T.amber} border={T.amberBdr} total={total} delay={80} />
              <MetricCard icon={XCircle}     value={a} label="Annulées"   bg={T.redBg}   color={T.red}   border={T.redBdr}   total={total} delay={110} />
            </div>
          </div>
        </div>
      </div>

      {/* Reservations */}
      <div style={{
        background: T.white, borderRadius: 20,
        border: `1.5px solid ${T.border}`,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(43,33,24,0.06)',
      }}>
        <div style={{
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1.5px solid ${T.border}`, flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: T.goldLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={15} color={T.goldDk} strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: T.dark }}>Réservations</h3>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: T.muted }}>{reservations.length} au total</p>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 480 }}>
            <ResTable reservations={reservations} onViewAll={onViewAll} />
          </div>
        </div>
      </div>

    </div>
  )
}

/* ═══════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════ */
export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info }                           = useRestaurantInfo()
  const navigate    = useNavigate()

  const [tab,        setTab]        = useState('today')
  const [refreshing, setRefreshing] = useState(false)
  const [todayRes,   setTodayRes]   = useState([])
  const [tomRes,     setTomRes]     = useState([])
  const [monthRes,   setMonthRes]   = useState([])

  useEffect(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const yr  = now.getFullYear()
    const mo  = String(now.getMonth() + 1).padStart(2, '0')

    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${yr}-${mo}`,{ headers: h }).then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", res: todayRes,  badge: stats.today_pending },
    { key: 'tomorrow', label: 'Demain',      res: tomRes,    badge: 0 },
    { key: 'month',    label: 'Ce mois',     res: monthRes,  badge: 0 },
  ]
  const active = TABS.find(t => t.key === tab)

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch() } finally { setTimeout(() => setRefreshing(false), 600) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: T.cream, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .hide-sm { display: table-cell; }
        .overview-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 28px;
          align-items: center;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 860px) {
          .overview-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 640px) {
          .metric-grid { grid-template-columns: 1fr 1fr; }
          .hide-sm { display: none !important; }
        }
        @media (max-width: 400px) {
          .metric-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(16px,4vw,40px) clamp(12px,3vw,32px)' }}>

        {/* ── TOP BAR ── */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 16,
            marginBottom: 28, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: T.dark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={16} color={T.gold} strokeWidth={2} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: 'clamp(20px,4vw,30px)', fontWeight: 900, color: T.dark, letterSpacing: '-1px', lineHeight: 1.1 }}>
                    {info.name || 'Dal Corso'}
                  </h1>
                  {info.location && (
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {info.location}
                    </p>
                  )}
                </div>
              </div>
              <LiveClock />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={handleRefresh} disabled={refreshing}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '10px 16px', borderRadius: 12,
                  background: T.white, border: `1.5px solid ${T.border}`,
                  color: T.dark, fontSize: 12, fontWeight: 700,
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', opacity: refreshing ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
              >
                <RefreshCw size={14} strokeWidth={2.5} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
                <span className="hide-sm">Actualiser</span>
              </button>

              <button
                onClick={() => navigate('/reservations')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '10px 16px', borderRadius: 12,
                  background: T.dark, border: 'none',
                  color: T.white, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.darkMid}
                onMouseLeave={e => e.currentTarget.style.background = T.dark}
              >
                <CalendarDays size={14} strokeWidth={2.5} />
                <span className="hide-sm">Réservations</span>
              </button>
            </div>
          </div>
        </FadeUp>

        {/* ── QUICK STATS ROW ── */}
        <FadeUp delay={60}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12, marginBottom: 24,
          }}>
            {[
              { icon: CalendarDays, label: "Aujourd'hui", value: stats.today,    color: T.dark,  bg: T.white,   border: T.border  },
              { icon: TrendingUp,   label: 'Demain',      value: stats.tomorrow, color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
              { icon: Users,        label: 'Total',       value: stats.total,    color: T.goldDk, bg: T.goldLight, border: '#e5d4c0' },
            ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
              <div key={i} style={{
                background: bg, border: `1.5px solid ${border}`,
                borderRadius: 16, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 1px 6px rgba(43,33,24,0.05)',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 1px 4px ${border}` }}>
                  <Icon size={18} color={color} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 700, color, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={80}>
          <div style={{
            display: 'flex', gap: 4,
            background: T.white,
            borderRadius: 14, padding: 4,
            border: `1.5px solid ${T.border}`,
            marginBottom: 20,
            width: 'fit-content',
            overflowX: 'auto',
          }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '9px clamp(14px,2vw,22px)',
                  borderRadius: 10, border: 'none',
                  background: tab === t.key ? T.dark : 'transparent',
                  color: tab === t.key ? T.white : T.muted,
                  fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                {t.label}
                {t.badge > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 18, height: 18, borderRadius: 99, padding: '0 5px',
                    background: tab === t.key ? T.gold : T.amberBg,
                    color: tab === t.key ? T.dark : T.amber,
                    fontSize: 9, fontWeight: 900,
                  }}>
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── TAB CONTENT ── */}
        <FadeUp delay={100} key={tab}>
          <TabContent
            tab={tab}
            stats={stats}
            reservations={active?.res ?? []}
            onViewAll={() => navigate('/reservations')}
          />
        </FadeUp>

        {error && (
          <div style={{
            marginTop: 16, padding: '12px 16px',
            background: T.redBg, borderRadius: 12,
            border: `1.5px solid ${T.redBdr}`,
            fontSize: 12, fontWeight: 700, color: T.red,
          }}>
            ⚠️ {error}
          </div>
        )}

      </div>
    </div>
  )
}