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
      borderRadius: 14,
      padding: '20px 22px 18px',
      height: '100%', boxSizing: 'border-box',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: B.text }}>Cette semaine</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 500, color: B.textMute }}>
            Aperçu des 7 derniers jours
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: B.tint, border: `1px solid ${B.tintBdr}`,
          borderRadius: 8, padding: '5px 11px',
        }}>
          <TrendingUp size={13} color={B.warm} strokeWidth={2.2} />
          <span style={{ fontSize: 12, fontWeight: 700, color: B.warm }}>+12%</span>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 90 }}>
        {h.map((val, i) => {
          const isToday = i === 6
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: `${pct}%`,
                minHeight: 5,
                borderRadius: '5px 5px 3px 3px',
                background: isToday
                  ? `linear-gradient(180deg, ${B.muted} 0%, ${B.mid} 100%)`
                  : B.bg,
                border: `1.5px solid ${isToday ? 'transparent' : B.border}`,
                transition: `height 0.6s cubic-bezier(0.34,1.2,0.64,1) ${i * 45}ms`,
                boxShadow: isToday ? `0 4px 12px ${B.warm}50` : 'none',
              }} />
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: 11,
              fontWeight: i === 6 ? 800 : 600,
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