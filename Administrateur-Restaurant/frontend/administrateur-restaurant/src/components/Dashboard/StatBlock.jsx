
import {
  wrapper, labelRow, labelText,
  valueRow, valueNumber,
  progressRow, progressTrack,
  progressFill, progressPct,
} from '../../styles/dashboard/statBlock.styles'

export default function StatBlock({ value, label, accent, bg, delay = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : null
    const w = pct ?? 0

  return (
    <div style={wrapper(bg, accent)}>

      {/* Label */}
      <div style={labelRow}>
        <span style={labelText(accent)}>{label}</span>
      </div>

      {/* Number */}
      <div style={valueRow}>
        <span style={valueNumber}>{value}</span>
      </div>

      {/* Progress bar + pct */}
      {pct !== null && (
        <div style={progressRow}>
          <div style={progressTrack}>
            <div style={progressFill(w, accent)} />
          </div>
          <span style={progressPct(accent)}>{pct}%</span>
        </div>
      )}

    </div>
  )
}