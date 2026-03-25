import { useState } from 'react'
import Label from '../../shared/Label'
import ServiceInfoCard from '../ServiceInfoCard'
import { DARK, GOLD, GOLD_DARK } from '../../../../styles/reservations/tokens'
import { selectStyle } from '../../../../styles/reservations/modal.styles'


export default function StepService({ form, setForm, services, selectedSvc, maxGuests, openDaysLabel, onNext }) {
  return (
    <>
      <div>
        <Label text="Nos Formules" />
        <select value={form.service??''} onChange={e => setForm({...form,service:e.target.value,date:'',start_time:'',guests:''})}
          style={selectStyle} onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='#e8e0d8'}>
          <option value="">— Choisir une formule —</option>
          {services.map(s => <option key={s.name} value={s.name}>{s.name}{Number(s.price)>0?` — ${s.price} dh`:''}</option>)}
        </select>
      </div>
      <ServiceInfoCard svc={selectedSvc} openDaysLabel={openDaysLabel} />
      <div>
        <Label text="Nombre de personnes" />
        <select value={form.guests??''} onChange={e => setForm({...form,guests:e.target.value})}
          style={selectStyle} onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='#e8e0d8'}>
          <option value="">— Choisir —</option>
          {Array.from({length:maxGuests},(_,i)=>i+1).map(n => <option key={n} value={n}>{n} personne{n>1?'s':''}</option>)}
        </select>
        {selectedSvc?.capacity && (
          <p style={{ margin:'5px 0 0', fontSize:11, fontWeight:700, color:'rgba(43,33,24,0.4)', display:'flex', alignItems:'center', gap:5 }}>
            Maximum {selectedSvc.capacity} personne{selectedSvc.capacity>1?'s':''} pour ce service
          </p>
        )}
      </div>
      <button onClick={onNext}
        style={{ padding:'14px', background:DARK, border:'none', fontSize:14, fontWeight:900, color:GOLD, cursor:'pointer' }}>
        Suivant →
      </button>
    </>
  )
}