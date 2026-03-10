import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  CalendarDays, ArrowRight, Users, TrendingUp, Bell,
  ChevronRight, Sun, Sunset, Moon
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─────────── DESIGN TOKENS ─────────── */
const D = {
  bg:       '#ffffff',
  surface:  '#faf8f5',
  dark:     '#2b2118',
  gold:     '#c8a97e',
  goldDk:   '#a8834e',
  goldBg:   '#fdf6ec',
  border:   'rgba(43,33,24,0.09)',
  muted:    'rgba(43,33,24,0.38)',
  green:    '#1a6e42',
  greenBg:  '#edfaf4',
  red:      '#b94040',
  redBg:    '#fdf0f0',
  amber:    '#a8670a',
  amberBg:  '#fff8ec',
}

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ─────────── Greeting ─────────── */
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Bonjour', Icon: Sun,    color: D.amber  }
  if (h < 18) return { text: 'Bonjour', Icon: Sunset, color: D.goldDk }
  return               { text: 'Bonsoir', Icon: Moon,  color: D.dark   }
}

/* ─────────── Live clock ─────────── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const day  = t.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const time = t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return <span style={{ fontVariantNumeric: 'tabular-nums', textTransform: 'capitalize' }}>{day} · {time}</span>
}

/* ─────────── Pill badge ─────────── */
function Pill({ count, color, bg }) {
  if (!count) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 20, height: 20, padding: '0 6px',
      background: bg, color, fontSize: 10, fontWeight: 900,
      borderRadius: 99, marginLeft: 7, letterSpacing: 0,
    }}>{count}</span>
  )
}

/* ─────────── Animated progress bar ─────────── */
function ProgressBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const id = setTimeout(() => setW(pct), 300 + delay); return () => clearTimeout(id) }, [pct, delay])
  return (
    <div style={{ height: 4, background: D.border, overflow: 'hidden', borderRadius: 2, marginTop: 10 }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, transition: 'width 1.1s cubic-bezier(.22,1,.36,1)', borderRadius: 2 }} />
    </div>
  )
}

/* ─────────── Stat card (big, clear, tap-friendly) ─────────── */
function StatCard({ icon: Icon, value, label, hint, variant, delay = 0, total = 0 }) {
  const n   = useCountUp(value, 800, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const V = {
    green: { bg: D.greenBg,  border: D.green,  text: D.green,  bar: D.green  },
    amber: { bg: D.amberBg,  border: D.gold,   text: D.amber,  bar: D.gold   },
    red:   { bg: D.redBg,    border: D.red,    text: D.red,    bar: D.red    },
  }
  const s = V[variant]
  return (
    <div style={{ background: s.bg, borderTop: `3px solid ${s.border}`, padding: 'clamp(16px,2.5vw,22px)', display: 'flex', flexDirection: 'column', minHeight: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: s.text, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.border}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} strokeWidth={2.5} color={s.border} />
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 'clamp(36px,5vw,52px)', fontWeight: 900, color: s.text, letterSpacing: '-2.5px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</p>
      {hint && <p style={{ margin: '6px 0 0', fontSize: 11, fontWeight: 800, color: s.text, opacity: 0.65 }}>{hint}</p>}
      {total > 0 && (
        <>
          <ProgressBar pct={pct} color={s.bar} delay={delay} />
          <span style={{ fontSize: 10, fontWeight: 900, color: s.text, marginTop: 5, opacity: 0.55 }}>{pct}% du total</span>
        </>
      )}
    </div>
  )
}

/* ─────────── Ring donut ─────────── */
function Ring({ c, p, a, size = 96 }) {
  const total = c + p + a || 1
  const pct   = Math.round((c / total) * 100)
  const r = 29, circ = 2 * Math.PI * r
  const segs = [{ v: c, color: D.green }, { v: p, color: D.gold }, { v: a, color: D.red }]
  let off = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke={D.border} strokeWidth="7" />
        {segs.map((s, i) => {
          if (!s.v) { off += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el = <circle key={i} cx="35" cy="35" r={r} fill="none" stroke={s.color} strokeWidth="7"
            strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-off}
            style={{ transition: `stroke-dasharray 1s ease ${i * 0.15}s` }} />
          off += arc; return el
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: D.dark, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 6.5, fontWeight: 900, color: D.goldDk, textTransform: 'uppercase', letterSpacing: '0.1em' }}>confirmés</span>
      </div>
    </div>
  )
}

/* ─────────── Quick-action button ─────────── */
function QBtn({ icon: Icon, label, sub, onClick, accent }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 20px',
        background: h ? D.dark : D.surface,
        border: `2px solid ${h ? D.dark : D.border}`,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.16s', textAlign: 'left', width: '100%',
      }}>
      <div style={{ width: 40, height: 40, background: h ? D.gold : D.goldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.16s' }}>
        <Icon size={18} strokeWidth={2} color={h ? D.dark : D.goldDk} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: h ? '#fff' : D.dark }}>{label}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: h ? 'rgba(255,255,255,0.6)' : D.muted }}>{sub}</p>}
      </div>
      <ChevronRight size={16} strokeWidth={2.5} color={h ? D.gold : D.muted} />
    </button>
  )
}

