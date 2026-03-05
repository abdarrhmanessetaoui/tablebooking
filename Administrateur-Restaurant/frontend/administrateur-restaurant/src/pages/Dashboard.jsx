import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import StatCard from '../components/StatCard'
import {
  CalendarCheck, CheckCircle2, Clock, TrendingUp, CalendarDays, ArrowRight
} from 'lucide-react'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-4 sm:p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#c8a97e' }}>
          Overview
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">{today}</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <>
          {/* Hero — Today */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden cursor-pointer"
            style={{ backgroundColor: '#2b2118' }}
            onClick={() => navigate('/calendar')}
          >
            {/* Decorative */}
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#c8a97e' }} />
            <div className="absolute right-20 -bottom-12 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: '#c8a97e' }} />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1">

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c8a97e' }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(200,169,126,0.7)' }}>
                    Today's Reservations
                  </p>
                </div>

                <p className="text-8xl font-black leading-none mb-2" style={{ color: '#c8a97e' }}>
                  {stats.today}
                </p>

                {/* Today breakdown */}
                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(74,222,128,0.1)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs font-semibold text-green-400">{stats.today_confirmed} confirmed</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(251,191,36,0.1)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">{stats.today_pending} pending</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(248,113,113,0.1)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-xs font-semibold text-red-400">{stats.today_cancelled} cancelled</span>
                  </div>
                </div>

              </div>

              {/* Calendar icon — clickable to timeline */}
              <div
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(200,169,126,0.12)', border: '1px solid rgba(200,169,126,0.25)' }}
                >
                  <CalendarCheck size={32} color="#c8a97e" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1" style={{ color: 'rgba(200,169,126,0.5)' }}>
                  <span className="text-xs font-medium">Timeline</span>
                  <ArrowRight size={11} strokeWidth={2} />
                </div>
              </div>

            </div>
          </div>

          {/* Tomorrow + Total row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div
              className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:border-gray-200 transition-colors"
              onClick={() => navigate('/calendar')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                  <CalendarDays size={20} color="#16a34a" strokeWidth={1.8} />
                </div>
                <ArrowRight size={14} color="#d1d5db" strokeWidth={2} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.tomorrow}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Tomorrow</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
                  <TrendingUp size={20} color="#6b7280" strokeWidth={1.8} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Total Reservations</p>
            </div>
          </div>

          {/* Status row — today only */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Confirmed today"
              value={stats.today_confirmed}
              icon={<CheckCircle2 size={18} color="#16a34a" strokeWidth={1.8} />}
              bg="#f0fdf4"
            />
            <StatCard
              label="Pending today"
              value={stats.today_pending}
              icon={<Clock size={18} color="#d97706" strokeWidth={1.8} />}
              bg="#fffbeb"
            />
            <StatCard
              label="Cancelled today"
              value={stats.today_cancelled}
              icon={<TrendingUp size={18} color="#dc2626" strokeWidth={1.8} />}
              bg="#fef2f2"
            />
          </div>
        </>
      )}
    </div>
  )
}