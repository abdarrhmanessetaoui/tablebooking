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
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
}

function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  if (!isLunch && !isDinner) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 20px', marginBottom: 16,
      background: isDinner ? '#1C1208' : '#FDF6E8',
      borderRadius: 12,
      border: `1px solid ${isDinner ? 'rgba(196,154,74,0.2)' : 'rgba(154,111,46,0.15)'}`,
    }}>
      <Flame size={14} color={B.brown} strokeWidth={2.5} />
      <span style={{ fontSize: 13, fontWeight: 800, color: isDinner ? '#E5C97A' : B.brown }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: isDinner ? 'rgba(255,255,255,0.45)' : B.brown, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Clock4 size={12} strokeWidth={2} /><LiveClock />
      </span>
    </div>
  )
}

function Label({ text }) {
  return (
    <p style={{ margin: '0 0 14px', fontSize: 10, fontWeight: 900, color: '#9CA3AF', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      {text}
    </p>
  )
}

/* White card wrapper */
function WCard({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '24px 26px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function StatusChip({ icon, iconColor, iconBg, value, label, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <WCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <IBox icon={icon} color={iconColor} bg={iconBg} size={14} />
        <span style={{ fontSize: 11, fontWeight: 900, color: iconColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <p style={{
        margin: 0, fontSize: 52, fontWeight: 900,
        color: B.black, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-2.5px',
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
      }}>
        {n}
      </p>
    </WCard>
  )
}

function Btn({ children, onClick, primary = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px',
        background: primary ? (hov ? '#7A5520' : '#9A6F2E') : hov ? '#F0F0F0' : '#fff',
        border: primary ? 'none' : '1.5px solid #E5E7EB',
        borderRadius: 10,
        fontSize: 13, fontWeight: 700,
        color: primary ? '#fff' : '#374151',
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap        { max-width:1100px; margin:0 auto; padding:clamp(20px,4vw,44px) clamp(20px,3vw,36px); }
        .topbar      { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:24px; }
        .topbar-btns { display:flex; gap:8px; }
        .status-row  { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .stat-row    { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        @media(max-width:640px){ .stat-row { grid-template-columns:1fr; } }
        @media(max-width:480px){
          .status-row { grid-template-columns:1fr; gap:10px; }
          .topbar-btns { width:100%; }
          .topbar-btns button { flex:1; justify-content:center; }
        }
      `}</style>

      <div className="wrap">

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div className="topbar">
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 900, color: '#111827', letterSpacing: '-0.8px', lineHeight: 1 }}>
                Aujourd'hui
              </h1>
              <p style={{ margin: '5px 0 0', fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'capitalize' }}>{today}</p>
            </div>
            <div className="topbar-btns">
              <Btn onClick={() => {}}><RefreshCw size={13} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary onClick={() => {}}><Download size={13} strokeWidth={2.5} /> Exporter</Btn>
            </div>
          </div>
        </FadeUp>

        {/* SERVICE BANNER */}
        <FadeUp delay={20}><ServiceBanner /></FadeUp>

        {/* HERO */}
        <FadeUp delay={60}>
          <WCard style={{ marginBottom: 14 }}>
            <Label text="Total du jour" />
            <TodayHero value={stats.today} onClick={() => navigate('/reservations')} />
          </WCard>
        </FadeUp>

        {/* DETAIL */}
        <FadeUp delay={130}>
          <Label text="Détail" />
          <div className="status-row" style={{ marginBottom: 20 }}>
            <StatusChip icon={CheckCircle2} iconColor="#059669" iconBg="#ECFDF5" value={stats.today_confirmed} label="Confirmées" delay={130} />
            <StatusChip icon={Clock}        iconColor={B.brown}  iconBg={B.brownTint} value={stats.today_pending}   label="En attente" delay={180} />
            <StatusChip icon={XCircle}      iconColor="#DC2626"  iconBg="#FEF2F2" value={stats.today_cancelled} label="Annulées"   delay={230} />
          </div>
        </FadeUp>

        {/* À VENIR */}
        <FadeUp delay={270}>
          <Label text="À venir" />
          <div className="stat-row">
            <StatCard
              icon={CalendarCheck} iconColor={B.brown} iconBg={B.brownTint}
              value={stats.tomorrow} label="Réservations demain"
              trend="+8 vs hier" actionLabel="Voir le planning"
              onClick={() => navigate('/calendar')} delay={0}
            />
            <StatCard
              icon={ClipboardList} iconColor="#6B7280" iconBg="#F3F4F6"
              value={stats.total} label="Total ce mois"
              delay={60}
            />
          </div>
        </FadeUp>

        {error && (
          <p style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: '#9CA3AF' }}>⚠️ {error}</p>
        )}
      </div>
    </div>
  )
}