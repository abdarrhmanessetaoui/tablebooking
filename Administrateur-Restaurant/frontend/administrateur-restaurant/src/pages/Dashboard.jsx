import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ClipboardList, Users, Download, RefreshCw, Clock4, Flame } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B } from '../utils/brand'

import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import Card      from '../components/Dashboard/Card'
import TodayHero from '../components/Dashboard/TodayHero'
import StatCard  from '../components/Dashboard/StatCard'

/* ── Live clock ─────────────────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

/* ── Service banner ─────────────────────────────────────────────────────── */
function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  if (!isLunch && !isDinner) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '15px 22px',
      background: isDinner ? B.black : B.brownTint,
      borderRadius: 16, marginBottom: 20,
    }}>
      <Flame size={16} color={isDinner ? B.brownLight : B.brown} strokeWidth={2.5} />
      <span style={{ fontSize: 14, fontWeight: 800, color: isDinner ? '#fff' : B.brown }}>
        {isDinner ? '🌙 Service du soir' : '☀️ Service du midi'}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: 13, fontWeight: 700,
        color: isDinner ? 'rgba(255,255,255,0.5)' : B.brown,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <Clock4 size={13} strokeWidth={2} />
        <LiveClock />
      </span>
    </div>
  )
}

/* ── Section heading ────────────────────────────────────────────────────── */
function SectionHead({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 12px' }}>
      <div style={{ width: 4, height: 18, background: B.brown, borderRadius: 2, flexShrink: 0 }} />
      <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: B.blackSoft, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {label}
      </p>
    </div>
  )
}

/* ── Button ─────────────────────────────────────────────────────────────── */
function Btn({ children, onClick, primary = false }) {
  const [hov,     setHov]     = useState(false)
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
        padding: '13px 22px',
        background: primary ? (hov ? B.brownDark : B.brown) : (hov ? '#E8E8E8' : '#EFEFEF'),
        border: 'none', borderRadius: 13,
        fontSize: 14, fontWeight: 800,
        color: primary ? '#fff' : B.blackSoft,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background 0.15s, transform 0.1s',
        transform: pressed ? 'scale(0.97)' : hov ? 'translateY(-2px)' : 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

/* ── MAIN ────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh', background: B.pageBg,
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      {/* Global responsive helpers */}
      <style>{`
        .dash-wrap      { max-width: 1160px; margin: 0 auto; padding: clamp(16px,4vw,48px) clamp(16px,3vw,36px); }
        .topbar         { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }
        .topbar-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .stat-grid      { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 860px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) {
          .stat-grid      { grid-template-columns: 1fr; }
          .topbar-actions { width: 100%; }
          .topbar-actions button { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="dash-wrap">

        {/* ── TOP BAR ── */}
        <FadeUp delay={0}>
          <Card padding="18px 28px" style={{ marginBottom: 20 }}>
            <div className="topbar">
              <div>
                <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: B.black, letterSpacing: '-1px', lineHeight: 1 }}>
                  Aujourd'hui
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: B.inkMute, textTransform: 'capitalize' }}>
                  {today}
                </p>
              </div>
              <div className="topbar-actions">
                <Btn onClick={() => {}}><RefreshCw size={14} strokeWidth={2.5} /> Actualiser</Btn>
                <Btn primary onClick={() => {}}><Download size={14} strokeWidth={2.5} /> Exporter</Btn>
              </div>
            </div>
          </Card>
        </FadeUp>

        {/* ── SERVICE BANNER ── */}
        <FadeUp delay={40}><ServiceBanner /></FadeUp>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ padding: '14px 20px', background: '#F5F5F5', borderRadius: 14, fontSize: 14, fontWeight: 700, color: B.blackSoft, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── HERO ── */}
        <FadeUp delay={80}>
          <div style={{ marginBottom: 28 }}>
            <SectionHead label="Réservations en temps réel" />
            <TodayHero
              value={stats.today}
              confirmed={stats.today_confirmed}
              pending={stats.today_pending}
              cancelled={stats.today_cancelled}
              onClick={() => navigate('/reservations')}
            />
          </div>
        </FadeUp>

        {/* ── STAT CARDS ── */}
        <FadeUp delay={180}>
          <SectionHead label="Vue d'ensemble" />
          <div className="stat-grid">
            <StatCard
              icon={CalendarCheck} iconColor={B.brown} iconBg={B.brownTint}
              value={stats.tomorrow} label="Réservations demain"
              trend="+8 vs hier" actionLabel="Voir le planning"
              onClick={() => navigate('/calendar')} delay={0}
            />
            <StatCard
              icon={ClipboardList} iconColor={B.blackSoft} iconBg="#EFEFEF"
              value={stats.total} label="Total ce mois"
              delay={80}
            />
            <StatCard
              icon={Users} iconColor={B.blackSoft} iconBg="#EFEFEF"
              value={stats.today_confirmed} label="Confirmées aujourd'hui"
              actionLabel="Voir les réservations"
              onClick={() => navigate('/reservations')} delay={140}
            />
          </div>
        </FadeUp>

      </div>
    </div>
  )
}