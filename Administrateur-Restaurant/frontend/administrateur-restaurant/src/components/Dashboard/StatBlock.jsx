import { useState, useEffect } from 'react'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import {
  wrapper, labelRow, labelText,
  valueRow, valueNumber, valuePct,
  progressTrack, progressFill,
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

      {/* Left: label + number */}
      <div>
        <div style={labelRow}>
          <Icon size={10} strokeWidth={2.5} color={accent} />
          <span style={labelText(accent)}>{label}</span>
        </div>
        <div style={valueRow}>
          <span style={valueNumber}>{n}</span>
          {pct !== null && (
            <span style={valuePct(accent)}>{pct}%</span>
          )}
        </div>
      </div>

      {/* Right: mini progress bar */}
      {pct !== null && (
        <div style={progressTrack}>
          <div style={progressFill(w, accent)} />
        </div>
      )}

    </div>
  )
}