/* ─────────── Status badge ─────────── */
function StatusBadge({ status }) {
  const M = {
    Confirmed: { label: 'Confirmée',  bg: D.greenBg, color: D.green },
    Pending:   { label: 'En attente', bg: D.amberBg, color: D.amber },
    Cancelled: { label: 'Annulée',    bg: D.redBg,   color: D.red   },
  }
  const s = M[status] || M.Pending
  return (
    <span style={{ padding: '4px 10px', background: s.bg, fontSize: 9, fontWeight: 900, color: s.color, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', borderRadius: 2 }}>
      {s.label}
    </span>
  )
}

/* ─────────── Reservations table ─────────── */
function ReservationsSection({ reservations, onViewAll }) {
  if (!reservations?.length) return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, background: D.surface, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <CalendarDays size={28} color={D.muted} />
      </div>
      <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 900, color: D.dark }}>Aucune réservation</p>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: D.muted }}>Rien de prévu pour cette période</p>
    </div>
  )

  /* Mobile cards + desktop table */
  return (
    <>
      {/* ── DESKTOP TABLE (hidden on mobile) ── */}
      <div className="res-desktop">
        <div className="res-header-row">
          {['Client', 'Tél.', 'Date', 'Heure', 'Pers.', 'Table', 'Statut'].map(h => (
            <span key={h} style={{ fontSize: 9, fontWeight: 900, color: D.gold, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{h}</span>
          ))}
        </div>
        {reservations.slice(0, 7).map((r, i) => (
          <div key={r.id ?? i} className="res-row" style={{ background: i % 2 === 0 ? '#fff' : D.surface }}>
            <span className="res-bold">{r.name}</span>
            <span className="res-muted">{r.phone || '—'}</span>
            <span className="res-semi">{r.date || r.reservation_date || '—'}</span>
            <span className="res-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</span>
            <span className="res-bold">{r.guests}</span>
            <span className="res-muted">{r.service || '—'}</span>
            <StatusBadge status={r.status} />
          </div>
        ))}
        <button onClick={onViewAll} className="res-footer">
          <span>Voir toutes les réservations</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── MOBILE CARDS (hidden on desktop) ── */}
      <div className="res-mobile">
        {reservations.slice(0, 5).map((r, i) => (
          <div key={r.id ?? i} style={{ padding: '14px 16px', borderBottom: `1px solid ${D.border}`, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: D.dark }}>{r.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 700, color: D.muted }}>{r.phone || '—'}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: D.dark }}>🕐 {r.start_time}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: D.dark }}>👥 {r.guests} pers.</span>
              {r.service && <span style={{ fontSize: 12, fontWeight: 700, color: D.muted }}>{r.service}</span>}
            </div>
          </div>
        ))}
        <button onClick={onViewAll} className="res-footer">
          <span>Voir toutes les réservations</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </>
  )
}

