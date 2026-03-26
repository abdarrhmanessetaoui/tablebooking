import { useTranslation } from "react-i18next"
import { X } from 'lucide-react'
import { DARK, GOLD } from '../../../styles/reservations/tokens'

export default function ModalHeader({ modalMode, step, editing, onClose }) {
  const { t } = useTranslation()

  const titles = { 
    view: t('detail'), 
    edit: t('edit_status'), 
    create: t('new_reservation') 
  }

  const stepTitles = { 
    1: t('step_service_guests'), 
    2: t('step_date_time'), 
    3: t('step_contact') 
  }

  return (
    <div style={{ background:DARK, padding:'20px 26px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
      <div>
        <p style={{ margin:0, fontSize:10, fontWeight:700, color:GOLD, letterSpacing:'0.16em', textTransform:'uppercase' }}>
          {titles[modalMode]}{modalMode==='create' && ` — ${t('step')} ${step}/3`}
        </p>

        <h2 style={{ margin:'3px 0 0', fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>
          {modalMode==='create' ? stepTitles[step] : (editing?.name || '—')}
        </h2>
      </div>

      <button 
        onClick={onClose} 
        style={{ background:'rgba(255,255,255,0.1)', border:'none', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
        <X size={17} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  )
}