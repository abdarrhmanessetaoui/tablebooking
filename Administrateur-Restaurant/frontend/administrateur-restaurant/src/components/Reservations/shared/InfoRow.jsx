import { DARK, LIGHT_BROWN_DARK } from '../../../styles/reservations/tokens'
export default function InfoRow({ icon:Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      <div>
        <p style={{ margin:0, fontSize:10, fontWeight:800, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
        <p style={{ margin:'2px 0 0', fontSize:15, fontWeight:800, color:DARK }}>{value}</p>
      </div>
    </div>
  )
}
