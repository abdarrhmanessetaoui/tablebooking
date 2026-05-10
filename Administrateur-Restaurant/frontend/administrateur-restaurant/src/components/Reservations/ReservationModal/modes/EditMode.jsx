import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Label from '../../shared/Label'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DARK, STATUS_CONFIG } from '../../../../styles/reservations/tokens'

export default function EditMode({ editing, form, setForm, handleSubmit, onClose }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  return (
    <>
      <div style={{ background:'#ffffff', padding:'14px 18px', display:'flex', flexDirection:'column', gap:8 }}>
        {[[t('date'),editing?.date],[t('time'),editing?.start_time],[t('pers_header'),editing?.guests]].map(([l,v]) => v ? (
          <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{l}</span>
            <span style={{ fontSize:13, fontWeight:800, color:DARK }}>{v}</span>
          </div>
        ) : null)}
      </div>
      <div>
        <Label text={t('status')} />
        <div style={{ display:'flex', gap:6 }}>
          {['Confirmed','Pending','Cancelled'].map(s => (
            <button key={s} onClick={() => setForm({...form,status:s})}
              style={{ flex:1, padding:'11px 6px', background:form.status===s?LIGHT_BROWN:'#f5f0eb', border:'none', fontSize:12, fontWeight:900, color:form.status===s?'#ffffff':'#888', cursor:'pointer', borderRadius:4 }}>
              {t(STATUS_CONFIG[s]?.key)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onClose} style={{ 
          flex:1, padding:'14px', background:'#f5f0eb', border:'none', 
          fontSize:12, fontWeight:900, color:'#888', 
          cursor:'pointer', borderRadius:4, textTransform: 'uppercase', letterSpacing: '0.05em' 
        }}>
          {t('cancel_btn')}
        </button>
        <button onClick={handleSubmit}
          style={{ 
            flex:2, padding:'14px', background:LIGHT_BROWN, border:'none', 
            fontSize:12, fontWeight:900, color:'#ffffff', 
            cursor:'pointer', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.05em' 
          }}>
          {t('save_btn')}
        </button>
      </div>
    </>
  )
}
