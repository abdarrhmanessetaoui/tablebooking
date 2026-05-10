import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from './Badge'
import {
  card, topRow, nameBlock, nameTxt, phoneTxt,
  badgeRow, chipsRow, chip,
} from '../../styles/dashboard/resCardMobile.styles'
import { DARK, LIGHT_BROWN_DK, TODAY_DATE, TOMORROW_DATE } from '../../styles/dashboard/tokens'

function fmtDate(iso, lang) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang, {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
  })
}

export default function ResCardMobile({ r, i, onRowClick }) {
  const { t, i18n } = useTranslation()
  const [hov, setHov] = useState(false)

  const chips = [
    {
      value: r.date && r.date !== TODAY_DATE && r.date !== TOMORROW_DATE
               ? fmtDate(r.date, i18n.language)
               : null,
      LIGHT_BROWN: false,
    },
    { value: r.start_time,                         LIGHT_BROWN: false },
    { value: r.guests ? t('count_persons', { count: r.guests }) : null, LIGHT_BROWN: false },
    { value: r.service || null,                    LIGHT_BROWN: true  },
  ].filter(item => item.value)

  return (
    <div
      onClick={() => onRowClick(r)}
      style={{ ...card(false, i), background: '#FFFFFF', border: `2px solid ${DARK}` }}
    >
      {/* Top row: name + badge + chevron */}
      <div style={topRow}>
        <div style={nameBlock}>
          <p style={nameTxt}>{r.name}</p>
          {r.phone && <p style={phoneTxt}>{r.phone}</p>}
        </div>
        <div style={badgeRow}>
          <Badge status={r.status} />
        </div>
      </div>

      {/* Chips row */}
      <div style={chipsRow}>
        {chips.map((item, idx) => (
          <span key={idx} style={{ ...chip(item.LIGHT_BROWN), fontSize: '12px', fontWeight: '600' }}>
            {item.value}
          </span>
        ))}
      </div>
    </div>
  )
}
