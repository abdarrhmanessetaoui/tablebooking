import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'

export default function WeekChart({ todayCount }) {
  const values  = [38, 65, 42, 80, 59, 92, Math.min(Math.max(Math.round((todayCount / 10) * 100), 8), 100)]
  const days    = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const [bars, setBars] = useState(values.map(() => 0))
  const [hovI, setHovI] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setBars(values), 350)
    return () => clearTimeout(t)
  }, [todayCount])

  const maxVal = Math.max(...values)
  const avg    = Math.round(values.slice(0, 6).reduce((a, b) => a + b, 0) / 6)

  return (
    <div style={{
      background: B.surface,
      borderRadius: 16,
      padding: '22px 24px 20px',
      height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: B.ink }}>Cette semaine</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: B.inkMute }}>
            Moy. {avg} rés/jour · 7 derniers jours
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: B.confirmedBg,
          borderRadius: 10, padding: '6px 12px',
        }}>
          <TrendingUp size={13} color={B.confirmed} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 800, color: B.confirmed }}>+12%</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-end', height: 115 }}>
        {bars.map((val, i) => {
          const isToday = i === 6
          const isHov   = hovI === i
          const pct     = maxVal > 0 ? (val / maxVal) * 100 : 0
          const count   = Math.round((val / 100) * (todayCount > 0 ? todayCount : 80))

          return (
            <div
              key={i}
              style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', cursor: 'default' }}
              onMouseEnter={() => setHovI(i)}
              onMouseLeave={() => setHovI(null)}
            >
              {isHov && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 5px)',
                  background: B.ink, color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  padding: '4px 9px', borderRadius: 7,
                  whiteSpace: 'nowrap', pointerEvents: 'none',
                  zIndex: 10,
                }}>
                  {count} rés.
                </div>
              )}
              <div style={{
                width: '100%',
                height: `${pct}%`,
                minHeight: 5,
                borderRadius: '6px 6px 3px 3px',
                background: isToday ? B.gold : isHov ? '#D1D5DB' : '#F0F0F0',
                transition: `height 0.65s cubic-bezier(0.34,1.2,0.64,1) ${i * 52}ms, background 0.15s`,
              }} />
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 9, marginTop: 11 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontSize: 11,
              fontWeight: i === 6 ? 900 : 600,
              color: i === 6 ? B.gold : B.inkMute,
            }}>
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}