import { useState } from 'react'

import InfoRow    from '../../shared/InfoRow'
import StatusBadge from '../../shared/StatusBadge'
import { DARK, GOLD, RED } from '../../../../styles/reservations/tokens'

export default function ViewMode({ editing, setForm, setModalMode, handleDelete }) {

  return (
    <>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <InfoRow label="Nom"      value={editing?.name}       />
        <InfoRow label="Tél"      value={editing?.phone}      />
        <InfoRow label="Email"    value={editing?.email}      />
        <InfoRow label="Date"     value={editing?.date}       />
        <InfoRow label="Heure"    value={editing?.start_time} />
        <InfoRow label="Couverts" value={editing?.guests}     />
        <InfoRow label="Service"  value={editing?.service}    />
        <InfoRow label="Notes"    value={editing?.notes}      />
      </div>
      <StatusBadge status={editing?.status} />
      <div style={{ height:2, background:'#f0ebe4' }} />
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={() => { setForm({...editing}); setModalMode('edit') }}
          style={{
            flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'12px', background:DARK, border:'none', fontSize:13, fontWeight:900, color:GOLD, cursor:'pointer',
            textTransform: 'uppercase'
          }}>
          Modifier le statut
        </button>
        <button onClick={() => handleDelete(editing.id)}
          style={{
            padding:'12px 18px', background:'#FF0000', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase'
          }}>
          Supprimer
        </button>
      </div>
    </>
  )
}