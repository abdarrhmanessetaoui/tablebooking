import { useState, useEffect } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'
import { B } from '../../utils/brand'

export default function WeekChart({ todayCount }) {
  const values  = [38, 65, 42, 80, 59, 92, Math.min(Math.max(Math.round((todayCount/10)*100), 8), 100)]
  const days    = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
  const [bars, setBars] = useState(values.map(() => 0))
  const [hovI, setHovI] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setBars(values), 350)
    return () => clearTimeout(t)
  }, [todayCount])

  const maxVal = Math.max(...values)
  const avg    = Math.round(values.slice(0,6).reduce((a,b)=>a+b,0)/6)

  return (
    <div style={{
      background: B.surface,
      border:`1.5px solid ${B.border}`,
      borderRadius:20,
      padding:'24px 26px 22px',
      height:'100%', boxSizing:'border-box',
      boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:44, height:44, borderRadius:13,
            background: B.goldTint, border:`1.5px solid ${B.goldBorder}`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Calendar size={20} color={B.gold} strokeWidth={2} />
          </div>
          <div>
            <p style={{ margin:0, fontSize:17, fontWeight:800, color: B.ink }}>Cette semaine</p>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:600, color: B.inkMute }}>
              Moy. {avg} rés/jour · 7 derniers jours
            </p>
          </div>
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background: B.confirmedBg, border:`1.5px solid ${B.confirmedBd}`,
          borderRadius:10, padding:'7px 14px',
        }}>
          <TrendingUp size={14} color={B.confirmed} strokeWidth={2.5} />
          <span style={{ fontSize:13, fontWeight:800, color: B.confirmed }}>+12%</span>
        </div>
      </div>

      {/* Chart area */}
      <div style={{ display:'flex', gap:10, alignItems:'flex-end', height:120, paddingBottom:0 }}>
        {bars.map((val, i) => {
          const isToday = i === 6
          const isHov   = hovI === i
          const pct     = maxVal > 0 ? (val / maxVal) * 100 : 0
          const count   = Math.round((val/100) * (todayCount > 0 ? todayCount : 80))

          return (
            <div
              key={i}
              style={{ flex:1, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', gap:6, cursor:'default' }}
              onMouseEnter={() => setHovI(i)}
              onMouseLeave={() => setHovI(null)}
            >
              {/* Tooltip */}
              {isHov && (
                <div style={{
                  position:'absolute',
                  background: B.dark, color:'#fff',
                  fontSize:11, fontWeight:700,
                  padding:'5px 10px', borderRadius:8,
                  whiteSpace:'nowrap', pointerEvents:'none',
                  zIndex:10,
                  boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
                }}>
                  {count} rés.
                </div>
              )}
              <div style={{
                width:'100%',
                height:`${pct}%`,
                minHeight:6,
                borderRadius:'7px 7px 4px 4px',
                background: isToday
                  ? `linear-gradient(180deg, ${B.goldLight} 0%, ${B.gold} 60%, ${B.goldDark} 100%)`
                  : isHov
                    ? `linear-gradient(180deg, ${B.borderDark} 0%, ${B.borderMed} 100%)`
                    : B.pageBg,
                border:`1.5px solid ${isToday ? 'transparent' : B.border}`,
                transition:`height 0.7s cubic-bezier(0.34,1.2,0.64,1) ${i*55}ms, background 0.15s`,
                boxShadow: isToday ? `0 6px 20px ${B.gold}55` : 'none',
                position:'relative',
              }}>
                {/* Top shine on today's bar */}
                {isToday && (
                  <div style={{
                    position:'absolute', top:2, left:'25%', right:'25%', height:3,
                    background:'rgba(255,255,255,0.5)', borderRadius:2,
                  }} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div style={{ display:'flex', gap:10, marginTop:12 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex:1, textAlign:'center' }}>
            {i === 6 ? (
              <span style={{
                display:'inline-block',
                fontSize:11, fontWeight:900, color: B.gold,
                background: B.goldTint, border:`1px solid ${B.goldBorder}`,
                padding:'3px 6px', borderRadius:6,
              }}>{d}</span>
            ) : (
              <span style={{ fontSize:11, fontWeight:700, color: B.inkMute }}>{d}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}