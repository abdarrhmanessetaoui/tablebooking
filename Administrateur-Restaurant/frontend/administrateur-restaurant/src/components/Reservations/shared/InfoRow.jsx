import { DARK, GOLD_DARK } from '../../../styles/reservations/tokens'
export default function InfoRow({ icon:Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
      <div style={{ width:32, height:32, background:'#f5f0eb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={14} color={GOLD_DARK} strokeWidth={2} />
      </div>
      <div>
        <p style={{ margin:0, fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</p>
        <p style={{ margin:'2px 0 0', fontSize:14, fontWeight:800, color:DARK }}>{value}</p>
      </div>
    </div>
  )
}