import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, Users, ChevronRight, ArrowUpRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import Card from './Card'
import IBox from './IBox'

/* ── Pulsing live dot ─────────────────────────────────────────────────── */
function PulseDot() {
  return (
    <>
      <span style={{ position: 'relative', display: 'inline-flex', width: 11, height: 11, flexShrink: 0 }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: B.brown, opacity: 0.3,
          animation: 'livepulse 2s ease-in-out infinite',
        }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: B.brown, display: 'block', position: 'relative' }} />
      </span>
      <style>{`@keyframes livepulse { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(2.6);opacity:0} }`}</style>
    </>
  )
}

/* ── Occupancy ring ───────────────────────────────────────────────────── */
function OccupancyRing({ rate, size = 130 }) {
  const [animRate, setAnimRate] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnimRate(rate), 600); return () => clearTimeout(t) }, [rate])
  const r = 52, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash  = (animRate / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EBEBEB" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={B.brown} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34,1.3,0.64,1)' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: B.black, lineHeight: 1, letterSpacing: '-1px' }}>{animRate}%</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: B.inkMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>confirmé</span>
      </div>
    </div>
  )
}

/* ── Status chip — uses IBox internally ──────────────────────────────── */
function StatusChip({ icon, val, label, color, bg }) {
  return (
    <div style={{ flex: '1 1 90px', background: bg, borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <IBox icon={icon} color={color} bg="transparent" size={14} />
        <span style={{ fontSize: 11, fontWeight: 900, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <p style={{
        margin: 0, fontSize: 50, fontWeight: 900,
        color: B.black, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
      }}>{val}</p>
    </div>
  )
}

/* ── Footer strip — same component as StatCard uses ─────────────────── */
function FooterStrip({ hov }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '16px 40px',
      background: hov ? B.brown : '#F0F0F0',
      transition: 'background 0.2s ease',
    }}>
      <span style={{
        fontSize: 13, fontWeight: 800,
        color: hov ? '#fff' : B.inkMute,
        transition: 'color 0.2s ease',
      }}>
        Voir et gérer toutes les réservations
      </span>
      <ChevronRight size={16} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute}
        style={{ transition: 'color 0.2s ease, transform 0.2s ease', transform: hov ? 'translateX(3px)' : 'none' }} />
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const [hov, setHov] = useState(false)

  const n  = useCountUp(value,     900,  80)
  const c  = useCountUp(confirmed, 750, 200)
  const p  = useCountUp(pending,   750, 300)
  const ca = useCountUp(cancelled, 750, 400)
  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0

  const statuses = [
    { icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.black,   bg: '#EFEFEF'    },
    { icon: Clock,        val: p,  label: 'En attente', color: B.brown,   bg: B.brownTint  },
    { icon: XCircle,      val: ca, label: 'Annulées',   color: B.inkMute, bg: '#F5F5F5'    },
  ]

  return (
    <Card onClick={onClick} padding={0}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Wrapper to track hover for footer — separate from Card's own hover */}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '32px 40px 36px' }}>

          {/* Top row: live badge + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <PulseDot />
              <span style={{ fontSize: 12, fontWeight: 900, color: B.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                En direct
              </span>
            </div>

            <CtaButton onClick={onClick} />
          </div>

          {/* Content: number · divider · ring · divider · chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>

            <div style={{ flex: '0 0 auto' }}>
              <span style={{
                fontSize: 'clamp(110px,14vw,172px)', fontWeight: 900,
                color: B.black, lineHeight: 0.88,
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-8px',
                fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
                display: 'block',
              }}>
                {n}
              </span>
              <p style={{ margin: '16px 0 0', fontSize: 17, fontWeight: 800, color: B.blackSoft }}>
                réservations aujourd'hui
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
                <Users size={14} color={B.inkMute} strokeWidth={2} />
                <span style={{ fontSize: 13, fontWeight: 600, color: B.inkMute }}>
                  ~{(value * 2.3).toFixed(0)} couverts estimés
                </span>
              </div>
            </div>

            <div style={{ width: 1, height: 120, background: '#E8E8E8', flexShrink: 0, alignSelf: 'center' }} />
            <OccupancyRing rate={rate} />
            <div style={{ width: 1, height: 120, background: '#E8E8E8', flexShrink: 0, alignSelf: 'center' }} />

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 280 }}>
              {statuses.map(s => <StatusChip key={s.label} {...s} />)}
            </div>
          </div>
        </div>

        <FooterStrip hov={hov} />
      </div>
    </Card>
  )
}

/* ── CTA button — self-contained hover ─────────────────────────────── */
function CtaButton({ onClick }) {
  const [hov, setHov] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick?.() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={e => { e.stopPropagation(); setPressed(true) }}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '15px 28px',
        background: hov ? B.brownDark : B.brown,
        border: 'none', borderRadius: 14,
        fontSize: 15, fontWeight: 900, color: '#fff',
        cursor: 'pointer', letterSpacing: '-0.2px',
        transition: 'background 0.15s ease, transform 0.1s ease',
        transform: pressed ? 'scale(0.96)' : hov ? 'translateY(-2px)' : 'none',
      }}
    >
      Gérer les réservations
      <ArrowUpRight size={18} strokeWidth={2.5} />
    </button>
  )
}