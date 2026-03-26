import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import Label          from '../../shared/Label'
import MiniCalendar   from '../MiniCalendar'
import TimeSlotPicker from '../TimeSlotPicker'
import { DARK, GOLD, GOLD_DARK } from '../../../../styles/reservations/tokens'
import { footerBtnPrimary, footerBtnSecondary } from '../../../../styles/reservations/modal.styles'

export default function StepDateTime({ form, setForm, blockedDates, disabledDays, timeSlots, selectedSvc, onBack, onNext }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const [hov, setHov] = useState(false)

  const formattedDate = form.date 
    ? new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(form.date + 'T00:00:00'))
    : ''

  return (
    <>
      {!form.service && (
        <div style={{ padding:'10px 14px', background:'#ffffff', borderLeft:`3px solid ${GOLD}`, fontSize:12, fontWeight:700, color:GOLD_DARK }}>
          {t('select_formula_first')}
        </div>
      )}
      <MiniCalendar value={form.date} onChange={v=>setForm({...form,date:v,start_time:''})} blockedDates={blockedDates} disabledDays={disabledDays} />
      {form.date && (
        <div>
          <Label text={t('time_at_date', { date: formattedDate })} />
          {form.service ? (
            <>
              <TimeSlotPicker value={form.start_time} onChange={v=>setForm({...form,start_time:v})} slots={timeSlots} />
              {timeSlots.length>0 && (
                <p style={{ margin:'8px 0 0', fontSize:11, fontWeight:600, color:'rgba(43,33,24,0.4)', display:'flex', alignItems:'center', gap:5 }}>
                  <Clock size={10} strokeWidth={2.5} />{t('time_slots_count', { count: timeSlots.length, duration: selectedSvc?.duration??30 })}
                </p>
              )}
            </>
          ) : (
            <div style={{ padding:'10px 14px', background:'#ffffff', fontSize:12, fontWeight:700, color:'rgba(43,33,24,0.4)' }}>
              {t('choose_formula_first')}
            </div>
          )}
        </div>
      )}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onBack} style={footerBtnSecondary}>{t('back_step')}</button>
        <button onClick={onNext} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={footerBtnPrimary(hov)}>{t('next_step')}</button>
      </div>
    </>
  )
}