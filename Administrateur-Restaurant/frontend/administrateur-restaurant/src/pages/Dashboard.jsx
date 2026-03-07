import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'

const BROWN = '#9A6F2E'
const BROWN_DARK = '#7A5520'

/* ── Live clock ── */
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

/* ── Section label ── */
function Label({ text }) {
  return (
    <p style={{ margin: '0 0 14px', fontSize: 10, fontWeight: 900, color: '#BABABA', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
      {text}
    </p>
  )
}

/* ── Hero number ── */
function HeroNumber({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{
      margin: 0,
      fontSize: 'clamp(96px,15vw,192px)',
      fontWeight: 900, color: '#111',
      lineHeight: 0.85,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-8px',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
    }}>
      {n}
    </p>
  )
}

/* ── Stat block ── */
function Stat({ value, label, color = '#111', delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      <p style={{
        margin: 0,
        fontSize: 'clamp(48px,6vw,72px)',
        fontWeight: 900, color,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-2.5px',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 600, color: '#BABABA' }}>
        {label}
      </p>
    </div>
  )
}

/* ── Button ── */
function Btn({ children, onClick, primary = false, disabled = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '12px 24px',
        background: primary
          ? (hov ? BROWN_DARK : BROWN)
          : (hov ? BROWN : '#111'),
        border: 'none',
        color: '#fff',
        fontSize: 13, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'background 0.15s',
        fontFamily: 'inherit',
        letterSpacing: '-0.1px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

/* ── Export CSV ── */
function exportCSV(stats) {
  const today = new Date().toLocaleDateString('fr-FR')
  const rows  = [
    ['Métrique', 'Valeur', 'Date'],
    ["Réservations aujourd'hui", stats.today,            today],
    ['Confirmées aujourd\'hui',  stats.today_confirmed,  today],
    ['En attente aujourd\'hui',  stats.today_pending,    today],
    ['Annulées aujourd\'hui',    stats.today_cancelled,  today],
    ['Réservations demain',      stats.tomorrow,         today],
    ['Total ce mois',            stats.total,            today],
    ['Confirmées (mois)',        stats.confirmed,        today],
    ['En attente (mois)',        stats.pending,          today],
    ['Annulées (mois)',          stats.cancelled,        today],
  ]
  const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
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
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap        { max-width:1100px; margin:0 auto; padding:clamp(28px,5vw,56px) clamp(24px,4vw,56px); }
        .topbar      { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:44px; }
        .topbar-btns { display:flex; gap:2px; }
        .three-col   { display:grid; grid-template-columns:repeat(3,1fr); gap:40px; }
        .two-col     { display:grid; grid-template-columns:repeat(2,1fr); gap:40px; }
        .divider     { height:1px; background:#F0F0F0; margin:40px 0; }
        @media(max-width:700px){
          .two-col   { grid-template-columns:1fr; gap:28px; }
        }
        @media(max-width:540px){
          .three-col { grid-template-columns:1fr; gap:24px; }
          .topbar-btns { width:100%; }
          .topbar-btns button { flex:1; }
        }
      `}</style>

      <div className="wrap">

        {/* ── TOP BAR ── */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 900, color: '#111', letterSpacing: '-1px', lineHeight: 1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin: '7px 0 0', fontSize: 13, fontWeight: 600, color: '#BABABA', textTransform: 'capitalize' }}>
                {today}
                {' · '}
                <LiveClock />
              </p>
            </div>
            <div className="topbar-btns">
              <Btn onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn primary onClick={() => exportCSV(stats)}>
                Exporter CSV
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── HERO ── */}
        <FadeUp delay={50}>
          <Label text="Aujourd'hui — total" />
          <HeroNumber value={stats.today} />
          <p style={{ margin: '16px 0 0', fontSize: 14, fontWeight: 600, color: '#BABABA' }}>
            réservations aujourd'hui
            {'  '}
            <button
              onClick={() => navigate('/reservations')}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 800, color: BROWN, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Voir tout →
            </button>
          </p>
        </FadeUp>

        <div className="divider" />

        {/* ── DÉTAIL DU JOUR ── */}
        <FadeUp delay={120}>
          <Label text="Détail du jour" />
          <div className="three-col">
            <Stat value={stats.today_confirmed} label="Confirmées"  color="#111"   delay={120} />
            <Stat value={stats.today_pending}   label="En attente"  color={BROWN}  delay={160} />
            <Stat value={stats.today_cancelled} label="Annulées"    color="#CCC"   delay={200} />
          </div>
        </FadeUp>

        <div className="divider" />

        {/* ── À VENIR ── */}
        <FadeUp delay={240}>
          <Label text="À venir" />
          <div className="two-col">
            <div>
              <Stat value={stats.tomorrow} label="Demain" color="#111" delay={240} />
              <button
                onClick={() => navigate('/calendar')}
                style={{ marginTop: 10, background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 800, color: BROWN, cursor: 'pointer', fontFamily: 'inherit', display: 'block' }}
              >
                Voir le planning →
              </button>
            </div>
            <Stat value={stats.total} label="Total ce mois" color="#111" delay={280} />
          </div>
        </FadeUp>

        <div className="divider" />

        {/* ── CE MOIS ── */}
        <FadeUp delay={330}>
          <Label text="Ce mois — détail" />
          <div className="three-col">
            <Stat value={stats.confirmed} label="Confirmées"  color="#111"  delay={330} />
            <Stat value={stats.pending}   label="En attente"  color={BROWN} delay={360} />
            <Stat value={stats.cancelled} label="Annulées"    color="#CCC"  delay={390} />
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop: 32, fontSize: 13, fontWeight: 700, color: '#CCC' }}>⚠️ {error}</p>
        )}

      </div>
    </div>
  )
}