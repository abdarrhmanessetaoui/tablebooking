import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck, ClipboardList, Users,
  Download, MapPin, RefreshCw,
  UtensilsCrossed, Clock4, Flame,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B }             from '../utils/brand'

import FadeUp    from '../components/Dashboard/FadeUp'
import Spinner   from '../components/Dashboard/Spinner'
import TodayHero from '../components/Dashboard/TodayHero'
import StatCard  from '../components/Dashboard/StatCard'
import WeekChart from '../components/Dashboard/WeekChart'
import QuickNav  from '../components/Dashboard/QuickNav'

/* ── Service banner (dinner/lunch context) ────────────────────────────────── */
function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  const isActive = isLunch || isDinner
  if (!isActive) return null

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'10px 18px',
      background: isDinner ? B.dark : B.goldTint,
      border:`1.5px solid ${isDinner ? B.darkBorder : B.goldBorder}`,
      borderRadius:12, marginBottom:20,
      boxShadow: isDinner ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
    }}>
      <Flame size={15} color={isDinner ? '#E5C97A' : B.gold} strokeWidth={2.5} />
      <span style={{ fontSize:13, fontWeight:700, color: isDinner ? '#fff' : B.gold }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{
        marginLeft:'auto', fontSize:11, fontWeight:700,
        color: isDinner ? B.darkMuted : B.gold,
        display:'flex', alignItems:'center', gap:5,
      }}>
        <Clock4 size={12} strokeWidth={2} />
        {new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
      </span>
    </div>
  )
}

/* ── Section heading ──────────────────────────────────────────────────────── */
function SectionHead({ label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <div style={{ width:3, height:18, background:`linear-gradient(180deg,${B.gold},${B.goldDark})`, borderRadius:2 }} />
      <p style={{ margin:0, fontSize:11, fontWeight:800, color: B.inkMute, letterSpacing:'0.13em', textTransform:'uppercase' }}>
        {label}
      </p>
    </div>
  )
}

/* ── Action button ────────────────────────────────────────────────────────── */
function Btn({ children, onClick, primary = false }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:'flex', alignItems:'center', gap:7,
        padding:'9px 18px',
        background: primary ? (hov ? B.goldDark : B.gold) : (hov ? B.goldTint : B.surface),
        border:`1.5px solid ${primary ? 'transparent' : (hov ? B.goldBorder : B.border)}`,
        borderRadius:11,
        fontSize:13, fontWeight:700,
        color: primary ? '#fff' : (hov ? B.gold : B.inkSub),
        cursor:'pointer',
        transition:'all 0.15s ease',
        boxShadow: primary ? `0 4px 14px ${B.gold}55` : 'none',
        whiteSpace:'nowrap',
      }}
    >
      {children}
    </button>
  )
}

/* ── MAIN ─────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { info }                  = useRestaurantInfo()
  const navigate                  = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday:'long', month:'long', day:'numeric',
  })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight:'100vh',
      background: B.pageBg,
      fontFamily:"'Plus Jakarta Sans', 'DM Sans', system-ui, -apple-system, sans-serif",
    }}>
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth:1160, margin:'0 auto', padding:'clamp(24px,4vw,44px) clamp(16px,3vw,36px)' }}>

        {/* ══ TOP BAR ══ */}
        <FadeUp delay={0}>
          <div style={{
            display:'flex', flexWrap:'wrap',
            alignItems:'center', justifyContent:'space-between',
            gap:14, marginBottom:28,
            background: B.surface,
            border:`1.5px solid ${B.border}`,
            borderRadius:18, padding:'16px 24px',
            boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
          }}>
            {/* Left: logo icon + title */}
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{
                width:48, height:48, borderRadius:14,
                background: B.dark,
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
                boxShadow:'0 4px 16px rgba(0,0,0,0.22)',
              }}>
                <UtensilsCrossed size={22} color="#E5C97A" strokeWidth={2} />
              </div>
              <div>
                <h1 style={{
                  margin:0, fontSize:22, fontWeight:900,
                  color: B.ink, letterSpacing:'-0.5px', lineHeight:1.1,
                }}>
                  Dashboard
                </h1>
                <p style={{
                  margin:'3px 0 0', fontSize:12, fontWeight:600,
                  color: B.inkMute, textTransform:'capitalize',
                }}>
                  {today}
                </p>
              </div>
            </div>

            {/* Right: chips + actions */}
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:9 }}>
              {info?.location && (
                <div style={{
                  display:'flex', alignItems:'center', gap:6, padding:'8px 14px',
                  background: B.pageBg, border:`1.5px solid ${B.border}`,
                  borderRadius:10, fontSize:13, fontWeight:700, color: B.inkSub,
                }}>
                  <MapPin size={13} color={B.inkMute} strokeWidth={2} /> {info.location}
                </div>
              )}
              <Btn onClick={() => {}}><RefreshCw size={14} strokeWidth={2.5} /> Actualiser</Btn>
              <Btn primary onClick={() => {}}><Download size={14} strokeWidth={2.5} /> Export CSV</Btn>
            </div>
          </div>
        </FadeUp>

        {/* ══ SERVICE BANNER ══ */}
        <FadeUp delay={40}>
          <ServiceBanner />
        </FadeUp>

        {/* ══ ERROR ══ */}
        {error && (
          <div style={{
            display:'flex', alignItems:'center', gap:9,
            padding:'13px 18px',
            background: B.cancelledBg, border:`1.5px solid ${B.cancelledBd}`,
            borderRadius:12, fontSize:13, fontWeight:700,
            color: B.cancelled, marginBottom:24,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ══ HERO ══ */}
        <FadeUp delay={80}>
          <div style={{ marginBottom:28 }}>
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

        {/* ══ STAT CARDS ══ */}
        <FadeUp delay={160}>
          <div style={{ marginBottom:28 }}>
            <SectionHead label="Vue d'ensemble" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(195px,1fr))', gap:14 }}>
              <StatCard
                icon={CalendarCheck} iconColor={B.indigo} iconBg={B.indigoBg}
                value={stats.tomorrow} label="Réservations demain"
                trend="+8 vs hier" onClick={() => navigate('/calendar')} delay={0}
              />
              <StatCard
                icon={ClipboardList} iconColor={B.blue} iconBg={B.blueBg}
                value={stats.total} label="Total réservations"
                trend="ce mois" delay={80}
              />
              <StatCard
                icon={Users} iconColor={B.confirmed} iconBg={B.confirmedBg}
                value={stats.today_confirmed} label="Confirmées aujourd'hui"
                delay={160}
              />
            </div>
          </div>
        </FadeUp>

        {/* ══ BOTTOM ROW ══ */}
        <FadeUp delay={240}>
          <SectionHead label="Activité hebdomadaire & Navigation" />
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',
            gap:14, alignItems:'start',
          }}>
            <div style={{ gridColumn:'span 2' }}>
              <WeekChart todayCount={stats.today} />
            </div>
            <QuickNav
              tomorrow={stats.tomorrow}
              onCalendar={() => navigate('/calendar')}
              onReservations={() => navigate('/reservations')}
            />
          </div>
        </FadeUp>

      </div>
    </div>
  )
}