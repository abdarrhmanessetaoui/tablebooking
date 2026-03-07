import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Users } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

function OccupancyRing({ rate, size = 120 }) {
  const [animRate, setAnimRate] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimRate(rate), 500)
    return () => clearTimeout(t)
  }, [rate])

  const r = 48, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = (animRate / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EBEBEB" strokeWidth={9} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={B.brown} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.3,0.64,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: B.black, lineHeight: 1 }}>{animRate}%</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: B.inkMute, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          confirmé
        </span>
      </div>
    </div>
  )
}

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const [hov, setHov] = useState(false)
  const [btnHov, setBtnHov] = useState(false)

  const n  = useCountUp(value,     900, 80)
  const c  = useCountUp(confirmed, 750, 200)
  const p  = useCountUp(pending,   750, 300)
  const ca = useCountUp(cancelled, 750, 400)
  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0

  const stats = [
    { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.black,   bg: '#F0F0F0' },
    { Icon: Clock,        val: p,  label: 'En attente', color: B.brown,   bg: B.brownTint },
    { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.inkMute, bg: '#F5F5F5' },
  ]

  return (
    <div
      style={{
        background: hov ? '#FAFAFA' : B.surface,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <div style={{ padding: '36px 40px 34px' }}>

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: B.brown, display: 'inline-block',
              boxShadow: `0 0 0 4px ${B.brownTint}`,
            }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: B.inkMute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              En direct
            </span>
          </div>

          {/* CLEAR CTA button with hover */}
          <button
            onClick={onClick}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: btnHov ? B.brownDark : B.brown,
              border: 'none', borderRadius: 14,
              padding: '15px 26px',
              fontSize: 15, fontWeight: 900, color: '#fff',
              cursor: 'pointer', letterSpacing: '-0.2px',
              transition: 'background 0.15s ease, transform 0.1s ease',
              transform: btnHov ? 'translateY(-2px)' : 'none',
            }}
          >
            Voir les réservations
            <ArrowUpRight size={18} strokeWidth={2.5} color="#fff" />
          </button>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 52, flexWrap: 'wrap' }}>

          {/* HUGE number — clicking hint */}
          <div style={{ flex: '0 0 auto' }}>
            <span style={{
              fontSize: 'clamp(120px,15vw,180px)',
              fontWeight: 900,
              color: B.black,
              lineHeight: 0.85,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-8px',
              fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
              display: 'block',
              transition: 'color 0.15s',
            }}>
              {n}
            </span>
            <p style={{ margin: '18px 0 0', fontSize: 17, fontWeight: 800, color: B.inkSub }}>
              réservations aujourd'hui
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
              <Users size={14} color={B.inkMute} strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 600, color: B.inkMute }}>
                ~{(value * 2.3).toFixed(0)} couverts estimés
              </span>
            </div>
          </div>

          {/* Ring */}
          <OccupancyRing rate={rate} />

          {/* Status chips */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 280 }}>
            {stats.map(({ Icon, val, label, color, bg }) => (
              <div key={label} style={{
                flex: '1 1 88px',
                background: bg,
                borderRadius: 16, padding: '20px 22px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                  <Icon size={15} color={color} strokeWidth={2.5} />
                  <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </div>
                <p style={{
                  margin: 0, fontSize: 52, fontWeight: 900,
                  color: B.black, lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
                  fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
                }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom click hint bar — makes it OBVIOUS it's clickable */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '14px 40px',
        background: hov ? B.brown : '#F5F5F5',
        transition: 'background 0.2s ease',
      }}>
        <span style={{
          fontSize: 13, fontWeight: 800,
          color: hov ? '#fff' : B.inkMute,
          letterSpacing: '0.04em',
          transition: 'color 0.2s ease',
        }}>
          Appuyez pour gérer les réservations
        </span>
        <ArrowUpRight size={15} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute} style={{ transition: 'color 0.2s' }} />
      </div>
    </div>
  )
}