/* ─────────── Tab panel ─────────── */
function TabPanel({ tab, stats, reservations, onViewAll, navigate }) {
  const c    = tab === 'today' ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p    = tab === 'today' ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a    = tab === 'today' ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const hero = tab === 'today' ? stats.today              : tab === 'tomorrow' ? (stats.tomorrow           ?? 0) : stats.total
  const total = c + p + a

  const heroN = useCountUp(hero, 900, 40)

  /* Pending alert */
  const showAlert = tab === 'today' && p > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── PENDING ALERT ── */}
      {showAlert && (
        <div style={{ background: D.amberBg, border: `2px solid ${D.gold}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Bell size={18} strokeWidth={2.5} color={D.amber} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: D.amber }}>
              {p} réservation{p > 1 ? 's' : ''} en attente de confirmation
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 700, color: D.amber, opacity: 0.8 }}>
              Pensez à confirmer ou annuler ces réservations
            </p>
          </div>
          <button onClick={onViewAll}
            style={{ padding: '9px 16px', background: D.amber, border: 'none', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Traiter maintenant
          </button>
        </div>
      )}

      {/* ── STATS BLOCK ── */}
      <div style={{ background: '#fff', border: `2px solid ${D.dark}`, padding: 'clamp(18px,3vw,28px)' }}>

        {/* Hero row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
              {tab === 'today' ? "Aujourd'hui" : tab === 'tomorrow' ? 'Demain' : 'Ce mois'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 'clamp(64px,11vw,110px)', fontWeight: 900, color: D.dark, lineHeight: 0.88, letterSpacing: '-5px', fontVariantNumeric: 'tabular-nums' }}>
                {heroN}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 'clamp(13px,1.8vw,16px)', fontWeight: 900, color: D.dark }}>
                  réservation{hero !== 1 ? 's' : ''}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: D.muted }}>
                  {hero === 0
                    ? 'Aucune pour le moment'
                    : `${c} conf. · ${p} att. · ${a} ann.`
                  }
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Ring c={c} p={p} a={a} size={96} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { color: D.green, label: 'Confirmées' },
            { color: D.gold,  label: 'En attente' },
            { color: D.red,   label: 'Annulées'   },
          ].map(x => (
            <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: x.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: D.dark }}>{x.label}</span>
            </div>
          ))}
        </div>

        {/* 3 stat cards */}
        <div className="db-cards">
          <StatCard icon={CheckCircle} value={c} label="Confirmées" hint="Prêtes à accueillir" variant="green" delay={0}   total={total} />
          <StatCard icon={Clock}       value={p} label="En attente" hint="À confirmer"          variant="amber" delay={60}  total={total} />
          <StatCard icon={XCircle}     value={a} label="Annulées"   hint="Tables libérées"      variant="red"   delay={120} total={total} />
        </div>
      </div>

      {/* ── RESERVATIONS ── */}
      <div style={{ background: '#fff', border: `2px solid ${D.dark}` }}>
        <div style={{ padding: '16px 20px', borderBottom: `2px solid ${D.dark}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={16} strokeWidth={2.5} color={D.dark} />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: D.dark, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Prochaines arrivées
            </h3>
          </div>
          <button onClick={onViewAll}
            style={{ background: 'none', border: 'none', color: D.goldDk, fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
            Voir tout <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>
        <ReservationsSection reservations={reservations} onViewAll={onViewAll} />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ background: '#fff', border: `2px solid ${D.dark}` }}>
        <div style={{ padding: '14px 20px', borderBottom: `2px solid ${D.dark}` }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: D.dark, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Actions rapides</h3>
        </div>
        <div className="qa-grid">
          <QBtn icon={CalendarDays} label="Voir le planning" sub="Vue calendrier complète" onClick={() => navigate('/calendar')} />
          <QBtn icon={TrendingUp}   label="Rapports & stats" sub="Analyse des réservations" onClick={() => navigate('/reports')} />
        </div>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
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

  useEffect(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${ym}`,           { headers: h }).then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", count: stats?.today_pending,    res: todayRes, date: TODAY_DATE    },
    { key: 'tomorrow', label: 'Demain',      count: stats?.tomorrow_pending, res: tomRes,   date: TOMORROW_DATE },
    { key: 'month',    label: 'Ce mois',     count: 0,                       res: monthRes, date: null          },
  ]
  const active = TABS.find(t => t.key === tab)
  const { text: greet, Icon: GreetIcon } = greeting()

  async function handleRefresh() { setRefreshing(true); try { await refetch() } finally { setRefreshing(false) } }
  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s) })
      exportPDF(stats)
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: D.surface, fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }

        .db-wrap {
          max-width: 1060px;
          margin: 0 auto;
          padding: clamp(16px,3vw,44px) clamp(12px,2.5vw,40px);
        }

        /* Stat cards */
        .db-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        /* Table desktop */
        .res-desktop  { display: block; }
        .res-mobile   { display: none; }
        .res-header-row {
          display: grid;
          grid-template-columns: 1.6fr 1.1fr .95fr .55fr .45fr .9fr .95fr;
          gap: 12px;
          padding: 10px 20px;
          background: ${D.dark};
        }
        .res-row {
          display: grid;
          grid-template-columns: 1.6fr 1.1fr .95fr .55fr .45fr .9fr .95fr;
          gap: 12px;
          padding: 13px 20px;
          border-bottom: 1px solid ${D.border};
          align-items: center;
        }
        .res-bold   { font-size: 13px; font-weight: 900; color: ${D.dark}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .res-semi   { font-size: 12px; font-weight: 800; color: ${D.dark}; }
        .res-muted  { font-size: 12px; font-weight: 700; color: ${D.muted}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .res-footer {
          width: 100%; padding: 15px 20px;
          background: ${D.dark}; border: none; color: #fff;
          font-size: 12px; font-weight: 900; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          font-family: inherit; letter-spacing: 0.06em;
          transition: background 0.15s;
        }
        .res-footer:hover { background: #1a0d05; }

        /* Quick actions grid */
        .qa-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .qa-grid > *:first-child {
          border-right: 1px solid ${D.border};
        }

        /* Tabs */
        .db-tabs {
          display: flex;
          border-bottom: 2px solid ${D.dark};
          margin-bottom: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          background: #fff;
        }
        .db-tabs::-webkit-scrollbar { display: none; }
        .db-tab {
          display: flex; align-items: center;
          padding: 15px clamp(16px,2.5vw,28px);
          background: none; border: none;
          border-bottom: 3px solid transparent;
          color: ${D.muted};
          font-size: 11px; font-weight: 900;
          cursor: pointer; font-family: inherit;
          letter-spacing: .12em; text-transform: uppercase;
          transition: all .14s; margin-bottom: -2px;
          white-space: nowrap; flex-shrink: 0;
        }
        .db-tab.active { border-bottom-color: ${D.dark}; color: ${D.dark}; }
        .db-tab:hover:not(.active) { color: ${D.dark}; background: ${D.surface}; }

        /* Responsive */
        @media(max-width: 860px) {
          .qa-grid { grid-template-columns: 1fr; }
          .qa-grid > *:first-child { border-right: none; border-bottom: 1px solid ${D.border}; }
        }
        @media(max-width: 680px) {
          .db-cards { grid-template-columns: 1fr 1fr; }
          .res-desktop { display: none; }
          .res-mobile  { display: block; }
        }
        @media(max-width: 420px) {
          .db-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-wrap">
        <FadeUp delay={0}>

          {/* ── HEADER ── */}
          <div style={{ background: '#fff', border: `2px solid ${D.dark}`, padding: 'clamp(16px,2.5vw,28px)', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>

              <div>
                {/* Greeting */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <GreetIcon size={14} strokeWidth={2.5} color={D.goldDk} />
                  <span style={{ fontSize: 12, fontWeight: 900, color: D.goldDk, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    {greet}
                  </span>
                </div>
                <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: D.dark, letterSpacing: '-2px', lineHeight: 1 }}>
                  Tableau de bord
                </h1>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: D.muted }}>
                  <LiveClock />
                </p>
              </div>

              {/* Action buttons with labels on md+, icons only on sm */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={handleRefresh} disabled={refreshing}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: refreshing ? D.surface : D.dark, border: 'none', color: '#fff', fontSize: 12, fontWeight: 900, cursor: refreshing ? 'not-allowed' : 'pointer', opacity: refreshing ? 0.6 : 1, fontFamily: 'inherit', transition: 'all .15s' }}
                  title="Actualiser les données">
                  <RefreshCw size={14} strokeWidth={2.5} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                  <span className="btn-label">Actualiser</span>
                </button>
                <button onClick={handleExport} disabled={exporting}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', background: exporting ? D.surface : D.gold, border: 'none', color: D.dark, fontSize: 12, fontWeight: 900, cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? 0.6 : 1, fontFamily: 'inherit', transition: 'all .15s' }}
                  title="Exporter en PDF">
                  <FileDown size={14} strokeWidth={2.5} />
                  <span className="btn-label">PDF</span>
                </button>
              </div>
            </div>

            {/* Summary mini-strip */}
            <div style={{ display: 'flex', gap: 0, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${D.border}`, flexWrap: 'wrap', gap: 12 }}>
              {[
                { label: "Aujourd'hui",     value: stats.today,    color: D.dark   },
                { label: 'Demain',          value: stats.tomorrow, color: D.dark   },
                { label: 'En attente',      value: (stats.today_pending ?? 0) + (stats.tomorrow_pending ?? 0), color: D.amber },
                { label: 'Ce mois (total)', value: stats.total,    color: D.dark   },
              ].map(x => (
                <div key={x.label} style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 1 60px', minWidth: 60 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{x.label}</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: x.color, letterSpacing: '-1px', lineHeight: 1 }}>{x.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 2, background: D.dark, marginBottom: 10 }} />

        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={10}>
          <div className="db-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`db-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
                {t.count > 0 && (
                  <Pill count={t.count} color={D.amber} bg={D.amberBg} />
                )}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── TAB CONTENT ── */}
        <FadeUp delay={20} key={tab}>
          <TabPanel
            tab={tab}
            stats={stats}
            reservations={active?.res ?? []}
            onViewAll={() => navigate('/reservations', { state: active?.date ? { filterDate: active.date } : {} })}
            navigate={navigate}
          />
        </FadeUp>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ marginTop: 12, padding: '14px 18px', background: D.redBg, border: `2px solid ${D.red}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <XCircle size={16} color={D.red} strokeWidth={2.5} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: D.red }}>
              Impossible de charger les données · {error}
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 500px) {
          .btn-label { display: none; }
        }
      `}</style>
    </div>
  )
}