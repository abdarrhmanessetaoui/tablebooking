import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, CheckCircle, Clock, XCircle, CalendarDays, ArrowRight } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─── TOKENS ─── */
const DARK     = '#2b2118'
const GOLD     = '#c8a97e'
const GOLD_DK  = '#a8834e'
const GOLD_BG  = '#fdf6ec'
const CREAM    = '#faf8f5'
const WHITE    = '#ffffff'
const GREEN    = '#1a6e42'
const GREEN_BG = '#edfaf4'
const RED      = '#b94040'
const RED_BG   = '#fdf0f0'
const AMBER    = '#a8670a'
const AMBER_BG = '#fff8ec'
const BORDER   = 'rgba(43,33,24,0.1)'
const MUTED    = 'rgba(43,33,24,0.35)'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ─── Live clock ─── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 900 }}>
      {t.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      &nbsp;·&nbsp;
      {t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

/* ─── Buttons ─── */
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
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

/* ─── Ring ─── */
function Ring({ c, p, a, size = 100 }) {
  const total = c + p + a || 1
  const pct   = Math.round((c / total) * 100)
  const r = 30, circ = 2 * Math.PI * r
  const segs = [{ v: c, color: GREEN }, { v: p, color: GOLD }, { v: a, color: RED }]
  let off = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e8e0d6" strokeWidth="7.5" />
        {segs.map((s, i) => {
          if (!s.v) { off += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el = (
            <circle key={i} cx="36" cy="36" r={r} fill="none" stroke={s.color} strokeWidth="7.5"
              strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-off}
              style={{ transition: `stroke-dasharray 0.9s ease ${i * 0.12}s` }}
            />
          )
          off += arc; return el
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: DARK, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 7, fontWeight: 900, color: GOLD_DK, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>conf.</span>
      </div>
    </div>
  )
}

/* ─── Animated bar ─── */
function Bar({ pct, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { const id = setTimeout(() => setW(pct), 400); return () => clearTimeout(id) }, [pct])
  return (
    <div style={{ height: 5, background: '#e8e0d6', overflow: 'hidden', marginTop: 10 }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, transition: 'width 0.9s ease' }} />
    </div>
  )
}

/* ─── Stat card ─── */
function StatCard({ icon: Icon, value, label, variant, delay = 0, total = 0 }) {
  const n   = useCountUp(value, 700, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const V = {
    green: { bg: GREEN_BG, border: GREEN, text: GREEN, bar: GREEN },
    gold:  { bg: AMBER_BG, border: GOLD,  text: AMBER, bar: GOLD  },
    red:   { bg: RED_BG,   border: RED,   text: RED,   bar: RED   },
  }
  const s = V[variant]
  return (
    <div style={{ background: s.bg, borderTop: `3px solid ${s.border}`, padding: '20px 18px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: s.text, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</span>
        <Icon size={15} strokeWidth={2.5} color={s.border} />
      </div>
      <p style={{ margin: 0, fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: s.text, letterSpacing: '-2.5px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</p>
      {total > 0 && (
        <>
          <Bar pct={pct} color={s.bar} />
          <span style={{ fontSize: 10, fontWeight: 900, color: s.text, marginTop: 6, opacity: 0.7 }}>{pct}%</span>
        </>
      )}
    </div>
  )
}

/* ─── Status badge ─── */
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

/* ─── Mobile reservation card ─── */
function ResCardMobile({ r, i }) {
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
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK }}>🕐 {r.start_time}</span>
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK }}>👥 {r.guests} pers.</span>
        {r.service && <span style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>{r.service}</span>}
      </div>
    </div>
  )
}

/* ─── Reservations block ─── */
function ReservationsBlock({ reservations, onViewAll }) {
  if (!reservations?.length) return (
    <div style={{ padding: '52px 0', textAlign: 'center' }}>
      <CalendarDays size={38} color="rgba(43,33,24,0.1)" style={{ display: 'block', margin: '0 auto 14px' }} />
      <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'rgba(43,33,24,0.18)' }}>Aucune réservation pour cette période</p>
      <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.14)' }}>Les réservations apparaîtront ici</p>
    </div>
  )

  const COLS = [
    { key: 'name',       label: 'Nom',       flex: 1.6 },
    { key: 'phone',      label: 'Téléphone', flex: 1.2 },
    { key: 'date',       label: 'Date',      flex: 1   },
    { key: 'start_time', label: 'Heure',     flex: 0.6 },
    { key: 'guests',     label: 'Couverts',  flex: 0.6 },
    { key: 'service',    label: 'Service',   flex: 1   },
    { key: 'status',     label: 'Statut',    flex: 1   },
  ]
  const tpl = COLS.map(c => `${c.flex}fr`).join(' ')

  return (
    <div>
      {/* Desktop table */}
      <div className="res-desktop" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: 540 }}>
          <div style={{ display: 'grid', gridTemplateColumns: tpl, gap: 12, padding: '11px 22px', background: DARK }}>
            {COLS.map(c => (
              <span key={c.key} style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{c.label}</span>
            ))}
          </div>
          {reservations.slice(0, 7).map((r, i) => (
            <div key={r.id ?? i}
              style={{ display: 'grid', gridTemplateColumns: tpl, gap: 12, padding: '13px 22px', background: i % 2 === 0 ? WHITE : CREAM, borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.phone || '—'}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: DARK }}>{r.date || r.reservation_date || '—'}</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: DARK, fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: DARK }}>{r.guests}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.service || '—'}</span>
              <Badge status={r.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="res-mobile">
        {reservations.slice(0, 6).map((r, i) => <ResCardMobile key={r.id ?? i} r={r} i={i} />)}
      </div>

      <button onClick={onViewAll}
        style={{ width: '100%', padding: '15px 22px', background: DARK, border: 'none', color: WHITE, fontSize: 12, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', letterSpacing: '0.06em' }}>
        <span>Voir toutes les réservations</span>
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ─── Tab panel ─── */
function TabPanel({ tab, stats, reservations, onViewAll }) {
  const c     = tab === 'today'    ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p     = tab === 'today'    ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a     = tab === 'today'    ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const hero  = tab === 'today'    ? stats.today              : tab === 'tomorrow' ? (stats.tomorrow           ?? 0) : stats.total
  const total = c + p + a

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* ── OVERVIEW ── */}
      <div style={{ background: WHITE, border: `2px solid ${DARK}`, padding: 'clamp(16px,2.5vw,28px)' }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 16 }}>Vue d'ensemble</span>

        <div className="hero-layout">
          {/* Hero number + ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 'clamp(64px,10vw,112px)', fontWeight: 900, color: DARK, lineHeight: 0.85, letterSpacing: '-6px', fontVariantNumeric: 'tabular-nums' }}>
                {hero}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: 13, fontWeight: 900, color: MUTED }}>
                réservation{hero !== 1 ? 's' : ''}
              </p>
            </div>
            <Ring c={c} p={p} a={a} size={100} />
          </div>

          {/* Divider */}
          <div className="hero-divider" />

          {/* 3 cards */}
          <div className="db-cards">
            <StatCard icon={CheckCircle} value={c} label="Confirmées" variant="green" delay={50}  total={total} />
            <StatCard icon={Clock}       value={p} label="En attente" variant="gold"  delay={80}  total={total} />
            <StatCard icon={XCircle}     value={a} label="Annulées"   variant="red"   delay={110} total={total} />
          </div>
        </div>
      </div>

      {/* ── RESERVATIONS ── */}
      <div style={{ background: WHITE, border: `2px solid ${DARK}` }}>
        <div style={{ padding: '16px 22px', borderBottom: `2px solid ${DARK}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(13px,2vw,15px)', fontWeight: 900, color: DARK, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Prochaines réservations
          </h3>
          <button onClick={onViewAll}
            style={{ background: 'none', border: 'none', color: GOLD_DK, fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, padding: 0, letterSpacing: '0.04em' }}>
            Voir tout <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>
        <ReservationsBlock reservations={reservations} onViewAll={onViewAll} />
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════
   PAGE
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
    const h    = { Authorization: `Bearer ${getToken()}` }
    const now  = new Date()
    const year = now.getFullYear()
    const mon  = String(now.getMonth() + 1).padStart(2, '0')
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${year}-${mon}`,  { headers: h }).then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", res: todayRes, date: TODAY_DATE    },
    { key: 'tomorrow', label: 'Demain',      res: tomRes,   date: TOMORROW_DATE },
    { key: 'month',    label: 'Ce mois',     res: monthRes, date: null          },
  ]
  const active = TABS.find(t => t.key === tab)

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
    <>
      <style>{`
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
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; }
          body { -webkit-font-smoothing: antialiased; }

          /* hero layout */
          .hero-layout {
            display: grid;
            grid-template-columns: auto 2px 1fr;
            gap: 28px;
            align-items: center;
          }
          .hero-divider {
            background: ${DARK};
            align-self: stretch;
            width: 2px;
            flex-shrink: 0;
          }

          /* 3 stat cards */
          .db-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          /* reservation show/hide */
          .res-desktop { display: block; }
          .res-mobile  { display: none;  }

          /* tabs */
          .db-tabs {
            display: flex;
            border-bottom: 2px solid ${DARK};
            margin-bottom: 16px;
            overflow-x: auto;
            scrollbar-width: none;
            background: ${WHITE};
          }
          .db-tabs::-webkit-scrollbar { display: none; }
          .db-tab {
            display: flex; align-items: center; gap: 7px;
            padding: 13px clamp(14px, 2.2vw, 28px);
            background: none; border: none;
            border-bottom: 3px solid transparent;
            color: ${MUTED}; font-size: 11px; font-weight: 900;
            cursor: pointer; font-family: inherit;
            letter-spacing: .12em; text-transform: uppercase;
            transition: all .14s; margin-bottom: -2px;
            white-space: nowrap; flex-shrink: 0;
          }
          .db-tab.active { border-bottom-color: ${DARK}; color: ${DARK}; }
          .db-tab:hover:not(.active) { color: ${DARK}; }
          .tab-pill {
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 18px; height: 18px; padding: 0 5px;
            background: ${AMBER_BG}; color: ${AMBER};
            font-size: 9px; font-weight: 900; border-radius: 99px;
          }

          /* ─── RESPONSIVE ─── */
          /* Tablet: hero stacks, divider hides */
          @media(max-width: 860px) {
            .hero-layout { grid-template-columns: 1fr; gap: 20px; }
            .hero-divider { display: none; }
          }
          /* Mobile: table → cards, cards 2-col */
          @media(max-width: 640px) {
            .db-cards    { grid-template-columns: 1fr 1fr; }
            .res-desktop { display: none; }
            .res-mobile  { display: block; }
          }
          /* Small mobile: cards 1-col */
          @media(max-width: 400px) {
            .db-cards { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* ── HEADER ── */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Tableau de bord
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK, textTransform: 'capitalize' }}>
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

        {/* ── DIVIDER ── */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 20px' }} />
        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={20}>
          <div className="db-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`db-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
                {t.key === 'today' && stats.today_pending > 0 && (
                  <span className="tab-pill">{stats.today_pending}</span>
                )}
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
          />
        </FadeUp>

        {/* ── ERROR ── */}
        {error && (
          <FadeUp delay={0}>
            <div style={{ marginTop: 12, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              Erreur de chargement — {error}
            </div>
          </FadeUp>
        )}

      </div>
    </>
  )
}