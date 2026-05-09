import { useTranslation } from 'react-i18next'
import MobileCard from './MobileCard'
import Checkbox   from './Checkbox'
import { DARK, LIGHT_BROWN, BORDER } from '../../../styles/reservations/tokens'

export default function MobileCards({ pageItems, selectedIds, highlightId, toggleOne, pageAllSel, pageSomeSel, togglePage, toggleAll, totalCount, openView, openEdit, handleDelete, onOpenAssign, highlightRef }) {
  const { t } = useTranslation()
  const someSelected = selectedIds.length > 0 && !pageItems.every(r => selectedIds.includes(r.id))

  return (
    <div>
      <div style={{ padding:'11px 16px', background:DARK, display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', flex:1 }}>
          {selectedIds.length > 0 ? t('selected_count', { count: selectedIds.length }) : t('select_page')}
        </span>
        {someSelected && (
          <button onClick={toggleAll} style={{ background:'none', border:`1px solid rgba(200,169,126,0.4)`, padding:'4px 10px', fontSize:10, fontWeight:700, color:LIGHT_BROWN, cursor:'pointer', fontFamily:'inherit' }}>
            {t('select_page')}
          </button>
        )}
      </div>

      {pageItems.length === 0 ? (
        <div style={{ padding:'48px 24px', textAlign:'center', fontSize:13, fontWeight:700, color:DARK }}>
          {t('no_reservations_found')}
        </div>
      ) : pageItems.map(r => (
        <MobileCard
          key={r.id} r={r}
          selected={selectedIds.includes(r.id)}
          highlighted={r.id === highlightId}
          rowRef={r.id === highlightId ? highlightRef : null}
          onToggle={() => toggleOne(r.id)}
          openView={openView} openEdit={openEdit} handleDelete={handleDelete}
          onOpenAssign={onOpenAssign}
        />
      ))}
    </div>
  )
}
