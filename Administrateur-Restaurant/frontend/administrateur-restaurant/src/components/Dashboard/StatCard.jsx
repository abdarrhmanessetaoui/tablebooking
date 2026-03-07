import { useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, trend, actionLabel, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false)
  const n = useCountUp(value, 800, delay + 80)

  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <div
        style={{
          background: B.surface,
          borderRadius: 18,
          overflow: 'hidden',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={() => onClick && setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
      >
        <div style={{ padding: '26px 28px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Icon */}
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Icon size={24} color={iconColor} strokeWidth={2.2} />
          </div>

          {/* Number */}
          <p style={{
            margin: 0,
            fontSize: 58, fontWeight: 900,
            color: B.black, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-3px',
            fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
          }}>
            {n}
          </p>

          {/* Label */}
          <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 800, color: B.inkSub }}>
            {label}
          </p>

          {/* Trend */}
          {trend && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 10, padding: '6px 12px',
              background: B.brownTint,
              borderRadius: 99, width: 'fit-content',
            }}>
              <TrendingUp size={12} color={B.brown} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 800, color: B.brown }}>{trend}</span>
            </div>
          )}
        </div>

        {/* Action button — only if clickable, clearly labeled */}
        {onClick && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 28px',
            background: hov ? B.brown : '#F0F0F0',
            transition: 'background 0.18s ease',
          }}>
            <span style={{
              fontSize: 13, fontWeight: 800,
              color: hov ? '#fff' : B.blackSoft,
              transition: 'color 0.18s ease',
            }}>
              {actionLabel || 'Voir le détail'}
            </span>
            <ArrowUpRight
              size={16} strokeWidth={2.5}
              color={hov ? '#fff' : B.inkMute}
              style={{ transition: 'color 0.18s ease' }}
            />
          </div>
        )}
      </div>
    </FadeUp>
  )
}