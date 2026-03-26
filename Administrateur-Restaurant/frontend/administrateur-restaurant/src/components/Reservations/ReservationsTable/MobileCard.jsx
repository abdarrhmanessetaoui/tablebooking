import { Eye, Pencil, Trash2, CalendarDays, Clock3, Users, Utensils } from 'lucide-react'
import Checkbox        from './Checkbox'
import AssignTableCell from './AssignTableCell'
import { DARK, GOLD, GOLD_DARK, CREAM, BORDER, RED, STATUS_CONFIG } from '../../../styles/reservations/tokens'

function trunc(str, max=16) {
  if (!str) return null
  return str.length > max ? str.slice(0,max)+'…' : str
}

export default function MobileCard({ r, selected, highlighted, rowRef, onToggle, openView, openEdit, handleDelete, onOpenAssign }) {
  const s = STATUS_CONFIG[r.status] || { bg:'#ffffff', color:DARK, label:r.status||'—', dot:'#c8a97e' }

  return (
    <div ref={rowRef} style={{
      background: highlighted?'#ffffff':selected?'#ffffff':'#fff',
      borderLeft: `3px solid ${highlighted?GOLD:selected?GOLD:'transparent'}`,
      borderBottom: `1px solid ${BORDER}`,
      padding:'14px 16px', transition:'all 0.15s', position:'relative',
    }}>
      {highlighted && (
        <div style={{ position:'absolute', top:10, right:14, fontSize:9, fontWeight:900, color:GOLD_DARK, letterSpacing:'0.12em', textTransform:'uppercase', background:'#ffffff', padding:'2px 7px', border:`1px solid ${GOLD}55` }}>
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
          { Icon:CalendarDays, value:r.date,                        gold:false },
          { Icon:Clock3,       value:r.start_time,                  gold:false },
          { Icon:Users,        value:r.guests?`${r.guests}p`:null,  gold:false },
          { Icon:Utensils,     value:trunc(r.service),               gold:true  },
        ].filter(x=>x.value).map((item,i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 9px', background:item.gold?'#f5f0eb':CREAM, fontSize:11, fontWeight:700, color:item.gold?GOLD_DARK:DARK }}>
            <item.Icon size={11} strokeWidth={2.5} color={item.gold?GOLD_DARK:DARK} />
            {item.value}
          </span>
        ))}
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:4 }}>
        <button onClick={() => openView(r)} style={{ flex:1, padding:'8px', background:highlighted?GOLD:'#f5f0eb', border:'none', fontSize:11, fontWeight:700, color:DARK, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, fontFamily:'inherit' }}>
          <Eye size={12} strokeWidth={2.5} /> Voir
        </button>
        <button onClick={() => openEdit(r)} style={{ flex:1, padding:'8px', background:DARK, border:'none', fontSize:11, fontWeight:700, color:GOLD, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, fontFamily:'inherit' }}>
          <Pencil size={12} strokeWidth={2.5} /> Modifier
        </button>
        <button onClick={() => handleDelete(r.id)} style={{ padding: 8, borderRadius: '50%', background:RED, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity=0.85} onMouseLeave={e => e.currentTarget.style.opacity=1}>
          <Trash2 size={16} strokeWidth={2.5} color="#fff" />
        </button>
      </div>
    </div>
  )
}