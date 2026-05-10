import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Phone, Mail, CalendarDays, Clock, Users, Utensils, FileText, Trash2 } from 'lucide-react'
import InfoRow    from '../../shared/InfoRow'
import StatusBadge from '../../shared/StatusBadge'
import { DARK, LIGHT_BROWN, RED } from '../../../../styles/reservations/tokens'

export default function ViewMode({ editing, setForm, setModalMode, handleDelete }) {
  const { t } = useTranslation()
  const [hovDel, setHovDel] = useState(false)
  return (
    <>
      <div style={{ display:'flex', flexDirection:'column', gap:18, padding:'4px 0' }}>
        <InfoRow label={t('name')}          value={editing?.name}       />
        <InfoRow label={t('tel_header')}    value={editing?.phone}      />
        <InfoRow label={t('email_label')}   value={editing?.email}      />
        <InfoRow label={t('date')}          value={editing?.date}       />
        <InfoRow label={t('time')}          value={editing?.start_time} />
        <InfoRow label={t('pers_header')}   value={editing?.guests}     />
        <InfoRow label={t('service')}       value={editing?.service}    />
        <InfoRow label={t('notes_label')}   value={editing?.notes}      />
      </div>

      <div style={{ margin:'10px 0' }}>
        <StatusBadge status={editing?.status} />
      </div>

      <div style={{ height:1, background: '#E5E0DA', margin: '8px 0' }} />

      <div style={{ display:'flex', gap:10, marginTop: 10 }}>
        <button onClick={() => { setForm({...editing}); setModalMode('edit') }}
          style={{ 
            flex: 2, padding:'14px', 
            background:LIGHT_BROWN, border:'none', 
            fontSize:12, fontWeight:900, color:'#ffffff', 
            cursor:'pointer', borderRadius: 12,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
          {t('edit_status')}
        </button>
        <button onClick={() => handleDelete(editing.id)}
          style={{ 
            flex: 1, padding:'14px', 
            background:'#EF4444', border:'none', 
            fontSize:12, fontWeight:900, color:'#ffffff', 
            cursor:'pointer', borderRadius: 12,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}
        >
          {t('delete_btn')}
        </button>
      </div>
    </>
  )
}
