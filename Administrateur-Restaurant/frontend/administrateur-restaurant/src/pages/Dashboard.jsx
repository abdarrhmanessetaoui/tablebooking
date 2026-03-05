import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import StatCard from '../components/StatCard'
import { PiCalendarCheckFill, PiCheckCircleFill, PiClockFill, PiXCircleFill, PiTrendUpFill, PiCalendarFill, PiArrowRightBold } from 'react-icons/pi'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-4 sm:p-8 max-w-5xl">

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
          {/* Hero */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden cursor-pointer"
            style={{ backgroundColor: '#2b2118' }}
            onClick={() => navigate('/calendar')}
          >
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

                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(74,222,128,0.1)' }}>
                    <PiCheckCircleFill size={14} color="#4ade80" />
                    <span className="text-xs font-semibold text-green-400">{stats.today_confirmed} confirmed</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(251,191,36,0.1)' }}>
                    <PiClockFill size={14} color="#fbbf24" />
                    <span className="text-xs font-semibold text-yellow-400">{stats.today_pending} pending</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(248,113,113,0.1)' }}>
                    <PiXCircleFill size={14} color="#f87171" />
                    <span className="text-xs font-semibold text-red-400">{stats.today_cancelled} cancelled</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(200,169,126,0.12)', border: '1px solid rgba(200,169,126,0.25)' }}
                >
                  <PiCalendarCheckFill size={36} color="#c8a97e" />
                </div>
                <div className="flex items-center gap-1" style={{ color: 'rgba(200,169,126,0.5)' }}>
                  <span className="text-xs font-medium">Timeline</span>
                  <PiArrowRightBold size={10} color="rgba(200,169,126,0.5)" />
                </div>
              </div>
            </div>
          </div>

          {/* Tomorrow + Total */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div
              className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:border-gray-200 transition-colors"
              onClick={() => navigate('/calendar')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                  <PiCalendarFill size={22} color="#16a34a" />
                </div>
                <PiArrowRightBold size={13} color="#d1d5db" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.tomorrow}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Tomorrow</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
                  <PiTrendUpFill size={22} color="#6b7280" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Total Reservations</p>
            </div>
          </div>

          {/* Today status */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Confirmed today"
              value={stats.today_confirmed}
              icon={<PiCheckCircleFill size={22} color="#16a34a" />}
              bg="#f0fdf4"
            />
            <StatCard
              label="Pending today"
              value={stats.today_pending}
              icon={<PiClockFill size={22} color="#d97706" />}
              bg="#fffbeb"
            />
            <StatCard
              label="Cancelled today"
              value={stats.today_cancelled}
              icon={<PiXCircleFill size={22} color="#dc2626" />}
              bg="#fef2f2"
            />
          </div>
        </>
      )}
    </div>
  )
}