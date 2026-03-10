import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  ArrowRight, TrendingUp, Star, CalendarDays
} from 'lucide-react'
import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─────────── TOKENS ─────────── */
const BG      = '#130e08'
const SURFACE = '#1e1510'
const CARD    = '#251a11'
const BORDER  = 'rgba(200,169,126,0.12)'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const WHITE   = '#ffffff'
const MUTED   = 'rgba(255,255,255,0.45)'
const GREEN   = '#3ecf8e'
const AMBER   = '#f0a500'
const RED     = '#e05c5c'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ─────────── Live clock ─────────── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return <span style={{ fontVariantNumeric: 'tabular-nums', color: MUTED }}>{t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
}

/* ─────────── Ring chart ─────────── */
function Ring({ confirmed, pending, cancelled, size = 90 }) {
  const total = confirmed + pending + cancelled || 1
  const pct   = Math.round((confirmed / total) * 100)
  const r = 30, circ = 2 * Math.PI * r
  const segs = [
    { v: confirmed, color: GREEN },
    { v: pending,   color: AMBER },
    { v: cancelled, color: RED   },
  ]
  let off = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        {segs.map((s, i) => {
          if (!s.v) { off += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el = (
            <circle key={i} cx="36" cy="36" r={r} fill="none"
              stroke={s.color} strokeWidth="7"
              strokeDasharray={`${arc} ${circ}`}
              strokeDashoffset={-off}
              style={{ transition: `stroke-dasharray 0.9s ease ${i * 0.12}s` }}
            />
          )
          off += arc; return el
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: WHITE, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 7, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>taux conf.</span>
      </div>
    </div>
  )
}

/* ─────────── Stat card ─────────── */
function StatCard({ icon: Icon, value, label, accent, note, delay = 0 }) {
  const n = useCountUp(value, 700, delay)
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `2px solid ${accent}`, padding: '20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</span>
        <Icon size={14} strokeWidth={2} color={accent} />
      </div>
      <p style={{ margin: 0, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, color: WHITE, letterSpacing: '-2px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</p>
      {note && <p style={{ margin: '10px 0 0', fontSize: 10, fontWeight: 800, color: accent }}>{note}</p>}
    </div>
  )
}

/* ─────────── Upcoming table ─────────── */
function UpcomingTable({ reservations, onViewAll }) {
  if (!reservations?.length) return (
    <div style={{ padding: '36px 0', textAlign: 'center' }}>
      <CalendarDays size={28} color="rgba(200,169,126,0.2)" style={{ display: 'block', margin: '0 auto 10px' }} />
      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.15)' }}>Aucune réservation</p>
    </div>
  )

  const STATUS = {
    Confirmed: { label: 'CONFIRMÉ',   bg: 'rgba(62,207,142,0.1)',  color: GREEN },
    Pending:   { label: 'EN ATTENTE', bg: 'rgba(240,165,0,0.1)',   color: AMBER },
    Cancelled: { label: 'ANNULÉ',     bg: 'rgba(224,92,92,0.1)',   color: RED   },
  }

  return (
    <div>
      {/* header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 80px 1fr 100px', padding: '10px 20px', borderBottom: `1px solid ${BORDER}` }}>
        {['HEURE','CLIENT','COUVERTS','TABLE','STATUT'].map(h => (
          <span key={h} style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</span>
        ))}
      </div>
      {reservations.slice(0, 5).map((r, i) => {
        const s = STATUS[r.status] || STATUS.Pending
        return (
          <div key={r.id ?? i}
            style={{ display: 'grid', gridTemplateColumns: '80px 1fr 80px 1fr 100px', padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: WHITE, fontVariantNumeric: 'tabular-nums' }}>{r.start_time}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: WHITE }}>{r.name}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: MUTED }}>{r.guests} Pers.</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>{r.service || '—'}</span>
            <span style={{ fontSize: 9, fontWeight: 900, color: s.color, background: s.bg, padding: '4px 10px', letterSpacing: '0.1em', display: 'inline-block' }}>{s.label}</span>
          </div>
        )
      })}
      <button onClick={onViewAll}
        style={{ width: '100%', padding: '13px 20px', background: 'transparent', border: 'none', borderTop: `1px solid ${BORDER}`, color: GOLD, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontFamily: 'inherit', letterSpacing: '0.04em' }}>
        Voir tout le planning <ArrowRight size={13} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/* ─────────── Insight card ─────────── */
function InsightCard({ icon: Icon, eyebrow, title, sub, accent = GOLD, action, onAction }) {
  const [h, setH] = useState(false)
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '22px 24px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <Icon size={12} strokeWidth={2.5} color={accent} />
        <span style={{ fontSize: 9, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{eyebrow}</span>
      </div>
      <p style={{ margin: '0 0 6px', fontSize: 'clamp(15px,1.8vw,20px)', fontWeight: 900, color: WHITE, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{title}</p>
      <p style={{ margin: '0 0 18px', fontSize: 12, fontWeight: 700, color: MUTED }}>{sub}</p>
      {action && (
        <button onClick={onAction}
          onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
          style={{ padding: '9px 18px', background: h ? GOLD : 'transparent', border: `1px solid ${GOLD}`, color: h ? '#130e08' : GOLD, fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', transition: 'all 0.14s' }}>
          {action}
        </button>
      )}
    </div>
  )
}

/* ─────────── Tab view ─────────── */
function TabView({ tab, stats, reservations, onViewAll }) {
  const isToday    = tab === 'today'
  const isTomorrow = tab === 'tomorrow'

  const c = isToday ? stats.today_confirmed    : isTomorrow ? (stats.tomorrow_confirmed ?? 0) : stats.confirmed
  const p = isToday ? stats.today_pending      : isTomorrow ? (stats.tomorrow_pending   ?? 0) : stats.pending
  const a = isToday ? stats.today_cancelled    : isTomorrow ? (stats.tomorrow_cancelled ?? 0) : stats.cancelled
  const total = isToday ? stats.today          : isTomorrow ? stats.tomorrow                  : stats.total

  return (
    <div>
      {/* ── Stats block ── */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: '28px 28px', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>

          {/* Big total */}
          <div style={{ flex: '0 0 auto' }}>
            <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Total réservations</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              <p style={{ margin: 0, fontSize: 'clamp(64px,9vw,112px)', fontWeight: 900, color: WHITE, lineHeight: 0.85, letterSpacing: '-5px', fontVariantNumeric: 'tabular-nums' }}>
                {total}
              </p>
              <Ring confirmed={c} pending={p} cancelled={a} size={88} />
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: 1, background: BORDER, alignSelf: 'stretch', flexShrink: 0 }} className="db-sep" />

          {/* 3 stat cards */}
          <div className="db-statgrid" style={{ flex: 1, minWidth: 0 }}>
            <StatCard icon={CheckCircle} value={c} label="Confirmées" accent={GREEN} note={`${total ? Math.round(c/total*100) : 0}% du total`} delay={50}  />
            <StatCard icon={Clock}       value={p} label="En attente" accent={AMBER} note={p > 0 ? `${p} à traiter` : null} delay={80}  />
            <StatCard icon={XCircle}     value={a} label="Annulées"   accent={RED}   note={`${total ? Math.round(a/total*100) : 0}% du total`} delay={110} />
          </div>

        </div>
      </div>

      {/* ── Upcoming reservations ── */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, marginBottom: 8 }}>
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(13px,1.8vw,16px)', fontWeight: 900, color: WHITE, letterSpacing: '-0.3px', textTransform: 'uppercase' }}>Prochaines arrivées</h3>
          <button onClick={onViewAll} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}>
            Voir tout le planning →
          </button>
        </div>
        <UpcomingTable reservations={reservations} onViewAll={onViewAll} />
      </div>

      {/* ── Insight cards ── */}
      <div className="db-insights">
        <InsightCard
          icon={TrendingUp}
          eyebrow="Tendance de la semaine"
          title={c > p ? "Bonne semaine en vue" : "Réservations en attente"}
          sub={`${c} confirmées · ${p} en attente · ${a} annulées`}
          accent={GOLD}
          action="Voir les réservations"
          onAction={onViewAll}
        />
        <InsightCard
          icon={Star}
          eyebrow="Statut du jour"
          title={`${total} réservation${total !== 1 ? 's' : ''} au total`}
          sub={`Taux de confirmation : ${total ? Math.round(c/total*100) : 0}%`}
          accent={GREEN}
        />
      </div>
    </div>
  )
}

/* ─────────── Btn ─────────── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [h, setH] = useState(false)
  const bg    = primary ? (h ? WHITE : GOLD) : (h ? GOLD : SURFACE)
  const color = primary ? (h ? BG : BG) : (h ? BG : WHITE)
  const brd   = primary ? 'none' : `1px solid ${BORDER}`
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: bg, border: brd, color, fontSize: 12, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'all 0.15s', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {Icon && <Icon size={13} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════
   PAGE
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

  /* fetch mini-tables */
  useEffect(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    { headers: h }).then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h }).then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch() } finally { setRefreshing(false) }
  }

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s) })
      exportPDF(stats)
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  const TABS = [
    { key: 'today',    label: "Aujourd'hui", res: todayRes,           date: TODAY_DATE    },
    { key: 'tomorrow', label: 'Demain',      res: tomRes,             date: TOMORROW_DATE },
    { key: 'month',    label: 'Ce mois',     res: [],                 date: null          },
  ]
  const activeTab = TABS.find(t => t.key === tab)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", color: WHITE }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .db-wrap     { max-width: 1100px; margin: 0 auto; padding: clamp(20px,3.5vw,44px) clamp(16px,3vw,44px); }
        .db-statgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .db-insights { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .db-sep      { display: block; }
        @media(max-width:900px){
          .db-statgrid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width:700px){
          .db-statgrid { grid-template-columns: 1fr; }
          .db-insights { grid-template-columns: 1fr; }
          .db-sep      { display: none; }
        }
        @media(max-width:480px){
          .db-topbtns { flex-direction:column; width:100%; }
          .db-topbtns button { justify-content:center; }
        }
      `}</style>

      <div className="db-wrap">

        {/* ── TOP BAR ── */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 900, color: WHITE, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'capitalize' }}>
                {today}&nbsp;·&nbsp;<LiveClock />
              </p>
            </div>
            <div className="db-topbtns" style={{ display: 'flex', gap: 8 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>{refreshing ? 'Actualisation…' : 'Actualiser'}</Btn>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>{exporting ? 'Génération…' : 'Exporter PDF'}</Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={20}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === t.key ? `2px solid ${GOLD}` : '2px solid transparent', color: tab === t.key ? GOLD : MUTED, fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.14s', marginBottom: -1 }}>
                {t.label}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── TAB CONTENT ── */}
        <FadeUp delay={40} key={tab}>
          <TabView
            tab={tab}
            stats={stats}
            reservations={activeTab?.res ?? []}
            onViewAll={() => navigate('/reservations', { state: activeTab?.date ? { filterDate: activeTab.date } : {} })}
          />
        </FadeUp>

        {error && <p style={{ marginTop: 24, fontSize: 12, fontWeight: 800, color: RED }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}