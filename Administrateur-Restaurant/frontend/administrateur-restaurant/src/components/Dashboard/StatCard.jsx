import { useState } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'
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
      <Card onClick={onClick} padding={0} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Body */}
        <div style={{ padding: '26px 28px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <IBox icon={icon} color={iconColor} bg={iconBg} />

          <p style={{
            margin: '20px 0 0',
            fontSize: 60, fontWeight: 900,
            color: B.black, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-3px',
            fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
          }}>
            {n}
          </p>

          <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 800, color: B.blackSoft }}>
            {label}
          </p>

          {trend && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 12, padding: '6px 12px',
              background: B.brownTint, borderRadius: 99, width: 'fit-content',
            }}>
              <TrendingUp size={12} color={B.brown} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 800, color: B.brown }}>{trend}</span>
            </div>
          )}
        </div>

        {/* Footer: clickable = brown action, static = thin line */}
        {clickable ? (
          <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 28px',
              background: hov ? B.brown : '#F0F0F0',
              transition: 'background 0.18s ease',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: hov ? '#fff' : B.blackSoft, transition: 'color 0.18s' }}>
              {actionLabel || 'Voir le détail'}
            </span>
            <ArrowRight size={16} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute}
              style={{ transition: 'color 0.18s, transform 0.18s', transform: hov ? 'translateX(3px)' : 'none', flexShrink: 0 }} />
          </div>
        ) : (
          <div style={{ height: 4, background: '#F0F0F0' }} />
        )}
      </Card>
    </FadeUp>
  )
}