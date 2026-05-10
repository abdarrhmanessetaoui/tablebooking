import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DARK } from '../../../styles/reservations/tokens'

export default function TimeSlotPicker({ value, onChange, slots }) {
  const { t } = useTranslation()
  if (!slots.length) return (
    <div style={{ padding:'12px 14px', background:'#ffffff', borderLeft:`3px solid ${LIGHT_BROWN}`, fontSize:12, fontWeight:700, color:LIGHT_BROWN_DARK, display:'flex', alignItems:'center', gap:8 }}>
      <AlertTriangle size={13} strokeWidth={2.5} />
      {t('no_time_slots_available')}
    </div>
  )
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:4 }}>
      {slots.map(slot => (
        <button key={slot} onClick={() => onChange(slot)}
          style={{ padding:'7px 13px', background:value===slot?DARK:LIGHT_BROWN, border:'none', borderRadius:999, fontSize:12, fontWeight:800, color:value===slot?LIGHT_BROWN:DARK, cursor:'pointer' }}>
          {slot}
        </button>
      ))}
    </div>
  )
}
