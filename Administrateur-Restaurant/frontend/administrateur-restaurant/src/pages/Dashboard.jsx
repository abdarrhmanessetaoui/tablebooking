import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck, ClipboardList, Users,
  Download, MapPin, RefreshCw,
  UtensilsCrossed, Clock4, Flame,
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
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '10px 16px',
      background: isDinner ? B.dark : B.goldTint,
      borderRadius: 12, marginBottom: 20,
    }}>
      <Flame size={14} color={isDinner ? '#E5C97A' : B.gold} strokeWidth={2.5} />
      <span style={{ fontSize: 13, fontWeight: 700, color: isDinner ? '#fff' : B.gold }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: 11, fontWeight: 700,
        color: isDinner ? B.darkMuted : B.gold,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <Clock4 size={12} strokeWidth={2} />
        {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function SectionHead({ label }) {
  return (
    <p style={{
      margin: '0 0 10px',
      fontSize: 10, fontWeight: 800,
      color: B.inkMute,
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
    }}>
      {label}
    </p>
  )
}

function Btn({ children, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 16px',
        background: primary ? B.gold : B.pageBg,
        border: 'none',
        borderRadius: 10,
        fontSize: 12, fontWeight: 700,
        color: primary ? '#fff' : B.inkSub,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
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
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: 'clamp(24px,4vw,42px) clamp(16px,3vw,34px)' }}>

        {/* TOP BAR */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 26,
            background: B.surface,
            borderRadius: 16, padding: '13px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>

              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: B.ink, letterSpacing: '-0.5px' }}>Dashboard</h1>
                <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 600, color: B.inkMute, textTransform: 'capitalize' }}>{today}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              {info?.location && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px',
                  background: B.pageBg, borderRadius: 10,
                  fontSize: 12, fontWeight: 700, color: B.inkSub,
                }}>
                  <MapPin size={12} color={B.inkMute} strokeWidth={2} /> {info.location}
                </div>
              )}
              <Btn onClick={() => {}}><RefreshCw size={13} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary onClick={() => {}}><Download size={13} strokeWidth={2.5} /> Export CSV</Btn>
            </div>
          </div>
        </FadeUp>

        {/* SERVICE BANNER */}
        <FadeUp delay={40}><ServiceBanner /></FadeUp>

        {/* ERROR */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: B.cancelledBg,
            borderRadius: 12, fontSize: 13, fontWeight: 700,
            color: B.cancelled, marginBottom: 22,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* HERO */}
        <FadeUp delay={80}>
          <div style={{ marginBottom: 26 }}>
            <SectionHead label="Aujourd'hui en temps réel" />
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
          <div style={{ marginBottom: 26 }}>
            <SectionHead label="Vue d'ensemble" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(192px,1fr))', gap: 12 }}>
              <StatCard icon={CalendarCheck} iconColor={B.indigo} iconBg={B.indigoBg} value={stats.tomorrow} label="Réservations demain" trend="+8 vs hier" onClick={() => navigate('/calendar')} delay={0} />
              <StatCard icon={ClipboardList} iconColor={B.blue} iconBg={B.blueBg} value={stats.total} label="Total réservations" trend="ce mois" delay={80} />
              <StatCard icon={Users} iconColor={B.confirmed} iconBg={B.confirmedBg} value={stats.today_confirmed} label="Confirmées aujourd'hui" delay={160} />
            </div>
          </div>
        </FadeUp>


      </div>
    </div>
  )
}