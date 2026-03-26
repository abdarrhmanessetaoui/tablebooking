import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, Users, Utensils, CalendarDays, ChevronRight } from 'lucide-react'
import Badge from './Badge'
import {
  card, topRow, nameBlock, nameTxt, phoneTxt,
  badgeRow, chipsRow, chip,
} from '../../styles/dashboard/resCardMobile.styles'
import { DARK, GOLD_DK, TODAY_DATE, TOMORROW_DATE } from '../../styles/dashboard/tokens'

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
      Icon:  CalendarDays,
      value: r.date && r.date !== TODAY_DATE && r.date !== TOMORROW_DATE
               ? fmtDate(r.date, i18n.language)
               : null,
      gold: false,
    },
    { Icon: Clock,    value: r.start_time,                         gold: false },
    { Icon: Users,    value: r.guests ? t('count_persons', { count: r.guests }) : null, gold: false },
    { Icon: Utensils, value: r.service || null,                    gold: true  },
  ].filter(item => item.value)

  return (
    <div
      onClick={() => onRowClick(r)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={card(hov, i)}
    >
      {/* Top row: name + badge + chevron */}
      <div style={topRow}>
        <div style={nameBlock}>
          <p style={nameTxt}>{r.name}</p>
          {r.phone && <p style={phoneTxt}>{r.phone}</p>}
        </div>
        <div style={badgeRow}>
          <Badge status={r.status} />
          <ChevronRight size={13} strokeWidth={2.5} color={DARK} />
        </div>
      </div>

      {/* Chips row */}
      <div style={chipsRow}>
        {chips.map((item, idx) => (
          <span key={idx} style={chip(item.gold)}>
            <item.Icon
              size={11}
              strokeWidth={2.5}
              color={item.gold ? GOLD_DK : DARK}
            />
            {item.value}
          </span>
        ))}
      </div>
    </div>
  )
}