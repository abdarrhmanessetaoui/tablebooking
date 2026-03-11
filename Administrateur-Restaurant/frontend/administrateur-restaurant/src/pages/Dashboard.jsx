import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileDown, CheckCircle, Clock, XCircle, CalendarDays, ArrowRight, Users, MapPin } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─── TOKENS (identical to BlockedDates) ─── */
const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM   = '#faf8f5'
const WHITE   = '#ffffff'
const GREEN   = '#1a6e42'
const GREEN_BG= '#edfaf4'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const AMBER   = '#a8670a'
const AMBER_BG= '#fff8ec'
const BORDER  = '#e8e0d6'
const MUTED   = 'rgba(43,33,24,0.38)'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ─── Live clock ─── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
      {t.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      &nbsp;·&nbsp;
      {t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

/* ─── Shared Btn (same as BlockedDates) ─── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 16px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 40,
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

/* ─── Stat card — compact, no ring, matching BD card style ─── */
function StatCard({ icon: Icon, value, label, accent, bg, delay = 0, total = 0 }) {
  const n   = useCountUp(value, 700, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : null
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setW(pct ?? 0), 420)
    return () => clearTimeout(id)
  }, [pct])

  return (
    <div style={{
      background: bg,
      borderTop: `3px solid ${accent}`,
      padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 9, fontWeight: 900, color: accent,
          textTransform: 'uppercase', letterSpacing: '0.18em',
        }}>{label}</span>
        <Icon size={14} strokeWidth={2.5} color={accent} />
      </div>

      {/* big number */}
      <p style={{
        margin: 0,
        fontSize: 'clamp(28px,4vw,44px)',
        fontWeight: 900, color: DARK,
        letterSpacing: '-2px', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>{n}</p>

      {/* progress bar + pct */}
      {pct !== null && (
        <div>
          <div style={{ height: 4, background: BORDER, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${w}%`, background: accent, transition: 'width 0.9s ease' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 900, color: accent, marginTop: 5, display: 'block', opacity: 0.8 }}>
            {pct}%
          </span>
        </div>
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
    <span style={{
      display: 'inline-block', padding: '3px 9px',
      background: s.bg, fontSize: 9, fontWeight: 900,
      color: s.color, textTransform: 'uppercase',
      letterSpacing: '0.1em', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

/* ─── Mobile reservation card ─── */
function ResCardMobile({ r, i }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: `1px solid ${BORDER}`,
      background: i % 2 === 0 ? WHITE : CREAM,
      borderLeft: `3px solid transparent`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: DARK }}>{r.name}</p>
          {r.phone && <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: MUTED }}>{r.phone}</p>}
        </div>
        <Badge status={r.status} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: DARK, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} strokeWidth={2.5} color={MUTED} />{r.start_time}
        </span>
        <span style={{ fontSize: 11, fontWeight: 900, color: DARK, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Users size={11} strokeWidth={2.5} color={MUTED} />{r.guests} pers.
        </span>
        {r.service && (
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} strokeWidth={2.5} color={MUTED} />{r.service}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Reservations table/cards ─── */
function ReservationsBlock({ reservations, onViewAll }) {
  if (!reservations?.length) return (
    <div style={{ padding: '52px 0', textAlign: 'center' }}>
      <CalendarDays size={36} color="rgba(43,33,24,0.1)" style={{ display: 'block', margin: '0 auto 14px' }} />
      <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'rgba(43,33,24,0.18)' }}>Aucune réservation</p>
      <p style={{ margin: '5px 0 0', fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.12)' }}>
        Les réservations apparaîtront ici
      </p>
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
          {/* Header — same dark bar as BlockedDateList */}
          <div style={{ display: 'grid', gridTemplateColumns: tpl, gap: 12, padding: '11px 20px', background: DARK }}>
            {COLS.map(c => (
              <span key={c.key} style={{
                fontSize: 9, fontWeight: 900, color: GOLD,
                textTransform: 'uppercase', letterSpacing: '0.18em',
              }}>{c.label}</span>
            ))}
          </div>
          {reservations.slice(0, 7).map((r, i) => (
            <div key={r.id ?? i} style={{
              display: 'grid', gridTemplateColumns: tpl, gap: 12,
              padding: '13px 20px',
              background: i % 2 === 0 ? WHITE : CREAM,
              borderBottom: `1px solid ${BORDER}`,
              alignItems: 'center',
            }}>
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
      </div>

      {/* Mobile cards */}
      <div className="res-mobile">
        {reservations.slice(0, 6).map((r, i) => <ResCardMobile key={r.id ?? i} r={r} i={i} />)}
      </div>

      {/* Footer CTA — same style as BlockedDates dark button */}
      <button onClick={onViewAll} style={{
        width: '100%', padding: '14px 20px',
        background: DARK, border: 'none', color: WHITE,
        fontSize: 12, fontWeight: 900,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'inherit', letterSpacing: '0.08em', textTransform: 'uppercase',
        transition: 'background 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#3d2d1e'}
        onMouseLeave={e => e.currentTarget.style.background = DARK}
      >
        <span>Voir toutes les réservations</span>
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ─── Tab content panel ─── */
function TabPanel({ tab, stats, reservations, onViewAll }) {
  const c     = tab === 'today'    ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p     = tab === 'today'    ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a     = tab === 'today'    ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const hero  = tab === 'today'    ? stats.today              : tab === 'tomorrow' ? (stats.tomorrow           ?? 0) : stats.total
  const total = c + p + a || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* ── OVERVIEW CARD ── */}
      <div style={{ background: WHITE, border: `2px solid ${DARK}` }}>

        {/* Card header bar */}
        <div style={{
          padding: '10px 20px',
          background: DARK,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Vue d'ensemble
          </span>
          {/* Hero total badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 28, height: 28, padding: '0 8px',
            background: GOLD, color: DARK,
            fontSize: 13, fontWeight: 900,
          }}>{hero}</span>
        </div>

        {/* Sub-label under the bar */}
        <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>
            réservation{hero !== 1 ? 's' : ''} au total
          </span>
        </div>

        {/* 3 stat cards */}
        <div className="db-cards" style={{ padding: '12px 20px 20px', gap: 8 }}>
          <StatCard icon={CheckCircle} value={c} label="Confirmées" accent={GREEN} bg={GREEN_BG} delay={50}  total={total} />
          <StatCard icon={Clock}       value={p} label="En attente" accent={GOLD}  bg={AMBER_BG} delay={80}  total={total} />
          <StatCard icon={XCircle}     value={a} label="Annulées"   accent={RED}   bg={RED_BG}   delay={110} total={total} />
        </div>
      </div>

      {/* ── RESERVATIONS CARD ── */}
      <div style={{ background: WHITE, border: `2px solid ${DARK}` }}>
        {/* Section header */}
        <div style={{
          padding: '10px 20px', background: DARK,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Prochaines réservations
          </span>
          <button onClick={onViewAll} style={{
            background: 'none', border: 'none', color: GOLD,
            fontSize: 11, fontWeight: 900, cursor: 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
            padding: 0, letterSpacing: '0.08em', textTransform: 'uppercase',
            opacity: 0.8, transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
          >
            Voir tout <ArrowRight size={11} strokeWidth={2.5} />
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

  const [tab,       setTab]       = useState('today')
  const [exporting, setExporting] = useState(false)
  const [todayRes,  setTodayRes]  = useState([])
  const [tomRes,    setTomRes]    = useState([])
  const [monthRes,  setMonthRes]  = useState([])

  const loadAll = useCallback(() => {
    const h   = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const yr  = now.getFullYear()
    const mo  = String(now.getMonth() + 1).padStart(2, '0')
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${yr}-${mo}`,     { headers: h }).then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})
    refetch()
  }, [refetch])

  useEffect(() => {
    loadAll()
    const id = setInterval(loadAll, 60_000)
    return () => clearInterval(id)
  }, [loadAll])

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", res: todayRes, date: TODAY_DATE    },
    { key: 'tomorrow', label: 'Demain',      res: tomRes,   date: TOMORROW_DATE },
    { key: 'month',    label: 'Ce mois',     res: monthRes, date: null          },
  ]
  const active = TABS.find(t => t.key === tab)

  async function handleExport() {
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
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }

        @media (max-width: 480px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }

        /* Stat cards grid */
        .db-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 560px) {
          .db-cards { grid-template-columns: 1fr; }
        }

        /* Tabs */
        .db-tabs {
          display: flex;
          border-bottom: 2px solid ${DARK};
          margin-bottom: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          background: ${WHITE};
        }
        .db-tabs::-webkit-scrollbar { display: none; }
        .db-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 12px clamp(14px,2.2vw,28px);
          background: none; border: none;
          border-bottom: 3px solid transparent;
          color: ${MUTED}; font-size: 10px; font-weight: 900;
          cursor: pointer; font-family: inherit;
          letter-spacing: .14em; text-transform: uppercase;
          transition: color .14s, border-color .14s;
          margin-bottom: -2px;
          white-space: nowrap; flex-shrink: 0;
        }
        .db-tab.active { border-bottom-color: ${DARK}; color: ${DARK}; }
        .db-tab:hover:not(.active) { color: ${DARK}; }

        /* Pending pill on today tab */
        .tab-pill {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 17px; height: 17px; padding: 0 4px;
          background: ${AMBER_BG}; color: ${AMBER};
          font-size: 9px; font-weight: 900;
        }

        /* Reservation show/hide */
        .res-desktop { display: block; }
        .res-mobile  { display: none;  }
        @media (max-width: 640px) {
          .res-desktop { display: none;  }
          .res-mobile  { display: block; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        width: '100%', overflowX: 'hidden',
        boxSizing: 'border-box',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

        {/* ── HEADER ── */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
            marginBottom: 8, flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{
                margin: 0, fontSize: 'clamp(20px,5vw,36px)',
                fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1,
              }}>
                Tableau de bord
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                <LiveClock />
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Export…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── DIVIDER (same 2px dark bar as BlockedDates) ── */}
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
            <div style={{
              marginTop: 12, padding: '11px 16px',
              background: RED_BG, borderLeft: `3px solid ${RED}`,
              fontSize: 12, fontWeight: 700, color: RED,
            }}>
              Erreur de chargement — {error}
            </div>
          </FadeUp>
        )}

      </div>
    </>
  )
}s