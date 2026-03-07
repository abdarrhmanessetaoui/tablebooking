import { useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, sub, trend, onClick, delay = 0 }) {
  const n = useCountUp(value, 800, delay + 100)
  const [hov, setHov] = useState(false)

  return (
    <FadeUp delay={delay} style={{ height:'100%' }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: B.surface,
          border: `1.5px solid ${hov ? B.borderMed : B.border}`,
          borderRadius: 18,
          padding: '22px 24px 20px',
          cursor: onClick ? 'pointer' : 'default',
          height:'100%', boxSizing:'border-box',
          display:'flex', flexDirection:'column', gap:0,
          transition:'all 0.2s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: hov && onClick
            ? '0 12px 36px rgba(0,0,0,0.10)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          transform: hov && onClick ? 'translateY(-3px)' : 'none',
          position:'relative', overflow:'hidden',
        }}
      >
        {/* Hover gold top bar */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:3,
          background:`linear-gradient(90deg, ${B.goldDark}, ${B.goldLight})`,
          opacity: hov && onClick ? 1 : 0,
          transition:'opacity 0.2s ease',
          borderRadius:'18px 18px 0 0',
        }} />

        {/* Icon row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{
            width:46, height:46, borderRadius:14,
            background: iconBg,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon size={22} color={iconColor} strokeWidth={2.1} />
          </div>
          {onClick && (
            <div style={{
              width:32, height:32, borderRadius:9,
              background: hov ? B.goldTint : B.pageBg,
              border:`1.5px solid ${hov ? B.goldBorder : B.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.15s',
            }}>
              <ArrowUpRight size={16} color={hov ? B.gold : B.inkMute} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Number */}
        <p style={{
          margin:0,
          fontSize:52, fontWeight:900,
          color: B.ink, lineHeight:1,
          fontVariantNumeric:'tabular-nums',
          letterSpacing:'-2px',
          fontFamily:"'Plus Jakarta Sans', 'DM Sans', system-ui",
        }}>
          {n}
        </p>

        {/* Label */}
        <p style={{
          margin:'10px 0 0',
          fontSize:14, fontWeight:700,
          color: B.inkSub, lineHeight:1.3,
        }}>
          {label}
        </p>

        {/* Optional trend badge */}
        {trend && (
          <div style={{
            display:'flex', alignItems:'center', gap:4,
            marginTop:10, padding:'4px 9px',
            background: B.confirmedBg, border:`1px solid ${B.confirmedBd}`,
            borderRadius:99, width:'fit-content',
          }}>
            <TrendingUp size={11} color={B.confirmed} strokeWidth={2.5} />
            <span style={{ fontSize:11, fontWeight:700, color: B.confirmed }}>{trend}</span>
          </div>
        )}
      </div>
    </FadeUp>
  )
}