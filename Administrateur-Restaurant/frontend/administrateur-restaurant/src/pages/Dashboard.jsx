import { useNavigate } from 'react-router-dom'
import { CalendarCheck, ClipboardList, Users, Download, MapPin, Mail } from 'lucide-react'

import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B }             from '../utils/brand'

import FadeUp     from '../components/Dashboard/FadeUp'
import Spinner    from '../components/Spinner'
import TodayHero  from '../components/TodayHero'
import StatCard   from '../components/StatCard'
import WeekChart  from '../components/WeekChart'
import QuickNav   from '../components/QuickNav'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(20px,4vw,36px)' }}>

        {/* ── Top bar ── */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 28 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#111827', letterSpacing: '-0.4px' }}>Dashboard</h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9CA3AF', textTransform: 'capitalize' }}>{today}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              {info.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#fff', border: `1.5px solid #F0EBE3`, borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#374151' }}>
                  <MapPin size={13} color={B.warm} strokeWidth={2} /> {info.location}
                </div>
              )}
              {info.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#fff', border: `1.5px solid #F0EBE3`, borderRadius: 10, fontSize: 12, color: '#6B7280' }}>
                  <Mail size={13} color={B.warm} strokeWidth={2} /> {info.email}
                </div>
              )}
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: B.dark, border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = B.mid}
                onMouseLeave={e => e.currentTarget.style.background = B.dark}
              >
                <Download size={13} color="#fff" strokeWidth={2.5} /> Export CSV
              </button>
            </div>
          </div>
        </FadeUp>

        {/* ── Error banner ── */}
        {error && (
          <div style={{ padding: '11px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, fontSize: 12, color: '#DC2626', marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Hero ── */}
        <FadeUp delay={70} style={{ marginBottom: 20 }}>
          <TodayHero
            value={stats.today}
            confirmed={stats.today_confirmed}
            pending={stats.today_pending}
            cancelled={stats.today_cancelled}
            onClick={() => navigate('/reservations')}
          />
        </FadeUp>

        {/* ── 3 stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 20 }}>
          <StatCard icon={CalendarCheck} iconColor="#6366f1" iconBg="#EEF2FF" value={stats.tomorrow}        label="Réservations demain"    onClick={() => navigate('/calendar')} delay={110} />
          <StatCard icon={ClipboardList} iconColor="#0EA5E9" iconBg="#F0F9FF" value={stats.total}           label="Total réservations"                                             delay={160} />
          <StatCard icon={Users}         iconColor="#059669" iconBg="#ECFDF5" value={stats.today_confirmed} label="Confirmées aujourd'hui"                                         delay={210} />
        </div>

        {/* ── Bottom row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          <FadeUp delay={270} style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <WeekChart todayCount={stats.today} />
          </FadeUp>
          <FadeUp delay={330}>
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