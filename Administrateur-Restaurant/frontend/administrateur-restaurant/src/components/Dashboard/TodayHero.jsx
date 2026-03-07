import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const n  = useCountUp(value,     750, 100)
  const c  = useCountUp(confirmed, 650, 250)
  const p  = useCountUp(pending,   650, 320)
  const ca = useCountUp(cancelled, 650, 390)

  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [bar, setBar] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBar(rate), 800)
    return () => clearTimeout(t)
  }, [rate])

  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: B.surface,
        border: `1px solid ${hov ? B.borderHov : B.border}`,
        borderRadius: 12,
        padding: '24px 24px 20px',
        cursor: 'pointer',
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Live dot */}
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#10b981', opacity: 0.4,
              animation: 'pulse-ring 1.6s ease infinite',
            }} />
            <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'block' }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: B.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            En direct · Aujourd'hui
          </span>
        </div>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600, color: B.warm,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          Voir tout <ArrowRight size={12} color={B.warm} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main content: big number + status boxes side by side */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>

        {/* Big number */}
        <div style={{ minWidth: 120 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span style={{
              fontSize: 'clamp(56px, 8vw, 80px)', fontWeight: 700,
              color: B.text, lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-1.5px',
            }}>
              {n}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 500, color: B.textSub }}>réservations ce soir</p>
        </div>

        {/* 3 status pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
          {[
            { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.green,  bg: B.greenBg,  bdr: B.greenBdr },
            { Icon: Clock,        val: p,  label: 'En attente', color: B.amber,  bg: B.amberBg,  bdr: B.amberBdr },
            { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.red,    bg: B.redBg,    bdr: B.redBdr   },
          ].map(({ Icon, val, label, color, bg, bdr }) => (
            <div key={label} style={{
              background: bg,
              border: `1px solid ${bdr}`,
              borderRadius: 10,
              padding: '12px 16px',
              minWidth: 110,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Icon size={13} color={color} strokeWidth={2.2} />
                <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.04em' }}>{label}</span>
              </div>
              <p style={{
                margin: 0, fontSize: 26, fontWeight: 700,
                color: B.text, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: B.textMute, fontWeight: 500 }}>Taux de confirmation</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: B.warm,
            background: B.tint, padding: '2px 7px', borderRadius: 20,
          }}>
            {rate}%
          </span>
        </div>
        <div style={{ height: 5, background: B.bg, borderRadius: 99, overflow: 'hidden', border: `1px solid ${B.border}` }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${B.mid} 0%, ${B.muted} 100%)`,
            width: `${bar}%`,
            transition: 'width 1s cubic-bezier(0.34,1.3,0.64,1)',
          }} />
        </div>
      </div>

      <style>{`@keyframes pulse-ring { 0%{transform:scale(1);opacity:.4} 70%{transform:scale(2.4);opacity:0} 100%{transform:scale(2.4);opacity:0} }`}</style>
    </div>
  )
}