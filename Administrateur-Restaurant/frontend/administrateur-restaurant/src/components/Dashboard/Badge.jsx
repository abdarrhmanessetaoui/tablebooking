import { STATUS_MAP, badge } from '../../styles/dashboard/badge.styles'

export default function Badge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.Pending

  return (
    <span style={badge(s.color)}>
      {s.label}
    </span>
  )
}