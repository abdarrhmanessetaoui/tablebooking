import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileDown, CheckCircle, Clock, XCircle, CalendarDays, ArrowRight, Users, MapPin, ChevronRight } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─── TOKENS ─── */
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

/* ─── helpers ─── */
function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

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

/* ─── Btn ─── */
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

/* ─── Ring donut ─── */
function Ring({ c, p, a, size = 88 }) {
  const total = c + p + a || 1
  const pct   = Math.round((c / total) * 100)
  const r = 30, circ = 2 * Math.PI * r
  const segs = [{ v: c, color: GREEN }, { v: p, color: GOLD }, { v: a, color: RED }]
  let off = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke={BORDER} strokeWidth="8" />
        {segs.map((s, i) => {
          if (!s.v) { off += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el = (
            <circle key={i} cx="36" cy="36" r={r} fill="none" stroke={s.color} strokeWidth="8"
              strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-off}
              style={{ transition: `stroke-dasharray 0.9s ease ${i * 0.12}s` }}
            />
          )
          off += arc; return el
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: DARK, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
        <span style={{ fontSize: 7, fontWeight: 900, color: GOLD_DK, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>conf.</span>
      </div>
    </div>
  )
}

/* ─── Single stat block ─── */
function StatBlock({ icon: Icon, value, label, accent, bg, delay = 0, total = 0 }) {
  const n   = useCountUp(value, 700, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : null
  const [w, setW] = useState(0)
  useEffect(() => { const id = setTimeout(() => setW(pct ?? 0), 440); return () => clearTimeout(id) }, [pct])

  return (
    <div style={{ background: bg, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 3, height: 36, background: accent, flexShrink: 0, borderRadius: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
          <Icon size={10} strokeWidth={2.5} color={accent} />
          <span style={{ fontSize: 8, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: DARK, letterSpacing: '-1px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
          {pct !== null && (
            <span style={{ fontSize: 9, fontWeight: 900, color: accent, opacity: 0.7 }}>{pct}%</span>
          )}
        </div>
      </div>
      {pct !== null && (
        <div style={{ width: 36, height: 3, background: BORDER, overflow: 'hidden', flexShrink: 0, alignSelf: 'center' }}>
          <div style={{ height: '100%', width: `${w}%`, background: accent, transition: 'width 0.9s ease' }} />
        </div>
      )}
    </div>
  )
}

/* ─── Status badge ─── */
function Badge({ status }) {
  const M = {
    Confirmed: { label: 'Confirmée',  color: GREEN },
    Pending:   { label: 'En attente', color: AMBER },
    Cancelled: { label: 'Annulée',    color: RED   },
  }
  const s = M[status] || M.Pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 900, color: s.color,
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: s.color, flexShrink: 0,
        boxShadow: `0 0 0 2px ${s.color}22`,
      }} />
      {s.label}
    </span>
  )
}

/* ─── Mobile reservation card ─── */
function ResCardMobile({ r, i, onRowClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => onRowClick(r)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '13px 14px', borderBottom: `1px solid ${BORDER}`,
        background: hov ? '#f5ede0' : i % 2 === 0 ? WHITE : CREAM,
        cursor: 'pointer', transition: 'background 0.12s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
          {r.phone && <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: MUTED }}>{r.phone}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Badge status={r.status} />
          <ChevronRight size={13} strokeWidth={2.5} color={MUTED} />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {r.date && r.date !== TODAY_DATE && r.date !== TOMORROW_DATE && (
          <span style={{ fontSize: 11, fontWeight: 900, color: GOLD_DK, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarDays size={11} strokeWidth={2.5} color={GOLD_DK} />{fmtDate(r.date)}
          </span>
        )}
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

/* ─── Reservations table (right column) ─── */
function ReservationsTable({ reservations, onViewAll, tabLabel, onRowClick, showDate }) {
  if (!reservations?.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', textAlign: 'center' }}>
        <CalendarDays size={36} color="rgba(43,33,24,0.1)" style={{ marginBottom: 14 }} />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'rgba(43,33,24,0.18)' }}>Aucune réservation</p>
        <p style={{ margin: '5px 0 0', fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.12)' }}>Les réservations apparaîtront ici</p>
      </div>
      <button onClick={onViewAll} style={{
        width: '100%', padding: '13px 20px', background: DARK, border: 'none', color: WHITE,
        fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'inherit', transition: 'background 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#3d2d1e'}
        onMouseLeave={e => e.currentTarget.style.background = DARK}
      >
        <span>Voir toutes les réservations</span>
        <ArrowRight size={13} strokeWidth={2.5} />
      </button>
    </div>
  )

  // Show date column when viewing "Ce mois" tab
  const COLS = [
    ...(showDate ? [{ key: 'date', label: 'Date', flex: 1.1 }] : []),
    { key: 'name',       label: 'Nom',      flex: 1.8 },
    { key: 'start_time', label: 'Heure',    flex: 0.7 },
    { key: 'guests',     label: 'Pers.',    flex: 0.65 },
    { key: 'service',    label: 'Service',  flex: 1.0 },
    { key: 'status',     label: 'Statut',   flex: 1.1 },
    { key: '_cta',       label: '',         flex: 0.3 },
  ]
  const tpl = COLS.map(c => `${c.flex}fr`).join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: tpl, gap: 10, padding: '11px 16px', background: DARK }}>
        {COLS.map(c => (
          <span key={c.key} style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.18em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.label}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {reservations.slice(0, 8).map((r, i) => (
          <ResRow key={r.id ?? i} r={r} i={i} tpl={tpl} showDate={showDate} onRowClick={onRowClick} />
        ))}
      </div>

      {/* Footer CTA */}
      <button onClick={onViewAll} style={{
        width: '100%', padding: '13px 16px', background: DARK, border: 'none', color: WHITE,
        fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'inherit', transition: 'background 0.15s', marginTop: 'auto',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#3d2d1e'}
        onMouseLeave={e => e.currentTarget.style.background = DARK}
      >
        <span>Toutes les réservations — {tabLabel}</span>
        <ArrowRight size={13} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ─── Single clickable table row ─── */
function ResRow({ r, i, tpl, showDate, onRowClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => onRowClick(r)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: tpl, gap: 10,
        padding: '13px 16px',
        background: hov ? '#f5ede0' : i % 2 === 0 ? WHITE : CREAM,
        borderBottom: `1px solid ${BORDER}`,
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      {/* Date column — only for month view */}
      {showDate && (
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: GOLD_DK, whiteSpace: 'nowrap' }}>
            {fmtDate(r.date)}
          </span>
        </div>
      )}

      {/* Name + phone */}
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
        {r.phone && <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 700, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.phone}</p>}
      </div>

      {/* Heure */}
      <span style={{ fontSize: 13, fontWeight: 900, color: DARK, fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</span>

      {/* Pers. — with icon */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 900, color: DARK }}>
        <Users size={11} strokeWidth={2.5} color={MUTED} />
        {r.guests}
      </span>

      {/* Service */}
      <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.service || '—'}</span>

      {/* Statut */}
      <Badge status={r.status} />

      {/* Chevron hint */}
      <ChevronRight
        size={14} strokeWidth={2.5}
        color={hov ? GOLD_DK : 'transparent'}
        style={{ transition: 'color 0.12s', justifySelf: 'end' }}
      />
    </div>
  )
}

/* ─── Tab panel ─── */
function TabPanel({ tab, stats, reservations, onViewAll, tabLabel, tabDate, onRowClick }) {
  const c     = tab === 'today' ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p     = tab === 'today' ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a     = tab === 'today' ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const hero  = tab === 'today' ? stats.today              : tab === 'tomorrow' ? (stats.tomorrow           ?? 0) : stats.total
  const total = c + p + a || 1
  const periodLabel = tab === 'today' ? "Aujourd'hui" : tab === 'tomorrow' ? 'Demain' : 'Ce mois'
  const showDate    = tab === 'month'  // show date column only in month view

  return (
    <>
      <style>{`
        .db-card { background: ${WHITE}; border: 2px solid ${DARK}; overflow: hidden; }
        .db-body { display: grid; grid-template-columns: 280px 1fr; }
        .db-left { border-right: 2px solid ${DARK}; }
        .db-stats-sticky { position: sticky; top: 24px; }
        @media (max-width: 860px) {
          .db-body { grid-template-columns: 1fr; }
          .db-left { border-right: none; border-bottom: 2px solid ${DARK}; }
          .db-stats-sticky { position: static; }
        }
        .res-desktop { display: block; }
        .res-mobile  { display: none;  }
        @media (max-width: 640px) {
          .res-desktop { display: none;  }
          .res-mobile  { display: block; }
        }
      `}</style>

      <div className="db-card">
        <div className="db-body">

          {/* LEFT: stats */}
          <div className="db-left db-stats-sticky">
            <div style={{ padding: '18px 20px 16px', display: 'flex', alignItems: 'center', gap: 20, borderBottom: `1px solid ${BORDER}`, background: WHITE }}>
              <div>
                <p style={{ margin: 0, fontSize: 'clamp(52px,8vw,80px)', fontWeight: 900, color: DARK, lineHeight: 0.9, letterSpacing: '-4px', fontVariantNumeric: 'tabular-nums' }}>{hero}</p>
                <p style={{ margin: '10px 0 0', fontSize: 11, fontWeight: 700, color: MUTED }}>réservation{hero !== 1 ? 's' : ''}</p>
              </div>
              <Ring c={c} p={p} a={a} size={88} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: BORDER }}>
              <StatBlock icon={CheckCircle} value={c} label="Confirmées" accent={GREEN} bg={GREEN_BG} delay={50}  total={total} />
              <StatBlock icon={Clock}       value={p} label="En attente" accent={AMBER} bg={AMBER_BG} delay={80}  total={total} />
              <StatBlock icon={XCircle}     value={a} label="Annulées"   accent={RED}   bg={RED_BG}   delay={110} total={total} />
            </div>
          </div>

          {/* RIGHT: table */}
          <div>
            <div className="res-desktop">
              <ReservationsTable
                reservations={reservations}
                onViewAll={onViewAll}
                tabLabel={periodLabel}
                onRowClick={onRowClick}
                showDate={showDate}
              />
            </div>
            <div className="res-mobile">
              {reservations?.length
                ? reservations.slice(0, 6).map((r, i) => (
                    <ResCardMobile key={r.id ?? i} r={r} i={i} onRowClick={onRowClick} />
                  ))
                : (
                  <div style={{ padding: '40px 16px', textAlign: 'center' }}>
                    <CalendarDays size={32} color="rgba(43,33,24,0.1)" style={{ display: 'block', margin: '0 auto 12px' }} />
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: 'rgba(43,33,24,0.18)' }}>Aucune réservation</p>
                    <p style={{ margin: '5px 0 0', fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.12)' }}>{periodLabel}</p>
                  </div>
                )
              }
              <button onClick={onViewAll} style={{
                width: '100%', padding: '13px 16px', background: DARK, border: 'none', color: WHITE,
                fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontFamily: 'inherit',
              }}>
                <span>Toutes les réservations — {periodLabel}</span>
                <ArrowRight size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

/* ═══════════════════════
   PAGE
═══════════════════════ */
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

  // Click a row → go to Reservations page with that reservation open in modal
  function handleRowClick(r) {
    navigate('/reservations', {
      state: {
        openId:     r.id,
        filterDate: active?.date ?? null,
      }
    })
  }

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = res; s.onerror = rej; document.head.appendChild(s)
      })
      exportPDF(stats, active?.res || [], active?.label || "Aujourd'hui")
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 480px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
        .db-tabs {
          display: flex; border-bottom: 2px solid ${DARK};
          margin-bottom: 8px; overflow-x: auto; scrollbar-width: none;
          background: ${WHITE};
        }
        .db-tabs::-webkit-scrollbar { display: none; }
        .db-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 12px clamp(14px, 2.2vw, 26px);
          background: none; border: none;
          border-bottom: 3px solid transparent; margin-bottom: -2px;
          color: ${MUTED}; font-size: 10px; font-weight: 900;
          cursor: pointer; font-family: inherit;
          letter-spacing: .14em; text-transform: uppercase;
          transition: color .14s, border-color .14s;
          white-space: nowrap; flex-shrink: 0;
        }
        .db-tab.active { border-bottom-color: ${DARK}; color: ${DARK}; }
        .db-tab:hover:not(.active) { color: ${DARK}; }
        .tab-pill {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 17px; height: 17px; padding: 0 4px;
          background: ${AMBER_BG}; color: ${AMBER};
          font-size: 9px; font-weight: 900;
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        width: '100%', overflowX: 'hidden', boxSizing: 'border-box',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
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

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 20px' }} />
        </FadeUp>

        {/* TABS */}
        <FadeUp delay={20}>
          <div className="db-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`db-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
                {t.key === 'today' && stats.today_pending > 0 && (
                  <span className="tab-pill">{stats.today_pending}</span>
                )}
                {t.key === 'tomorrow' && (stats.tomorrow_pending ?? 0) > 0 && (
                  <span className="tab-pill">{stats.tomorrow_pending}</span>
                )}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* CONTENT */}
        <FadeUp delay={30} key={tab}>
          <TabPanel
            tab={tab}
            stats={stats}
            reservations={active?.res ?? []}
            tabLabel={active?.label ?? ''}
            tabDate={active?.date ?? null}
            onViewAll={() => navigate('/reservations', { state: active?.date ? { filterDate: active.date } : {} })}
            onRowClick={handleRowClick}
          />
        </FadeUp>

        {/* ERROR */}
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