import { useNavigate } from 'react-router-dom'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
  CalendarRange,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Mail,
  Dot,
} from 'lucide-react'

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusPill({ icon: Icon, count, label, bg }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${bg}`}>
      <Icon size={13} color="#fff" strokeWidth={2.5} />
      <span className="text-xs font-semibold text-white tabular-nums">
        {count} {label}
      </span>
    </div>
  )
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, onClick, accent = false, className = '' }) {
  const base = accent
    ? 'text-white'
    : 'text-gray-900'

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden
        ${onClick ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={17} color={iconColor} strokeWidth={2} />
        </div>
        {onClick && <ArrowRight size={13} className={accent ? 'text-white/40' : 'text-gray-200'} />}
      </div>
      <div>
        <p className={`text-3xl font-black tabular-nums leading-none ${base}`}>{value}</p>
        <p className={`text-[11px] font-bold mt-1.5 uppercase tracking-[0.12em] ${accent ? 'text-white/60' : 'text-gray-400'}`}>
          {label}
        </p>
      </div>
    </div>
  )
}

function InfoChip({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={13} color="#c8a97e" strokeWidth={2} />
      <span className="text-xs font-medium text-gray-500">{text}</span>
    </div>
  )
}

// ─── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div
        className="w-5 h-5 border-2 border-gray-100 rounded-full animate-spin"
        style={{ borderTopColor: '#c8a97e' }}
      />
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const today    = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  return (
    <div className="p-6 sm:p-10 max-w-5xl space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: '#c8a97e' }}
          >
            {greeting}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {info.name}
          </h1>
          <p className="text-sm text-gray-400 capitalize">{today}</p>
        </div>

        {/* Restaurant meta card */}
        <div className="hidden sm:flex flex-col gap-2 px-4 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {info.location && <InfoChip icon={MapPin} text={info.location} />}
          {info.email    && <InfoChip icon={Mail}   text={info.email}    />}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#c8a97e' }} />
            <span className="text-[11px] font-medium text-gray-400">
              Statut par défaut ·{' '}
              <span className="font-bold text-gray-600">{info.default_status}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-medium">
          {error}
        </div>
      )}

      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-7 sm:p-8 relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-black/30"
        style={{ backgroundColor: '#1e1812' }}
        onClick={() => navigate('/calendar')}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'radial-gradient(ellipse 60% 50% at 5% 95%, rgba(200,169,126,0.14) 0%, transparent 70%)',
              'radial-gradient(ellipse 40% 40% at 95% 5%,  rgba(200,169,126,0.06) 0%, transparent 60%)',
            ].join(', '),
          }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px)',
          }}
        />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{
                backgroundColor: 'rgba(200,169,126,0.08)',
                border: '1px solid rgba(200,169,126,0.15)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#c8a97e' }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'rgba(200,169,126,0.8)' }}
              >
                En direct · Aujourd'hui
              </span>
            </div>

            {/* Big number */}
            <div className="flex items-end gap-3 mb-7">
              <span
                className="font-black leading-none tabular-nums"
                style={{ color: '#c8a97e', fontSize: 'clamp(64px, 10vw, 96px)', lineHeight: 1 }}
              >
                {stats.today}
              </span>
              <div className="mb-2 sm:mb-3">
                <p className="text-white font-bold text-base leading-tight">réservations</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  aujourd'hui
                </p>
              </div>
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill icon={CheckCircle2} count={stats.today_confirmed} label="confirmées" bg="bg-emerald-500" />
              <StatusPill icon={Clock3}       count={stats.today_pending}   label="en attente" bg="bg-amber-400"   />
              <StatusPill icon={XCircle}      count={stats.today_cancelled} label="annulées"   bg="bg-red-500"     />
            </div>

          </div>

          {/* Calendar icon + cta */}
          <div className="flex flex-col items-center gap-2.5 flex-shrink-0 pt-1">
            <div
              className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: 'rgba(200,169,126,0.08)',
                border: '1px solid rgba(200,169,126,0.15)',
              }}
            >
              <CalendarDays size={30} color="#c8a97e" strokeWidth={1.5} />
            </div>
            <div
              className="flex items-center gap-1 transition-gap duration-200 group-hover:gap-1.5"
              style={{ color: 'rgba(200,169,126,0.4)' }}
            >
              <span className="text-xs font-semibold">Planning</span>
              <ArrowRight size={11} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Stat grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={CalendarRange}
          iconBg="bg-emerald-50"
          iconColor="#16a34a"
          value={stats.tomorrow}
          label="Demain"
          onClick={() => navigate('/calendar')}
          className="bg-white border border-gray-100"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-gray-100"
          iconColor="#6b7280"
          value={stats.total}
          label="Total"
          className="bg-white border border-gray-100"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-white/20"
          iconColor="#fff"
          value={stats.today_confirmed}
          label="Confirmées"
          accent
          className="bg-emerald-500"
        />
        <StatCard
          icon={Clock3}
          iconBg="bg-white/20"
          iconColor="#fff"
          value={stats.today_pending}
          label="En attente"
          accent
          className="bg-amber-400"
        />
      </div>

      {/* ── Bottom row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          icon={XCircle}
          iconBg="bg-white/20"
          iconColor="#fff"
          value={stats.today_cancelled}
          label="Annulées aujourd'hui"
          accent
          className="bg-red-500"
        />

        {/* CTA card */}
        <div
          className="relative rounded-2xl p-5 cursor-pointer group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{ backgroundColor: '#c8a97e' }}
          onClick={() => navigate('/reservations')}
        >
          {/* Decorative circles */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -right-2 -top-8 w-20 h-20 rounded-full bg-white/[0.07] pointer-events-none" />

          <div className="relative flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">
              <ArrowUpRight size={17} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-black text-white leading-tight">Voir tout</p>
              <p className="text-[11px] font-bold mt-0.5 uppercase tracking-[0.12em] text-white/60">
                Réservations
              </p>
            </div>
            <div className="flex items-center gap-1 transition-all duration-200 group-hover:gap-2">
              <ArrowRight size={15} color="rgba(255,255,255,0.45)" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}