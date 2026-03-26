import { useState } from 'react'
import { Clock } from 'lucide-react'
import Label          from '../../shared/Label'
import MiniCalendar   from '../MiniCalendar'
import TimeSlotPicker from '../TimeSlotPicker'
import { DARK, GOLD, GOLD_DARK } from '../../../../styles/reservations/tokens'
import { footerBtnPrimary, footerBtnSecondary } from '../../../../styles/reservations/modal.styles'

export default function StepDateTime({ form, setForm, blockedDates, disabledDays, timeSlots, selectedSvc, onBack, onNext }) {
  const [hov, setHov] = useState(false)
  return (
    <>
      {!form.service && (
        <div style={{ padding:'10px 14px', background:'#ffffff', borderLeft:`3px solid ${GOLD}`, fontSize:12, fontWeight:700, color:GOLD_DARK }}>
          Sélectionnez d'abord une formule à l'étape précédente.
        </div>
      )}
      <MiniCalendar value={form.date} onChange={v=>setForm({...form,date:v,start_time:''})} blockedDates={blockedDates} disabledDays={disabledDays} />
      {form.date && (
        <div>
          <Label text={`Heure — ${new Date(form.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}`} />
          {form.service ? (
            <>
              <TimeSlotPicker value={form.start_time} onChange={v=>setForm({...form,start_time:v})} slots={timeSlots} />
              {timeSlots.length>0 && (
                <p style={{ margin:'8px 0 0', fontSize:11, fontWeight:600, color:'rgba(43,33,24,0.4)', display:'flex', alignItems:'center', gap:5 }}>
                  <Clock size={10} strokeWidth={2.5} />{timeSlots.length} créneaux · intervalles de {selectedSvc?.duration??30} min
                </p>
              )}
            </>
          ) : (
            <div style={{ padding:'10px 14px', background:'#ffffff', fontSize:12, fontWeight:700, color:'rgba(43,33,24,0.4)' }}>
              Choisissez d'abord une formule à l'étape précédente.
            </div>
          )}
        </div>
      )}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onBack} style={footerBtnSecondary}>← Retour</button>
        <button onClick={onNext} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={footerBtnPrimary(hov)}>Suivant →</button>
      </div>
    </>
  )
}