import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import FadeUp from './FadeUp'

export default function StatCard({ icon: Icon, iconColor, iconBg, value, label, onClick, delay = 0 }) {
  const n = useCountUp(value, 700, delay + 150)
  const [hov, setHov] = useState(false)

  return (
    <FadeUp delay={delay} style={{ height:'100%' }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: B.surface,
          border: `1.5px solid ${hov ? B.borderHov : B.border}`,
          borderRadius: 16,
          padding: '22px 24px',
          cursor: onClick ? 'pointer' : 'default',
          height: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 20,
          transition: 'box-shadow 0.18s, border-color 0.18s, transform 0.18s',
          boxShadow: hov && onClick
            ? '0 8px 28px rgba(0,0,0,0.10)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          transform: hov && onClick ? 'translateY(-2px)' : 'none',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Subtle top-left glow on hover */}
        {hov && onClick && (
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:3,
            background:`linear-gradient(90deg, ${B.goldHov}, ${B.goldBdr})`,
            borderRadius:'16px 16px 0 0',
          }} />
        )}

        {/* Icon + arrow */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{
            width:48, height:48, borderRadius:13,
            background: iconBg, border:`1.5px solid ${iconBg}`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon size={22} color={iconColor} strokeWidth={2.2} />
          </div>
          {onClick && (
            <div style={{
              width:32, height:32, borderRadius:9,
              background: hov ? B.goldLight : B.bg,
              border: `1.5px solid ${hov ? B.goldBdr : B.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.15s',
            }}>
              <ArrowUpRight size={16} color={hov ? B.gold : B.textMute} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Value + label */}
        <div>
          <p style={{
            margin: 0,
            fontSize: 46, fontWeight: 900,
            color: B.text, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-2px',
          }}>
            {n}
          </p>
          <p style={{
            margin: '9px 0 0',
            fontSize: 14, fontWeight: 700,
            color: B.textSub,
            lineHeight: 1.3,
          }}>
            {label}
          </p>
        </div>
      </div>
    </FadeUp>
  )
}