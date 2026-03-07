import { useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'
import Card from './Card'
import IBox from './IBox'

export default function StatCard({
  icon, iconColor, iconBg,
  value, label, trend,
  actionLabel, onClick, delay = 0,
}) {
  const [hov, setHov] = useState(false)
  const n = useCountUp(value, 800, delay + 80)
  const clickable = !!onClick

  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <Card
        onClick={onClick}
        padding={0}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Body */}
        <div style={{ padding: '28px 30px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Icon row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
            <IBox icon={icon} color={iconColor} bg={iconBg} />

            {/* Arrow box — only on clickable cards so user knows instantly */}
            {clickable && (
              <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: hov ? B.brown : '#EFEFEF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight size={17} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute}
                  style={{ transition: 'color 0.15s' }} />
              </div>
            )}
          </div>

          {/* Number */}
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
          <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 800, color: B.blackSoft }}>
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

        {/* Footer — clickable cards get a labeled action strip */}
        {clickable ? (
          <ActionStrip label={actionLabel || 'Voir le détail'} />
        ) : (
          <div style={{ height: 4, background: '#F0F0F0', borderRadius: '0 0 20px 20px' }} />
        )}
      </Card>
    </FadeUp>
  )
}

// Shared action strip — same style as TodayHero footer
export function ActionStrip({ label }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '15px 30px',
        background: hov ? B.brown : '#F0F0F0',
        transition: 'background 0.18s ease',
      }}
    >
      <span style={{
        fontSize: 13, fontWeight: 800,
        color: hov ? '#fff' : B.blackSoft,
        transition: 'color 0.18s ease',
      }}>
        {label}
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
  )
}