import { useState, useEffect } from 'react'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_BG = '#fdf6ec'
const CREAM   = '#faf8f5'

export default function BarChart({ data = {}, title, subtitle, color = GOLD, animate = true }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 120); return () => clearTimeout(id) }, [])

  const entries = Object.entries(data)
  if (entries.length === 0) {
    return (
      <div style={{ background: '#fff', border: `1px solid rgba(43,33,24,0.1)`, padding: '28px 24px' }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(43,33,24,0.35)', marginBottom: 20 }}>{subtitle}</div>}
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'rgba(43,33,24,0.18)' }}>
          Aucune donnée
        </div>
      </div>
    )
  }

  const max     = Math.max(...entries.map(([, v]) => v), 1)
  const total   = entries.reduce((s, [, v]) => s + v, 0)
  const topVal  = max
  const topKey  = entries.find(([, v]) => v === max)?.[0]

  return (
    <div style={{ background: '#fff', border: `1px solid rgba(43,33,24,0.1)`, padding: '24px 20px', flex: 1, minWidth: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(43,33,24,0.4)' }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: DARK, letterSpacing: '-1px', lineHeight: 1 }}>{topVal}</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(43,33,24,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>max · {topKey}</div>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: entries.length > 20 ? 2 : entries.length > 12 ? 3 : 5, height: 140, marginBottom: 8 }}>
        {entries.map(([label, value], i) => {
          const pct    = (value / max) * 100
          const isTop  = value === max
          const barH   = Math.max(animate && mounted ? pct : 0, animate && !mounted ? 0 : pct)
          return (
            <div key={label} title={`${label}: ${value}`}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 0, height: '100%', minWidth: 0 }}>
              {/* value on top */}
              <span style={{
                fontSize: 9, fontWeight: 900, color: isTop ? DARK : 'transparent',
                height: 14, lineHeight: '14px', textAlign: 'center', width: '100%',
                fontVariantNumeric: 'tabular-nums', marginBottom: 3,
              }}>
                {isTop ? value : ''}
              </span>
              {/* bar */}
              <div style={{
                width: '100%',
                height: `${Math.max(pct, 2)}%`,
                background: isTop ? DARK : color,
                transition: animate ? 'height 0.7s cubic-bezier(0.22,1,0.36,1)' : 'none',
                opacity: 0.85 + (value / max) * 0.15,
              }} />
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', gap: entries.length > 20 ? 2 : entries.length > 12 ? 3 : 5 }}>
        {entries.map(([label]) => (
          <div key={label} style={{
            flex: 1, textAlign: 'center', fontSize: entries.length > 20 ? 7 : 9,
            fontWeight: 800, color: 'rgba(43,33,24,0.4)', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Footer total */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(43,33,24,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(43,33,24,0.4)' }}>Total</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: DARK }}>{total}</span>
      </div>
    </div>
  )
}