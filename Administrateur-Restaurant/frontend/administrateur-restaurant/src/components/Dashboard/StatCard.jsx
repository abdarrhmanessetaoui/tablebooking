import { ArrowRight, TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'
import IBox from './IBox'

export default function StatCard({
  icon, iconColor, iconBg,
  value, label, trend,
  actionLabel, onClick, delay = 0,
}) {
  const n = useCountUp(value, 800, delay + 80)

  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <div
        onClick={onClick}
        style={{
          height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: '4px 0',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <IBox icon={icon} color={iconColor} bg={iconBg} />

        <p style={{
          margin: '18px 0 0', fontSize: 54, fontWeight: 900,
          color: B.black, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-3px',
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
        }}>
          {n}
        </p>

        <p style={{ margin: '9px 0 0', fontSize: 14, fontWeight: 800, color: B.blackSoft }}>
          {label}
        </p>

        {trend && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            marginTop: 10, padding: '5px 11px',
            background: B.brownTint, borderRadius: 99, width: 'fit-content',
          }}>
            <TrendingUp size={11} color={B.brown} strokeWidth={2.5} />
            <span style={{ fontSize: 11, fontWeight: 800, color: B.brown }}>{trend}</span>
          </div>
        )}

        {onClick && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: B.brown }}>
              {actionLabel || 'Voir le détail'}
            </span>
            <ArrowRight size={13} strokeWidth={2.5} color={B.brown} />
          </div>
        )}
      </div>
    </FadeUp>
  )
}