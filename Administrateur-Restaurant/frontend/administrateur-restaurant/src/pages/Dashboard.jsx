import { useState } from 'react'
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

function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  if (!isLunch && !isDinner) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 20px',
      background: isDinner ? B.black : B.brownTint,
      borderRadius: 14, marginBottom: 20,
    }}>
      <Flame size={16} color={isDinner ? B.brownLight : B.brown} strokeWidth={2.5} />
      <span style={{ fontSize: 14, fontWeight: 800, color: isDinner ? '#fff' : B.brown }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: 13, fontWeight: 700,
        color: isDinner ? B.darkMuted : B.brown,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <Clock4 size={13} strokeWidth={2} />
        {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function SectionHead({ label }) {
  return (
    <p style={{
      margin: '0 0 12px',
      fontSize: 11, fontWeight: 800,
      color: B.inkMute,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
    }}>
      {label}
    </p>
  )
}

function Btn({ children, onClick, primary = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '13px 22px',
        background: primary
          ? (hov ? B.brownDark : B.brown)
          : (hov ? '#EBEBEB' : B.pageBg),
        border: 'none',
        borderRadius: 12,
        fontSize: 14, fontWeight: 800,
        color: primary ? '#fff' : B.blackSoft,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.1px',
        transition: 'background 0.15s ease, transform 0.1s ease',
        transform: hov ? 'translateY(-1px)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh',
      background: B.pageBg,
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: 'clamp(24px,4vw,42px) clamp(16px,3vw,34px)' }}>

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 14, marginBottom: 28,
            background: B.surface,
            borderRadius: 18, padding: '18px 28px',
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: B.black, letterSpacing: '-0.8px' }}>
                Aujourd'hui
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: B.inkMute, textTransform: 'capitalize' }}>
                {today}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              {info?.location && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '13px 18px',
                  background: B.pageBg, borderRadius: 12,
                  fontSize: 13, fontWeight: 700, color: B.blackSoft,
                }}>
                  <MapPin size={14} color={B.inkMute} strokeWidth={2} /> {info.location}
                </div>
              )}
              <Btn onClick={() => {}}><RefreshCw size={15} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary onClick={() => {}}><Download size={15} strokeWidth={2.5} /> Export CSV</Btn>
            </div>
          </div>
        </FadeUp>

        {/* SERVICE BANNER */}
        <FadeUp delay={40}><ServiceBanner /></FadeUp>

        {/* ERROR */}
        {error && (
          <div style={{
            padding: '14px 20px', background: '#F5F5F5',
            borderRadius: 12, fontSize: 14, fontWeight: 700,
            color: B.blackSoft, marginBottom: 22,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* HERO */}
        <FadeUp delay={80}>
          <div style={{ marginBottom: 28 }}>
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

        {/* STAT CARDS */}
        <FadeUp delay={160}>
          <div style={{ marginBottom: 28 }}>
            <SectionHead label="Vue d'ensemble" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <StatCard
                icon={CalendarCheck} iconColor={B.brown} iconBg={B.brownTint}
                value={stats.tomorrow} label="Demain"
                trend="+8 vs hier"
                actionLabel="Voir le planning"
                onClick={() => navigate('/calendar')} delay={0}
              />
              <StatCard
                icon={ClipboardList} iconColor={B.black} iconBg="#EFEFEF"
                value={stats.total} label="Ce mois"
                trend="total" delay={80}
              />
              <StatCard
                icon={Users} iconColor={B.black} iconBg="#EFEFEF"
                value={stats.today_confirmed} label="Confirmées"
                actionLabel="Voir les réservations"
                onClick={() => navigate('/reservations')} delay={160}
              />
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  )
}