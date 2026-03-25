import { Badge } from './Badge'
import {
  row, nameWrapper, nameInner, nameTxt, phoneTxt,
  dateTxt, timeChip, guestsTxt,
  serviceChip, serviceText, chevron,
} from '../../styles/dashboard/resRow.styles'
import { DARK, GOLD_DK } from '../../styles/dashboard/tokens'

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
  })
}

export default function ResRow({ r, i, tpl, showDate, onRowClick }) {
  return (
    <div
      onClick={() => onRowClick(r)}
      style={{ ...row(false, i), gridTemplateColumns: tpl, cursor: 'pointer' }}
    >
      {/* Date — only in month tab */}
      {showDate && (
        <div style={nameWrapper}>
          <span style={dateTxt}>{fmtDate(r.date)}</span>
        </div>
      )}

      {/* Name + phone */}
      <div style={nameWrapper}>
        <div style={nameInner}>
          <p style={nameTxt}>{r.name}</p>
        </div>
        {r.phone && <p style={phoneTxt}>{r.phone}</p>}
      </div>

      {/* Time chip */}
      <span style={timeChip}>
        {r.start_time}
      </span>

      {/* Guests */}
      <span style={guestsTxt}>
        {r.guests} pers.
      </span>

      {/* Service chip */}
      <span style={serviceChip}>
        <span style={serviceText}>{r.service || '—'}</span>
      </span>

      {/* Status badge */}
      <Badge status={r.status} />
    </div>
  )
}