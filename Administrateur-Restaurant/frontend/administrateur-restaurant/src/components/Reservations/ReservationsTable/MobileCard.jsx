
import Checkbox        from './Checkbox'
import AssignTableCell from './AssignTableCell'
import { DARK, GOLD, GOLD_DARK, CREAM, BORDER, RED, STATUS_CONFIG } from '../../../styles/reservations/tokens'

function trunc(str, max=16) {
  if (!str) return null
  return str.length > max ? str.slice(0,max)+'…' : str
}

export default function MobileCard({ r, selected, highlighted, rowRef, onToggle, openView, openEdit, handleDelete, onOpenAssign }) {
  const s = STATUS_CONFIG[r.status] || { bg:'#fdf6ec', color:DARK, label:r.status||'—', dot:'#c8a97e' }

  return (
    <div ref={rowRef} style={{
      background: highlighted ? '#fff8ec' : selected ? '#fdf6ec' : '#FFFFFF',
      borderLeft: `3px solid ${highlighted ? GOLD : selected ? GOLD : 'transparent'}`,
      borderBottom: `2px solid ${BORDER}`,
      padding: '14px 16px', position: 'relative',
    }}>
      {highlighted && (
        <div style={{ position:'absolute', top:10, right:14, fontSize:9, fontWeight:900, color:GOLD_DARK, letterSpacing:'0.12em', textTransform:'uppercase', background:'#fdf6ec', padding:'2px 7px', border:`1px solid ${GOLD}55` }}>
          Sélectionnée
        </div>
      )}

      {/* Top row */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <Checkbox checked={selected} onChange={onToggle} />
        <div style={{ flex:1, minWidth:0, paddingRight: highlighted ? 90 : 0 }}>
          <p style={{ margin:0, fontSize:14, fontWeight:800, color:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name||'—'}</p>
          <p style={{ margin:'2px 0 0', fontSize:11, fontWeight:700, color:DARK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.phone||r.email||'—'}</p>
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', background:s.bg, fontSize:10, fontWeight:800, color:s.color, whiteSpace:'nowrap', flexShrink:0 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot }} />
          {s.label}
        </span>
      </div>

      {/* Chips */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
        {[
          { label: 'DATE',     value: r.date,                        gold: false },
          { label: 'HEURE',    value: r.start_time,                  gold: true  },
          { label: 'PERS.',    value: r.guests ? `${r.guests}P` : null, gold: false },
          { label: 'SERVICE',  value: trunc(r.service),               gold: true  },
        ].filter(x => x.value).map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', background: item.gold ? DARK : '#f0f0f0', fontSize: 10, fontWeight: 900, color: item.gold ? GOLD : DARK }}>
            <span style={{ opacity: 0.6, fontSize: 9 }}>{item.label}:</span>
            {item.value}
          </span>
        ))}
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => openView(r)} style={{ flex: 1, padding: '10px', background: DARK, border: 'none', fontSize: 11, fontWeight: 900, color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', textTransform: 'uppercase' }}>
          VOIR
        </button>
        <button onClick={() => openEdit(r)} style={{ flex: 1, padding: '10px', background: DARK, border: 'none', fontSize: 11, fontWeight: 900, color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', textTransform: 'uppercase' }}>
          MODIFIER
        </button>
        <button onClick={() => handleDelete(r.id)} style={{ flex: 1, padding: '10px', background: '#FF0000', border: 'none', fontSize: 11, fontWeight: 900, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', textTransform: 'uppercase' }}>
          SUPPRIMER
        </button>
      </div>
    </div>
  )
}