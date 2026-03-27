import { useTranslation } from 'react-i18next'
import {
  ringWrapper, svg, trackCircle,
  segment, centerOverlay, centerPct, centerLabel,
} from '../../styles/dashboard/ring.styles'
import { GREEN, RED, GOLD, DARK } from '../../styles/dashboard/tokens'

export default function Ring({ c, p, a, size = 88 }) {
  const { t } = useTranslation()
  const total = c + p + a || 1
  const pct   = Math.round((c / total) * 100)
  const r     = 30
  const circ  = 2 * Math.PI * r

  const segs = [
    { v: c, color: GREEN },
    { v: p, color: GOLD  },
    { v: a, color: RED   },
  ]

  let off = 0

  return (
    <div style={ringWrapper(size)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        style={svg(size)}
      >
        <circle cx="36" cy="36" r={r} {...trackCircle} />
        {segs.map((s, i) => {
          if (!s.v) { off += (s.v / total) * circ; return null }
          const arc = (s.v / total) * circ
          const el  = (
            <circle
              key={i}
              cx="36" cy="36" r={r}
              style={segment(arc, circ, off, s.color, i)}
            />
          )
          off += arc
          return el
        })}
      </svg>

      {/* Center label */}
      <div style={centerOverlay}>
        <span style={centerPct}>{pct}%</span>
        <span style={centerLabel}>{t('confirmed_plural')}</span>
      </div>
    </div>
  )
}
