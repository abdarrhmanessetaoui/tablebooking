import { useState, useEffect } from 'react'
import { Users, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

function PulseDot() {
  return (
    <>
      <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8, flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.brown, opacity: 0.3, animation: 'livepulse 2s ease-in-out infinite' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.brown, display: 'block', position: 'relative' }} />
      </span>
      <style>{`@keyframes livepulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(2.6);opacity:0}}`}</style>
    </>
  )
}

export default function TodayHero({ value, onClick }) {
  const n = useCountUp(value, 900, 80)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
        <PulseDot />
        <span style={{ fontSize: 11, fontWeight: 900, color: '#9CA3AF', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          En direct
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 'clamp(72px,11vw,140px)', fontWeight: 900,
          color: '#111827', lineHeight: 0.88,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-5px',
          fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui",
        }}>
          {n}
        </span>
        <div style={{ paddingBottom: 4 }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#374151', lineHeight: 1.25 }}>
            réservations<br />aujourd'hui
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
            <Users size={12} color="#9CA3AF" strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>
              ~{(value * 2.3).toFixed(0)} couverts estimés
            </span>
          </div>
        </div>
      </div>

      {onClick && (
        <button
          onClick={onClick}
          style={{
            marginTop: 20,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'none', border: 'none', padding: 0,
            fontSize: 13, fontWeight: 800, color: B.brown,
            cursor: 'pointer',
          }}
        >
          Gérer les réservations
          <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}