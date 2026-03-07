import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Users } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

/* SVG arc ring for occupancy */
function OccupancyRing({ rate, size = 106 }) {
  const [animRate, setAnimRate] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimRate(rate), 500)
    return () => clearTimeout(t)
  }, [rate])

  const r = 42, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = (animRate / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth={8} />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={B.gold} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.3,0.64,1)' }}
        />
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 1,
      }}>
        <span style={{ fontSize: 19, fontWeight: 900, color: B.ink, lineHeight: 1, letterSpacing: '-0.5px' }}>
          {animRate}%
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: B.inkMute, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          confirmé
        </span>
      </div>
    </div>
  )
}

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const n  = useCountUp(value,     900, 80)
  const c  = useCountUp(confirmed, 750, 200)
  const p  = useCountUp(pending,   750, 300)
  const ca = useCountUp(cancelled, 750, 400)
  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0

  const stats = [
    { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.confirmed,  bg: B.confirmedBg },
    { Icon: Clock,        val: p,  label: 'En attente', color: B.pending,    bg: B.pendingBg   },
    { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.cancelled,  bg: B.cancelledBg },
  ]

  return (
    <div
      onClick={onClick}
      style={{
        background: B.surface,
        borderRadius: 16,
        border: `1.5px solid ${B.border}`,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div style={{ padding: '26px 30px 24px' }}>

        {/* Top row: live badge + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: B.inkMute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Service en cours · En direct
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: B.goldTint,
            borderRadius: 10, padding: '7px 14px',
            fontSize: 12, fontWeight: 700, color: B.gold,
          }}>
            Voir les réservations <ArrowUpRight size={13} strokeWidth={2.5} color={B.gold} />
          </div>
        </div>

        {/* Main content: number + ring + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 38, flexWrap: 'wrap' }}>

          {/* Big number block */}
          <div style={{ flex: '0 0 auto' }}>
            <span style={{
              fontSize: 'clamp(80px,10vw,112px)', fontWeight: 900,
              color: B.ink, lineHeight: 0.9,
              fontVariantNumeric: 'tabular-nums', letterSpacing: '-5px',
              fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
              display: 'block',
            }}>
              {n}
            </span>
            <p style={{ margin: '13px 0 0', fontSize: 15, fontWeight: 700, color: B.inkSub }}>
              réservations ce soir
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
              <Users size={12} color={B.inkMute} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: B.inkMute }}>
                {(value * 2.3).toFixed(0)} couverts estimés
              </span>
            </div>
          </div>

          {/* Occupancy ring */}
          <OccupancyRing rate={rate} />

          {/* 3 status cards */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, minWidth: 270 }}>
            {stats.map(({ Icon, val, label, color, bg }) => (
              <div key={label} style={{
                flex: '1 1 82px',
                background: bg,
                borderRadius: 14, padding: '15px 17px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 11 }}>
                  <Icon size={13} color={color} strokeWidth={2.5} />
                  <span style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </div>
                <p style={{
                  margin: 0, fontSize: 40, fontWeight: 900,
                  color: B.ink, lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-1.5px',
                }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}