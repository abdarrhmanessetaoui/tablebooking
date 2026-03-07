import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck, ClipboardList,
  CheckCircle2, Clock, XCircle,
  Download, RefreshCw, Clock4, Flame,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import { B } from '../utils/brand'

import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import IBox      from '../components/Dashboard/IBox'
import TodayHero from '../components/Dashboard/TodayHero'
import StatCard  from '../components/Dashboard/StatCard'
import useCountUp from '../hooks/Dashboard/useCountUp'

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

function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  if (!isLunch && !isDinner) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', marginBottom: 8,
    }}>
      <Flame size={14} color={B.brown} strokeWidth={2.5} />
      <span style={{ fontSize: 13, fontWeight: 800, color: B.brown }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: B.inkMute, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Clock4 size={12} strokeWidth={2} />
        <LiveClock />
      </span>
    </div>
  )
}

function Label({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
      <div style={{ width: 3, height: 14, background: B.brown, borderRadius: 2 }} />
      <span style={{ fontSize: 10, fontWeight: 900, color: B.inkMute, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {text}
      </span>
    </div>
  )
}

function StatusChip({ icon, iconColor, value, label, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <IBox icon={icon} color={iconColor} bg="transparent" size={13} />
        <span style={{ fontSize: 11, fontWeight: 900, color: iconColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <p style={{
        margin: 0, fontSize: 48, fontWeight: 900,
        color: B.black, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
      }}>
        {n}
      </p>
    </div>
  )
}

function Btn({ children, onClick, primary = false }) {
  const [hov, setHov]         = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 20px',
        background: primary ? (hov ? B.brownDark : B.brown) : 'transparent',
        border: primary ? 'none' : `1.5px solid ${hov ? B.brown : '#D0CCC6'}`,
        borderRadius: 11,
        fontSize: 13, fontWeight: 800,
        color: primary ? '#fff' : hov ? B.brown : B.blackSoft,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.15s',
        transform: pressed ? 'scale(0.97)' : 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EDEEF2',
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap       { max-width:1100px; margin:0 auto; padding:clamp(20px,4vw,48px) clamp(20px,3vw,40px); }
        .topbar     { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:32px; }
        .topbar-btns{ display:flex; gap:8px; }
        .status-row { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
        .stat-row   { display:grid; grid-template-columns:repeat(2,1fr); gap:32px; }
        .divider    { height:1px; background:rgba(0,0,0,0.07); margin:28px 0; }
        @media(max-width:640px){
          .stat-row  { grid-template-columns:1fr; gap:24px; }
        }
        @media(max-width:480px){
          .status-row { grid-template-columns:1fr; gap:20px; }
          .topbar-btns{ width:100%; }
          .topbar-btns button{ flex:1; justify-content:center; }
        }
      `}</style>

      <div className="wrap">

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 900, color: B.black, letterSpacing: '-0.8px', lineHeight: 1 }}>
                Aujourd'hui
              </h1>
              <p style={{ margin: '5px 0 0', fontSize: 13, fontWeight: 600, color: B.inkMute, textTransform: 'capitalize' }}>
                {today}
              </p>
            </div>
            <div className="topbar-btns">
              <Btn onClick={() => {}}><RefreshCw size={13} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary onClick={() => {}}><Download size={13} strokeWidth={2.5} /> Exporter</Btn>
            </div>
          </div>
        </FadeUp>

        {/* SERVICE BANNER */}
        <FadeUp delay={30}><ServiceBanner /></FadeUp>

        {/* HERO */}
        <FadeUp delay={70}>
          <Label text="Total du jour" />
          <TodayHero value={stats.today} onClick={() => navigate('/reservations')} />
        </FadeUp>

        <div className="divider" />

        {/* DETAIL */}
        <FadeUp delay={140}>
          <Label text="Détail" />
          <div className="status-row">
            <StatusChip icon={CheckCircle2} iconColor={B.black}   value={stats.today_confirmed} label="Confirmées" delay={140} />
            <StatusChip icon={Clock}        iconColor={B.brown}   value={stats.today_pending}   label="En attente" delay={190} />
            <StatusChip icon={XCircle}      iconColor={B.inkMute} value={stats.today_cancelled} label="Annulées"   delay={240} />
          </div>
        </FadeUp>

        <div className="divider" />

        {/* À VENIR */}
        <FadeUp delay={280}>
          <Label text="À venir" />
          <div className="stat-row">
            <StatCard
              icon={CalendarCheck} iconColor={B.brown} iconBg={B.brownTint}
              value={stats.tomorrow} label="Réservations demain"
              trend="+8 vs hier" actionLabel="Voir le planning"
              onClick={() => navigate('/calendar')} delay={0}
            />
            <StatCard
              icon={ClipboardList} iconColor={B.blackSoft} iconBg="#E8E9EE"
              value={stats.total} label="Total ce mois"
              delay={60}
            />
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: B.inkMute }}>⚠️ {error}</p>
        )}

      </div>
    </div>
  )
}