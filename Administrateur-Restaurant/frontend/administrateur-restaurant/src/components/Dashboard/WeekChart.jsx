import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'

export default function WeekChart({ todayCount }) {
  const targets = [42, 61, 38, 78, 55, 90, Math.min(Math.max((todayCount / 10) * 100, 10), 100)]
  const days    = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const [h, setH] = useState(targets.map(() => 0))

  useEffect(() => {
    const t = setTimeout(() => setH(targets), 300)
    return () => clearTimeout(t)
  }, [todayCount])

  const maxVal = Math.max(...targets)

  return (
    <div style={{
      background: B.surface,
      border: `1.5px solid ${B.border}`,
      borderRadius: 16,
      padding: '22px 24px 20px',
      height: '100%', boxSizing: 'border-box',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: B.text }}>Cette semaine</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: B.textMute }}>
            Aperçu des 7 derniers jours
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: B.tint, border: `1.5px solid ${B.tintBdr}`,
          borderRadius: 9, padding: '6px 13px',
        }}>
          <TrendingUp size={15} color={B.warm} strokeWidth={2.2} />
          <span style={{ fontSize: 13, fontWeight: 800, color: B.warm }}>+12%</span>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
        {h.map((val, i) => {
          const isToday = i === 6
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${pct}%`, minHeight: 6,
                borderRadius: '6px 6px 4px 4px',
                background: isToday
                  ? `linear-gradient(180deg, ${B.muted} 0%, ${B.mid} 100%)`
                  : B.bg,
                border: `1.5px solid ${isToday ? 'transparent' : B.border}`,
                transition: `height 0.6s cubic-bezier(0.34,1.2,0.64,1) ${i * 45}ms`,
                boxShadow: isToday ? `0 4px 14px ${B.warm}55` : 'none',
              }} />
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: 12,
              fontWeight: i === 6 ? 900 : 700,
              color: i === 6 ? B.warm : B.textMute,
            }}>
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}