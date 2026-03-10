import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  CalendarDays, ArrowRight, Users, ChevronRight,
  Bell, TrendingUp, Utensils, Sun, Sunset, Moon, MapPin
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─── TOKENS (same as Reservations page) ─── */
const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const GOLD_BG = '#fdf6ec'
const CREAM   = '#faf8f5'
const WHITE   = '#ffffff'
const GREEN   = '#1a6e42'
const GREEN_BG= '#edfaf4'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const AMBER   = '#a8670a'
const AMBER_BG= '#fff8ec'
const BORDER  = 'rgba(43,33,24,0.1)'
const MUTED   = 'rgba(43,33,24,0.35)'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ─── Same Btn as Reservations page ─── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 20px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} style={{ animation: (disabled && Icon === RefreshCw) ? 'spin .9s linear infinite' : 'none' }} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

/* ─── Live clock ─── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const day  = t.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const time = t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <span style={{ fontVariantNumeric: 'tabular-nums', textTransform: 'capitalize' }}>{day} · {time}</span>
}

/* ─── Service badge ─── */
function getService() {
  const h = new Date().getHours()
  if (h >= 11 && h < 15) return { label: '🍽️ Service du midi',  color: AMBER,   bg: AMBER_BG }
  if (h >= 18 && h < 23) return { label: '🌙 Service du soir',  color: GREEN,   bg: GREEN_BG }
  if (h >= 15 && h < 18) return { label: '☕ Entre les services', color: GOLD_DK, bg: GOLD_BG  }
  return                         { label: '🌅 Avant le service',  color: MUTED,   bg: CREAM    }
}

/* ─── Animated bar ─── */
function Bar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 300 + delay); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{ height: 5, background: '#e8e0d6', overflow: 'hidden', marginTop: 8, borderRadius: 99 }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, transition: 'width 1.1s cubic-bezier(.22,1,.36,1)', borderRadius: 99 }} />
    </div>
  )
}

