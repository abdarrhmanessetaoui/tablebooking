import { useState, useEffect } from 'react'
import { TrendingUp, BarChart2 } from 'lucide-react'
import { B } from '../../utils/brand'

export default function WeekChart({ todayCount }) {
  const rawTargets = [38, 64, 45, 82, 58, 94, Math.min(Math.max((todayCount / 10) * 100, 10), 100)]
  const days       = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
  const [h, setH]  = useState(rawTargets.map(() => 0))

  useEffect(() => {
    const t = setTimeout(() => setH(rawTargets), 300)
    return () => clearTimeout(t)
  }, [todayCount])

  const maxVal = Math.max(...rawTargets)

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
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:40, height:40, borderRadius:11,
            background: B.goldLight, border:`1.5px solid ${B.goldBdr}`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <BarChart2 size={20} color={B.gold} strokeWidth={2} />
          </div>
          <div>
            <p style={{ margin:0, fontSize:17, fontWeight:800, color: B.text }}>Cette semaine</p>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:600, color: B.textMute }}>7 derniers jours</p>
          </div>
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background: B.greenBg, border:`1.5px solid ${B.greenBdr}`,
          borderRadius:9, padding:'7px 14px',
        }}>
          <TrendingUp size={15} color={B.greenSolid} strokeWidth={2.5} />
          <span style={{ fontSize:13, fontWeight:800, color: B.greenSolid }}>+12%</span>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:110, marginBottom:10 }}>
        {h.map((val, i) => {
          const isToday = i === 6
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
          return (
            <div key={i} style={{ flex:1, height:'100%', display:'flex', alignItems:'flex-end' }}>
              <div style={{
                width:'100%', height:`${pct}%`, minHeight:6,
                borderRadius:'6px 6px 4px 4px',
                background: isToday
                  ? `linear-gradient(180deg, ${B.goldBdr} 0%, ${B.gold} 50%, ${B.goldHov} 100%)`
                  : B.bg,
                border: `1.5px solid ${isToday ? 'transparent' : B.border}`,
                transition:`height 0.65s cubic-bezier(0.34,1.2,0.64,1) ${i*50}ms`,
                boxShadow: isToday ? `0 6px 18px ${B.gold}50` : 'none',
              }} />
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div style={{ display:'flex', gap:8 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex:1, textAlign:'center' }}>
            <span style={{
              fontSize:12, fontWeight: i===6 ? 900 : 700,
              color: i===6 ? B.gold : B.textMute,
              background: i===6 ? B.goldLight : 'transparent',
              padding: i===6 ? '2px 6px' : '2px 0',
              borderRadius: i===6 ? 5 : 0,
            }}>
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}