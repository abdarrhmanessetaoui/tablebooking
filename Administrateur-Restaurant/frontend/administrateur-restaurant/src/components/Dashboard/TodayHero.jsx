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
        borderRadius: 16,
        padding: '28px 30px 24px',
        cursor: 'pointer',
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease',
        boxShadow: hov ? '0 8px 28px rgba(160,124,56,0.13)' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#16a34a', opacity: 0.4, animation: 'pulse-ring 1.6s ease infinite' }} />
            <span style={{ position: 'relative', width: 10, height: 10, borderRadius: '50%', background: '#16a34a', display: 'block' }} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, color: B.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            En direct · Aujourd'hui
          </span>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 700, color: B.warm,
          background: B.tint, border: `1.5px solid ${B.tintBdr}`,
          borderRadius: 8, padding: '6px 13px', cursor: 'pointer',
        }}>
          Voir tout <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Big number + status boxes */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>

        {/* Number */}
        <div style={{ minWidth: 120 }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(72px, 10vw, 104px)',
            fontWeight: 900,
            color: B.text,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-3px',
          }}>
            {n}
          </span>
          <p style={{ margin: '10px 0 0', fontSize: 17, fontWeight: 700, color: B.textSub }}>
            réservations ce soir
          </p>
        </div>

        {/* Status boxes */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 6 }}>
          {[
            { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.green, bg: B.greenBg, bdr: B.greenBdr },
            { Icon: Clock,        val: p,  label: 'En attente', color: B.amber, bg: B.amberBg, bdr: B.amberBdr },
            { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.red,   bg: B.redBg,   bdr: B.redBdr   },
          ].map(({ Icon, val, label, color, bg, bdr }) => (
            <div key={label} style={{
              background: bg, border: `1.5px solid ${bdr}`,
              borderRadius: 13, padding: '16px 20px', minWidth: 120,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Icon size={15} color={color} strokeWidth={2.5} />
                <span style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {label}
                </span>
              </div>
              <p style={{
                margin: 0, fontSize: 36, fontWeight: 900,
                color: B.text, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-1px',
              }}>
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: B.textSub }}>
            Taux de confirmation
          </span>
          <span style={{
            fontSize: 13, fontWeight: 900, color: B.warm,
            background: B.tint, border: `1.5px solid ${B.tintBdr}`,
            padding: '3px 10px', borderRadius: 20,
          }}>
            {rate}%
          </span>
        </div>
        <div style={{ height: 8, background: B.bg, borderRadius: 99, overflow: 'hidden', border: `1px solid ${B.border}` }}>
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