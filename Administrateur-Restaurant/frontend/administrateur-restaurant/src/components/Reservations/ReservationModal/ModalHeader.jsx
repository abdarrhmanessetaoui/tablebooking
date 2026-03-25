
import { DARK, GOLD } from '../../../styles/reservations/tokens'
export default function ModalHeader({ modalMode, step, editing, onClose }) {
  const titles = { view:'Détail', edit:'Modifier le statut', create:'Nouvelle réservation' }
  const stepTitles = { 1:'Formule & couverts', 2:'Date & heure', 3:'Coordonnées' }
  return (
    <div style={{ background:DARK, padding:'20px 26px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
      <div>
        <p style={{ margin:0, fontSize:10, fontWeight:700, color:GOLD, letterSpacing:'0.16em', textTransform:'uppercase' }}>
          {titles[modalMode]}{modalMode==='create'&&` — Étape ${step}/3`}
        </p>
        <h2 style={{ margin:'3px 0 0', fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>
          {modalMode==='create' ? stepTitles[step] : (editing?.name||'—')}
        </h2>
      </div>
      <button onClick={onClose} style={{ background: GOLD, border: 'none', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
        Fermer
      </button>
    </div>
  )
}