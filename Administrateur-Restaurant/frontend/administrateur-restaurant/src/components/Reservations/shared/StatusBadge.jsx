import { useTranslation } from 'react-i18next'
import { STATUS_CONFIG } from '../../../styles/reservations/tokens'

export default function StatusBadge({ status }) {
  const { t } = useTranslation()
  const s = STATUS_CONFIG[status] || { bg:'#f5f5f5', color:'#888', label: status }
  return (
    <div style={{ padding:'10px 16px', background:s.bg, display:'inline-flex' }}>
      <span style={{ fontSize:12, fontWeight:900, color:s.color }}>{t(s.key || status)}</span>
    </div>
  )
}
