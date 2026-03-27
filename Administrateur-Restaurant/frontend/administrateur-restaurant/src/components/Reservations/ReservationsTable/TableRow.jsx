import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Pencil, Trash2, CalendarDays, Clock3, Users, Utensils, User2, Phone } from 'lucide-react'
import Checkbox        from './Checkbox'
import ActionBtn       from './ActionBtn'
import AssignTableCell from './AssignTableCell'
import { DARK, GOLD, GOLD_DARK, CREAM, BORDER, STATUS_CONFIG } from '../../../styles/reservations/tokens'
import { cellStyle }   from '../../../styles/reservations/table.styles'

function trunc(str, max=14) {
  if (!str) return '—'
  return str.length > max ? str.slice(0,max)+'…' : str
}

export default function TableRow({ r, i, selected, highlighted, highlightRef, toggleOne, openView, openEdit, handleDelete, onOpenAssign }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  const s = STATUS_CONFIG[r.status] || { bg:'#ffffff', color:DARK, label:r.status||'—', dot:'#c8a97e' }

  let rowBg = i % 2 === 0 ? '#fff' : CREAM
  if (selected)    rowBg = '#ffffff'
  if (highlighted) rowBg = '#ffffff'
  const bg = (!selected && !highlighted && hov) ? '#f5ede0' : rowBg

  return (
    <tr
      ref={highlighted ? highlightRef : null}
      className={highlighted ? 'row-highlighted' : ''}
      onClick={() => toggleOne(r.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: bg,
        borderBottom: `1px solid ${BORDER}`,
        borderInlineStart: highlighted ? `6px solid ${GOLD}` : selected ? `6px solid ${GOLD}88` : hov ? `6px solid ${GOLD}44` : '6px solid transparent',
        transition: 'background 0.12s, border-color 0.12s',
        cursor: 'pointer',
      }}
    >
      <td style={{ ...cellStyle, width:36, padding:'9px 10px' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={() => toggleOne(r.id)} />
      </td>
      <td style={cellStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <User2 size={11} strokeWidth={2.5} color={highlighted?GOLD_DARK:DARK} style={{ flexShrink:0 }} />
          <span style={{ fontSize:12, fontWeight:highlighted?900:800, color:highlighted?GOLD_DARK:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:100 }}>
            {r.name||'—'}
          </span>
        </div>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>
          <Phone size={10} strokeWidth={2.5} color={DARK} style={{ flexShrink:0 }} />
          {r.phone||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>
          <CalendarDays size={10} strokeWidth={2.5} color={DARK} style={{ flexShrink:0 }} />
          {r.date||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 7px', background:highlighted?`${GOLD}22`:'#f5f0eb', fontSize:11, fontWeight:700, color:GOLD_DARK, whiteSpace:'nowrap' }}>
          <Clock3 size={10} strokeWidth={2.5} color={GOLD_DARK} />
          {r.start_time||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>
          <Users size={10} strokeWidth={2.5} color={DARK} style={{ flexShrink:0 }} />
          {r.guests||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 7px', background:'#f5f0eb', fontSize:11, fontWeight:700, color:GOLD_DARK, maxWidth:110, overflow:'hidden' }}>
          <Utensils size={10} strokeWidth={2.5} color={GOLD_DARK} style={{ flexShrink:0 }} />
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.service||'—'}</span>
        </span>
      </td>
      <td style={cellStyle} onClick={e => e.stopPropagation()}>
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', background:s.bg, fontSize:10, fontWeight:800, color:s.color, whiteSpace:'nowrap' }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
          {t(`status_${(r.status || 'pending').toLowerCase()}`)}
        </span>
      </td>
      <td style={{ ...cellStyle, padding:'9px 10px' }}>
        <div style={{ display:'flex', gap:3 }}>
          <ActionBtn icon={Eye}    title={t('view_btn')}      onClick={() => openView(r)} />
          <ActionBtn icon={Pencil} title={t('edit_btn')}  onClick={() => openEdit(r)} />
          <ActionBtn icon={Trash2} title={t('delete_btn')} onClick={() => handleDelete(r.id)} danger />
        </div>
      </td>
    </tr>
  )
}
