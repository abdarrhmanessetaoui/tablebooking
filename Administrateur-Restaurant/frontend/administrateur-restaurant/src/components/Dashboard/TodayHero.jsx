import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, Users, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import Card from './Card'
import IBox from './IBox'

function PulseDot() {
  return (
    <>
      <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10, flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.brown, opacity: 0.3, animation: 'livepulse 2s ease-in-out infinite' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: B.brown, display: 'block', position: 'relative' }} />
      </span>
      <style>{`@keyframes livepulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(2.6);opacity:0}}`}</style>
    </>
  )
}

function OccupancyRing({ rate, size = 110 }) {
  const [animRate, setAnimRate] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnimRate(rate), 600); return () => clearTimeout(t) }, [rate])
  const r = 44, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = (animRate / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EBEBEB" strokeWidth={9} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={B.brown} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34,1.3,0.64,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: B.black, lineHeight: 1, letterSpacing: '-1px' }}>{animRate}%</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: B.inkMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>confirmé</span>
      </div>
    </div>
  )
}

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const [hov, setHov] = useState(false)
  const n  = useCountUp(value,     900,  80)
  const c  = useCountUp(confirmed, 750, 200)
  const p  = useCountUp(pending,   750, 300)
  const ca = useCountUp(cancelled, 750, 400)
  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0

  const statuses = [
    { icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.black,   bg: '#EFEFEF'   },
    { icon: Clock,        val: p,  label: 'En attente', color: B.brown,   bg: B.brownTint },
    { icon: XCircle,      val: ca, label: 'Annulées',   color: B.inkMute, bg: '#F5F5F5'   },
  ]

  return (
    <>
      <style>{`
        .hero-content { display: flex; align-items: center; gap: 40px; flex-wrap: wrap; }
        .hero-chips   { display: flex; gap: 12px; flex-wrap: wrap; flex: 1; min-width: 0; }
        .hero-divider { width: 1px; height: 100px; background: #E8E8E8; flex-shrink: 0; align-self: center; }
        .chip-num     { font-size: 44px; }
        @media (max-width: 640px) {
          .hero-content { gap: 24px; }
          .hero-divider { display: none; }
          .hero-chips   { min-width: 100%; }
          .chip-num     { font-size: 36px; }
        }
      `}</style>
      <Card onClick={onClick} padding={0} style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {/* Body */}
          <div style={{ padding: 'clamp(20px,4vw,36px) clamp(20px,4vw,40px)' }}>

            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <PulseDot />
              <span style={{ fontSize: 11, fontWeight: 900, color: B.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                En direct
              </span>
            </div>

            {/* Content row */}
            <div className="hero-content">

              {/* Big number */}
              <div style={{ flex: '0 0 auto' }}>
                <span style={{
                  fontSize: 'clamp(72px,11vw,160px)', fontWeight: 900,
                  color: B.black, lineHeight: 0.88,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-6px',
                  fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui", display: 'block',
                }}>
                  {n}
                </span>
                <p style={{ margin: '14px 0 0', fontSize: 16, fontWeight: 800, color: B.blackSoft }}>
                  réservations aujourd'hui
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <Users size={13} color={B.inkMute} strokeWidth={2} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: B.inkMute }}>
                    ~{(value * 2.3).toFixed(0)} couverts estimés
                  </span>
                </div>
              </div>

              <div className="hero-divider" />
              <OccupancyRing rate={rate} />
              <div className="hero-divider" />

              {/* Status chips */}
              <div className="hero-chips">
                {statuses.map(({ icon, val, label, color, bg }) => (
                  <div key={label} style={{ flex: '1 1 80px', background: bg, borderRadius: 14, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <IBox icon={icon} color={color} bg="transparent" size={13} />
                      <span style={{ fontSize: 10, fontWeight: 900, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
                    </div>
                    <p className="chip-num" style={{
                      margin: 0, fontWeight: 900,
                      color: B.black, lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
                      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
                    }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Single clear action footer — the ONLY click indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px clamp(20px,4vw,40px)',
            background: hov ? B.brown : '#F0F0F0',
            transition: 'background 0.2s ease',
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: hov ? '#fff' : B.blackSoft, transition: 'color 0.2s' }}>
              Gérer les réservations
            </span>
            <ArrowRight size={18} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute}
              style={{ transition: 'color 0.2s, transform 0.2s', transform: hov ? 'translateX(4px)' : 'none', flexShrink: 0 }} />
          </div>
        </div>
      </Card>
    </>
  )
}