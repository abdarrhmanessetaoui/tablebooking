import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown,
  CheckCircle, Clock, XCircle,
  CalendarDays, ClipboardList, ArrowRight,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'

const B = '#9A6F2E'   // brown
const BD = '#7A5520'  // brown dark

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

/* ── Label ── */
function Label({ text }) {
  return (
    <p style={{
      margin: '0 0 20px',
      fontSize: 11, fontWeight: 900,
      color: '#111',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
    }}>
      {text}
    </p>
  )
}

/* ── Big number ── */
function HeroNum({ value }) {
  const n = useCountUp(value, 900, 60)
  return (
    <p style={{
      margin: 0,
      fontSize: 'clamp(100px,14vw,200px)',
      fontWeight: 900,
      color: '#111',
      lineHeight: 0.85,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-6px',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
    }}>
      {n}
    </p>
  )
}

/* ── Stat block ── */
function Stat({ value, label, accent = false, muted = false, delay = 0, icon: Icon }) {
  const n = useCountUp(value, 750, delay)
  const color = muted ? B : accent ? B : '#111'
  return (
    <div>
      {Icon && (
        <Icon
          size={32} strokeWidth={2}
          color={muted ? B : accent ? B : '#111'}
          style={{ marginBottom: 16, display: 'block' }}
        />
      )}
      <p style={{
        margin: 0,
        fontSize: 'clamp(52px,6vw,80px)',
        fontWeight: 900,
        color,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-2.5px',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin: '10px 0 0', fontSize: 14, fontWeight: 700, color: '#111' }}>
        {label}
      </p>
    </div>
  )
}

/* ── Link ── */
function Link({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'none', border: 'none', padding: 0,
        fontSize: 14, fontWeight: 800,
        color: hov ? BD : B,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'color 0.13s',
      }}
    >
      {children} <ArrowRight size={15} strokeWidth={2.5} />
    </button>
  )
}

