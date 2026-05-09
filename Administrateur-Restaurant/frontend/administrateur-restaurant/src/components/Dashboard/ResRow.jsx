import { useTranslation } from 'react-i18next'
import Badge from './Badge'
import {
  row, nameWrapper, nameTxt, phoneTxt,
  dateTxt, timeChip, guestsTxt,
  serviceChip, serviceText,
} from '../../styles/dashboard/resRow.styles'

function fmtDate(iso, lang) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang, {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
  })
}

export default function ResRow({ r, i, tpl, showDate, onRowClick }) {
  const { i18n } = useTranslation()

  return (
    <div
      onClick={() => onRowClick(r)}
      style={{ ...row(false, i), gridTemplateColumns: tpl }}
    >
      {/* Date   only in month tab */}
      {showDate && (
        <div style={nameWrapper}>
          <span style={dateTxt}>{fmtDate(r.date, i18n.language)}</span>
        </div>
      )}

      {/* Name + phone */}
      <div style={nameWrapper}>
        <p style={nameTxt}>{r.name}</p>
        {r.phone && <p style={phoneTxt}>{r.phone}</p>}
      </div>

      {/* Time chip */}
      <span style={timeChip}>
        {r.start_time}
      </span>

      {/* Guests */}
      <span style={guestsTxt}>
        {r.guests}
      </span>

      {/* Service chip */}
      <span style={serviceChip}>
        <span style={serviceText}>{r.service || ' '}</span>
      </span>

      {/* Status badge */}
      <Badge status={r.status} />

    </div>
  )
}
