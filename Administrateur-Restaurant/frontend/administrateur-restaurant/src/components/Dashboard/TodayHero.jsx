import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Users } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

/* SVG arc ring for occupancy */
function OccupancyRing({ rate, size = 110 }) {
  const [animRate, setAnimRate] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnimRate(rate), 600); return () => clearTimeout(t) }, [rate])

  const r = 44, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = (animRate / 100) * circ

  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={B.border} strokeWidth={8} />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#goldGrad)" strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition:'stroke-dasharray 1.2s cubic-bezier(0.34,1.3,0.64,1)' }}
        />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={B.goldDark} />
            <stop offset="100%" stopColor={B.goldLight} />
          </linearGradient>
        </defs>
      </svg>
      {/* Center label */}
      <div style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        gap:1,
      }}>
        <span style={{ fontSize:20, fontWeight:900, color: B.ink, lineHeight:1, letterSpacing:'-0.5px' }}>
          {animRate}%
        </span>
        <span style={{ fontSize:9, fontWeight:700, color: B.inkMute, textTransform:'uppercase', letterSpacing:'0.08em' }}>
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

  const [hov, setHov] = useState(false)

  const stats = [
    { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.confirmed,  bg: B.confirmedBg, bd: B.confirmedBd },
    { Icon: Clock,        val: p,  label: 'En attente', color: B.pending,    bg: B.pendingBg,   bd: B.pendingBd  },
    { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.cancelled,  bg: B.cancelledBg, bd: B.cancelledBd},
  ]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: B.surface,
        borderRadius: 20,
        border: `1.5px solid ${hov ? B.borderMed : B.border}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
        boxShadow: hov
          ? '0 12px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Gold accent bar */}
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${B.goldDark} 0%, ${B.gold} 55%, ${B.goldLight} 100%)`,
      }} />

      <div style={{ padding:'28px 32px 26px' }}>

        {/* Top row: badge + CTA */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ position:'relative', display:'inline-flex', width:10, height:10 }}>
              <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#22c55e', opacity:0.4, animation:'hpulse 2s ease infinite' }} />
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'block', position:'relative' }} />
            </span>
            <span style={{ fontSize:11, fontWeight:800, color: B.inkMute, letterSpacing:'0.12em', textTransform:'uppercase' }}>
              Service en cours · En direct
            </span>
          </div>
          <div style={{
            display:'flex', alignItems:'center', gap:6,
            background: B.goldTint, border:`1.5px solid ${B.goldBorder}`,
            borderRadius:10, padding:'7px 14px',
            fontSize:13, fontWeight:700, color: B.gold,
          }}>
            Voir les réservations <ArrowUpRight size={14} strokeWidth={2.5} color={B.gold} />
          </div>
        </div>

        {/* Main content: number + ring + stats */}
        <div style={{ display:'flex', alignItems:'center', gap:40, flexWrap:'wrap' }}>

          {/* Big number block */}
          <div style={{ flex:'0 0 auto' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <span style={{
                fontSize:'clamp(84px,11vw,120px)', fontWeight:900,
                color: B.ink, lineHeight:0.9,
                fontVariantNumeric:'tabular-nums', letterSpacing:'-5px',
                fontFamily:"'Plus Jakarta Sans', 'DM Sans', system-ui",
              }}>
                {n}
              </span>
            </div>
            <p style={{ margin:'14px 0 0', fontSize:16, fontWeight:700, color: B.inkSub }}>
              réservations ce soir
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
              <Users size={13} color={B.inkMute} strokeWidth={2} />
              <span style={{ fontSize:12, fontWeight:600, color: B.inkMute }}>
                {(value * 2.3).toFixed(0)} couverts estimés
              </span>
            </div>
          </div>

          {/* Occupancy ring */}
          <OccupancyRing rate={rate} />

          {/* 3 status cards */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', flex:1, minWidth:280 }}>
            {stats.map(({ Icon, val, label, color, bg, bd }) => (
              <div key={label} style={{
                flex:'1 1 85px',
                background: bg, border:`1.5px solid ${bd}`,
                borderRadius:16, padding:'16px 18px',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
                  <div style={{
                    width:28, height:28, borderRadius:8,
                    background:`${color}18`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={14} color={color} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize:11, fontWeight:800, color, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                    {label}
                  </span>
                </div>
                <p style={{
                  margin:0, fontSize:42, fontWeight:900,
                  color: B.ink, lineHeight:1,
                  fontVariantNumeric:'tabular-nums', letterSpacing:'-1.5px',
                }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes hpulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(2.5);opacity:0}}`}</style>
    </div>
  )
}