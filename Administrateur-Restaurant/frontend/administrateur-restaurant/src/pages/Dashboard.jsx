import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ClipboardList, Users, Download, MapPin, RefreshCw, LayoutDashboard } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B }             from '../utils/brand'

import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import TodayHero from '../components/Dashboard/TodayHero'
import StatCard  from '../components/Dashboard/StatCard'
import WeekChart from '../components/Dashboard/WeekChart'
import QuickNav  from '../components/Dashboard/QuickNav'

/* ── Section heading ──────────────────────────────────────────────────────── */
function Section({ label, children, style = {} }) {
  return (
    <div style={{ marginBottom: 28, ...style }}>
      <p style={{
        margin: '0 0 13px',
        fontSize: 11, fontWeight: 800,
        color: B.textMute,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ display:'inline-block', width:18, height:2, background: B.gold, borderRadius:2 }} />
        {label}
      </p>
      {children}
    </div>
  )
}

/* ── Top action button ────────────────────────────────────────────────────── */
function Btn({ children, onClick, primary = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 17px',
        background: primary ? (hov ? B.goldHov : B.gold) : (hov ? B.goldLight : B.surface),
        border: `1.5px solid ${primary ? 'transparent' : (hov ? B.goldBdr : B.border)}`,
        borderRadius: 10,
        fontSize: 13, fontWeight: 700,
        color: primary ? '#fff' : (hov ? B.gold : B.textSub),
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: primary ? `0 3px 12px ${B.gold}60` : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

/* ── MAIN ─────────────────────────────────────────────────────────────────── */
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
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: 'clamp(24px,4vw,44px) clamp(16px,3vw,36px)' }}>

        {/* ── Top bar ── */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 14, marginBottom: 36,
            paddingBottom: 24,
            borderBottom: `2px solid ${B.divider}`,
          }}>
            {/* Left */}
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{
                width:46, height:46, borderRadius:12,
                background: B.dark, display:'flex',
                alignItems:'center', justifyContent:'center',
                flexShrink:0,
                boxShadow:`0 4px 14px rgba(0,0,0,0.18)`,
              }}>
                <LayoutDashboard size={22} color="#E5C97A" strokeWidth={2} />
              </div>
              <div>
                <h1 style={{
                  margin: 0, fontSize: 24, fontWeight: 900,
                  color: B.text, letterSpacing: '-0.6px',
                }}>
                  Dashboard
                </h1>
                <p style={{
                  margin: '3px 0 0', fontSize: 13, fontWeight: 600,
                  color: B.textMute, textTransform: 'capitalize',
                }}>
                  {today}
                </p>
              </div>
            </div>

            {/* Right */}
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:9 }}>
              {info?.location && (
                <div style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'8px 14px',
                  background: B.surface, border:`1.5px solid ${B.border}`,
                  borderRadius:10, fontSize:13, fontWeight:700, color: B.textSub,
                }}>
                  <MapPin size={14} color={B.textMute} strokeWidth={2} />
                  {info.location}
                </div>
              )}
              <Btn><RefreshCw size={14} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary><Download size={14} strokeWidth={2.5} /> Export CSV</Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── Error ── */}
        {error && (
          <div style={{
            display:'flex', alignItems:'center', gap:9,
            padding:'12px 18px',
            background: B.redBg, border:`1.5px solid ${B.redBdr}`,
            borderRadius:12, fontSize:13, fontWeight:700,
            color: B.red, marginBottom:28,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Hero ── */}
        <FadeUp delay={50}>
          <Section label="Aujourd'hui en temps réel">
            <TodayHero
              value={stats.today}
              confirmed={stats.today_confirmed}
              pending={stats.today_pending}
              cancelled={stats.today_cancelled}
              onClick={() => navigate('/reservations')}
            />
          </Section>
        </FadeUp>

        {/* ── 3 stat cards ── */}
        <FadeUp delay={120}>
          <Section label="Vue d'ensemble">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:14 }}>
              <StatCard
                icon={CalendarCheck} iconColor={B.indigo} iconBg={B.indigoBg}
                value={stats.tomorrow} label="Réservations demain"
                onClick={() => navigate('/calendar')} delay={0}
              />
              <StatCard
                icon={ClipboardList} iconColor={B.blue} iconBg={B.blueBg}
                value={stats.total} label="Total réservations"
                delay={80}
              />
              <StatCard
                icon={Users} iconColor={B.greenSolid} iconBg={B.greenBg}
                value={stats.today_confirmed} label="Confirmées aujourd'hui"
                delay={160}
              />
            </div>
          </Section>
        </FadeUp>

        {/* ── Bottom row ── */}
        <FadeUp delay={200}>
          <Section label="Activité & Navigation rapide" style={{ marginBottom:0 }}>
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',
              gap:14, alignItems:'start',
            }}>
              <div style={{ gridColumn:'span 2' }}>
                <WeekChart todayCount={stats.today} />
              </div>
              <QuickNav
                tomorrow={stats.tomorrow}
                onCalendar={() => navigate('/calendar')}
                onReservations={() => navigate('/reservations')}
              />
            </div>
          </Section>
        </FadeUp>

      </div>
    </div>
  )
}