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
          borderRadius: 18,
          padding: '26px 28px',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Icon + arrow row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color={iconColor} strokeWidth={2.2} />
          </div>
          {onClick && (
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: B.pageBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowUpRight size={18} color={B.inkMute} strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Number */}
        <p style={{
          margin: 0,
          fontSize: 56, fontWeight: 900,
          color: B.black, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-3px',
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
        }}>
          {n}
        </p>

        {/* Label */}
        <p style={{
          margin: '10px 0 0',
          fontSize: 15, fontWeight: 800,
          color: B.inkSub, lineHeight: 1.3,
        }}>
          {label}
        </p>

        {/* Trend badge */}
        {trend && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            marginTop: 12, padding: '6px 12px',
            background: B.brownTint,
            borderRadius: 99, width: 'fit-content',
          }}>
            <TrendingUp size={12} color={B.brown} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 800, color: B.brown }}>{trend}</span>
          </div>
        )}

        {/* Big action button at bottom if clickable */}
        {onClick && (
          <button style={{
            marginTop: 'auto', paddingTop: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '13px 0',
            background: B.pageBg, border: 'none',
            borderRadius: 12, marginTop: 16,
            fontSize: 13, fontWeight: 800, color: B.blackSoft,
            cursor: 'pointer',
          }}>
            Voir le détail <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </FadeUp>
  )
}