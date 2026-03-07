import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck, ClipboardList,
  CheckCircle2, Clock, XCircle,
  Download, RefreshCw, Clock4, Flame,
} from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B } from '../utils/brand'

import FadeUp      from '../components/Dashboard/FadeUp'
import Spinner     from '../components/Dashboard/Spinner'
import Card        from '../components/Dashboard/Card'
import TodayHero   from '../components/Dashboard/TodayHero'
import StatusChip  from '../components/Dashboard/StatusChip'
import StatCard    from '../components/Dashboard/StatCard'

/* ── Live clock ──────────────────────────────────────────────────────── */
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

/* ── Service banner ──────────────────────────────────────────────────── */
function ServiceBanner() {
  const h = new Date().getHours()
  const isLunch  = h >= 11 && h < 15
  const isDinner = h >= 18 && h < 23
  if (!isLunch && !isDinner) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 22px',
      background: isDinner ? B.black : B.brownTint,
      borderRadius: 14, marginBottom: 16,
    }}>
      <Flame size={15} color={isDinner ? B.brownLight : B.brown} strokeWidth={2.5} />
      <span style={{ fontSize: 14, fontWeight: 800, color: isDinner ? '#fff' : B.brown }}>
        {isDinner ? '🌙 Service du soir en cours' : '☀️ Service du midi en cours'}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: 13, fontWeight: 700,
        color: isDinner ? 'rgba(255,255,255,0.45)' : B.brown,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <Clock4 size={13} strokeWidth={2} />
        <LiveClock />
      </span>
    </div>
  )
}

/* ── Section label ───────────────────────────────────────────────────── */
function Label({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
      <div style={{ width: 4, height: 16, background: B.brown, borderRadius: 2 }} />
      <span style={{ fontSize: 10, fontWeight: 900, color: B.blackSoft, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {text}
      </span>
    </div>
  )
}

/* ── Button ──────────────────────────────────────────────────────────── */
function Btn({ children, onClick, primary = false }) {
  const [hov, setHov]         = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '13px 22px',
        background: primary ? (hov ? B.brownDark : B.brown) : (hov ? '#E4E4E4' : '#EFEFEF'),
        border: 'none', borderRadius: 13,
        fontSize: 14, fontWeight: 800,
        color: primary ? '#fff' : B.blackSoft,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background 0.15s, transform 0.1s',
        transform: pressed ? 'scale(0.97)' : hov ? 'translateY(-2px)' : 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

/* ── MAIN ─────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh', background: B.pageBg,
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .wrap   { max-width:1160px; margin:0 auto; padding:clamp(16px,4vw,44px) clamp(16px,3vw,36px); }
        .topbar { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; }
        .topbar-btns { display:flex; gap:10px; flex-wrap:wrap; }

        /* Status row: 3 equal chips */
        .status-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

        /* Bottom row: 2 stat cards */
        .stat-row   { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }

        @media(max-width:700px) {
          .status-row { grid-template-columns:repeat(3,1fr); gap:10px; }
          .stat-row   { grid-template-columns:1fr; }
        }
        @media(max-width:480px) {
          .status-row { grid-template-columns:1fr; gap:10px; }
          .topbar-btns button { flex:1; justify-content:center; }
        }
      `}</style>

      <div className="wrap">

        {/* ── 1. TOP BAR ── */}
        <FadeUp delay={0}>
          <Card padding="18px 26px" style={{ marginBottom: 16 }}>
            <div className="topbar">
              <div>
                <h1 style={{ margin: 0, fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 900, color: B.black, letterSpacing: '-0.8px', lineHeight: 1 }}>
                  Aujourd'hui
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: B.inkMute, textTransform: 'capitalize' }}>
                  {today}
                </p>
              </div>
              <div className="topbar-btns">
                <Btn onClick={() => {}}><RefreshCw size={14} strokeWidth={2.5} /> Actualiser</Btn>
                <Btn primary onClick={() => {}}><Download size={14} strokeWidth={2.5} /> Exporter</Btn>
              </div>
            </div>
          </Card>
        </FadeUp>

        {/* ── 2. SERVICE BANNER (contextual) ── */}
        <FadeUp delay={30}><ServiceBanner /></FadeUp>

        {/* ── 3. HERO — single focus: total count ── */}
        <FadeUp delay={70}>
          <div style={{ marginBottom: 14 }}>
            <Label text="Total du jour" />
            <TodayHero
              value={stats.today}
              onClick={() => navigate('/reservations')}
            />
          </div>
        </FadeUp>

        {/* ── 4. STATUS ROW — breakdown of today ── */}
        <FadeUp delay={140}>
          <div style={{ marginBottom: 24 }}>
            <Label text="Détail" />
            <div className="status-row">
              <StatusChip
                icon={CheckCircle2} iconColor={B.black} iconBg="#EFEFEF"
                value={stats.today_confirmed} label="Confirmées" delay={140}
              />
              <StatusChip
                icon={Clock} iconColor={B.brown} iconBg={B.brownTint}
                value={stats.today_pending} label="En attente" delay={190}
              />
              <StatusChip
                icon={XCircle} iconColor={B.inkMute} iconBg="#F5F5F5"
                value={stats.today_cancelled} label="Annulées" delay={240}
              />
            </div>
          </div>
        </FadeUp>

        {/* ── 5. BOTTOM ROW — forward-looking ── */}
        <FadeUp delay={280}>
          <Label text="À venir" />
          <div className="stat-row">
            <StatCard
              icon={CalendarCheck} iconColor={B.brown} iconBg={B.brownTint}
              value={stats.tomorrow} label="Réservations demain"
              trend="+8 vs hier" actionLabel="Voir le planning"
              onClick={() => navigate('/calendar')} delay={0}
            />
            <StatCard
              icon={ClipboardList} iconColor={B.blackSoft} iconBg="#EFEFEF"
              value={stats.total} label="Total ce mois"
              delay={60}
            />
          </div>
        </FadeUp>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ marginTop: 16, padding: '13px 18px', background: '#F5F5F5', borderRadius: 12, fontSize: 14, fontWeight: 700, color: B.blackSoft }}>
            ⚠️ {error}
          </div>
        )}

      </div>
    </div>
  )
}