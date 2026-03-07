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
      border: `1px solid ${B.border}`,
      borderRadius: 12,
      padding: '20px 20px 16px',
      height: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: B.text }}>Cette semaine</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: B.textMute }}>Aperçu des 7 derniers jours</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: B.tint, border: `1px solid #FED7AA`,
          borderRadius: 8, padding: '5px 10px',
        }}>
          <TrendingUp size={13} color={B.warm} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 600, color: B.warm }}>+12%</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 88 }}>
        {h.map((val, i) => {
          const isToday = i === 6
          const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: `${heightPct}%`,
                minHeight: 4,
                borderRadius: '4px 4px 3px 3px',
                background: isToday
                  ? `linear-gradient(180deg, ${B.muted} 0%, ${B.mid} 100%)`
                  : B.bg,
                border: `1px solid ${isToday ? 'transparent' : B.border}`,
                transition: `height 0.6s cubic-bezier(0.34,1.2,0.64,1) ${i * 45}ms`,
                boxShadow: isToday ? `0 3px 10px ${B.warm}40` : 'none',
              }} />
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: 11, fontWeight: i === 6 ? 700 : 500,
              color: i === 6 ? B.warm : B.textMute,
            }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}