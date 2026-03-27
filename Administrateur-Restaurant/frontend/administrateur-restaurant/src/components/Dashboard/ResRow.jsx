import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, Users, Utensils, ChevronRight, User2 } from 'lucide-react'
import Badge from './Badge'
import {
  row, nameWrapper, nameInner, nameTxt, phoneTxt,
  dateTxt, timeChip, guestsTxt,
  serviceChip, serviceText, chevron,
} from '../../styles/dashboard/resRow.styles'
import { DARK, GOLD_DK } from '../../styles/dashboard/tokens'

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
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={() => onRowClick(r)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...row(hov, i), gridTemplateColumns: tpl }}
    >
      {/* Date — only in month tab */}
      {showDate && (
        <div style={nameWrapper}>
          <span style={dateTxt}>{fmtDate(r.date, i18n.language)}</span>
        </div>
      )}

      {/* Name + phone */}
      <div style={nameWrapper}>
        <div style={nameInner}>
          <User2 size={11} strokeWidth={2.5} color={DARK} style={{ flexShrink: 0 }} />
          <p style={nameTxt}>{r.name}</p>
        </div>
        {r.phone && <p style={phoneTxt}>{r.phone}</p>}
      </div>

      {/* Time chip */}
      <span style={timeChip}>
        <Clock size={11} strokeWidth={2.5} color={GOLD_DK} />
        {r.start_time}
      </span>

      {/* Guests */}
      <span style={guestsTxt}>
        <Users size={11} strokeWidth={2.5} color={DARK} />
        {r.guests}
      </span>

      {/* Service chip */}
      <span style={serviceChip}>
        <Utensils size={11} strokeWidth={2.5} color={GOLD_DK} style={{ flexShrink: 0 }} />
        <span style={serviceText}>{r.service || '—'}</span>
      </span>

      {/* Status badge */}
      <Badge status={r.status} />

      {/* Chevron */}
      <ChevronRight size={14} strokeWidth={2.5} style={chevron(hov)} />
    </div>
  )
}
