import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock,
  XCircle, CalendarDays, ClipboardList, ArrowRight,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const GOLD_DARK = '#a8834e'

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
      margin: '0 0 22px',
      fontSize: 11, fontWeight: 900,
      color: DARK,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
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
      fontSize: 'clamp(96px,13vw,196px)',
      fontWeight: 900,
      color: DARK,
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
function Stat({ value, label, gold = false, delay = 0, icon: Icon }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div>
      {Icon && (
        <Icon
          size={30} strokeWidth={2}
          color={gold ? GOLD : DARK}
          style={{ marginBottom: 16, display: 'block' }}
        />
      )}
      <p style={{
        margin: 0,
        fontSize: 'clamp(48px,5.5vw,76px)',
        fontWeight: 900,
        color: gold ? GOLD : DARK,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-2.5px',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
      }}>
        {n}
      </p>
      <p style={{ margin: '10px 0 0', fontSize: 14, fontWeight: 700, color: DARK }}>
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
        color: hov ? GOLD_DARK : GOLD,
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
        background: primary
          ? (hov ? GOLD_DARK : GOLD)
          : (hov ? GOLD : DARK),
        border: 'none', color: primary ? DARK : '#fff',
        fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
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
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Helvetica Neue',Arial,sans-serif; background:#fff; color:#2b2118; padding:56px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; padding-bottom:24px; border-bottom:3px solid #2b2118; }
  .brand  { font-size:24px; font-weight:900; letter-spacing:-0.5px; color:#2b2118; }
  .brand span { color:#c8a97e; }
  .meta   { font-size:12px; font-weight:700; color:#c8a97e; text-transform:uppercase; letter-spacing:0.15em; text-align:right; line-height:1.9; }
  .lbl    { font-size:10px; font-weight:900; letter-spacing:0.25em; text-transform:uppercase; color:#2b2118; margin:44px 0 20px; }
  .hero   { font-size:130px; font-weight:900; line-height:0.88; letter-spacing:-5px; color:#2b2118; }
  .sub    { font-size:15px; font-weight:700; color:#c8a97e; margin:14px 0 44px; }
  .grid3  { display:grid; grid-template-columns:repeat(3,1fr); }
  .grid2  { display:grid; grid-template-columns:repeat(2,1fr); }
  .stat   { padding:0 0 36px; }
  .n      { font-size:68px; font-weight:900; letter-spacing:-2px; line-height:1; color:#2b2118; }
  .n.g    { color:#c8a97e; }
  .l      { font-size:14px; font-weight:700; color:#2b2118; margin-top:9px; }
  .hr     { height:2px; background:#2b2118; margin:8px 0 40px; }
  .foot   { margin-top:56px; padding-top:18px; border-top:1px solid #c8a97e; font-size:11px; font-weight:700; color:#c8a97e; display:flex; justify-content:space-between; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">Table<span>Booking</span>.ma</div>
    <div class="meta">Tableau de bord<br/>${today}<br/>Généré à ${now}</div>
  </div>

  <div class="lbl">Aujourd'hui — Total</div>
  <div class="hero">${stats.today}</div>
  <div class="sub">réservations aujourd'hui</div>
  <div class="hr"></div>

  <div class="lbl">Détail du jour</div>
  <div class="grid3">
    <div class="stat"><div class="n">${stats.today_confirmed}</div><div class="l">Confirmées</div></div>
    <div class="stat"><div class="n g">${stats.today_pending}</div><div class="l">En attente</div></div>
    <div class="stat"><div class="n">${stats.today_cancelled}</div><div class="l">Annulées</div></div>
  </div>
  <div class="hr"></div>

  <div class="lbl">À venir</div>
  <div class="grid2">
    <div class="stat"><div class="n g">${stats.tomorrow}</div><div class="l">Réservations demain</div></div>
    <div class="stat"><div class="n">${stats.total}</div><div class="l">Total ce mois</div></div>
  </div>
  <div class="hr"></div>

  <div class="lbl">Ce mois — Détail</div>
  <div class="grid3">
    <div class="stat"><div class="n">${stats.confirmed}</div><div class="l">Confirmées</div></div>
    <div class="stat"><div class="n g">${stats.pending}</div><div class="l">En attente</div></div>
    <div class="stat"><div class="n">${stats.cancelled}</div><div class="l">Annulées</div></div>
  </div>

  <div class="foot">
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
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap   { max-width:1060px; margin:0 auto; padding:clamp(32px,5vw,64px) clamp(28px,4vw,56px); }
        .topbar { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:56px; }
        .tbtns  { display:flex; gap:3px; }
        .three  { display:grid; grid-template-columns:repeat(3,1fr); gap:0; }
        .two    { display:grid; grid-template-columns:repeat(2,1fr); gap:0; }
        .hr     { height:2px; background:${DARK}; margin:48px 0; }
        @media(max-width:680px){ .two { grid-template-columns:1fr; } .two > * { margin-bottom:32px; } }
        @media(max-width:520px){
          .three { grid-template-columns:1fr; } .three > * { margin-bottom:32px; }
          .tbtns { width:100%; } .tbtns button { flex:1; justify-content:center; }
        }
      `}</style>

      <div className="wrap">

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-1.5px', lineHeight:1 }}>
                Tableau de bord
              </h1>
              <p style={{ margin:'10px 0 0', fontSize:14, fontWeight:700, color:GOLD, textTransform:'capitalize', letterSpacing:'-0.2px' }}>
                {today}&nbsp;·&nbsp;<LiveClock />
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
          <p style={{ margin:'18px 0 0', fontSize:15, fontWeight:700, color:DARK }}>
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
            <Stat icon={Clock}       value={stats.today_pending}   label="En attente"  gold delay={145} />
            <Stat icon={XCircle}     value={stats.today_cancelled} label="Annulées"    delay={180} />
          </div>
        </FadeUp>

        <div className="hr" />

        {/* À VENIR */}
        <FadeUp delay={230}>
          <Label text="À venir" />
          <div className="two">
            <div>
              <Stat icon={CalendarDays} value={stats.tomorrow} label="Demain" gold delay={230} />
              <div style={{ marginTop:18 }}>
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
            <Stat icon={Clock}       value={stats.pending}   label="En attente"  gold delay={340} />
            <Stat icon={XCircle}     value={stats.cancelled} label="Annulées"    delay={370} />
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop:32, fontSize:14, fontWeight:700, color:GOLD }}>
            Erreur — {error}
          </p>
        )}
      </div>
    </div>
  )
}