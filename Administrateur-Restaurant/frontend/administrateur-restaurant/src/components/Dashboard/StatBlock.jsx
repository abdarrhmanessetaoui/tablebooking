import { useState, useEffect } from 'react'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import {
  wrapper, labelRow, labelText,
  valueRow, valueNumber,
  progressRow, progressTrack,
  progressFill, progressPct,
} from '../../styles/dashboard/statBlock.styles'

export default function StatBlock({ icon: Icon, value, label, accent, bg, delay = 0, total = 0 }) {
  const n   = useCountUp(value, 700, delay)
  const pct = total > 0 ? Math.round((value / total) * 100) : null
  const [w, setW] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setW(pct ?? 0), 440)
    return () => clearTimeout(id)
  }, [pct])

  return (
    <div style={wrapper(bg, accent)}>

      {/* Label */}
      <div style={labelRow}>
        <Icon size={10} strokeWidth={2.5} color="rgba(255,255,255,0.75)" />
        <span style={labelText()}>{label}</span>
      </div>

      {/* Number */}
      <div style={valueRow}>
        <span style={valueNumber}>{n}</span>
      </div>

      {/* Progress bar + pct */}
      {pct !== null && (
        <div style={progressRow}>
          <div style={progressTrack}>
            <div style={progressFill(w)} />
          </div>
          <span style={progressPct()}>{pct}%</span>
        </div>
      )}

    </div>
  )
}