import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, Download,
  CheckCircle, Clock, XCircle,
  CalendarDays, ClipboardList,
  ArrowRight,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'

const BROWN      = '#9A6F2E'
const BROWN_DARK = '#7A5520'

/* ── Live clock ── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ fontVariantNumeric:'tabular-nums' }}>
      {time.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
    </span>
  )
}

/* ── Section label ── */
function Label({ text }) {
  return (
    <p style={{
      margin: '0 0 18px',
      fontSize: 10, fontWeight: 900, color: '#CACACA',
      letterSpacing: '0.22em', textTransform: 'uppercase',
    }}>
      {text}
    </p>
  )
}

/* ── Hero number ── */
function HeroNum({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{
      margin: 0,
      fontSize: 'clamp(88px,13vw,172px)',
      fontWeight: 900, color: '#111',
      lineHeight: 0.85,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-5px',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
    }}>
      {n}
    </p>
  )
}

/* ── Stat block ── */
function Stat({ value, label, color = '#111', delay = 0, icon: Icon, iconColor }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      {Icon && (
        <div style={{ marginBottom: 14 }}>
          <Icon size={28} color={iconColor || color} strokeWidth={1.75} />
        </div>
      )}
      <p style={{
        margin: 0,
        fontSize: 'clamp(44px,5.5vw,68px)',
        fontWeight: 900, color,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-2px',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin: '7px 0 0', fontSize: 13, fontWeight: 600, color: '#C0C0C0' }}>
        {label}
      </p>
    </div>
  )
}

/* ── Text link button ── */
function TextLink({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', padding: 0,
        fontSize: 13, fontWeight: 800,
        color: hov ? BROWN_DARK : BROWN,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'color 0.13s',
      }}
    >
      {children}
      <ArrowRight size={14} strokeWidth={2.5} />
    </button>
  )
}

/* ── Action button ── */
function Btn({ children, onClick, primary = false, disabled = false, icon: Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '12px 22px',
        background: primary
          ? hov ? BROWN_DARK : BROWN
          : hov ? BROWN : '#111',
        border: 'none', color: '#fff',
        fontSize: 13, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'background 0.15s',
        fontFamily: 'inherit', letterSpacing: '-0.1px', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

/* ── Export CSV ── */
function exportCSV(stats) {
  const today = new Date().toLocaleDateString('fr-FR')
  const rows  = [
    ['Métrique', 'Valeur', 'Date'],
    ["Réservations aujourd'hui", stats.today,           today],
    ['Confirmées aujourd\'hui',  stats.today_confirmed, today],
    ['En attente aujourd\'hui',  stats.today_pending,   today],
    ['Annulées aujourd\'hui',    stats.today_cancelled, today],
    ['Réservations demain',      stats.tomorrow,        today],
    ['Total ce mois',            stats.total,           today],
    ['Confirmées (mois)',        stats.confirmed,       today],
    ['En attente (mois)',        stats.pending,         today],
    ['Annulées (mois)',          stats.cancelled,       today],
  ]
  const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = `dashboard_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ── MAIN ── */
export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const navigate                           = useNavigate()
  const [refreshing, setRefreshing]        = useState(false)

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch() } finally { setRefreshing(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap   { max-width:1060px; margin:0 auto; padding:clamp(28px,5vw,56px) clamp(24px,4vw,52px); }
        .topbar { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:48px; }
        .tbtns  { display:flex; gap:2px; }
        .three  { display:grid; grid-template-columns:repeat(3,1fr); gap:48px; }
        .two    { display:grid; grid-template-columns:repeat(2,1fr); gap:48px; }
        .hr     { height:1px; background:#F2F2F2; margin:44px 0; }
        @media(max-width:680px){ .two   { grid-template-columns:1fr; gap:28px; } }
        @media(max-width:520px){
          .three { grid-template-columns:1fr; gap:28px; }
          .tbtns { width:100%; }
          .tbtns button { flex:1; justify-content:center; }
        }
      `}</style>

      <div className="wrap">

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(22px,3.5vw,32px)', fontWeight:900, color:'#111', letterSpacing:'-1px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'8px 0 0', fontSize:13, fontWeight:600, color:'#C0C0C0', textTransform:'capitalize' }}>
                {today}&nbsp;&nbsp;·&nbsp;&nbsp;<LiveClock />
              </p>
            </div>
            <div className="tbtns">
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={Download} primary onClick={() => exportCSV(stats)}>
                Exporter CSV
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* HERO */}
        <FadeUp delay={50}>
          <Label text="Aujourd'hui — total" />
          <HeroNum value={stats.today} />
          <p style={{ margin:'16px 0 0', fontSize:14, fontWeight:600, color:'#C0C0C0' }}>
            réservations aujourd'hui&nbsp;&nbsp;
            <TextLink onClick={() => navigate('/reservations')}>Voir tout</TextLink>
          </p>
        </FadeUp>

        <div className="hr" />

        {/* DÉTAIL DU JOUR */}
        <FadeUp delay={120}>
          <Label text="Détail du jour" />
          <div className="three">
            <Stat icon={CheckCircle} iconColor="#111"    value={stats.today_confirmed} label="Confirmées"  color="#111"    delay={120} />
            <Stat icon={Clock}       iconColor={BROWN}   value={stats.today_pending}   label="En attente"  color={BROWN}   delay={155} />
            <Stat icon={XCircle}     iconColor="#D0D0D0" value={stats.today_cancelled} label="Annulées"    color="#D0D0D0" delay={190} />
          </div>
        </FadeUp>

        <div className="hr" />

        {/* À VENIR */}
        <FadeUp delay={240}>
          <Label text="À venir" />
          <div className="two">
            <div>
              <Stat icon={CalendarDays} iconColor={BROWN} value={stats.tomorrow} label="Demain" color="#111" delay={240} />
              <div style={{ marginTop: 14 }}>
                <TextLink onClick={() => navigate('/calendar')}>Voir le planning</TextLink>
              </div>
            </div>
            <Stat icon={ClipboardList} iconColor="#111" value={stats.total} label="Total ce mois" color="#111" delay={275} />
          </div>
        </FadeUp>

        <div className="hr" />

        {/* CE MOIS */}
        <FadeUp delay={320}>
          <Label text="Ce mois — détail" />
          <div className="three">
            <Stat icon={CheckCircle} iconColor="#111"    value={stats.confirmed} label="Confirmées"  color="#111"    delay={320} />
            <Stat icon={Clock}       iconColor={BROWN}   value={stats.pending}   label="En attente"  color={BROWN}   delay={350} />
            <Stat icon={XCircle}     iconColor="#D0D0D0" value={stats.cancelled} label="Annulées"    color="#D0D0D0" delay={380} />
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:'#C0C0C0' }}>
            ⚠ {error}
          </p>
        )}

      </div>
    </div>
  )
}