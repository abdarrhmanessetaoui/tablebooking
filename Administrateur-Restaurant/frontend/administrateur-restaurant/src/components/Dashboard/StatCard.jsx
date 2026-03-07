import { useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, trend, actionLabel, onClick, delay = 0 }) {
  const [hov,     setHov]     = useState(false)
  const [pressed, setPressed] = useState(false)
  const n = useCountUp(value, 800, delay + 80)
  const isClickable = !!onClick

  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <div
        onMouseEnter={() => isClickable && setHov(true)}
        onMouseLeave={() => { setHov(false); setPressed(false) }}
        onMouseDown={() => isClickable && setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onClick={onClick}
        style={{
          background: B.surface,
          borderRadius: 20,
          overflow: 'hidden',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column',
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'transform 0.12s ease',
          transform: pressed ? 'scale(0.97)' : hov ? 'translateY(-3px)' : 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ padding: '28px 30px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Icon + clickable indicator */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16,
              background: iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={26} color={iconColor} strokeWidth={2.2} />
            </div>

            {/* Only show on clickable cards — makes it crystal clear */}
            {isClickable && (
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: hov ? B.brown : '#EFEFEF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s ease',
              }}>
                <ArrowUpRight size={18} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute} style={{ transition: 'color 0.15s' }} />
              </div>
            )}
          </div>

          {/* Big number */}
          <p style={{
            margin: 0,
            fontSize: 64, fontWeight: 900,
            color: B.black, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-3px',
            fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
          }}>
            {n}
          </p>

          {/* Label */}
          <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 800, color: B.inkSub, lineHeight: 1.3 }}>
            {label}
          </p>

          {/* Trend pill */}
          {trend && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 12, padding: '6px 13px',
              background: B.brownTint, borderRadius: 99, width: 'fit-content',
            }}>
              <TrendingUp size={12} color={B.brown} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 800, color: B.brown }}>{trend}</span>
            </div>
          )}
        </div>

        {/* Footer action strip — ONLY on clickable cards */}
        {isClickable && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '15px 30px',
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
              style={{
                transition: 'color 0.18s ease, transform 0.18s ease',
                transform: hov ? 'translate(2px,-2px)' : 'none',
              }}
            />
          </div>
        )}

        {/* Non-clickable: just a subtle bottom accent line */}
        {!isClickable && (
          <div style={{ height: 4, background: '#F0F0F0' }} />
        )}
      </div>
    </FadeUp>
  )
}