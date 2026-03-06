import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
  ArrowRight,
  MapPin,
  Mail,
  UtensilsCrossed,
  Users,
  ClipboardList,
  Download,
} from 'lucide-react'

// ─── Big Stat Card ──────────────────────────────────────────────────────────────
function BigStatCard({ icon: Icon, iconColor, iconBg, value, label, onClick, badge }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-4 shadow-sm
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-px transition-all duration-200' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={22} color={iconColor} strokeWidth={1.8} />
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">{value}</p>
        <p className="text-sm font-medium text-gray-400 mt-1.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Mini Stat ──────────────────────────────────────────────────────────────────
function MiniStat({ icon: Icon, color, bg, value, label }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon size={16} color={color} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xl font-black text-gray-900 tabular-nums leading-none">{value}</p>
        <p className="text-xs font-medium text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Spinner ────────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-5 h-5 border-2 border-gray-100 rounded-full animate-spin" style={{ borderTopColor: '#c8a97e' }} />
    </div>
  )
}

// ─── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  const confirmRate = stats.today > 0
    ? Math.round((stats.today_confirmed / stats.today) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-400 capitalize mt-0.5">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            {(info.location || info.email) && (
              <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                {info.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} color="#c8a97e" strokeWidth={2} />
                    <span className="text-xs font-semibold text-gray-600">{info.location}</span>
                  </div>
                )}
                {info.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} color="#c8a97e" strokeWidth={2} />
                    <span className="text-xs text-gray-400">{info.email}</span>
                  </div>
                )}
              </div>
            )}

            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={13} strokeWidth={2} />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* ── 4 Big stat cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BigStatCard
            icon={UtensilsCrossed}
            iconColor="#c8a97e"
            iconBg="bg-amber-50"
            value={stats.today}
            label="Réservations aujourd'hui"
            badge="Live"
            onClick={() => navigate('/calendar')}
          />
          <BigStatCard
            icon={CalendarDays}
            iconColor="#6366f1"
            iconBg="bg-indigo-50"
            value={stats.tomorrow}
            label="Réservations demain"
            onClick={() => navigate('/calendar')}
          />
          <BigStatCard
            icon={ClipboardList}
            iconColor="#0ea5e9"
            iconBg="bg-sky-50"
            value={stats.total}
            label="Total réservations"
          />
          <BigStatCard
            icon={Users}
            iconColor="#10b981"
            iconBg="bg-emerald-50"
            value={stats.today_confirmed}
            label="Confirmées aujourd'hui"
          />
        </div>

        {/* ── Middle row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Today breakdown */}
          <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-base font-black text-gray-900">Réservations</h2>
                <p className="text-xs text-gray-400 mt-0.5">Statut d'aujourd'hui</p>
              </div>
              <button
                onClick={() => navigate('/reservations')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Voir tout <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-100 mt-2">
              <div className="pr-4">
                <MiniStat icon={CheckCircle2} color="#10b981" bg="bg-emerald-50" value={stats.today_confirmed} label="Confirmées" />
              </div>
              <div className="px-4">
                <MiniStat icon={Clock3} color="#f59e0b" bg="bg-amber-50" value={stats.today_pending} label="En attente" />
              </div>
              <div className="pl-4">
                <MiniStat icon={XCircle} color="#ef4444" bg="bg-red-50" value={stats.today_cancelled} label="Annulées" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 pt-5 border-t border-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Taux de confirmation</span>
                <span className="text-xs font-black text-gray-900">{confirmRate}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${confirmRate}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3">
                {[
                  { color: 'bg-emerald-500', label: 'Confirmées' },
                  { color: 'bg-amber-400',   label: 'En attente' },
                  { color: 'bg-red-400',     label: 'Annulées'   },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-[11px] text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dark CTA card */}
          <div
            className="rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative cursor-pointer group transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#1e1812' }}
            onClick={() => navigate('/reservations')}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 10% 90%, rgba(200,169,126,0.18) 0%, transparent 70%)' }}
            />

            <div className="relative">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-5"
                style={{ backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.15)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c8a97e' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(200,169,126,0.8)' }}>
                  En direct
                </span>
              </div>

              <p className="text-4xl font-black text-white tabular-nums leading-none">{stats.today}</p>
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                réservations ce soir
              </p>
              {info.default_status && (
                <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Statut: {info.default_status}
                </p>
              )}
            </div>

            <div className="relative mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">{info.name}</p>
                  {info.location && (
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{info.location}</p>
                  )}
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ backgroundColor: 'rgba(200,169,126,0.15)' }}
                >
                  <ArrowRight size={16} color="#c8a97e" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Bar chart card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-black text-gray-900">Cette semaine</h2>
                <p className="text-xs text-gray-400 mt-0.5">Aperçu des 7 derniers jours</p>
              </div>
              <TrendingUp size={18} color="#c8a97e" strokeWidth={2} />
            </div>

            <div className="flex items-end gap-2 h-20">
              {[40, 65, 45, 80, 55, 90, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 6 ? '#c8a97e' : '#f3f4f6',
                      transition: 'height 0.5s ease',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <span key={i} className={`flex-1 text-center text-[10px] font-bold ${i === 6 ? 'text-amber-600' : 'text-gray-300'}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Quick nav grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/calendar')}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:border-amber-200 hover:shadow-md transition-all duration-200 group"
            >
              <CalendarDays size={20} color="#c8a97e" strokeWidth={1.8} />
              <p className="text-sm font-black text-gray-900 mt-3 leading-tight">Planning</p>
              <p className="text-xs text-gray-400 mt-0.5">Voir le calendrier</p>
              <div className="flex items-center gap-1 mt-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold">Ouvrir</span>
                <ArrowRight size={11} />
              </div>
            </button>

            <button
              onClick={() => navigate('/reservations')}
              className="rounded-2xl p-5 text-left hover:shadow-md transition-all duration-200 group"
              style={{ backgroundColor: '#c8a97e' }}
            >
              <ClipboardList size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
              <p className="text-sm font-black text-white mt-3 leading-tight">Réservations</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Gérer tout</p>
              <div className="mt-3">
                <ArrowRight size={11} color="rgba(255,255,255,0.5)" className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Users size={16} color="#6366f1" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900">Demain</p>
                <p className="text-xs text-gray-400 truncate">{stats.tomorrow} réservation(s) prévue(s)</p>
              </div>
              <span className="text-2xl font-black text-gray-900 tabular-nums">{stats.tomorrow}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}