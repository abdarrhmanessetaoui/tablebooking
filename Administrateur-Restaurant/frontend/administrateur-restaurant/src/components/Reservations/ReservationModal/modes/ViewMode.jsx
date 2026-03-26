import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Phone, Mail, CalendarDays, Clock, Users, Utensils, FileText, Trash2 } from 'lucide-react'
import InfoRow    from '../../shared/InfoRow'
import StatusBadge from '../../shared/StatusBadge'
import { DARK, GOLD, RED } from '../../../../styles/reservations/tokens'

export default function ViewMode({ editing, setForm, setModalMode, handleDelete }) {
  const { t } = useTranslation()
  const [hovDel, setHovDel] = useState(false)
  return (
    <>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <InfoRow icon={User}         label={t('name')}      value={editing?.name}       />
        <InfoRow icon={Phone}        label={t('tel_header')}      value={editing?.phone}      />
        <InfoRow icon={Mail}         label={t('email_label')}    value={editing?.email}      />
        <InfoRow icon={CalendarDays} label={t('date')}     value={editing?.date}       />
        <InfoRow icon={Clock}        label={t('time')}    value={editing?.start_time} />
        <InfoRow icon={Users}        label={t('pers_header')} value={editing?.guests}     />
        <InfoRow icon={Utensils}     label={t('service')}  value={editing?.service}    />
        <InfoRow icon={FileText}     label={t('notes_label')}    value={editing?.notes}      />
      </div>
      <StatusBadge status={editing?.status} />
      <div style={{ height:4, background:'#f0ebe4' }} />
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={() => { setForm({...editing}); setModalMode('edit') }}
          style={{ flex:1, padding:'12px', background:DARK, border:'none', fontSize:13, fontWeight:800, color:GOLD, cursor:'pointer' }}>
          {t('edit_status')}
        </button>
        <button onClick={() => handleDelete(editing.id)}
          style={{ padding: 10, borderRadius: '50%', background:RED, border:'none', cursor:'pointer', transition:'opacity 0.15s', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          <Trash2 size={18} strokeWidth={2.5} color="#fff" />
        </button>
      </div>
    </>
  )
}