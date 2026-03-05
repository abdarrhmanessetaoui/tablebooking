import useDashboardStats from '../hooks/useDashboardStats'
import StatCard from '../components/StatCard'
import { CalendarDays, CheckCircle2, Clock, XCircle } from 'lucide-react'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-4 sm:p-8 max-w-6xl">

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
          <div className="rounded-2xl p-7 mb-6 relative overflow-hidden" style={{ backgroundColor: '#2b2118' }}>
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#c8a97e' }} />
            <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full opacity-5" style={{ backgroundColor: '#c8a97e' }} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c8a97e' }} />
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,169,126,0.7)' }}>
                    Today
                  </p>
                </div>
                <p className="text-7xl font-black leading-none mb-3" style={{ color: '#c8a97e' }}>
                  {stats.today}
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  reservations today
                </p>
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.confirmed} confirmed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.pending} pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.cancelled} cancelled</span>
                  </div>
                </div>
              </div>
              <div
                className="w-20 h-20 rounded-2xl items-center justify-center flex-shrink-0 hidden sm:flex"
                style={{ backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)' }}
              >
                <CalendarDays size={34} color="#c8a97e" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total"     value={stats.total}     icon={<CalendarDays size={20} color="#6b7280" strokeWidth={1.8} />} bg="#f9fafb" />
            <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle2 size={20} color="#16a34a" strokeWidth={1.8} />} bg="#f0fdf4" />
            <StatCard label="Pending"   value={stats.pending}   icon={<Clock        size={20} color="#d97706" strokeWidth={1.8} />} bg="#fffbeb" />
            <StatCard label="Cancelled" value={stats.cancelled} icon={<XCircle      size={20} color="#dc2626" strokeWidth={1.8} />} bg="#fef2f2" />
          </div>
        </>
      )}
    </div>
  )
}