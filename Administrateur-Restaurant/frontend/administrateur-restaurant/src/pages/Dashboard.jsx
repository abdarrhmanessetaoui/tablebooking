import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import {
  MdCalendarToday,
  MdCheckCircle,
  MdAccessTime,
  MdCancel,
  MdTrendingUp,
  MdCalendarMonth,
  MdArrowForward,
  MdArrowUpward,
  MdLocationOn,
  MdEmail,
} from 'react-icons/md'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-100 rounded-full animate-spin" style={{ borderTopColor: '#c8a97e' }} />
    </div>
  )

  return (
    <div className="p-6 sm:p-10 max-w-5xl">

      {/* Header */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#c8a97e' }}>
            {greeting}
          </p>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            {info.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1 capitalize">{today}</p>
        </div>

        {/* Restaurant info card */}
        <div className="hidden sm:flex flex-col gap-1.5 px-4 py-3 rounded-2xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          {info.location && (
            <div className="flex items-center gap-2">
              <MdLocationOn size={14} color="#c8a97e" />
              <span className="text-xs font-semibold text-gray-600">{info.location}</span>
            </div>
          )}
          {info.email && (
            <div className="flex items-center gap-2">
              <MdEmail size={14} color="#c8a97e" />
              <span className="text-xs font-medium text-gray-400">{info.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c8a97e' }} />
            <span className="text-xs font-medium text-gray-400">
              Statut par défaut: <span className="font-bold text-gray-600">{info.default_status}</span>
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-500">
          {error}
        </div>
      )}

      {/* Hero */}
      <div
        className="rounded-3xl p-8 mb-5 relative overflow-hidden cursor-pointer group"
        style={{ backgroundColor: '#2b2118' }}
        onClick={() => navigate('/calendar')}
      >
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(200,169,126,0.12) 0%, transparent 60%), radial-gradient(circle at 90% 10%, rgba(200,169,126,0.06) 0%, transparent 60%)' }}
        />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c8a97e' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(200,169,126,0.85)' }}>
                En direct · Aujourd'hui
              </span>
            </div>

            <div className="flex items-end gap-3 mb-7">
              <span className="font-black leading-none" style={{ color: '#c8a97e', fontSize: '96px', lineHeight: 1 }}>
                {stats.today}
              </span>
              <div className="mb-3">
                <p className="text-white font-bold text-base leading-tight">réservations</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>aujourd'hui</p>
              </div>
            </div>

            {/* Solid color pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500">
                <MdCheckCircle size={14} color="#fff" />
                <span className="text-xs font-bold text-white">{stats.today_confirmed} confirmées</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400">
                <MdAccessTime size={14} color="#fff" />
                <span className="text-xs font-bold text-white">{stats.today_pending} en attente</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500">
                <MdCancel size={14} color="#fff" />
                <span className="text-xs font-bold text-white">{stats.today_cancelled} annulées</span>
              </div>
            </div>

          </div>

          <div className="flex flex-col items-center gap-3 flex-shrink-0 pt-1">
            <div
              className="rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
              style={{ width: 72, height: 72, backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.18)' }}
            >
              <MdCalendarToday size={32} color="#c8a97e" />
            </div>
            <div className="flex items-center gap-1" style={{ color: 'rgba(200,169,126,0.45)' }}>
              <span className="text-xs font-semibold">Planning</span>
              <MdArrowForward size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">

        <div
          className="bg-white rounded-3xl p-5 cursor-pointer hover:shadow-sm transition-all group border border-gray-100"
          onClick={() => navigate('/calendar')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-green-100">
              <MdCalendarMonth size={20} color="#16a34a" />
            </div>
            <MdArrowForward size={14} color="#e5e7eb" />
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.tomorrow}</p>
          <p className="text-xs font-bold text-gray-400 mt-1.5 uppercase tracking-wider">Demain</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 bg-gray-100">
            <MdTrendingUp size={20} color="#6b7280" />
          </div>
          <p className="text-4xl font-black text-gray-900">{stats.total}</p>
          <p className="text-xs font-bold text-gray-400 mt-1.5 uppercase tracking-wider">Total</p>
        </div>

        <div className="bg-green-500 rounded-3xl p-5 border border-green-500">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <MdCheckCircle size={20} color="#fff" />
          </div>
          <p className="text-4xl font-black text-white">{stats.today_confirmed}</p>
          <p className="text-xs font-bold mt-1.5 uppercase tracking-wider text-white opacity-80">Confirmées</p>
        </div>

        <div className="bg-yellow-400 rounded-3xl p-5 border border-yellow-400">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <MdAccessTime size={20} color="#fff" />
          </div>
          <p className="text-4xl font-black text-white">{stats.today_pending}</p>
          <p className="text-xs font-bold mt-1.5 uppercase tracking-wider text-white opacity-80">En attente</p>
        </div>

      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-red-500 rounded-3xl p-5 border border-red-500">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <MdCancel size={20} color="#fff" />
          </div>
          <p className="text-4xl font-black text-white">{stats.today_cancelled}</p>
          <p className="text-xs font-bold mt-1.5 uppercase tracking-wider text-white opacity-80">Annulées aujourd'hui</p>
        </div>

        <div
          className="rounded-3xl p-5 cursor-pointer group relative overflow-hidden"
          style={{ backgroundColor: '#c8a97e' }}
          onClick={() => navigate('/reservations')}
        >
          <div className="absolute -right-5 -bottom-5 w-28 h-28 rounded-full opacity-15" style={{ backgroundColor: '#fff' }} />
          <div className="absolute -right-2 -top-8 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: '#fff' }} />
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <MdArrowUpward size={20} color="#fff" />
          </div>
          <p className="text-sm font-black text-white">Voir tout</p>
          <p className="text-xs font-bold mt-0.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Réservations
          </p>
          <div className="flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
            <MdArrowForward size={16} color="rgba(255,255,255,0.5)" />
          </div>
        </div>

      </div>

    </div>
  )
}