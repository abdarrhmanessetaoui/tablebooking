import { useTranslation } from 'react-i18next'
import { STATUS_CONFIG } from '../../../styles/reservations/tokens'

export default function StatusBadge({ status }) {
  const { t } = useTranslation()
  const s = STATUS_CONFIG[status] || { bg:'#f5f5f5', color:'#888', label: status }
  return (
    <div style={{ 
      padding:'12px 16px', background:s.bg, 
      display:'flex', width: '100%', boxSizing: 'border-box',
      justifyContent: 'center', alignItems: 'center',
      borderRadius: 4
    }}>
      <span style={{ fontSize:13, fontWeight:900, color:s.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(s.key || status)}</span>
    </div>
  )
}
