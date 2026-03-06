import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'

import { B } from './brand'
import { FadeUp, Spinner } from './components/UI'
import TopBar    from './components/TopBar'
import TodayHero from './components/TodayHero'
import StatCard  from './components/StatCard'
import WeekChart from './components/WeekChart'
import QuickNav  from './components/QuickNav'

import {
  CalendarCheck,
  ClipboardList,
  Users,
} from 'lucide-react'

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: B.page, fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(20px,4vw,36px)' }}>

        {/* ── Top Bar ────────────────────────────────────────────────── */}
        <FadeUp delay={0}>
          <TopBar
            title="Dashboard"
            subtitle={today}
            location={info.location}
            email={info.email}
          />
        </FadeUp>

        {/* ── Error ──────────────────────────────────────────────────── */}
        {error && (
          <div style={{
            padding: '11px 16px', marginBottom: 18,
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 12, fontSize: 12, color: '#DC2626',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Today Hero ─────────────────────────────────────────────── */}
        <FadeUp delay={70} style={{ marginBottom: 20 }}>
          <TodayHero
            value={stats.today}
            confirmed={stats.today_confirmed}
            pending={stats.today_pending}
            cancelled={stats.today_cancelled}
            onClick={() => navigate('/reservations')}
          />
        </FadeUp>

        {/* ── 3 Stat Cards ───────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}>
          <StatCard
            icon={CalendarCheck}
            iconColor="#6366f1"
            iconBg="#EEF2FF"
            value={stats.tomorrow}
            label="Réservations demain"
            onClick={() => navigate('/calendar')}
            delay={110}
          />
          <StatCard
            icon={ClipboardList}
            iconColor="#0EA5E9"
            iconBg="#F0F9FF"
            value={stats.total}
            label="Total réservations"
            delay={165}
          />
          <StatCard
            icon={Users}
            iconColor="#059669"
            iconBg="#ECFDF5"
            value={stats.today_confirmed}
            label="Confirmées aujourd'hui"
            delay={220}
          />
        </div>

        {/* ── Bottom Row: Chart + Quick Nav ───────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          <FadeUp delay={275} style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <WeekChart todayCount={stats.today} />
          </FadeUp>

          <FadeUp delay={335}>
            <QuickNav
              tomorrow={stats.tomorrow}
              onCalendar={() => navigate('/calendar')}
              onReservations={() => navigate('/reservations')}
            />
          </FadeUp>
        </div>

      </div>
    </div>
  )
}