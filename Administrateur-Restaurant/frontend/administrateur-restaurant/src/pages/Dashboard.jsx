import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck, ClipboardList, Users,
  Download, MapPin, RefreshCw, Clock4, Flame,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B } from '../utils/brand'

import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import TodayHero from '../components/Dashboard/TodayHero'
import StatCard  from '../components/Dashboard/StatCard'

/* ── Live clock ─────────────────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

/* ── Service banner ─────────────────────────────────────────────────────── */
function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  if (!isLunch && !isDinner) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '16px 24px',
      background: isDinner ? B.black : B.brownTint,
      borderRadius: 16, marginBottom: 24,
    }}>
      <Flame size={18} color={isDinner ? B.brownLight : B.brown} strokeWidth={2.5} />
      <span style={{ fontSize: 15, fontWeight: 800, color: isDinner ? '#fff' : B.brown }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: 14, fontWeight: 700,
        color: isDinner ? 'rgba(255,255,255,0.55)' : B.brown,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Clock4 size={14} strokeWidth={2} />
        <LiveClock />
      </span>
    </div>
  )
}

/* ── Section heading ────────────────────────────────────────────────────── */
function SectionHead({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 14px' }}>
      <div style={{ width: 4, height: 20, background: B.brown, borderRadius: 2 }} />
      <p style={{
        margin: 0, fontSize: 11, fontWeight: 900,
        color: B.blackSoft, letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        {label}
      </p>
    </div>
  )
}

/* ── Button ─────────────────────────────────────────────────────────────── */
function Btn({ children, onClick, primary = false }) {
  const [hov, setHov] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '14px 24px',
        background: primary
          ? (hov ? B.brownDark : B.brown)
          : (hov ? '#E8E8E8' : '#EFEFEF'),
        border: 'none', borderRadius: 14,
        fontSize: 14, fontWeight: 800,
        color: primary ? '#fff' : B.blackSoft,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background 0.15s ease, transform 0.1s ease',
        transform: pressed ? 'scale(0.97)' : hov ? 'translateY(-2px)' : 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

/* ── MAIN ────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh',
      background: B.pageBg,
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,36px)' }}>

        {/* ── TOP BAR ── */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 16, marginBottom: 24,
            background: B.surface,
            borderRadius: 20, padding: '20px 32px',
          }}>
            <div>
              <h1 style={{
                margin: 0, fontSize: 30, fontWeight: 900,
                color: B.black, letterSpacing: '-1px', lineHeight: 1,
              }}>
                Aujourd'hui
              </h1>
              <p style={{ margin: '5px 0 0', fontSize: 14, fontWeight: 600, color: B.inkMute, textTransform: 'capitalize' }}>
                {today}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              {info?.location && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '14px 20px', background: B.pageBg, borderRadius: 14,
                  fontSize: 13, fontWeight: 700, color: B.blackSoft,
                }}>
                  <MapPin size={15} color={B.inkMute} strokeWidth={2} /> {info.location}
                </div>
              )}
              <Btn onClick={() => {}}><RefreshCw size={15} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary onClick={() => {}}><Download size={15} strokeWidth={2.5} /> Exporter</Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── SERVICE BANNER ── */}
        <FadeUp delay={40}><ServiceBanner /></FadeUp>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ padding: '14px 20px', background: '#F5F5F5', borderRadius: 14, fontSize: 14, fontWeight: 700, color: B.blackSoft, marginBottom: 24 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── HERO ── */}
        <FadeUp delay={80}>
          <div style={{ marginBottom: 32 }}>
            <SectionHead label="Réservations en temps réel" />
            <TodayHero
              value={stats.today}
              confirmed={stats.today_confirmed}
              pending={stats.today_pending}
              cancelled={stats.today_cancelled}
              onClick={() => navigate('/reservations')}
            />
          </div>
        </FadeUp>

        {/* ── STAT CARDS ── */}
        <FadeUp delay={200}>
          <SectionHead label="Vue d'ensemble" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 16 }}>
            <StatCard
              icon={CalendarCheck} iconColor={B.brown} iconBg={B.brownTint}
              value={stats.tomorrow} label="Réservations demain"
              trend="+8 vs hier" actionLabel="Voir le planning"
              onClick={() => navigate('/calendar')} delay={0}
            />
            <StatCard
              icon={ClipboardList} iconColor={B.blackSoft} iconBg="#EFEFEF"
              value={stats.total} label="Total ce mois"
              delay={80}
            />
            <StatCard
              icon={Users} iconColor={B.blackSoft} iconBg="#EFEFEF"
              value={stats.today_confirmed} label="Confirmées aujourd'hui"
              actionLabel="Voir les réservations"
              onClick={() => navigate('/reservations')} delay={160}
            />
          </div>
        </FadeUp>

      </div>
    </div>
  )
}