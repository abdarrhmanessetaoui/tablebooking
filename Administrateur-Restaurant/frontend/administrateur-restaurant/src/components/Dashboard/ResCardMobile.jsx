import { useState } from 'react'

import Badge from './Badge'
import {
  card, topRow, nameBlock, nameTxt, phoneTxt,
  badgeRow, chipsRow, chip,
} from '../../styles/dashboard/resCardMobile.styles'
import { DARK, GOLD_DK, TODAY_DATE, TOMORROW_DATE } from '../../styles/dashboard/tokens'

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
  })
}

export default function ResCardMobile({ r, i, onRowClick }) {
  const chips = [
    {
      label: 'DATE',
      value: r.date && r.date !== TODAY_DATE && r.date !== TOMORROW_DATE
               ? fmtDate(r.date)
               : null,
      gold: false,
    },
    { label: 'HEURE', value: r.start_time, gold: false },
    { label: 'PERS',  value: r.guests ? `${r.guests}` : null, gold: false },
    { label: 'SERVICE', value: r.service || null, gold: true  },
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
          <span key={idx} style={{ ...chip(item.gold), background: item.gold ? GOLD : DARK, color: item.gold ? DARK : GOLD, padding: '4px 8px', fontSize: 10, fontWeight: 900 }}>
            <span style={{ fontSize: 8, opacity: 0.8, marginRight: 4 }}>{item.label}</span>
            {item.value}
          </span>
        ))}
      </div>
    </div>
  )
}