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
        border: `1.5px solid ${hov ? B.borderHov : B.border}`,
        borderRadius: 14,
        padding: '24px 26px 22px',
        cursor: 'pointer',
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease',
        boxShadow: hov
          ? '0 6px 24px rgba(160,124,56,0.12)'
          : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#16a34a', opacity: 0.4,
              animation: 'pulse-ring 1.6s ease infinite',
            }} />
            <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#16a34a', display: 'block' }} />
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: B.textMute,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            En direct · Aujourd'hui
          </span>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, fontWeight: 700, color: B.warm,
          background: B.tint, border: `1px solid ${B.tintBdr}`,
          borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
        }}>
          Voir tout <ArrowRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Big number + status side by side */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 36, flexWrap: 'wrap' }}>

        {/* Big number */}
        <div style={{ minWidth: 110 }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(60px, 8vw, 88px)',
            fontWeight: 800,
            color: B.text,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-2px',
          }}>
            {n}
          </span>
          <p style={{ margin: '8px 0 0', fontSize: 15, fontWeight: 700, color: B.textSub }}>
            réservations ce soir
          </p>
        </div>

        {/* 3 status boxes */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
          {[
            { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.green, bg: B.greenBg, bdr: B.greenBdr },
            { Icon: Clock,        val: p,  label: 'En attente', color: B.amber, bg: B.amberBg, bdr: B.amberBdr },
            { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.red,   bg: B.redBg,   bdr: B.redBdr   },
          ].map(({ Icon, val, label, color, bg, bdr }) => (
            <div key={label} style={{
              background: bg, border: `1.5px solid ${bdr}`,
              borderRadius: 11, padding: '13px 18px', minWidth: 108,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 9 }}>
                <Icon size={13} color={color} strokeWidth={2.5} />
                <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {label}
                </span>
              </div>
              <p style={{
                margin: 0, fontSize: 30, fontWeight: 800,
                color: B.text, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.5px',
              }}>
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: B.textMute }}>
            Taux de confirmation
          </span>
          <span style={{
            fontSize: 12, fontWeight: 800, color: B.warm,
            background: B.tint, border: `1px solid ${B.tintBdr}`,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {rate}%
          </span>
        </div>
        <div style={{ height: 6, background: B.bg, borderRadius: 99, overflow: 'hidden', border: `1px solid ${B.border}` }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${B.mid} 0%, ${B.muted} 100%)`,
            width: `${bar}%`,
            transition: 'width 1s cubic-bezier(0.34,1.3,0.64,1)',
          }} />
        </div>
      </div>

      <style>{`@keyframes pulse-ring{0%{transform:scale(1);opacity:.4}70%{transform:scale(2.4);opacity:0}100%{transform:scale(2.4);opacity:0}}`}</style>
    </div>
  )
}