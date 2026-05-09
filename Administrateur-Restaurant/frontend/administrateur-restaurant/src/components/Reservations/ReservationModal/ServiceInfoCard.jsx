import { useTranslation } from 'react-i18next'
import { Clock, Users, CalendarDays } from 'lucide-react'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DARK } from '../../../styles/reservations/tokens'

export default function ServiceInfoCard({ svc, openDaysLabel }) {
  const { t } = useTranslation()
  if (!svc) return null
  return (
    <div style={{ padding:'8px 0', display:'flex', flexDirection:'column', gap:8 }}>
      {[
        { Icon:Clock,       text: t('duration_label'), bold:`${svc.duration} min` },
        { Icon:Users,       text: t('max_capacity_label'), bold: t('count_persons', { count: svc.capacity }) },
      ].map(({Icon,text,bold}) => (
        <div key={text} style={{ display:'flex', alignItems:'center', gap:7 }}>
          <Icon size={12} color={LIGHT_BROWN_DARK} strokeWidth={2.5} />
          <span style={{ fontSize:12, fontWeight:700, color:DARK }}>{text}<strong>{bold}</strong></span>
        </div>
      ))}
      {openDaysLabel && (
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <CalendarDays size={12} color={LIGHT_BROWN_DARK} strokeWidth={2.5} />
          <span style={{ fontSize:12, fontWeight:700, color:LIGHT_BROWN_DARK }}>{openDaysLabel}</span>
        </div>
      )}
    </div>
  )
}
