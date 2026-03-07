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
          border: `1.5px solid ${hov ? B.borderHov : B.border}`,
          borderRadius: 14,
          padding: '20px 22px 18px',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 18,
          transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
          boxShadow: hov && onClick
            ? '0 6px 20px rgba(160,124,56,0.10)'
            : '0 1px 4px rgba(0,0,0,0.05)',
          transform: hov && onClick ? 'translateY(-2px)' : 'none',
        }}
      >
        {/* Icon row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: iconBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} color={iconColor} strokeWidth={2} />
          </div>
          {onClick && (
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: hov ? B.bg : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
              border: hov ? `1px solid ${B.border}` : '1px solid transparent',
            }}>
              <ChevronRight size={14} color={hov ? B.textSub : B.textMute} />
            </div>
          )}
        </div>

        {/* Value + label */}
        <div>
          <p style={{
            margin: 0,
            fontSize: 38, fontWeight: 800,
            color: B.text, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-1px',
          }}>
            {n}
          </p>
          <p style={{
            margin: '7px 0 0',
            fontSize: 13, fontWeight: 600,
            color: B.textSub,
            lineHeight: 1.3,
          }}>
            {label}
          </p>
        </div>
      </div>
    </FadeUp>
  )
}