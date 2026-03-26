import { useTranslation } from 'react-i18next'
import { STATUS_MAP, badge, dot } from '../../styles/dashboard/badge.styles'

export default function Badge({ status }) {
  const { t } = useTranslation()
  const s = STATUS_MAP[status] || STATUS_MAP.Pending

  // Map status labels to translation keys
  const labelKey = status === 'Confirmed' ? 'status_confirmed'
                 : status === 'Cancelled' ? 'status_cancelled'
                 : 'status_pending'

  return (
    <span style={badge(s.color)}>
      <span style={dot(s.color)} />
      {t(labelKey)}
    </span>
  )
}