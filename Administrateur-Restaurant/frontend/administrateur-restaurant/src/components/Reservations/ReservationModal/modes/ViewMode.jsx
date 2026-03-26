import { useState } from 'react'
import { useTranslation } from "react-i18next"
import { User, Phone, Mail, CalendarDays, Clock, Users, Utensils, FileText, Trash2 } from 'lucide-react'
import InfoRow    from '../../shared/InfoRow'
import StatusBadge from '../../shared/StatusBadge'
import { DARK, GOLD, RED } from '../../../../styles/reservations/tokens'

export default function ViewMode({ editing, setForm, setModalMode, handleDelete }) {
  const [hovDel, setHovDel] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <InfoRow icon={User}         label={t('name')}    value={editing?.name}       />
        <InfoRow icon={Phone}        label={t('phone')}   value={editing?.phone}      />
        <InfoRow icon={Mail}         label={t('email')}   value={editing?.email}      />
        <InfoRow icon={CalendarDays} label={t('date')}    value={editing?.date}       />
        <InfoRow icon={Clock}        label={t('time')}    value={editing?.start_time} />
        <InfoRow icon={Users}        label={t('guests')}  value={editing?.guests}     />
        <InfoRow icon={Utensils}     label={t('service')} value={editing?.service}    />
        <InfoRow icon={FileText}     label={t('notes')}   value={editing?.notes}      />
      </div>

      <StatusBadge status={editing?.status} />

      <div style={{ height:2, background:'#f0ebe4' }} />

      <div style={{ display:'flex', gap:8 }}>
        <button 
          onClick={() => { setForm({...editing}); setModalMode('edit') }}
          style={{ flex:1, padding:'12px', background:DARK, border:'none', fontSize:13, fontWeight:800, color:GOLD, cursor:'pointer' }}>
          {t('edit_status')}
        </button>

        <button 
          onClick={() => handleDelete(editing.id)}
          onMouseEnter={() => setHovDel(true)} 
          onMouseLeave={() => setHovDel(false)}
          style={{ padding:'12px 16px', background:hovDel?RED:'#fef2f2', border:'none', cursor:'pointer', transition:'background 0.15s', display:'flex', alignItems:'center' }}>
          <Trash2 size={16} strokeWidth={2.5} color={hovDel?'#fff':RED} />
        </button>
      </div>
    </>
  )
}