/* ── Button ── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '14px 26px',
        background: primary ? (hov ? BD : B) : (hov ? B : '#111'),
        border: 'none', color: '#fff',
        fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s',
        fontFamily: 'inherit', letterSpacing: '-0.2px', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={16} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

/* ── Export PDF ── */
function exportPDF(stats) {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Dashboard — TableBooking.ma</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #111; padding: 56px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 3px solid #111; }
  .logo   { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
  .logo span { color: #9A6F2E; }
  .meta   { font-size: 12px; font-weight: 600; color: #9A6F2E; text-transform: uppercase; letter-spacing: 0.15em; text-align: right; line-height: 1.8; }
  .section-label { font-size: 10px; font-weight: 900; letter-spacing: 0.25em; text-transform: uppercase; color: #111; margin-bottom: 20px; margin-top: 40px; }
  .hero   { font-size: 120px; font-weight: 900; line-height: 0.9; letter-spacing: -5px; color: #111; margin-bottom: 8px; }
  .hero-sub { font-size: 15px; font-weight: 700; color: #9A6F2E; margin-bottom: 40px; }
  .grid3  { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; margin-bottom: 8px; }
  .grid2  { display: grid; grid-template-columns: repeat(2,1fr); gap: 0; margin-bottom: 8px; }
  .stat   { padding: 0 0 32px; }
  .stat-num { font-size: 64px; font-weight: 900; letter-spacing: -2px; line-height: 1; }
  .stat-num.brown { color: #9A6F2E; }
  .stat-lbl { font-size: 13px; font-weight: 700; color: #111; margin-top: 8px; }
  .divider { height: 1px; background: #111; margin: 12px 0 40px; }
  .footer { margin-top: 64px; padding-top: 20px; border-top: 1px solid #111; font-size: 11px; font-weight: 600; color: #9A6F2E; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">Table<span>Booking</span>.ma</div>
    <div class="meta">
      Tableau de bord<br/>
      ${today}<br/>
      Généré à ${now}
    </div>
  </div>

  <div class="section-label">Aujourd'hui — Total</div>
  <div class="hero">${stats.today}</div>
  <div class="hero-sub">réservations aujourd'hui</div>

  <div class="divider"></div>

  <div class="section-label">Détail du jour</div>
  <div class="grid3">
    <div class="stat"><div class="stat-num">${stats.today_confirmed}</div><div class="stat-lbl">Confirmées</div></div>
    <div class="stat"><div class="stat-num brown">${stats.today_pending}</div><div class="stat-lbl">En attente</div></div>
    <div class="stat"><div class="stat-num">${stats.today_cancelled}</div><div class="stat-lbl">Annulées</div></div>
  </div>

  <div class="divider"></div>

  <div class="section-label">À venir</div>
  <div class="grid2">
    <div class="stat"><div class="stat-num brown">${stats.tomorrow}</div><div class="stat-lbl">Réservations demain</div></div>
    <div class="stat"><div class="stat-num">${stats.total}</div><div class="stat-lbl">Total ce mois</div></div>
  </div>

  <div class="divider"></div>

  <div class="section-label">Ce mois — Détail</div>
  <div class="grid3">
    <div class="stat"><div class="stat-num">${stats.confirmed}</div><div class="stat-lbl">Confirmées</div></div>
    <div class="stat"><div class="stat-num brown">${stats.pending}</div><div class="stat-lbl">En attente</div></div>
    <div class="stat"><div class="stat-num">${stats.cancelled}</div><div class="stat-lbl">Annulées</div></div>
  </div>

  <div class="footer">
    <span>TableBooking.ma — Rapport automatique</span>
    <span>${today} · ${now}</span>
  </div>
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 600)
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
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap   { max-width: 1060px; margin: 0 auto; padding: clamp(32px,5vw,64px) clamp(28px,4vw,56px); }
        .topbar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 56px; }
        .tbtns  { display: flex; gap: 3px; }
        .three  { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; }
        .two    { display: grid; grid-template-columns: repeat(2,1fr); gap: 0; }
        .hr     { height: 2px; background: #111; margin: 48px 0; }
        @media(max-width:680px){ .two   { grid-template-columns: 1fr; } .two > * { margin-bottom: 32px; } }
        @media(max-width:520px){ .three { grid-template-columns: 1fr; } .three > * { margin-bottom: 32px; } .tbtns { width:100%; } .tbtns button { flex:1; justify-content:center; } }
      `}</style>

      <div className="wrap">

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#111', letterSpacing:'-1.5px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'10px 0 0', fontSize:14, fontWeight:700, color:B, textTransform:'capitalize', letterSpacing:'-0.2px' }}>
                {today}&nbsp;&nbsp;·&nbsp;&nbsp;<LiveClock />
              </p>
            </div>
            <div className="tbtns">
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={FileDown} primary onClick={() => exportPDF(stats)}>
                Exporter PDF
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* HERO */}
        <FadeUp delay={40}>
          <Label text="Aujourd'hui — total" />
          <HeroNum value={stats.today} />
          <p style={{ margin:'18px 0 0', fontSize:15, fontWeight:700, color:'#111' }}>
            réservations aujourd'hui&emsp;
            <Link onClick={() => navigate('/reservations')}>Voir tout</Link>
          </p>
        </FadeUp>

        <div className="hr" />

        {/* DÉTAIL DU JOUR */}
        <FadeUp delay={110}>
          <Label text="Détail du jour" />
          <div className="three">
            <Stat icon={CheckCircle} value={stats.today_confirmed} label="Confirmées"  delay={110} />
            <Stat icon={Clock}       value={stats.today_pending}   label="En attente"  accent delay={145} />
            <Stat icon={XCircle}     value={stats.today_cancelled} label="Annulées"    muted  delay={180} />
          </div>
        </FadeUp>

        <div className="hr" />

        {/* À VENIR */}
        <FadeUp delay={230}>
          <Label text="À venir" />
          <div className="two">
            <div>
              <Stat icon={CalendarDays} value={stats.tomorrow} label="Demain" accent delay={230} />
              <div style={{ marginTop: 18 }}>
                <Link onClick={() => navigate('/calendar')}>Voir le planning</Link>
              </div>
            </div>
            <Stat icon={ClipboardList} value={stats.total} label="Total ce mois" delay={265} />
          </div>
        </FadeUp>

        <div className="hr" />

        {/* CE MOIS */}
        <FadeUp delay={310}>
          <Label text="Ce mois — détail" />
          <div className="three">
            <Stat icon={CheckCircle} value={stats.confirmed} label="Confirmées"  delay={310} />
            <Stat icon={Clock}       value={stats.pending}   label="En attente"  accent delay={340} />
            <Stat icon={XCircle}     value={stats.cancelled} label="Annulées"    muted  delay={370} />
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop:32, fontSize:14, fontWeight:700, color:B }}>
            Erreur — {error}
          </p>
        )}

      </div>
    </div>
  )
}