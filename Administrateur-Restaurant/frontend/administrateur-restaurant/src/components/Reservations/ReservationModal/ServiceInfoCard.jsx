import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens'
export default function ServiceInfoCard({ svc, openDaysLabel }) {
  if (!svc) return null
  return (
    <div style={{ padding:'12px 14px', background:'#faf8f5', borderLeft:`3px solid ${GOLD}`, display:'flex', flexDirection:'column', gap:8 }}>
      {[
        { text:`Durée : `, bold:`${svc.duration} min` },
        { text:`Capacité max : `, bold:`${svc.capacity} personne${svc.capacity>1?'s':''}` },
      ].map(({text,bold}) => (
        <div key={text} style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ fontSize:12, fontWeight:700, color:DARK }}>{text}<strong>{bold}</strong></span>
        </div>
      ))}
      {openDaysLabel && (
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ fontSize:12, fontWeight:700, color:GOLD_DARK }}>{openDaysLabel}</span>
        </div>
      )}
    </div>
  )
}