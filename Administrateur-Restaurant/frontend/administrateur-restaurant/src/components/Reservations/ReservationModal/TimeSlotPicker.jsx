import { AlertTriangle } from 'lucide-react'
import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens'
export default function TimeSlotPicker({ value, onChange, slots }) {
  if (!slots.length) return (
    <div style={{ padding:'12px 14px', background:'#fdf6ec', borderLeft:`3px solid ${GOLD}`, fontSize:12, fontWeight:700, color:GOLD_DARK, display:'flex', alignItems:'center', gap:8 }}>
      <AlertTriangle size={13} strokeWidth={2.5} />
      Aucun créneau disponible pour ce service ce jour-là.
    </div>
  )
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:4 }}>
      {slots.map(slot => (
        <button key={slot} onClick={() => onChange(slot)}
          style={{ padding:'7px 13px', background:value===slot?DARK:GOLD, border:'none', borderRadius:999, fontSize:12, fontWeight:800, color:value===slot?GOLD:DARK, cursor:'pointer' }}>
          {slot}
        </button>
      ))}
    </div>
  )
}