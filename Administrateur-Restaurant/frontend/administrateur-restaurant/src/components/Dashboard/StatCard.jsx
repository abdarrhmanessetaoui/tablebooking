import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, onClick, delay = 0 }) {
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
          border: `1.5px solid ${hov ? B.warm : B.border}`,
          borderRadius: 16,
          padding: '22px 24px 20px',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 18,
          transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
          boxShadow: hov && onClick
            ? '0 8px 24px rgba(160,124,56,0.13)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          transform: hov && onClick ? 'translateY(-2px)' : 'none',
        }}
      >
        {/* Icon + arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: iconBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color={iconColor} strokeWidth={2} />
          </div>
          {onClick && (
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: hov ? B.tint : 'transparent',
              border: hov ? `1.5px solid ${B.tintBdr}` : '1.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              <ChevronRight size={16} color={hov ? B.warm : B.textMute} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Value + label */}
        <div>
          <p style={{
            margin: 0,
            fontSize: 44, fontWeight: 900,
            color: B.text, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-1.5px',
          }}>
            {n}
          </p>
          <p style={{
            margin: '9px 0 0',
            fontSize: 14, fontWeight: 700,
            color: B.textSub, lineHeight: 1.3,
          }}>
            {label}
          </p>
        </div>
      </div>
    </FadeUp>
  )
}