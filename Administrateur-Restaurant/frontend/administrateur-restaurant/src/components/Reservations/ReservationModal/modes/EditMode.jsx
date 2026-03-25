
import Label from '../../shared/Label'
import { DARK, GOLD, STATUS_CONFIG } from '../../../../styles/reservations/tokens'

export default function EditMode({ editing, form, setForm, handleSubmit, onClose }) {
  return (
    <>
      <div style={{ background:'#faf8f5', padding:'14px 18px', display:'flex', flexDirection:'column', gap:8 }}>
        {[['Date',editing?.date],['Heure',editing?.start_time],['Couverts',editing?.guests]].map(([l,v]) => v ? (
          <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{l}</span>
            <span style={{ fontSize:13, fontWeight:800, color:DARK }}>{v}</span>
          </div>
        ) : null)}
      </div>
      <div>
        <Label text="Statut" />
        <div style={{ display:'flex', gap:6 }}>
          {['Confirmed','Pending','Cancelled'].map(s => (
            <button key={s} onClick={() => setForm({...form,status:s})}
              style={{ flex:1, padding:'11px 6px', background:form.status===s?DARK:'#f5f0eb', border:'none', fontSize:12, fontWeight:900, color:form.status===s?GOLD:'#888', cursor:'pointer' }}>
              {STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onClose} style={{ flex:1, padding:'12px', background:GOLD, border:'none', fontSize:13, fontWeight:900, color:DARK, cursor:'pointer' }}>
          Annuler
        </button>
        <button onClick={handleSubmit}
          style={{
            flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'12px', background:DARK, border:'none', fontSize:14, fontWeight:900, color:GOLD, cursor:'pointer',
            textTransform: 'uppercase'
          }}>
          Enregistrer le statut
        </button>
      </div>
    </>
  )
}