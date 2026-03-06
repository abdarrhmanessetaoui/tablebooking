import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import {
  CalendarDays, CheckCircle2, Clock3, XCircle,
  ArrowRight, MapPin, Mail, UtensilsCrossed,
  Users, ClipboardList, Download, TrendingUp,
} from 'lucide-react'

/* ── Count-up animation ───────────────────────────────────────────────────── */
function useCountUp(target, duration = 800, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf, start = null
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        setValue(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf) }
  }, [target, duration, delay])
  return value
}

/* ── Fade-in on mount ─────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      {children}
    </div>
  )
}

/* ── TODAY hero number ────────────────────────────────────────────────────── */
function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const n  = useCountUp(value,     750, 200)
  const c  = useCountUp(confirmed, 650, 400)
  const p  = useCountUp(pending,   650, 480)
  const ca = useCountUp(cancelled, 650, 560)

  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [bar, setBar] = useState(0)
  useEffect(() => { const t = setTimeout(() => setBar(rate), 900); return () => clearTimeout(t) }, [rate])

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 cursor-pointer group hover:border-gray-300 hover:shadow-md transition-all duration-200"
    >
      {/* header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">En direct · Aujourd'hui</span>
        </div>
        <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors flex items-center gap-1">
          Voir tout <ArrowRight size={12} />
        </span>
      </div>

      {/* BIG number */}
      <div className="flex items-end gap-3 mb-8">
        <span className="font-black text-gray-900 tabular-nums leading-none" style={{ fontSize: 'clamp(72px, 10vw, 108px)', lineHeight: 1 }}>
          {n}
        </span>
        <div className="pb-2">
          <p className="text-xl font-bold text-gray-900">réservations</p>
          <p className="text-sm text-gray-400 mt-0.5">ce soir</p>
        </div>
      </div>

      {/* 3 status boxes */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <CheckCircle2 size={16} color="#10b981" strokeWidth={2} />
          <p className="text-2xl font-black text-gray-900 tabular-nums mt-2 leading-none">{c}</p>
          <p className="text-xs font-medium text-gray-500 mt-1">Confirmées</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <Clock3 size={16} color="#f59e0b" strokeWidth={2} />
          <p className="text-2xl font-black text-gray-900 tabular-nums mt-2 leading-none">{p}</p>
          <p className="text-xs font-medium text-gray-500 mt-1">En attente</p>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <XCircle size={16} color="#ef4444" strokeWidth={2} />
          <p className="text-2xl font-black text-gray-900 tabular-nums mt-2 leading-none">{ca}</p>
          <p className="text-xs font-medium text-gray-500 mt-1">Annulées</p>
        </div>
      </div>

      {/* progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Taux de confirmation</span>
          <span className="text-xs font-bold text-gray-700">{rate}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${bar}%`, transition: 'width 1s cubic-bezier(0.25,1,0.5,1)' }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3">
          {[
            { dot: 'bg-emerald-500', label: 'Confirmées' },
            { dot: 'bg-amber-400',   label: 'En attente' },
            { dot: 'bg-red-400',     label: 'Annulées'   },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-[11px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Small stat card ──────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconColor, iconBg, value, label, onClick, badge, delay }) {
  const n = useCountUp(value, 700, delay + 200)
  return (
    <FadeUp delay={delay}>
      <div
        onClick={onClick}
        className={`bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 h-full
          ${onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
            <Icon size={19} color={iconColor} strokeWidth={1.8} />
          </div>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
              {badge}
            </span>
          )}
          {onClick && !badge && <ArrowRight size={14} className="text-gray-300" />}
        </div>
        <div>
          <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">{n}</p>
          <p className="text-sm text-gray-500 mt-2">{label}</p>
        </div>
      </div>
    </FadeUp>
  )
}

/* ── Spinner ──────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  const bars = [35, 58, 42, 75, 50, 88, Math.min(Math.max((stats.today / 10) * 100, 15), 100)]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <FadeUp delay={0}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-400 capitalize mt-0.5">{today}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* meta chips */}
              {info.location && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                  <MapPin size={12} color="#9ca3af" strokeWidth={2} />
                  {info.location}
                </div>
              )}
              {info.email && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                  <Mail size={12} color="#9ca3af" strokeWidth={2} />
                  {info.email}
                </div>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">
                <Download size={12} strokeWidth={2} />
                Export CSV
              </button>
            </div>
          </div>
        </FadeUp>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* ── TODAY hero ───────────────────────────────────────────── */}
        <FadeUp delay={80}>
          <TodayHero
            value={stats.today}
            confirmed={stats.today_confirmed}
            pending={stats.today_pending}
            cancelled={stats.today_cancelled}
            onClick={() => navigate('/reservations')}
          />
        </FadeUp>

        {/* ── 3 stat cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={CalendarDays}
            iconColor="#6366f1" iconBg="#eef2ff"
            value={stats.tomorrow} label="Réservations demain"
            onClick={() => navigate('/calendar')} delay={120}
          />
          <StatCard
            icon={ClipboardList}
            iconColor="#0ea5e9" iconBg="#f0f9ff"
            value={stats.total} label="Total réservations"
            delay={170}
          />
          <StatCard
            icon={Users}
            iconColor="#10b981" iconBg="#f0fdf4"
            value={stats.today_confirmed} label="Confirmées aujourd'hui"
            delay={220}
          />
        </div>

        {/* ── Bottom row ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Bar chart – 2 cols */}
          <FadeUp delay={280} className="sm:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[15px] font-black text-gray-900">Cette semaine</p>
                  <p className="text-xs text-gray-400 mt-0.5">Aperçu des 7 derniers jours</p>
                </div>
                <TrendingUp size={17} color="#9ca3af" strokeWidth={1.8} />
              </div>
              {/* bars */}
              <div className="flex items-end gap-2 h-28">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg"
                      style={{
                        height: `${h}%`,
                        background: i === 6 ? '#111827' : '#f3f4f6',
                        transition: `height 0.6s ease ${i * 60}ms`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2.5">
                {['L','M','M','J','V','S','D'].map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[11px] font-semibold" style={{ color: i === 6 ? '#111827' : '#d1d5db' }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Quick nav – 1 col */}
          <FadeUp delay={330}>
            <div className="flex flex-col gap-3">

              {/* Planning */}
              <button
                onClick={() => navigate('/calendar')}
                className="bg-white rounded-2xl border border-gray-200 p-5 text-left group hover:border-gray-300 hover:shadow-sm transition-all duration-150 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={18} color="#6366f1" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">Planning</p>
                  <p className="text-xs text-gray-400">Voir le calendrier</p>
                </div>
                <ArrowRight size={15} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-150" />
              </button>

              {/* Réservations */}
              <button
                onClick={() => navigate('/reservations')}
                className="bg-gray-900 rounded-2xl p-5 text-left group hover:bg-gray-800 transition-colors flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <ClipboardList size={18} color="#fff" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Réservations</p>
                  <p className="text-xs text-gray-400">Gérer tout</p>
                </div>
                <ArrowRight size={15} className="text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all duration-150" />
              </button>

              {/* Demain row */}
              <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Users size={15} color="#6366f1" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">Demain</p>
                  <p className="text-xs text-gray-400 truncate">{stats.tomorrow} réservation(s) prévue(s)</p>
                </div>
                <span className="text-2xl font-black text-gray-900 tabular-nums">{stats.tomorrow}</span>
              </div>

            </div>
          </FadeUp>
        </div>

      </div>
    </div>
  )
}