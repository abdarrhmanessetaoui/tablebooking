import { B } from '../../utils/brand'
import IBox from './IBox'
import useCountUp from '../../hooks/Dashboard/useCountUp'

// Small non-clickable status card — just info, no action
export default function StatusChip({ icon, iconColor, iconBg, value, label, delay = 0 }) {
  const n = useCountUp(value, 750, delay)
  return (
    <div style={{
      background: iconBg,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <IBox icon={icon} color={iconColor} bg="transparent" size={14} />
        <span style={{ fontSize: 11, fontWeight: 900, color: iconColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <p style={{
        margin: 0, fontSize: 48, fontWeight: 900,
        color: B.black, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
      }}>
        {n}
      </p>
    </div>
  )
}