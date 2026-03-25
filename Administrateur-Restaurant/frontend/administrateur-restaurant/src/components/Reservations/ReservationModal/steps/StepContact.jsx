import { useState } from 'react'

import Label      from '../../shared/Label'
import TextInput  from '../../shared/TextInput'
import { DARK, GOLD, GOLD_DARK, STATUS_CONFIG } from '../../../../styles/reservations/tokens'
import { inputStyle, footerBtnPrimary, footerBtnSecondary, summaryBoxStyle } from '../../../../styles/reservations/modal.styles'

export default function StepContact({ form, setForm, onBack, onSubmit }) {
  return (
    <>
      <div style={summaryBoxStyle}>
        {[['Service',form.service||'—'],['Couverts',form.guests?`${form.guests} personne${form.guests>1?'s':''}`:' —'],['Date',form.date||'—'],['Heure',form.start_time||'—']].map(([l,v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{l}</span>
            <span style={{ fontSize:13, fontWeight:800, color:DARK }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <TextInput label="Nom et prénom" value={form.name}  onChange={v=>setForm({...form,name:v})}  required />
        <TextInput label="Téléphone"     value={form.phone} onChange={v=>setForm({...form,phone:v})} />
        <TextInput label="Email"         value={form.email} onChange={v=>setForm({...form,email:v})} type="email" />
      </div>
      <div>
        <Label text="Demande spéciale (optionnel)" />
        <textarea value={form.notes??''} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}
          style={{ ...inputStyle, resize:'vertical' }} />
      </div>
      <div>
        <Label text="Statut" />
        <div style={{ display:'flex', gap:6 }}>
          {['Confirmed','Pending','Cancelled'].map(s => (
            <button key={s} onClick={() => setForm({...form,status:s})}
              style={{ flex:1, padding:'10px 4px', background:form.status===s?DARK:'#f5f0eb', border:'none', fontSize:12, fontWeight:900, color:form.status===s?GOLD:'#888', cursor:'pointer' }}>
              {STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onBack} style={footerBtnSecondary}>← Retour</button>
        <button onClick={onSubmit} style={{ ...footerBtnPrimary, display:'flex', alignItems:'center', justifyContent:'center', gap:8, textTransform: 'uppercase' }}>
          Terminer la réservation
        </button>
      </div>
    </>
  )
}