import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ClipboardList, Users, Download, MapPin, Mail, RefreshCw } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B }             from '../utils/brand'

import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import TodayHero from '../components/Dashboard/TodayHero'
import StatCard  from '../components/Dashboard/StatCard'
import WeekChart from '../components/Dashboard/WeekChart'
import QuickNav  from '../components/Dashboard/QuickNav'

/* ── Tiny section label ─────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{
      margin: '0 0 10px',
      fontSize: 11, fontWeight: 600,
      color: B.textMute,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  )
}

/* ── Top bar button ─────────────────────────────────────────────────────── */
function TopBtn({ children, onClick, primary = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px',
        background: primary
          ? (hov ? B.mid : B.warm)
          : (hov ? B.bg : B.surface),
        border: `1px solid ${primary ? 'transparent' : (hov ? B.borderHov : B.border)}`,
        borderRadius: 8,
        fontSize: 12, fontWeight: 600,
        color: primary ? '#fff' : B.textSub,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: primary ? `0 1px 4px ${B.warm}40` : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

import { useState } from 'react'

/* ── MAIN ───────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh',
      background: B.bg,
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)' }}>

        {/* ── Top bar ── */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 28,
            paddingBottom: 20,
            borderBottom: `1px solid ${B.border}`,
          }}>
            {/* Left: title + date */}
            <div>
              <h1 style={{
                margin: 0, fontSize: 20, fontWeight: 700,
                color: B.text, letterSpacing: '-0.3px',
              }}>
                Dashboard
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: B.textMute, textTransform: 'capitalize' }}>
                {today}
              </p>
            </div>

            {/* Right: meta + actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              {info.location && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 11px',
                  background: B.surface,
                  border: `1px solid ${B.border}`,
                  borderRadius: 8,
                  fontSize: 12, fontWeight: 500, color: B.textSub,
                }}>
                  <MapPin size={12} color={B.textMute} strokeWidth={2} />
                  {info.location}
                </div>
              )}
              {info.email && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 11px',
                  background: B.surface,
                  border: `1px solid ${B.border}`,
                  borderRadius: 8,
                  fontSize: 12, color: B.textSub,
                }}>
                  <Mail size={12} color={B.textMute} strokeWidth={2} />
                  {info.email}
                </div>
              )}
              <TopBtn>
                <RefreshCw size={12} strokeWidth={2.2} /> Actualiser
              </TopBtn>
              <TopBtn primary>
                <Download size={12} strokeWidth={2.5} /> Export CSV
              </TopBtn>
            </div>
          </div>
        </FadeUp>

        {/* ── Error banner ── */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            background: B.redBg, border: `1px solid ${B.redBdr}`,
            borderRadius: 9, fontSize: 12, color: B.red, marginBottom: 20,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Hero ── */}
        <FadeUp delay={60} style={{ marginBottom: 24 }}>
          <SectionLabel>Aujourd'hui en temps réel</SectionLabel>
          <TodayHero
            value={stats.today}
            confirmed={stats.today_confirmed}
            pending={stats.today_pending}
            cancelled={stats.today_cancelled}
            onClick={() => navigate('/reservations')}
          />
        </FadeUp>

        {/* ── 3 stat cards ── */}
        <FadeUp delay={120} style={{ marginBottom: 24 }}>
          <SectionLabel>Vue d'ensemble</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
            <StatCard
              icon={CalendarCheck} iconColor={B.indigo} iconBg={B.indigoBg}
              value={stats.tomorrow} label="Réservations demain"
              onClick={() => navigate('/calendar')} delay={0}
            />
            <StatCard
              icon={ClipboardList} iconColor={B.blue} iconBg={B.blueBg}
              value={stats.total} label="Total réservations"
              delay={60}
            />
            <StatCard
              icon={Users} iconColor={B.green} iconBg={B.greenBg}
              value={stats.today_confirmed} label="Confirmées aujourd'hui"
              delay={120}
            />
          </div>
        </FadeUp>

        {/* ── Bottom row ── */}
        <FadeUp delay={200}>
          <SectionLabel>Activité & Navigation</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, alignItems: 'start' }}>

            {/* Chart — spans 2 cols on wider screens */}
            <div style={{ gridColumn: 'span 2' }}>
              <WeekChart todayCount={stats.today} />
            </div>

            {/* Quick nav */}
            <QuickNav
              tomorrow={stats.tomorrow}
              onCalendar={() => navigate('/calendar')}
              onReservations={() => navigate('/reservations')}
            />
          </div>
        </FadeUp>

      </div>
    </div>
  )
}