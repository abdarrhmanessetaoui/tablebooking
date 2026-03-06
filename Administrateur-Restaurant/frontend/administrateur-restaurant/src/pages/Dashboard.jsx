import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import {
  CalendarDays, CheckCircle2, Clock3, XCircle,
  TrendingUp, ArrowRight, MapPin, Mail,
  UtensilsCrossed, Users, ClipboardList, Download,
  Sparkles, ChevronRight,
} from 'lucide-react'

// ─── Animated Count-Up Hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 900, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    let raf
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(ease * target))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf) }
  }, [target, duration, delay])
  return value
}

// ─── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {children}
    </div>
  )
}

// ─── Hero Today Card ──────────────────────────────────────────────────────────
function HeroTodayCard({ value, confirmed, pending, cancelled, onClick }) {
  const animVal       = useCountUp(value,     800,  300)
  const animConfirmed = useCountUp(confirmed, 700,  500)
  const animPending   = useCountUp(pending,   700,  600)
  const animCancelled = useCountUp(cancelled, 700,  700)

  const confirmRate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(confirmRate), 900)
    return () => clearTimeout(t)
  }, [confirmRate])

  return (
    <div
      onClick={onClick}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{
        background: 'linear-gradient(135deg, #1a120a 0%, #2c1d10 50%, #1a120a 100%)',
        boxShadow: '0 20px 60px rgba(200,169,126,0.15), 0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 15% 85%, rgba(200,169,126,0.2) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 85% 15%, rgba(200,169,126,0.07) 0%, transparent 55%)',
        }}
      />
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 28px)',
        }}
      />

      <div className="relative p-8">
        {/* Live badge */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(200,169,126,0.12)', border: '1px solid rgba(200,169,126,0.2)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#c8a97e' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#c8a97e' }} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(200,169,126,0.9)' }}>
              En direct · Aujourd'hui
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.18)' }}
          >
            <UtensilsCrossed size={18} color="#c8a97e" strokeWidth={1.8} />
          </div>
        </div>

        {/* BIG number */}
        <div className="flex items-end gap-4 mb-8">
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontSize: 'clamp(80px, 12vw, 120px)',
              color: '#c8a97e',
              lineHeight: 1,
              textShadow: '0 0 60px rgba(200,169,126,0.3)',
            }}
          >
            {animVal}
          </span>
          <div className="mb-3">
            <p className="text-white font-bold text-lg leading-tight">réservations</p>
            <p className="text-sm font-medium mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>ce soir</p>
          </div>
        </div>

        {/* Status row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: CheckCircle2, val: animConfirmed, label: 'Confirmées',  color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
            { icon: Clock3,       val: animPending,   label: 'En attente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
            { icon: XCircle,      val: animCancelled, label: 'Annulées',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)'   },
          ].map(({ icon: Icon, val, label, color, bg, border }) => (
            <div
              key={label}
              className="rounded-2xl p-3.5"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <Icon size={15} color={color} strokeWidth={2} />
              <p className="text-2xl font-black mt-2 tabular-nums leading-none text-white">{val}</p>
              <p className="text-[11px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Taux de confirmation</span>
            <span className="text-xs font-black" style={{ color: '#c8a97e' }}>{confirmRate}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${barWidth}%`,
                background: 'linear-gradient(90deg, #c8a97e, #e8c99e)',
                transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, iconBg, value, label, onClick, badge, delay = 0 }) {
  const animVal = useCountUp(value, 700, delay + 200)
  return (
    <FadeIn delay={delay}>
      <div
        onClick={onClick}
        className={`
          bg-white rounded-2xl p-6 border border-gray-100/80 flex flex-col gap-5 h-full
          ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-250' : ''}
        `}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: iconBg }}
          >
            <Icon size={20} color={iconColor} strokeWidth={1.8} />
          </div>
          {badge && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
              style={{ background: 'rgba(200,169,126,0.1)', color: '#c8a97e', border: '1px solid rgba(200,169,126,0.2)' }}
            >
              {badge}
            </span>
          )}
          {onClick && !badge && (
            <ChevronRight size={15} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
          )}
        </div>
        <div>
          <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">{animVal}</p>
          <p className="text-[13px] font-medium text-gray-400 mt-2 leading-snug">{label}</p>
        </div>
      </div>
    </FadeIn>
  )
}

// ─── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-5 h-5 border-2 border-gray-100 rounded-full animate-spin" style={{ borderTopColor: '#c8a97e' }} />
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  // Mini bar chart heights (last 6 days static, today dynamic)
  const barHeights = [35, 58, 42, 75, 50, 88, Math.min(Math.max((stats.today / 10) * 100, 15), 100)]

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f4' }}>
      <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <FadeIn delay={0}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-black text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-400 capitalize mt-0.5">{today}</p>
            </div>

            <div className="flex items-center gap-2.5">
              {(info.location || info.email) && (
                <div
                  className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-100"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  {info.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} color="#c8a97e" strokeWidth={2} />
                      <span className="text-xs font-semibold text-gray-700">{info.location}</span>
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

              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <Download size={13} strokeWidth={2} />
                Export CSV
              </button>
            </div>
          </div>
        </FadeIn>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* ── HERO: Today big card ─────────────────────────────────────── */}
        <FadeIn delay={100}>
          <HeroTodayCard
            value={stats.today}
            confirmed={stats.today_confirmed}
            pending={stats.today_pending}
            cancelled={stats.today_cancelled}
            onClick={() => navigate('/reservations')}
          />
        </FadeIn>

        {/* ── 3 smaller stat cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={CalendarDays}
            iconColor="#6366f1"
            iconBg="rgba(99,102,241,0.08)"
            value={stats.tomorrow}
            label="Réservations demain"
            onClick={() => navigate('/calendar')}
            delay={150}
          />
          <StatCard
            icon={ClipboardList}
            iconColor="#0ea5e9"
            iconBg="rgba(14,165,233,0.08)"
            value={stats.total}
            label="Total réservations"
            delay={200}
          />
          <StatCard
            icon={Users}
            iconColor="#10b981"
            iconBg="rgba(16,185,129,0.08)"
            value={stats.today_confirmed}
            label="Confirmées aujourd'hui"
            delay={250}
          />
        </div>

        {/* ── Bottom row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Bar chart */}
          <FadeIn delay={300} className="sm:col-span-2">
            <div
              className="bg-white rounded-2xl border border-gray-100/80 p-6 h-full"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[15px] font-black text-gray-900">Cette semaine</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Aperçu des 7 derniers jours</p>
                </div>
                <TrendingUp size={18} color="#c8a97e" strokeWidth={2} />
              </div>

              <div className="flex items-end gap-2 h-24">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full rounded-lg transition-all duration-700"
                      style={{
                        height: `${h}%`,
                        background: i === 6
                          ? 'linear-gradient(180deg, #e8c99e 0%, #c8a97e 100%)'
                          : '#f0efed',
                        transitionDelay: `${i * 60}ms`,
                        boxShadow: i === 6 ? '0 4px 12px rgba(200,169,126,0.3)' : 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <span
                    key={i}
                    className="flex-1 text-center text-[11px] font-bold"
                    style={{ color: i === 6 ? '#c8a97e' : '#d1d5db' }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Quick nav */}
          <FadeIn delay={350}>
            <div className="flex flex-col gap-3 h-full">
              {/* Planning */}
              <button
                onClick={() => navigate('/calendar')}
                className="flex-1 bg-white rounded-2xl border border-gray-100/80 p-5 text-left group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(200,169,126,0.08)' }}
                  >
                    <CalendarDays size={17} color="#c8a97e" strokeWidth={1.8} />
                  </div>
                  <ArrowRight
                    size={14}
                    color="#c8a97e"
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                  />
                </div>
                <p className="text-sm font-black text-gray-900 mt-3">Planning</p>
                <p className="text-[12px] text-gray-400 mt-0.5">Voir le calendrier</p>
              </button>

              {/* Réservations CTA */}
              <button
                onClick={() => navigate('/reservations')}
                className="flex-1 rounded-2xl p-5 text-left group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #c8a97e 0%, #b8966a 100%)',
                  boxShadow: '0 4px 20px rgba(200,169,126,0.35)',
                }}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
                <div className="relative flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15">
                    <ClipboardList size={17} color="#fff" strokeWidth={1.8} />
                  </div>
                  <ArrowRight
                    size={14}
                    color="rgba(255,255,255,0.6)"
                    className="mt-0.5 group-hover:translate-x-0.5 transition-transform duration-150"
                  />
                </div>
                <p className="text-sm font-black text-white mt-3 relative">Réservations</p>
                <p className="text-[12px] mt-0.5 relative" style={{ color: 'rgba(255,255,255,0.65)' }}>Gérer tout</p>
              </button>

              {/* Tomorrow row */}
              <div
                className="bg-white rounded-2xl border border-gray-100/80 px-4 py-3.5 flex items-center gap-3"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.08)' }}>
                  <Users size={14} color="#6366f1" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 leading-tight">Demain</p>
                  <p className="text-[11px] text-gray-400 truncate">{stats.tomorrow} réservation(s) prévue(s)</p>
                </div>
                <span className="text-2xl font-black text-gray-900 tabular-nums">{stats.tomorrow}</span>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </div>
  )
}