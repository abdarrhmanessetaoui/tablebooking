import { useState } from 'react'

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
  let rowBg = i % 2 === 0 ? '#fff' : CREAM
  if (selected)    rowBg = '#fdf6ec'
  if (highlighted) rowBg = '#fff8ec'
  const bg = rowBg

  return (
    <tr
      ref={highlighted ? highlightRef : null}
      className={highlighted ? 'row-highlighted' : ''}
      onClick={() => toggleOne(r.id)}
      style={{
        background: bg,
        borderBottom: `2px solid ${DARK}`,
        borderLeft: highlighted ? `6px solid ${GOLD}` : selected ? `6px solid ${GOLD}` : '6px solid transparent',
        cursor: 'pointer',
      }}
    >
      <td style={{ ...cellStyle, width:36, padding:'9px 10px' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={() => toggleOne(r.id)} />
      </td>
      <td style={cellStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: GOLD, marginRight: 2 }}>NOM:</span>
          <span style={{ fontSize:12, fontWeight:900, color:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:100 }}>
            {r.name||'—'}
          </span>
        </div>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: GOLD, marginRight: 2 }}>TÉL:</span>
          {r.phone||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: GOLD, marginRight: 2 }}>DATE:</span>
          {r.date||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 7px', background:DARK, fontSize:11, fontWeight:900, color:GOLD, whiteSpace:'nowrap' }}>
          {r.start_time||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:DARK, whiteSpace:'nowrap' }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: GOLD, marginRight: 2 }}>PERS:</span>
          {r.guests||'—'}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 7px', background:DARK, fontSize:11, fontWeight:900, color:GOLD, maxWidth:110, overflow:'hidden' }}>
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.service||'—'}</span>
        </span>
      </td>
      <td style={cellStyle} onClick={e => e.stopPropagation()}>
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </td>
      <td style={cellStyle}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', background:s.bg, fontSize:10, fontWeight:800, color:s.color, whiteSpace:'nowrap' }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
          {s.label}
        </span>
      </td>
      <td style={{ ...cellStyle, padding:'9px 10px' }}>
        <div style={{ display:'flex', gap:3 }}>
          <ActionBtn icon={Eye}    title="Voir"      onClick={() => openView(r)} />
          <ActionBtn icon={Pencil} title="Modifier"  onClick={() => openEdit(r)} />
          <ActionBtn icon={Trash2} title="Supprimer" onClick={() => handleDelete(r.id)} danger />
        </div>
      </td>
    </tr>
  )
}