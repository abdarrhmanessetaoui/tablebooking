import { useState, useEffect } from 'react'
import { Users, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

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

export default function TodayHero({ value, onClick }) {
  const n = useCountUp(value, 900, 80)

  return (
    <div style={{ padding: '8px 0 24px' }}>

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <PulseDot />
        <span style={{ fontSize: 11, fontWeight: 900, color: B.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          En direct
        </span>
      </div>

      {/* Big number */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 'clamp(80px,13vw,160px)', fontWeight: 900,
          color: B.black, lineHeight: 0.88,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-6px',
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
        }}>
          {n}
        </span>
        <div style={{ paddingBottom: 6 }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: B.blackSoft, lineHeight: 1.2 }}>
            réservations<br />aujourd'hui
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Users size={13} color={B.inkMute} strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600, color: B.inkMute }}>
              ~{(value * 2.3).toFixed(0)} couverts estimés
            </span>
          </div>
        </div>
      </div>

      {/* Link */}
      {onClick && (
        <button
          onClick={onClick}
          style={{
            marginTop: 22,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'none', border: 'none', padding: 0,
            fontSize: 13, fontWeight: 800, color: B.brown,
            cursor: 'pointer', letterSpacing: '-0.1px',
          }}
        >
          Gérer les réservations
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}