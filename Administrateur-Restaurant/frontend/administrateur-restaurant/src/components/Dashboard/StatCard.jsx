import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, trend, onClick, delay = 0 }) {
  const n = useCountUp(value, 800, delay + 80)

  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <div
        onClick={onClick}
        style={{
          background: B.surface,
          borderRadius: 16,
          padding: '22px 24px',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={20} color={iconColor} strokeWidth={2.2} />
          </div>
          {onClick && <ArrowUpRight size={16} color={B.inkMute} strokeWidth={2} />}
        </div>

        <p style={{
          margin: 0,
          fontSize: 48, fontWeight: 900,
          color: B.black, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-2px',
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
        }}>
          {n}
        </p>

        <p style={{ margin: '9px 0 0', fontSize: 13, fontWeight: 700, color: B.inkSub }}>
          {label}
        </p>

        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            marginTop: 10, padding: '4px 9px',
            background: B.brownTint,
            borderRadius: 99, width: 'fit-content',
          }}>
            <TrendingUp size={11} color={B.brown} strokeWidth={2.5} />
            <span style={{ fontSize: 11, fontWeight: 700, color: B.brown }}>{trend}</span>
          </div>
        )}
      </div>
    </FadeUp>
  )
}