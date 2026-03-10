import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  CalendarDays, ArrowRight, Users, ChevronRight,
  Bell, TrendingUp, Utensils, Sun, Sunset, Moon,
  Phone, MapPin, Star
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ══════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════ */
const C = {
  bg:       '#f7f5f2',
  white:    '#ffffff',
  dark:     '#2b2118',
  darkSoft: '#3d2e22',
  gold:     '#c8a97e',
  goldDk:   '#a8834e',
  goldBg:   '#fdf6ec',
  border:   'rgba(43,33,24,0.08)',
  borderMd: 'rgba(43,33,24,0.14)',
  muted:    'rgba(43,33,24,0.4)',
  mutedLt:  'rgba(43,33,24,0.22)',
  green:    '#1a6e42',
  greenBg:  '#edfaf4',
  greenBd:  'rgba(26,110,66,0.2)',
  red:      '#b94040',
  redBg:    '#fdf0f0',
  redBd:    'rgba(185,64,64,0.2)',
  amber:    '#a8670a',
  amberBg:  '#fff8ec',
  amberBd:  'rgba(168,103,10,0.2)',
}

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ══════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════ */

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { label: 'Bonjour', Icon: Sun,    color: C.amber  }
  if (h < 18) return { label: 'Bonjour', Icon: Sunset, color: C.goldDk }
  return              { label: 'Bonsoir', Icon: Moon,   color: C.dark   }
}

function getService() {
  const h = new Date().getHours()
  if (h >= 11 && h < 15) return { label: 'Service du midi en cours', color: C.amber,  bg: C.amberBg }
  if (h >= 18 && h < 23) return { label: 'Service du soir en cours', color: C.green,  bg: C.greenBg }
  if (h >= 15 && h < 18) return { label: 'Entre deux services',      color: C.goldDk, bg: C.goldBg  }
  return                         { label: 'Avant le service',         color: C.muted,  bg: '#f0ede9'  }
}

function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

function AnimNum({ value, delay = 0 }) {
  const n = useCountUp(value, 900, delay)
  return <>{n}</>
}

function Bar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 200 + delay); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{ height: 4, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 99, transition: 'width 1.2s cubic-bezier(.22,1,.36,1)' }} />
    </div>
  )
}

