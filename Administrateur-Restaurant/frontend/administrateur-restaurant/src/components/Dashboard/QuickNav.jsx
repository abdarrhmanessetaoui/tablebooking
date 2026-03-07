import { useState } from 'react'
import { CalendarDays, ClipboardList, Sunrise, ChevronRight, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'

function NavCard({ icon: Icon, title, sub, badge, onClick, dark = false, accent = false }) {
  const [hov, setHov] = useState(false)

  if (dark) return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? B.darkCard : B.dark,
        borderRadius:16, padding:'20px 22px',
        display:'flex', alignItems:'center', gap:16,
        cursor:'pointer', overflow:'hidden', position:'relative',
        transition:'all 0.2s ease',
        boxShadow: hov ? '0 10px 32px rgba(0,0,0,0.28)' : '0 4px 14px rgba(0,0,0,0.18)',
        border:`1.5px solid ${B.darkBorder}`,
      }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position:'absolute', inset:0, opacity:0.06,
        background:`radial-gradient(ellipse at top-right, ${B.goldLight}, transparent 70%)`,
        pointerEvents:'none',
      }} />
      <div style={{
        width:46, height:46, borderRadius:13, flexShrink:0,
        background:'rgba(255,255,255,0.07)',
        border:'1.5px solid rgba(255,255,255,0.08)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon size={22} color="#E5C97A" strokeWidth={2} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ margin:0, fontSize:15, fontWeight:800, color:'#FFFFFF', letterSpacing:'-0.2px' }}>{title}</p>
        <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:600, color: B.darkMuted }}>{sub}</p>
      </div>
      <div style={{
        width:32, height:32, borderRadius:9, flexShrink:0,
        background:'rgba(255,255,255,0.07)',
        border:'1.5px solid rgba(255,255,255,0.08)',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'transform 0.15s',
        transform: hov ? 'translateX(2px)' : 'none',
      }}>
        <ArrowRight size={15} color={hov ? '#E5C97A' : 'rgba(255,255,255,0.4)'} strokeWidth={2.5} />
      </div>
    </div>
  )

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? B.goldTint : B.surface,
        border:`1.5px solid ${hov ? B.goldBorder : B.border}`,
        borderRadius:16, padding:'18px 22px',
        display:'flex', alignItems:'center', gap:16,
        cursor:'pointer',
        transition:'all 0.18s ease',
        boxShadow: hov ? `0 6px 20px rgba(154,111,46,0.12)` : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{
        width:46, height:46, borderRadius:13, flexShrink:0,
        background: B.goldTint, border:`1.5px solid ${B.goldBorder}`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon size={22} color={B.gold} strokeWidth={2} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ margin:0, fontSize:15, fontWeight:800, color: B.ink }}>{title}</p>
        <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:600, color: B.inkMute }}>{sub}</p>
      </div>
      <div style={{
        width:32, height:32, borderRadius:9, flexShrink:0,
        background: hov ? B.goldTint : B.pageBg,
        border:`1.5px solid ${hov ? B.goldBorder : B.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 0.15s',
      }}>
        <ChevronRight size={15} color={hov ? B.gold : B.inkMute} strokeWidth={2.5} />
      </div>
    </div>
  )
}

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, height:'100%' }}>

      <NavCard
        icon={CalendarDays}
        title="Planning"
        sub="Voir le calendrier complet"
        onClick={onCalendar}
      />

      <NavCard
        icon={ClipboardList}
        title="Réservations"
        sub="Gérer toutes les réservations"
        onClick={onReservations}
        dark
      />

      {/* Tomorrow box */}
      <div style={{
        background: B.surface,
        border:`1.5px solid ${B.border}`,
        borderRadius:16, padding:'18px 22px',
        display:'flex', alignItems:'center', gap:16,
        boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
        marginTop:'auto',
      }}>
        <div style={{
          width:46, height:46, borderRadius:13, flexShrink:0,
          background: B.indigoBg, border:`1.5px solid ${B.indigoBd}`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Sunrise size={22} color={B.indigo} strokeWidth={2} />
        </div>
        <div style={{ flex:1 }}>
          <p style={{ margin:0, fontSize:15, fontWeight:800, color: B.ink }}>Demain</p>
          <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:600, color: B.inkMute }}>Réservations prévues</p>
        </div>
        {/* Badge */}
        <div style={{
          background: B.goldTint, border:`2px solid ${B.goldBorder}`,
          borderRadius:14, padding:'8px 18px', textAlign:'center',
        }}>
          <span style={{
            fontSize:30, fontWeight:900, color: B.gold,
            fontVariantNumeric:'tabular-nums', letterSpacing:'-1px',
            display:'block', lineHeight:1,
          }}>
            {tomorrow}
          </span>
          <span style={{ fontSize:9, fontWeight:800, color: B.goldBorder, textTransform:'uppercase', letterSpacing:'0.1em' }}>
            rés.
          </span>
        </div>
      </div>

    </div>
  )
}