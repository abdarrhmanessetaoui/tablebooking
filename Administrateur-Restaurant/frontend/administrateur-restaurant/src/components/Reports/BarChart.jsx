import { useState, useEffect } from 'react'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_BG = '#fdf6ec'
const CREAM   = '#faf8f5'

export default function BarChart({ data = {}, title, subtitle, highlight = false }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id) }, [])

  const entries = Object.entries(data)
  const max     = Math.max(...entries.map(([, v]) => v), 1)
  const total   = entries.reduce((s, [, v]) => s + v, 0)
  const topKey  = entries.find(([, v]) => v === max)?.[0] ?? '—'

  if (entries.length === 0) return (
    <div style={{ background: '#fff', border: `2px solid ${DARK}`, padding: '28px 24px' }}>
      <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.4)', marginBottom: 20 }}>{subtitle}</div>}
      <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: 'rgba(43,33,24,0.15)' }}>
        Aucune donnée
      </div>
    </div>
  )

  const gap     = entries.length > 20 ? 2 : entries.length > 12 ? 3 : 6
  const lblSize = entries.length > 20 ? 7 : entries.length > 12 ? 8 : 10

  return (
    <div style={{ background: '#fff', border: `2px solid ${DARK}`, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ padding: '18px 20px 16px', borderBottom: `2px solid ${DARK}`, background: highlight ? DARK : '#fff', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: highlight ? GOLD : GOLD, marginBottom: 5 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 13, fontWeight: 800, color: highlight ? 'rgba(255,255,255,0.7)' : DARK }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: highlight ? '#fff' : DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>{max}</div>
          <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>max · {topKey}</div>
        </div>
      </div>

      {/* ── Bars ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap, height: 160 }}>
          {entries.map(([label, value]) => {
            const pct   = (value / max) * 100
            const isTop = value === max
            return (
              <div key={label} title={`${label}: ${value}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 0, minWidth: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: isTop ? DARK : 'transparent', height: 14, lineHeight: '14px', marginBottom: 3, fontVariantNumeric: 'tabular-nums' }}>
                  {isTop ? value : ''}
                </span>
                <div style={{
                  width: '100%',
                  height: mounted ? `${Math.max(pct, 2)}%` : '2%',
                  background: isTop ? DARK : GOLD,
                  opacity: isTop ? 1 : 0.55 + (value / max) * 0.45,
                  transition: 'height 0.65s cubic-bezier(0.22,1,0.36,1)',
                }} />
              </div>
            )
          })}
        </div>

        {/* X labels */}
        <div style={{ display: 'flex', gap, marginTop: 6, paddingBottom: 16 }}>
          {entries.map(([label]) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', fontSize: lblSize, fontWeight: 800, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 'auto', borderTop: `1px solid rgba(43,33,24,0.1)`, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: CREAM }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: DARK, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: DARK, letterSpacing: '-1px' }}>{total}</span>
      </div>
    </div>
  )
}