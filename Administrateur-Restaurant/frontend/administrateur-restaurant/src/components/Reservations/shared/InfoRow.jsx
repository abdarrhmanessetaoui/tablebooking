export default function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      <p style={{ margin:0, fontSize:10, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.12em' }}>{label}</p>
      <p style={{ margin:0, fontSize:14, fontWeight:800, color:DARK }}>{value}</p>
    </div>
  )
}