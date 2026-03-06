import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useDashboardStats from '../hooks/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import {
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ClipboardList,
  Users,
  TrendingUp,
  Download,
  MapPin,
  Mail,
  ChevronRight,
  Sunrise,
} from 'lucide-react'

/* ── Brand ────────────────────────────────────────────────────────────────── */
const B = {
  dark:   '#3D1F0D',   // sidebar dark brown
  mid:    '#7C4A20',   // medium brown — accent
  warm:   '#C48A52',   // warm tan — secondary
  tint:   '#FBF6F1',   // very light cream
  border: '#EDE3DA',   // soft brown border
}

/* ── Count-up ──────────────────────────────────────────────────────────────── */
function useCountUp(target, ms = 900, delay = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf, t0 = null
    const id = setTimeout(() => {
      const tick = (ts) => {
        if (!t0) t0 = ts
        const p = Math.min((ts - t0) / ms, 1)
        setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [target, ms, delay])
  return v
}

/* ── FadeUp ────────────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, style = {} }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Icon box ──────────────────────────────────────────────────────────────── */
function IBox({ icon: Icon, color, bg, size = 20 }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={size} color={color} strokeWidth={1.8} />
    </div>
  )
}

/* ── Card shell ────────────────────────────────────────────────────────────── */
function Card({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hov ? B.border : '#F0EBE3'}`,
        borderRadius: 18,
        padding: 24,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        boxShadow: hov ? '0 8px 28px rgba(61,31,13,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hov && onClick ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── TODAY HERO ────────────────────────────────────────────────────────────── */
function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const n  = useCountUp(value,     800, 150)
  const c  = useCountUp(confirmed, 700, 320)
  const p  = useCountUp(pending,   700, 400)
  const ca = useCountUp(cancelled, 700, 480)
  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [bar, setBar] = useState(0)
  useEffect(() => { const t = setTimeout(() => setBar(rate), 950); return () => clearTimeout(t) }, [rate])

  return (
    <Card onClick={onClick}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', opacity: 0.5,
              animation: 'pulse-ring 1.4s ease infinite' }} />
            <span style={{ position: 'relative', width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'block' }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            En direct · Aujourd'hui
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: B.mid, cursor: 'pointer' }}>
          Voir tout <ChevronRight size={14} color={B.mid} />
        </div>
      </div>

      {/* big number */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 28 }}>
        <span style={{
          fontSize: 'clamp(72px, 10vw, 110px)', fontWeight: 900,
          color: B.dark, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-2px',
        }}>
          {n}
        </span>
        <div style={{ paddingBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111827' }}>réservations</p>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9ca3af' }}>ce soir</p>
        </div>
      </div>

      {/* 3 status boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { Icon: CheckCircle2, val: c,  label: 'Confirmées', iconColor: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
          { Icon: Clock,        val: p,  label: 'En attente',  iconColor: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
          { Icon: XCircle,      val: ca, label: 'Annulées',    iconColor: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
        ].map(({ Icon, val, label, iconColor, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: '16px 14px' }}>
            <Icon size={18} color={iconColor} strokeWidth={2} />
            <p style={{ margin: '10px 0 0', fontSize: 30, fontWeight: 900, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {val}
            </p>
            <p style={{ margin: '5px 0 0', fontSize: 12, fontWeight: 600, color: iconColor }}>{label}</p>
          </div>
        ))}
      </div>

      {/* progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Taux de confirmation</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: B.dark }}>{rate}%</span>
        </div>
        <div style={{ height: 7, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${B.dark} 0%, ${B.warm} 100%)`,
            width: `${bar}%`,
            transition: 'width 1.1s cubic-bezier(0.34,1.4,0.64,1)',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[['#10b981','Confirmées'],['#f59e0b','En attente'],['#ef4444','Annulées']].map(([col, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: col, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse-ring{0%{transform:scale(1);opacity:.5}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}`}</style>
    </Card>
  )
}

/* ── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconColor, iconBg, value, label, onClick, delay = 0 }) {
  const n = useCountUp(value, 700, delay + 200)
  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <Card onClick={onClick} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <IBox icon={Icon} color={iconColor} bg={iconBg} />
          {onClick && <ChevronRight size={16} color="#D1D5DB" />}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 40, fontWeight: 900, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {n}
          </p>
          <p style={{ margin: '7px 0 0', fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{label}</p>
        </div>
      </Card>
    </FadeUp>
  )
}

/* ── Week chart ────────────────────────────────────────────────────────────── */
function WeekChart({ todayCount }) {
  const targets = [35, 58, 42, 75, 50, 88, Math.min(Math.max((todayCount / 10) * 100, 12), 100)]
  const [h, setH] = useState(targets.map(() => 0))
  useEffect(() => { const t = setTimeout(() => setH(targets), 350); return () => clearTimeout(t) }, [todayCount])

  return (
    <Card style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#111827' }}>Cette semaine</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9CA3AF' }}>Aperçu des 7 derniers jours</p>
        </div>
        <IBox icon={TrendingUp} color={B.mid} bg={B.tint} size={17} />
      </div>

      {/* chart area with Y-axis labels */}
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Y labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 28, paddingTop: 2 }}>
          {['100', '50', '0'].map(l => (
            <span key={l} style={{ fontSize: 10, color: '#D1D5DB', fontWeight: 600, lineHeight: 1 }}>{l}</span>
          ))}
        </div>

        {/* bars + day labels */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
            {h.map((val, i) => (
              <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: `${val}%`,
                  minHeight: 4,
                  borderRadius: '5px 5px 3px 3px',
                  background: i === 6
                    ? `linear-gradient(180deg, ${B.warm} 0%, ${B.dark} 100%)`
                    : '#EDE8E3',
                  transition: `height 0.65s cubic-bezier(0.34,1.2,0.64,1) ${i * 50}ms`,
                  boxShadow: i === 6 ? `0 4px 14px ${B.mid}55` : 'none',
                }} />
              </div>
            ))}
          </div>
          {/* day labels */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: i === 6 ? B.dark : '#D1D5DB' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ── Quick nav ─────────────────────────────────────────────────────────────── */
function QuickNav({ tomorrow, onCalendar, onReservations }) {
  const [h1, setH1] = useState(false)
  const [h2, setH2] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>

      {/* Planning */}
      <div
        onClick={onCalendar}
        onMouseEnter={() => setH1(true)}
        onMouseLeave={() => setH1(false)}
        style={{
          background: '#fff', border: `1.5px solid ${h1 ? B.border : '#F0EBE3'}`,
          borderRadius: 16, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          boxShadow: h1 ? '0 6px 20px rgba(61,31,13,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'all 0.18s ease',
          transform: h1 ? 'translateY(-1px)' : 'none',
        }}
      >
        <IBox icon={CalendarDays} color={B.mid} bg={B.tint} size={18} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#111827' }}>Planning</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>Voir le calendrier</p>
        </div>
        <ChevronRight size={16} color={h1 ? B.mid : '#D1D5DB'} style={{ transition: 'color 0.15s' }} />
      </div>

      {/* Réservations */}
      <div
        onClick={onReservations}
        onMouseEnter={() => setH2(true)}
        onMouseLeave={() => setH2(false)}
        style={{
          background: h2 ? B.mid : B.dark,
          borderRadius: 16, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          boxShadow: h2 ? `0 8px 24px ${B.dark}50` : `0 4px 12px ${B.dark}30`,
          transition: 'all 0.18s ease',
          transform: h2 ? 'translateY(-1px)' : 'none',
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ClipboardList size={18} color="#fff" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>Réservations</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Gérer tout</p>
        </div>
        <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
      </div>

      {/* Demain */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
        <IBox icon={Sunrise} color="#6366f1" bg="#EEF2FF" size={17} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#111827' }}>Demain</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{tomorrow} réservation(s) prévue(s)</p>
        </div>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
          {tomorrow}
        </span>
      </Card>

    </div>
  )
}

/* ── Spinner ────────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ width: 22, height: 22, border: `3px solid #EDE3DA`, borderTop: `3px solid ${B.dark}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ── MAIN ───────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(20px,4vw,36px)' }}>

        {/* Top bar */}
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

        {error && (
          <div style={{ padding: '11px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, fontSize: 12, color: '#DC2626', marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Hero */}
        <FadeUp delay={70} style={{ marginBottom: 20 }}>
          <TodayHero
            value={stats.today}
            confirmed={stats.today_confirmed}
            pending={stats.today_pending}
            cancelled={stats.today_cancelled}
            onClick={() => navigate('/reservations')}
          />
        </FadeUp>

        {/* 3 stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 20 }}>
          <StatCard icon={CalendarCheck} iconColor="#6366f1" iconBg="#EEF2FF" value={stats.tomorrow}        label="Réservations demain"     onClick={() => navigate('/calendar')} delay={110} />
          <StatCard icon={ClipboardList} iconColor="#0EA5E9" iconBg="#F0F9FF" value={stats.total}           label="Total réservations"                                              delay={160} />
          <StatCard icon={Users}         iconColor="#059669" iconBg="#ECFDF5" value={stats.today_confirmed} label="Confirmées aujourd'hui"                                          delay={210} />
        </div>

        {/* Bottom row */}
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