import { B } from '../../utils/brand'
export default function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: B.bg }}>
      <div style={{ width:32, height:32, border:`3px solid ${B.border}`, borderTop:`3px solid ${B.gold}`, borderRadius:'50%', animation:'spin 0.65s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}