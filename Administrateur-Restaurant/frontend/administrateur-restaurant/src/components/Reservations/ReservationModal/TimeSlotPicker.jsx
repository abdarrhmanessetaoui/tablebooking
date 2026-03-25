
import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens'
export default function TimeSlotPicker({ value, onChange, slots }) {
  if (!slots.length) return (
    <div style={{ padding:'12px 14px', background:'#fdf6ec', borderLeft:`4px solid ${GOLD}`, fontSize:12, fontWeight:900, color:GOLD_DARK, display:'flex', alignItems:'center', gap:8, textTransform: 'uppercase' }}>
      ! Aucun créneau disponible pour ce service ce jour-là.
    </div>
  )
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:4 }}>
      {slots.map(slot => (
        <button key={slot} onClick={() => onChange(slot)}
          style={{ padding:'8px 14px', background:value===slot?DARK:GOLD, border:`2px solid ${DARK}`, fontSize:12, fontWeight:900, color:value===slot?GOLD:DARK, cursor:'pointer' }}>
          {slot}
        </button>
      ))}
    </div>
  )
}