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
      <button onClick={onClose} style={{ background: GOLD, border: 'none', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
        Fermer
      </button>
    </div>
  )
}
