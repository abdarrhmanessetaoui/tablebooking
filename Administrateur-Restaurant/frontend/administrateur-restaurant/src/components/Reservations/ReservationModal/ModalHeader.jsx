import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { DARK, LIGHT_BROWN } from '../../../styles/reservations/tokens'

export default function ModalHeader({ modalMode, step, editing, onClose }) {
  const { t } = useTranslation()
  const titles = { view: t('detail'), edit: t('edit_status'), create: t('new_reservation') }
  const stepTitles = { 1: t('formula_couverts'), 2: t('date_heure'), 3: t('coordonnees') }

  return (
    <div style={{ background:LIGHT_BROWN, padding:'20px 26px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
      <div>

        <h2 style={{ margin:'3px 0 0', fontSize:18, fontWeight:900, color:'#ffffff', letterSpacing:'-0.5px' }}>
          {modalMode==='create' ? stepTitles[step] : (editing?.name||' ')}
        </h2>
      </div>
      <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
        <X size={17} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  )
}
