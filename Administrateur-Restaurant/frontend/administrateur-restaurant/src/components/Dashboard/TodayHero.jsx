import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const n  = useCountUp(value,     800, 80)
  const c  = useCountUp(confirmed, 700, 220)
  const p  = useCountUp(pending,   700, 300)
  const ca = useCountUp(cancelled, 700, 380)

  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [bar, setBar] = useState(0)
  useEffect(() => { const t = setTimeout(() => setBar(rate), 900); return () => clearTimeout(t) }, [rate])

  const [hov, setHov] = useState(false)

  const statuses = [
    { Icon: CheckCircle2, val: c,  label: 'Confirmées', color: B.greenSolid, bg: B.greenBg,  bdr: B.greenBdr,  dot: '#16A34A' },
    { Icon: Clock,        val: p,  label: 'En attente', color: B.amberSolid, bg: B.amberBg,  bdr: B.amberBdr,  dot: '#D97706' },
    { Icon: XCircle,      val: ca, label: 'Annulées',   color: B.redSolid,   bg: B.redBg,    bdr: B.redBdr,    dot: '#DC2626' },
  ]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: B.surface,
        border: `1.5px solid ${hov ? B.borderHov : B.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        boxShadow: hov
          ? '0 8px 32px rgba(0,0,0,0.10)'
          : '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0 transparent',
      }}
    >
      {/* Gold top stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${B.goldHov} 0%, ${B.gold} 60%, ${B.goldBdr} 100%)` }} />

      <div style={{ padding: '26px 28px 24px' }}>

        {/* Header row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            {/* Live pulse */}
            <span style={{ position:'relative', display:'inline-flex', width:10, height:10 }}>
              <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#16A34A', opacity:0.35, animation:'hrpulse 1.8s ease infinite' }} />
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#16A34A', display:'block', position:'relative' }} />
            </span>
            <span style={{ fontSize:12, fontWeight:800, color: B.textMute, letterSpacing:'0.11em', textTransform:'uppercase' }}>
              En direct · Aujourd'hui
            </span>
          </div>
          <button style={{
            display:'flex', alignItems:'center', gap:6,
            fontSize:13, fontWeight:700, color: B.gold,
            background: B.goldLight, border:`1.5px solid ${B.goldBdr}`,
            borderRadius:9, padding:'7px 14px', cursor:'pointer',
          }}>
            Voir tout <ArrowUpRight size={14} strokeWidth={2.5} color={B.gold} />
          </button>
        </div>

        {/* Main content row */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:40, flexWrap:'wrap' }}>

          {/* Big number */}
          <div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:12 }}>
              <span style={{
                fontSize:'clamp(80px,10vw,112px)', fontWeight:900,
                color: B.text, lineHeight:1,
                fontVariantNumeric:'tabular-nums', letterSpacing:'-4px',
              }}>{n}</span>
            </div>
            <p style={{ margin:'10px 0 0', fontSize:17, fontWeight:700, color: B.textSub }}>
              réservations ce soir
            </p>
          </div>

          {/* Status cards */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', paddingTop:6 }}>
            {statuses.map(({ Icon, val, label, color, bg, bdr, dot }) => (
              <div key={label} style={{
                background: bg,
                border: `1.5px solid ${bdr}`,
                borderRadius: 14,
                padding: '16px 20px',
                minWidth: 118,
              }}>
                {/* Label row */}
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:dot, flexShrink:0 }} />
                  <span style={{ fontSize:11, fontWeight:800, color, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    {label}
                  </span>
                </div>
                {/* Number */}
                <p style={{
                  margin:0, fontSize:40, fontWeight:900,
                  color: B.text, lineHeight:1,
                  fontVariantNumeric:'tabular-nums', letterSpacing:'-1px',
                }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop:26, paddingTop:22, borderTop:`1.5px solid ${B.divider}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:9 }}>
            <span style={{ fontSize:13, fontWeight:700, color: B.textSub }}>
              Taux de confirmation
            </span>
            <span style={{
              fontSize:14, fontWeight:900, color: B.surface,
              background: B.gold, padding:'3px 12px', borderRadius:99,
            }}>
              {rate}%
            </span>
          </div>
          <div style={{ height:10, background: B.bg, borderRadius:99, overflow:'hidden', border:`1px solid ${B.border}` }}>
            <div style={{
              height:'100%', borderRadius:99,
              background:`linear-gradient(90deg, ${B.goldHov} 0%, ${B.gold} 50%, ${B.goldBdr} 100%)`,
              width:`${bar}%`,
              transition:'width 1.1s cubic-bezier(0.34,1.3,0.64,1)',
              boxShadow:`0 0 10px ${B.gold}60`,
            }} />
          </div>
          {/* Legend */}
          <div style={{ display:'flex', gap:20, marginTop:10 }}>
            {[['#16A34A','Confirmées'],['#D97706','En attente'],['#DC2626','Annulées']].map(([col,lbl]) => (
              <div key={lbl} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:col }} />
                <span style={{ fontSize:12, fontWeight:600, color: B.textMute }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes hrpulse{0%{transform:scale(1);opacity:.35}70%{transform:scale(2.6);opacity:0}100%{transform:scale(2.6);opacity:0}}`}</style>
    </div>
  )
}