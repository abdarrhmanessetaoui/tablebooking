import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../shared/Label'
import ServiceInfoCard from '../ServiceInfoCard'
import { DARK, GOLD, GOLD_DARK } from '../../../../styles/reservations/tokens'
import { selectStyle } from '../../../../styles/reservations/modal.styles'
import { Users } from 'lucide-react'

export default function StepService({ form, setForm, services, selectedSvc, maxGuests, openDaysLabel, onNext }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  return (
    <>
      <div>
        <Label text={t('formula_label')} />
        <select value={form.service??''} onChange={e => setForm({...form,service:e.target.value,date:'',start_time:'',guests:''})}
          style={selectStyle} onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='#e8e0d8'}>
          <option value="">{t('choose_formula')}</option>
          {services.map(s => <option key={s.name} value={s.name}>{s.name}{Number(s.price)>0?` — ${s.price} dh`:''}</option>)}
        </select>
      </div>
      <ServiceInfoCard svc={selectedSvc} openDaysLabel={openDaysLabel} />
      <div>
        <Label text={t('count_persons').replace('{{count}} ', '')} />
        <select value={form.guests??''} onChange={e => setForm({...form,guests:e.target.value})}
          style={selectStyle} onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='#e8e0d8'}>
          <option value="">{t('choose_guests')}</option>
          {Array.from({length:maxGuests},(_,i)=>i+1).map(n => <option key={n} value={n}>{n} {t(n>1?'persons':'person')}</option>)}
        </select>
        {selectedSvc?.capacity && (
          <p style={{ margin:'5px 0 0', fontSize:11, fontWeight:700, color:'rgba(43,33,24,0.4)', display:'flex', alignItems:'center', gap:5 }}>
            <Users size={10} strokeWidth={2.5} />{t('guests_max_service', { count: selectedSvc.capacity, plural: selectedSvc.capacity > 1 ? 's' : '' })}
          </p>
        )}
      </div>
      <button onClick={onNext} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{ padding:'14px', background:hov?GOLD_DARK:GOLD, border:'none', fontSize:14, fontWeight:900, color:DARK, cursor:'pointer' }}>
        {t('next_step')}
      </button>
    </>
  )
}