/* ══════════════════════════════════════
   STAT CARDS
══════════════════════════════════════ */
function BigStatCard({ icon: Icon, value, label, desc, variant, delay = 0, total = 0, onClick }) {
  const n   = useCountUp(value, 800, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : 0

  const styles = {
    green: { bg: C.greenBg, border: C.green,  text: C.green,  barColor: C.green,  iconBg: C.greenBd },
    amber: { bg: C.amberBg, border: C.gold,   text: C.amber,  barColor: C.gold,   iconBg: C.amberBd },
    red:   { bg: C.redBg,   border: C.red,    text: C.red,    barColor: C.red,    iconBg: C.redBd   },
  }
  const s = styles[variant]

  return (
    <div onClick={onClick}
      style={{ background: s.bg, borderTop: `4px solid ${s.border}`, padding: 'clamp(16px,2.5vw,24px)', display: 'flex', flexDirection: 'column', gap: 8, cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.12s', userSelect: 'none' }}
      onMouseEnter={e => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.transform = 'translateY(0)')}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: s.text, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} strokeWidth={2.5} color={s.border} />
        </div>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 'clamp(40px,6vw,56px)', fontWeight: 900, color: s.text, letterSpacing: '-3px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</p>
        {desc && <p style={{ margin: '5px 0 0', fontSize: 11, fontWeight: 800, color: s.text, opacity: 0.65 }}>{desc}</p>}
      </div>
      {total > 0 && (
        <div>
          <Bar pct={pct} color={s.barColor} delay={delay} />
          <span style={{ fontSize: 10, fontWeight: 800, color: s.text, opacity: 0.55, marginTop: 4, display: 'block' }}>{pct}% du total</span>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════
   HERO COUNTER
══════════════════════════════════════ */
function HeroBlock({ tab, stats }) {
  const c = tab === 'today' ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p = tab === 'today' ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a = tab === 'today' ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const total = c + p + a
  const n = useCountUp(total, 900, 40)

  const segments = [
    { value: c, color: C.green, label: 'Confirmées' },
    { value: p, color: C.gold,  label: 'En attente' },
    { value: a, color: C.red,   label: 'Annulées'   },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,3vw,40px)', flexWrap: 'wrap', marginBottom: 24 }}>
      {/* Giant number */}
      <div>
        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Total</p>
        <p style={{ margin: 0, fontSize: 'clamp(72px,12vw,120px)', fontWeight: 900, color: C.dark, lineHeight: 0.85, letterSpacing: '-6px', fontVariantNumeric: 'tabular-nums' }}>{n}</p>
        <p style={{ margin: '10px 0 0', fontSize: 12, fontWeight: 800, color: C.muted }}>réservation{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Stacked bar */}
      {total > 0 && (
        <div style={{ flex: 1, minWidth: 140, maxWidth: 320 }}>
          <div style={{ height: 10, display: 'flex', overflow: 'hidden', borderRadius: 99, marginBottom: 14, gap: 2 }}>
            {segments.filter(s => s.value > 0).map((s, i) => (
              <BarSegment key={i} pct={(s.value / total) * 100} color={s.color} delay={i * 80} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {segments.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.dark }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: C.dark, fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, minWidth: 30, textAlign: 'right' }}>
                    {total > 0 ? Math.round((s.value / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BarSegment({ pct, color, delay }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 200 + delay); return () => clearTimeout(t) }, [pct])
  return <div style={{ height: '100%', width: `${w}%`, background: color, transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${delay}ms`, borderRadius: 99 }} />
}

/* ══════════════════════════════════════
   RESERVATION CARD (mobile)
══════════════════════════════════════ */
function ResCard({ r, i }) {
  const S = {
    Confirmed: { label: 'Confirmée',  bg: C.greenBg, color: C.green },
    Pending:   { label: 'En attente', bg: C.amberBg, color: C.amber },
    Cancelled: { label: 'Annulée',    bg: C.redBg,   color: C.red   },
  }
  const s = S[r.status] || S.Pending

  return (
    <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.bg }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.dark, letterSpacing: '-0.3px' }}>{r.name}</p>
          {r.phone && <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 700, color: C.muted }}>{r.phone}</p>}
        </div>
        <span style={{ padding: '5px 11px', background: s.bg, color: s.color, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 3, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {s.label}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={12} color={C.muted} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: C.dark }}>{r.start_time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Users size={12} color={C.muted} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: C.dark }}>{r.guests} pers.</span>
        </div>
        {r.service && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={12} color={C.muted} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{r.service}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   RESERVATION TABLE (desktop)
══════════════════════════════════════ */
function ResTable({ reservations }) {
  const S = {
    Confirmed: { label: 'Confirmée',  bg: C.greenBg, color: C.green },
    Pending:   { label: 'En attente', bg: C.amberBg, color: C.amber },
    Cancelled: { label: 'Annulée',    bg: C.redBg,   color: C.red   },
  }
  const cols = '1.5fr 1fr .9fr .5fr .45fr .85fr .9fr'
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '10px 22px', background: C.dark }}>
        {['Client', 'Téléphone', 'Date', 'Heure', 'Pers.', 'Table', 'Statut'].map(h => (
          <span key={h} style={{ fontSize: 9, fontWeight: 900, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</span>
        ))}
      </div>
      {reservations.map((r, i) => {
        const s = S[r.status] || S.Pending
        return (
          <div key={r.id ?? i} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '14px 22px', background: i % 2 === 0 ? C.white : C.bg, borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: C.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.phone || '—'}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.dark }}>{r.date || r.reservation_date || '—'}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: C.dark, fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: C.dark }}>{r.guests}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.service || '—'}</span>
            <span style={{ display: 'inline-block', padding: '4px 10px', background: s.bg, color: s.color, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2, whiteSpace: 'nowrap' }}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════
   TAB PANEL
══════════════════════════════════════ */
function TabPanel({ tab, stats, reservations, onViewAll, navigate }) {
  const c    = tab === 'today' ? stats.today_confirmed    : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p    = tab === 'today' ? stats.today_pending      : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a    = tab === 'today' ? stats.today_cancelled    : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const total = c + p + a

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── PENDING ALERT ── */}
      {tab === 'today' && p > 0 && (
        <div style={{ background: C.amberBg, border: `2px solid ${C.gold}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 38, height: 38, background: `${C.amber}22`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={17} strokeWidth={2.5} color={C.amber} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.amber }}>
              {p} réservation{p > 1 ? 's' : ''} à confirmer
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 700, color: C.amber, opacity: 0.75 }}>
              Ces clients attendent votre réponse
            </p>
          </div>
          <button onClick={onViewAll}
            style={{ padding: '10px 18px', background: C.amber, border: 'none', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 0, flexShrink: 0 }}>
            Traiter →
          </button>
        </div>
      )}

      {/* ── OVERVIEW CARD ── */}
      <div style={{ background: C.white, border: `2px solid ${C.dark}`, padding: 'clamp(18px,3vw,32px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Utensils size={13} strokeWidth={2.5} color={C.goldDk} />
          <span style={{ fontSize: 10, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Vue d'ensemble</span>
        </div>
        <HeroBlock tab={tab} stats={stats} />
        <div className="stat-grid">
          <BigStatCard icon={CheckCircle} value={c} label="Confirmées" desc="Clients attendus"    variant="green" delay={0}   total={total} onClick={onViewAll} />
          <BigStatCard icon={Clock}       value={p} label="En attente" desc="À traiter"           variant="amber" delay={60}  total={total} onClick={onViewAll} />
          <BigStatCard icon={XCircle}     value={a} label="Annulées"   desc="Tables disponibles"  variant="red"   delay={120} total={total} />
        </div>
      </div>

      {/* ── RESERVATIONS ── */}
      <div style={{ background: C.white, border: `2px solid ${C.dark}` }}>
        <div style={{ padding: '16px 20px', borderBottom: `2px solid ${C.dark}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Users size={15} strokeWidth={2.5} color={C.dark} />
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: C.dark, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Prochaines arrivées
              {reservations.length > 0 && (
                <span style={{ marginLeft: 8, padding: '2px 8px', background: C.goldBg, color: C.goldDk, fontSize: 10, fontWeight: 900, borderRadius: 99 }}>
                  {reservations.length}
                </span>
              )}
            </h3>
          </div>
          <button onClick={onViewAll}
            style={{ background: 'none', border: 'none', color: C.goldDk, fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
            Voir tout <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {!reservations?.length
          ? (
            <div style={{ padding: '52px 20px', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, background: C.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CalendarDays size={26} color={C.mutedLt} />
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, color: C.dark }}>Aucune réservation</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.muted }}>Rien de prévu pour cette période</p>
            </div>
          )
          : (
            <>
              {/* Desktop table */}
              <div className="show-desktop" style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 560 }}>
                  <ResTable reservations={reservations.slice(0, 7)} />
                </div>
              </div>
              {/* Mobile cards */}
              <div className="show-mobile">
                {reservations.slice(0, 6).map((r, i) => <ResCard key={r.id ?? i} r={r} i={i} />)}
              </div>
              <button onClick={onViewAll}
                style={{ width: '100%', padding: '15px 22px', background: C.dark, border: 'none', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', letterSpacing: '0.05em' }}>
                <span>Voir toutes les réservations</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </>
          )
        }
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="action-grid">
        {[
          { icon: CalendarDays, label: 'Planning',   sub: 'Calendrier complet',   to: '/calendar'     },
          { icon: TrendingUp,   label: 'Rapports',   sub: 'Statistiques',          to: '/reports'      },
          { icon: CalendarDays, label: 'Dates bloq.', sub: 'Gérer la fermeture',  to: '/blocked-dates' },
        ].map((a, i) => <QuickAction key={i} {...a} navigate={navigate} />)}
      </div>

    </div>
  )
}

function QuickAction({ icon: Icon, label, sub, to, navigate }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={() => navigate(to)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', background: h ? C.dark : C.white, border: `2px solid ${h ? C.dark : C.borderMd}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'left' }}>
      <div style={{ width: 42, height: 42, background: h ? C.gold : C.goldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
        <Icon size={18} strokeWidth={2} color={h ? C.dark : C.goldDk} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: h ? '#fff' : C.dark }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: h ? 'rgba(255,255,255,0.55)' : C.muted }}>{sub}</p>
      </div>
      <ChevronRight size={15} strokeWidth={2.5} color={h ? C.gold : C.mutedLt} />
    </button>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
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

  const loadReservations = useCallback(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${ym}`,           { headers: h }).then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  useEffect(() => { loadReservations() }, [loadReservations])

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch(); loadReservations() } finally { setRefreshing(false) }
  }

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = res; s.onerror = rej; document.head.appendChild(s)
      })
      exportPDF(stats)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", count: stats?.today_pending ?? 0,    res: todayRes, date: TODAY_DATE    },
    { key: 'tomorrow', label: 'Demain',      count: stats?.tomorrow_pending ?? 0, res: tomRes,   date: TOMORROW_DATE },
    { key: 'month',    label: 'Ce mois',     count: 0,                            res: monthRes, date: null          },
  ]
  const active   = TABS.find(t => t.key === tab)
  const greeting = getGreeting()
  const service  = getService()

  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }

        .db-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: clamp(14px, 2.5vw, 40px) clamp(12px, 2.5vw, 40px);
        }

        /* Stat cards */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        /* Quick actions */
        .action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        /* Show/hide by screen */
        .show-desktop { display: block; }
        .show-mobile  { display: none;  }

        /* Tabs */
        .db-tabs {
          display: flex;
          background: ${C.white};
          border: 2px solid ${C.dark};
          border-bottom: none;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .db-tabs::-webkit-scrollbar { display: none; }

        .db-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 14px clamp(14px, 2.5vw, 28px);
          background: none; border: none; border-bottom: 3px solid transparent;
          color: ${C.muted};
          font-size: 11px; font-weight: 900;
          cursor: pointer; font-family: inherit;
          letter-spacing: 0.12em; text-transform: uppercase;
          transition: all 0.14s; white-space: nowrap; flex-shrink: 0;
          margin-bottom: -2px;
        }
        .db-tab.active {
          border-bottom: 3px solid ${C.dark};
          color: ${C.dark};
          background: ${C.bg};
        }
        .db-tab:hover:not(.active) { color: ${C.dark}; }

        .tab-pill {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 18px; height: 18px; padding: 0 5px;
          background: ${C.amberBg}; color: ${C.amber};
          font-size: 9px; font-weight: 900; border-radius: 99px;
        }

        /* Buttons */
        .top-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 11px 16px; border: none; cursor: pointer;
          font-size: 12px; font-weight: 900; font-family: inherit;
          transition: all 0.15s; white-space: nowrap;
        }
        .top-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spin { animation: spin 0.9s linear infinite; }

        /* Responsive */
        @media(max-width: 760px) {
          .stat-grid   { grid-template-columns: 1fr 1fr; }
          .action-grid { grid-template-columns: 1fr; gap: 2px; }
          .show-desktop { display: none; }
          .show-mobile  { display: block; }
        }
        @media(max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr; }
          .btn-text  { display: none; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.35s ease both; }
      `}</style>

      <div className="db-wrap">

        {/* ══ HEADER ══ */}
        <FadeUp delay={0}>
          <div style={{ background: C.white, border: `2px solid ${C.dark}`, padding: 'clamp(16px,2.5vw,28px)', marginBottom: 10 }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>

              {/* Title block */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <greeting.Icon size={13} strokeWidth={2.5} color={greeting.color} />
                  <span style={{ fontSize: 11, fontWeight: 900, color: greeting.color, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{greeting.label}</span>
                </div>
                <h1 style={{ margin: '0 0 5px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: C.dark, letterSpacing: '-2px', lineHeight: 1 }}>
                  Tableau de bord
                </h1>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.muted, textTransform: 'capitalize' }}>
                  {todayStr} · <LiveClock />
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'flex-start' }}>
                <button className="top-btn" onClick={handleRefresh} disabled={refreshing}
                  style={{ background: C.dark, color: '#fff' }}>
                  <RefreshCw size={14} strokeWidth={2.5} className={refreshing ? 'spin' : ''} />
                  <span className="btn-text">Actualiser</span>
                </button>
                <button className="top-btn" onClick={handleExport} disabled={exporting}
                  style={{ background: C.gold, color: C.dark }}>
                  <FileDown size={14} strokeWidth={2.5} />
                  <span className="btn-text">PDF</span>
                </button>
              </div>
            </div>

            {/* ── Stats strip ── */}
            <div style={{ display: 'flex', gap: 0, marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.border}`, flexWrap: 'wrap', rowGap: 12 }}>

              {/* Service badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: service.bg, marginRight: 16, flexShrink: 0 }}>
                <Utensils size={11} color={service.color} strokeWidth={2.5} />
                <span style={{ fontSize: 10, fontWeight: 900, color: service.color, whiteSpace: 'nowrap' }}>{service.label}</span>
              </div>

              {/* Quick numbers */}
              {[
                { label: "Auj.",      value: stats.today,    sub: `${stats.today_confirmed ?? 0} conf.`  },
                { label: "Demain",    value: stats.tomorrow, sub: `${stats.tomorrow_confirmed ?? 0} conf.` },
                { label: "Ce mois",   value: stats.total,    sub: `${stats.confirmed ?? 0} conf.`       },
                { label: "En attente", value: (stats.today_pending ?? 0) + (stats.tomorrow_pending ?? 0), sub: 'à traiter', accent: true },
              ].map(x => (
                <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderLeft: `1px solid ${C.border}` }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{x.label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 900, color: x.accent ? C.amber : C.dark, letterSpacing: '-1px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{x.value}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 800, color: C.muted }}>{x.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ══ TABS ══ */}
        <FadeUp delay={10}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'stretch' }}>
            <div className="db-tabs" style={{ flex: 1 }}>
              {TABS.map(t => (
                <button key={t.key} className={`db-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                  {t.label}
                  {t.count > 0 && <span className="tab-pill">{t.count}</span>}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ══ CONTENT ══ */}
        <div className="fade-in" key={tab}>
          <TabPanel
            tab={tab}
            stats={stats}
            reservations={active?.res ?? []}
            onViewAll={() => navigate('/reservations', { state: active?.date ? { filterDate: active.date } : {} })}
            navigate={navigate}
          />
        </div>

        {/* ══ ERROR ══ */}
        {error && (
          <div style={{ marginTop: 10, padding: '14px 18px', background: C.redBg, border: `2px solid ${C.red}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <XCircle size={16} color={C.red} strokeWidth={2.5} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: C.red }}>
              Erreur de chargement · Vérifiez votre connexion
            </p>
            <button onClick={handleRefresh} style={{ marginLeft: 'auto', padding: '8px 14px', background: C.red, border: 'none', color: '#fff', fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>
              Réessayer
            </button>
          </div>
        )}

      </div>
    </div>
  )
}