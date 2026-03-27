import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Label      from '../../shared/Label'
import TextInput  from '../../shared/TextInput'
import { DARK, GOLD, STATUS_CONFIG } from '../../../../styles/reservations/tokens'
import { inputStyle, footerBtnPrimary, footerBtnSecondary, summaryBoxStyle } from '../../../../styles/reservations/modal.styles'

export default function StepContact({ form, setForm, onBack, onSubmit }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  return (
    <>
      <div style={summaryBoxStyle}>
        {[
          [t('service'), form.service||'—'],
          [t('count_persons').replace('{{count}} ', ''), form.guests ? `${form.guests} ${t(form.guests > 1 ? 'persons' : 'person')}` : ' —'],
          [t('date'), form.date||'—'],
          [t('time'), form.start_time||'—']
        ].map(([l,v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{l}</span>
            <span style={{ fontSize:13, fontWeight:800, color:DARK }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <TextInput label={t('name_and_surname')} value={form.name}  onChange={v=>setForm({...form,name:v})}  required />
        <TextInput label={t('phone_label')}     value={form.phone} onChange={v=>setForm({...form,phone:v})} />
        <TextInput label={t('email_label')}         value={form.email} onChange={v=>setForm({...form,email:v})} type="email" />
      </div>
      <div>
        <Label text={t('special_request')} />
        <textarea value={form.notes??''} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}
          style={{ ...inputStyle, resize:'vertical' }}
          onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor='#e8e0d8'} />
      </div>
      <div>
        <Label text={t('status')} />
        <div style={{ display:'flex', gap:6 }}>
          {['Confirmed','Pending','Cancelled'].map(s => (
            <button key={s} onClick={() => setForm({...form,status:s})}
              style={{ flex:1, padding:'10px 4px', background:form.status===s?DARK:'#f5f0eb', border:'none', fontSize:12, fontWeight:900, color:form.status===s?GOLD:'#888', cursor:'pointer' }}>
              {t(STATUS_CONFIG[s]?.key)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onBack} style={footerBtnSecondary}>{t('back_step')}</button>
        <button onClick={onSubmit} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={footerBtnPrimary(hov)}>
          {t('create_reservation_btn')}
        </button>
      </div>
    </>
  )
}
