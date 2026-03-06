import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import {
  MdCalendarToday,
  MdCheckCircle,
  MdAccessTime,
  MdCancel,
  MdTrendingUp,
  MdCalendarMonth,
  MdArrowForward,
  MdArrowUpward,
} from 'react-icons/md'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#c8a97e' }} />
    </div>
  )

  return (
    <div className="p-6 sm:p-10 max-w-5xl">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#c8a97e' }}>
          Good evening
        </p>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Dal Corso — Marrakech
        </h1>
        <p className="text-sm text-gray-400 mt-1">{today}</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-500">
          {error}
        </div>
      )}

      {/* Hero card */}
      <div
        className="rounded-3xl p-8 mb-5 relative overflow-hidden cursor-pointer group"
        style={{ backgroundColor: '#2b2118' }}
        onClick={() => navigate('/calendar')}
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #c8a97e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c8a97e 0%, transparent 50%)' }}
        />
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full opacity-[0.07]" style={{ backgroundColor: '#c8a97e' }} />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1">

            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c8a97e' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,169,126,0.8)' }}>
                Live · Today
              </span>
            </div>

            {/* Big number */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-[88px] font-black leading-none" style={{ color: '#c8a97e' }}>
                {stats.today}
              </span>
              <div className="mb-4">
                <p className="text-white text-sm font-semibold leading-tight">reservations</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>today</p>
              </div>
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <MdCheckCircle size={13} color="#4ade80" />
                <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>{stats.today_confirmed} confirmed</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <MdAccessTime size={13} color="#fbbf24" />
                <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>{stats.today_pending} pending</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <MdCancel size={13} color="#f87171" />
                <span className="text-xs font-semibold" style={{ color: '#f87171' }}>{stats.today_cancelled} cancelled</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0 pt-2">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: 'rgba(200,169,126,0.12)', border: '1px solid rgba(200,169,126,0.2)' }}
            >
              <MdCalendarToday size={30} color="#c8a97e" />
            </div>
            <div className="flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: 'rgba(200,169,126,0.5)' }}>
              <span className="text-xs font-semibold">View timeline</span>
              <MdArrowForward size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">

        {/* Tomorrow */}
        <div
          className="col-span-2 sm:col-span-1 bg-white rounded-3xl p-5 cursor-pointer hover:shadow-md transition-all group border border-gray-100"
          onClick={() => navigate('/calendar')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
              <MdCalendarMonth size={20} color="#16a34a" />
            </div>
            <div className="flex items-center gap-1 text-gray-300 group-hover:text-gray-400 transition-colors">
              <span className="text-xs font-medium">See all</span>
              <MdArrowForward size={13} />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.tomorrow}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Tomorrow</p>
        </div>

        {/* Total */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f9fafb' }}>
            <MdTrendingUp size={20} color="#6b7280" />
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.total}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">All time</p>
        </div>

        {/* Confirmed today */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f0fdf4' }}>
            <MdCheckCircle size={20} color="#16a34a" />
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.today_confirmed}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Confirmed</p>
        </div>

        {/* Pending today */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#fffbeb' }}>
            <MdAccessTime size={20} color="#d97706" />
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.today_pending}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Pending</p>
        </div>

      </div>

      {/* Bottom row — cancelled + quick action */}
      <div className="grid grid-cols-2 gap-4">

        {/* Cancelled */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#fef2f2' }}>
            <MdCancel size={20} color="#dc2626" />
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.today_cancelled}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Cancelled today</p>
        </div>

        {/* Quick action — go to reservations */}
        <div
          className="rounded-3xl p-5 cursor-pointer group relative overflow-hidden"
          style={{ backgroundColor: '#c8a97e' }}
          onClick={() => navigate('/reservations')}
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: '#fff' }} />
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <MdArrowUpward size={20} color="#fff" />
          </div>
          <p className="text-sm font-black text-white">View all</p>
          <p className="text-xs font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Reservations
          </p>
          <MdArrowForward
            size={18}
            color="rgba(255,255,255,0.6)"
            className="mt-3 group-hover:translate-x-1 transition-transform"
          />
        </div>

      </div>

    </div>
  )
}