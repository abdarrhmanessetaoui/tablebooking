import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Pencil, Trash2, CalendarDays, Clock3, Users, Utensils, User2, Phone } from 'lucide-react'
import Checkbox        from './Checkbox'
import ActionBtn       from './ActionBtn'
import AssignTableCell from './AssignTableCell'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DARK, CREAM, BORDER, STATUS_CONFIG, WHITE } from '../../../styles/reservations/tokens'
import { cellStyle }   from '../../../styles/reservations/table.styles'

function trunc(str, max=14) {
  if (!str) return ' '
  return str.length > max ? str.slice(0,max)+'…' : str
}

export default function TableRow({ r, i, selected, highlighted, highlightRef, toggleOne, openView, openEdit, handleDelete, onOpenAssign }) {
  const { t } = useTranslation()
  const s = STATUS_CONFIG[r.status] || { bg:WHITE, color:DARK, label:r.status||' ', dot:LIGHT_BROWN }
  const bg = highlighted ? '#FAF7F4' : selected ? '#FAF7F4' : WHITE
  
  return (
    <tr
      ref={highlighted ? highlightRef : null}
      className={highlighted ? 'row-highlighted' : ''}
      onClick={() => toggleOne(r.id)}
      style={{
        background: bg,
        borderBottom: `1px solid ${BORDER}`,
        transition: 'none',
        cursor: 'pointer',
      }}
    >
      <td style={{ ...cellStyle, width:36, padding:'9px 10px' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={() => toggleOne(r.id)} />
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize:12, fontWeight:900, color:highlighted?LIGHT_BROWN:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:100 }}>
          {r.name||' '}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize:11, fontWeight:800, color:DARK, whiteSpace:'nowrap' }}>
          {r.phone||' '}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize:11, fontWeight:800, color:DARK, whiteSpace:'nowrap' }}>
          {r.date||' '}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', padding:'3px 0', fontSize:11, fontWeight:800, color:LIGHT_BROWN, whiteSpace:'nowrap' }}>
          {r.start_time||' '}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize:11, fontWeight:800, color:DARK, whiteSpace:'nowrap' }}>
          {r.guests||' '}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', padding:'3px 0', fontSize:11, fontWeight:800, color:LIGHT_BROWN, maxWidth:110, overflow:'hidden' }}>
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.service||' '}</span>
        </span>
      </td>
      <td style={cellStyle} onClick={e => e.stopPropagation()}>
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 8px', background:s.bg, fontSize:10, fontWeight:900, color:s.color, whiteSpace:'nowrap', borderRadius: 2 }}>
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
