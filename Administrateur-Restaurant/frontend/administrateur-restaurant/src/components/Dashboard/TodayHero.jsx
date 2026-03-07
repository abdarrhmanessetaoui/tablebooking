import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Users, ChevronRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

/* ── Pulsing live dot ─────────────────────────────────────────────────── */
function PulseDot() {
  return (
    <>
      <span style={{ position: 'relative', display: 'inline-flex', width: 12, height: 12, flexShrink: 0 }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: B.brown, opacity: 0.35,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{
          width: 12, height: 12, borderRadius: '50%',
          background: B.brown, display: 'block', position: 'relative',
        }} />
      </span>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50%       { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </>
  )
}

/* ── Occupancy ring ───────────────────────────────────────────────────── */
function OccupancyRing({ rate, size = 130 }) {
  const [animRate, setAnimRate] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimRate(rate), 600)
    return () => clearTimeout(t)
  }, [rate])

  const r = 52, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash  = (animRate / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EBEBEB" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={B.brown} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.34,1.3,0.64,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: B.black, lineHeight: 1, letterSpacing: '-1px' }}>
          {animRate}%
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, color: B.inkMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          confirmé
        </span>
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const [hov,    setHov]    = useState(false)
  const [pressed, setPressed] = useState(false)
  const [btnHov, setBtnHov] = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)

  const n  = useCountUp(value,     900,  80)
  const c  = useCountUp(confirmed, 750, 200)
  const p  = useCountUp(pending,   750, 300)
  const ca = useCountUp(cancelled, 750, 400)
  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0

  const statuses = [
    { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.black,   bg: '#EFEFEF' },
    { Icon: Clock,        val: p,  label: 'En attente', color: B.brown,   bg: B.brownTint },
    { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.inkMute, bg: '#F5F5F5' },
  ]

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      style={{
        background: B.surface,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
        transform: pressed ? 'scale(0.995)' : 'none',
        userSelect: 'none',
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: '32px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>

          {/* Live badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <PulseDot />
            <span style={{ fontSize: 12, fontWeight: 900, color: B.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              En direct
            </span>
          </div>

          {/* CTA button */}
          <button
            onClick={e => { e.stopPropagation(); onClick() }}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => { setBtnHov(false); setBtnPressed(false) }}
            onMouseDown={e => { e.stopPropagation(); setBtnPressed(true) }}
            onMouseUp={() => setBtnPressed(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '15px 28px',
              background: btnHov ? B.brownDark : B.brown,
              border: 'none', borderRadius: 14,
              fontSize: 15, fontWeight: 900, color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.15s ease, transform 0.1s ease',
              transform: btnPressed ? 'scale(0.96)' : btnHov ? 'translateY(-2px)' : 'none',
              letterSpacing: '-0.2px',
            }}
          >
            Gérer les réservations
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Content row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap', paddingBottom: 36 }}>

          {/* Massive number */}
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              <span style={{
                fontSize: 'clamp(110px,14vw,172px)',
                fontWeight: 900,
                color: B.black,
                lineHeight: 0.88,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-8px',
                fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
              }}>
                {n}
              </span>
            </div>
            <p style={{ margin: '16px 0 0', fontSize: 17, fontWeight: 800, color: B.inkSub }}>
              réservations aujourd'hui
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
              <Users size={14} color={B.inkMute} strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 600, color: B.inkMute }}>
                ~{(value * 2.3).toFixed(0)} couverts estimés
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 120, background: '#EBEBEB', flexShrink: 0, alignSelf: 'center' }} />

          {/* Ring */}
          <OccupancyRing rate={rate} />

          {/* Divider */}
          <div style={{ width: 1, height: 120, background: '#EBEBEB', flexShrink: 0, alignSelf: 'center' }} />

          {/* Status chips */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 280 }}>
            {statuses.map(({ Icon, val, label, color, bg }) => (
              <div key={label} style={{
                flex: '1 1 90px', background: bg,
                borderRadius: 16, padding: '20px 22px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                  <Icon size={14} color={color} strokeWidth={2.5} />
                  <span style={{ fontSize: 11, fontWeight: 900, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </div>
                <p style={{
                  margin: 0, fontSize: 50, fontWeight: 900,
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

      {/* ── Click-me footer strip ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '16px 40px',
        background: hov ? B.brown : '#F2F2F2',
        transition: 'background 0.2s ease',
      }}>
        <span style={{
          fontSize: 13, fontWeight: 800, letterSpacing: '0.02em',
          color: hov ? '#fff' : B.inkMute,
          transition: 'color 0.2s ease',
        }}>
          Voir et gérer toutes les réservations
        </span>
        <ChevronRight
          size={16} strokeWidth={2.5}
          color={hov ? '#fff' : B.inkMute}
          style={{ transition: 'color 0.2s ease, transform 0.2s ease', transform: hov ? 'translateX(3px)' : 'none' }}
        />
      </div>
    </div>
  )
}