/* ─── Stat card ─── */
function StatCard({ icon: Icon, value, label, desc, variant, delay = 0, total = 0 }) {
  const n   = useCountUp(value, 800, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const V = {
    green: { bg: GREEN_BG, border: GREEN, text: GREEN, bar: GREEN },
    amber: { bg: AMBER_BG, border: GOLD,  text: AMBER, bar: GOLD  },
    red:   { bg: RED_BG,   border: RED,   text: RED,   bar: RED   },
  }
  const s = V[variant]
  return (
    <div style={{ background: s.bg, borderTop: `3px solid ${s.border}`, padding: 'clamp(14px,2vw,20px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: s.text, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</span>
        <Icon size={14} strokeWidth={2.5} color={s.border} />
      </div>
      <p style={{ margin: 0, fontSize: 'clamp(34px,5vw,52px)', fontWeight: 900, color: s.text, letterSpacing: '-2.5px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</p>
      {desc && <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: s.text, opacity: 0.65 }}>{desc}</p>}
      {total > 0 && (
        <>
          <Bar pct={pct} color={s.bar} delay={delay} />
          <span style={{ fontSize: 9, fontWeight: 900, color: s.text, opacity: 0.5 }}>{pct}% du total</span>
        </>
      )}
    </div>
  )
}

/* ─── Badge ─── */
function Badge({ status }) {
  const M = {
    Confirmed: { label: 'Confirmée',  bg: GREEN_BG, color: GREEN },
    Pending:   { label: 'En attente', bg: AMBER_BG, color: AMBER },
    Cancelled: { label: 'Annulée',    bg: RED_BG,   color: RED   },
  }
  const s = M[status] || M.Pending
  return (
    <span style={{ display: 'inline-block', padding: '4px 10px', background: s.bg, fontSize: 9, fontWeight: 900, color: s.color, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

/* ─── Stacked bar ─── */
function StackedBar({ c, p, a }) {
  const total = c + p + a || 1
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), 300); return () => clearTimeout(t) }, [])
  const segs = [
    { v: c, color: GREEN, label: 'Confirmées' },
    { v: p, color: GOLD,  label: 'En attente' },
    { v: a, color: RED,   label: 'Annulées'   },
  ]
  return (
    <div>
      <div style={{ height: 8, display: 'flex', gap: 2, borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
        {segs.filter(s => s.v > 0).map((s, i) => (
          <div key={i} style={{
            height: '100%',
            width: on ? `${(s.v / total) * 100}%` : '0%',
            background: s.color, borderRadius: 99,
            transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${i * 80}ms`,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: DARK }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: DARK, fontVariantNumeric: 'tabular-nums' }}>{s.v}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: MUTED, minWidth: 32, textAlign: 'right' }}>{Math.round((s.v / total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Reservation row (mobile card) ─── */
function ResCard({ r, i }) {
  return (
    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? WHITE : CREAM }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: DARK }}>{r.name}</p>
          {r.phone && <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: MUTED }}>{r.phone}</p>}
        </div>
        <Badge status={r.status} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} color={MUTED} strokeWidth={2.5} /> {r.start_time}
        </span>
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Users size={11} color={MUTED} strokeWidth={2.5} /> {r.guests} pers.
        </span>
        {r.service && (
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color={MUTED} strokeWidth={2.5} /> {r.service}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Reservation desktop table ─── */
function ResDesktop({ reservations }) {
  const cols = '1.5fr 1.1fr .9fr .55fr .5fr .9fr .95fr'
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '10px 20px', background: DARK }}>
        {['Client', 'Téléphone', 'Date', 'Heure', 'Pers.', 'Table', 'Statut'].map(h => (
          <span key={h} style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</span>
        ))}
      </div>
      {reservations.map((r, i) => (
        <div key={r.id ?? i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '13px 20px', background: i % 2 === 0 ? WHITE : CREAM, borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.phone || '—'}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: DARK }}>{r.date || r.reservation_date || '—'}</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: DARK, fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: DARK }}>{r.guests}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.service || '—'}</span>
          <Badge status={r.status} />
        </div>
      ))}
    </div>
  )
}

/* ─── Quick action ─── */
function QAction({ icon: Icon, label, sub, to, navigate }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={() => navigate(to)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: h ? DARK : WHITE, border: `1px solid ${h ? DARK : BORDER}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s', textAlign: 'left', width: '100%' }}>
      <div style={{ width: 38, height: 38, background: h ? GOLD : GOLD_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.14s' }}>
        <Icon size={17} strokeWidth={2} color={h ? DARK : GOLD_DK} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: h ? WHITE : DARK }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: h ? 'rgba(255,255,255,0.5)' : MUTED }}>{sub}</p>
      </div>
      <ChevronRight size={14} strokeWidth={2.5} color={h ? GOLD : MUTED} />
    </button>
  )
}

/* ─── Tab panel ─── */
function TabPanel({ tab, stats, reservations, onViewAll, navigate }) {
  const c    = tab === 'today' ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p    = tab === 'today' ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a    = tab === 'today' ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const hero = tab === 'today' ? stats.today              : tab === 'tomorrow' ? (stats.tomorrow           ?? 0) : stats.total
  const total = c + p + a
  const heroN = useCountUp(hero, 900, 40)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Pending alert */}
      {tab === 'today' && p > 0 && (
        <div style={{ background: AMBER_BG, borderLeft: `4px solid ${GOLD}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Bell size={17} strokeWidth={2.5} color={AMBER} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: AMBER }}>{p} réservation{p > 1 ? 's' : ''} à confirmer</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 700, color: AMBER, opacity: 0.75 }}>Ces clients attendent votre réponse</p>
          </div>
          <button onClick={onViewAll}
            style={{ padding: '9px 16px', background: AMBER, border: 'none', color: WHITE, fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Traiter →
          </button>
        </div>
      )}

      {/* Stats block */}
      <div style={{ background: WHITE, border: `2px solid ${DARK}`, padding: 'clamp(16px,2.5vw,28px)' }}>
        <p style={{ margin: '0 0 18px', fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Vue d'ensemble</p>

        <div className="overview-grid">
          {/* Left: hero + stacked bar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <p style={{ margin: 0, fontSize: 'clamp(64px,10vw,108px)', fontWeight: 900, color: DARK, lineHeight: 0.88, letterSpacing: '-5px', fontVariantNumeric: 'tabular-nums' }}>{heroN}</p>
              <div>
                <p style={{ margin: 0, fontSize: 'clamp(13px,1.8vw,16px)', fontWeight: 900, color: DARK }}>réservation{hero !== 1 ? 's' : ''}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: MUTED }}>
                  {hero === 0 ? 'Aucune pour cette période' : `${tab === 'today' ? "aujourd'hui" : tab === 'tomorrow' ? 'demain' : 'ce mois'}`}
                </p>
              </div>
            </div>
            {total > 0 && <StackedBar c={c} p={p} a={a} />}
          </div>

          {/* Right: 3 cards */}
          <div className="db-cards">
            <StatCard icon={CheckCircle} value={c} label="Confirmées" desc="Clients attendus"  variant="green" delay={0}   total={total} />
            <StatCard icon={Clock}       value={p} label="En attente" desc="À confirmer"        variant="amber" delay={60}  total={total} />
            <StatCard icon={XCircle}     value={a} label="Annulées"   desc="Tables libérées"   variant="red"   delay={120} total={total} />
          </div>
        </div>
      </div>

      {/* Reservations */}
      <div style={{ background: WHITE, border: `2px solid ${DARK}` }}>
        <div style={{ padding: '15px 20px', borderBottom: `2px solid ${DARK}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Users size={15} strokeWidth={2.5} color={DARK} />
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: DARK, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Prochaines arrivées
              {reservations.length > 0 && (
                <span style={{ marginLeft: 8, padding: '2px 8px', background: GOLD_BG, color: GOLD_DK, fontSize: 10, fontWeight: 900, borderRadius: 99 }}>
                  {reservations.length}
                </span>
              )}
            </h3>
          </div>
          <button onClick={onViewAll}
            style={{ background: 'none', border: 'none', color: GOLD_DK, fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
            Voir tout <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {!reservations?.length ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: CREAM, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CalendarDays size={24} color={MUTED} />
            </div>
            <p style={{ margin: '0 0 5px', fontSize: 15, fontWeight: 900, color: DARK }}>Aucune réservation</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: MUTED }}>Rien de prévu pour cette période</p>
          </div>
        ) : (
          <>
            <div className="show-desktop" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ minWidth: 540 }}><ResDesktop reservations={reservations.slice(0, 7)} /></div>
            </div>
            <div className="show-mobile">
              {reservations.slice(0, 6).map((r, i) => <ResCard key={r.id ?? i} r={r} i={i} />)}
            </div>
            <button onClick={onViewAll}
              style={{ width: '100%', padding: '14px 20px', background: DARK, border: 'none', color: WHITE, fontSize: 12, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', letterSpacing: '0.05em' }}>
              <span>Voir toutes les réservations</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="qa-grid">
        <QAction icon={CalendarDays} label="Planning"        sub="Vue calendrier"         to="/calendar"       navigate={navigate} />
        <QAction icon={TrendingUp}   label="Rapports"        sub="Statistiques complètes" to="/reports"         navigate={navigate} />
        <QAction icon={Utensils}     label="Dates bloquées"  sub="Gérer les fermetures"   to="/blocked-dates"  navigate={navigate} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   PAGE — structure identique à Reservations
═══════════════════════════════════════ */
export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info }                           = useRestaurantInfo()
  const navigate = useNavigate()

  const [tab,        setTab]        = useState('today')
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)
  const [todayRes,   setTodayRes]   = useState([])
  const [tomRes,     setTomRes]     = useState([])
  const [monthRes,   setMonthRes]   = useState([])

  const loadRes = useCallback(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${ym}`,           { headers: h }).then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  useEffect(() => { loadRes() }, [loadRes])

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", count: stats?.today_pending ?? 0,    res: todayRes, date: TODAY_DATE    },
    { key: 'tomorrow', label: 'Demain',      count: stats?.tomorrow_pending ?? 0, res: tomRes,   date: TOMORROW_DATE },
    { key: 'month',    label: 'Ce mois',     count: 0,                            res: monthRes, date: null          },
  ]
  const active  = TABS.find(t => t.key === tab)
  const service = getService()

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch(); loadRes() } finally { setRefreshing(false) }
  }

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s) })
      exportPDF(stats)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <>
      {/* Same media query pattern as Reservations page */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; }
          body { -webkit-font-smoothing: antialiased; }

          /* Stats 3 cards */
          .db-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }

          /* Overview: hero left + cards right */
          .overview-grid { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }

          /* Quick actions */
          .qa-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }

          /* Show/hide */
          .show-desktop { display: block; }
          .show-mobile  { display: none;  }

          /* Tabs (same style as Reservations filters feel) */
          .db-tabs {
            display: flex; gap: 0;
            border-bottom: 2px solid ${DARK};
            margin-bottom: 16px;
            overflow-x: auto; scrollbar-width: none;
            background: ${WHITE};
          }
          .db-tabs::-webkit-scrollbar { display: none; }
          .db-tab {
            display: flex; align-items: center; gap: 7px;
            padding: 13px clamp(14px,2.2vw,28px);
            background: none; border: none;
            border-bottom: 3px solid transparent;
            color: ${MUTED}; font-size: 11px; font-weight: 900;
            cursor: pointer; font-family: inherit;
            letter-spacing: .12em; text-transform: uppercase;
            transition: all .14s; margin-bottom: -2px;
            white-space: nowrap; flex-shrink: 0;
          }
          .db-tab.active { border-bottom-color: ${DARK}; color: ${DARK}; background: ${CREAM}; }
          .db-tab:hover:not(.active) { color: ${DARK}; }
          .tab-pill {
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 18px; height: 18px; padding: 0 5px;
            background: ${AMBER_BG}; color: ${AMBER};
            font-size: 9px; font-weight: 900; border-radius: 99px;
          }

          /* Responsive */
          @media(max-width: 860px) {
            .overview-grid { grid-template-columns: 1fr; gap: 20px; }
            .qa-grid { grid-template-columns: 1fr 1fr; }
          }
          @media(max-width: 680px) {
            .show-desktop { display: none; }
            .show-mobile  { display: block; }
            .db-cards { grid-template-columns: 1fr 1fr; }
            .qa-grid { grid-template-columns: 1fr; gap: 2px; }
          }
          @media(max-width: 440px) {
            .db-cards { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* ── HEADER (identical structure to Reservations) ── */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Tableau de bord
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                <LiveClock />
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Export…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── DIVIDER (same as Reservations) ── */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 20px' }} />
        </FadeUp>

        {/* ── SERVICE BADGE + QUICK STATS STRIP ── */}
        <FadeUp delay={15}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ padding: '5px 12px', background: service.bg, fontSize: 11, fontWeight: 900, color: service.color, whiteSpace: 'nowrap' }}>
              {service.label}
            </span>
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
              {[
                { label: "Auj.", value: stats.today,    accent: false },
                { label: "Demain", value: stats.tomorrow, accent: false },
                { label: "En attente", value: (stats.today_pending ?? 0) + (stats.tomorrow_pending ?? 0), accent: true },
              ].map((x, i) => (
                <div key={i} style={{ padding: '4px 14px', borderLeft: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{x.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: x.accent ? AMBER : DARK, letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>{x.value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={20}>
          <div className="db-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`db-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
                {t.count > 0 && <span className="tab-pill">{t.count}</span>}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── CONTENT ── */}
        <FadeUp delay={30} key={tab}>
          <TabPanel
            tab={tab}
            stats={stats}
            reservations={active?.res ?? []}
            onViewAll={() => navigate('/reservations', { state: active?.date ? { filterDate: active.date } : {} })}
            navigate={navigate}
          />
        </FadeUp>

        {/* ── ERROR (same style as Reservations) ── */}
        {error && (
          <FadeUp delay={0}>
            <div style={{ marginTop: 12, padding: '11px 16px', background: RED_BG, borderLeft: '3px solid #b94040', fontSize: 12, fontWeight: 700, color: RED, display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle size={14} strokeWidth={2.5} />
              {error}
              <button onClick={handleRefresh} style={{ marginLeft: 'auto', padding: '6px 12px', background: RED, border: 'none', color: WHITE, fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>
                Réessayer
              </button>
            </div>
          </FadeUp>
        )}

      </div>
    </>
  )
}