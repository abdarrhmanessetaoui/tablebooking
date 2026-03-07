import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, sub, onClick, delay = 0 }) {
  const n = useCountUp(value, 700, delay + 150)
  const [hov, setHov] = useState(false)

  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: B.surface,
          border: `1px solid ${hov ? B.borderHov : B.border}`,
          borderRadius: 12,
          padding: '20px 20px 18px',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
          boxShadow: hov && onClick
            ? '0 4px 16px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.04)',
          transform: hov && onClick ? 'translateY(-1px)' : 'none',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: iconBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={17} color={iconColor} strokeWidth={1.9} />
          </div>
          {onClick && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: 7,
              background: hov ? B.bg : 'transparent',
              transition: 'background 0.15s',
            }}>
              <ChevronRight size={14} color={hov ? B.textSub : B.textMute} />
            </div>
          )}
        </div>

        {/* Value + label */}
        <div>
          <p style={{
            margin: 0, fontSize: 32, fontWeight: 700,
            color: B.text, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.5px',
          }}>
            {n}
          </p>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: B.textSub, fontWeight: 500 }}>{label}</p>
          {sub && <p style={{ margin: '3px 0 0', fontSize: 11, color: B.textMute }}>{sub}</p>}
        </div>
      </div>
    </FadeUp>
  )
}