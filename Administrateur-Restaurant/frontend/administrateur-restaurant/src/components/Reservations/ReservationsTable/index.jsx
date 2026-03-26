import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import DesktopTable    from './DesktopTable'
import MobileCards     from './MobileCards'
import Pagination      from './Pagination'
import AssignTableModal from '../AssignTableModal'
import { DARK, GOLD, GOLD_DARK, CREAM, BORDER, GREEN } from '../../../styles/reservations/tokens'

export default function ReservationsTable({
  reservations, openView, openEdit, handleDelete,
  selectedIds, setSelectedIds, highlightId, onTableAssigned,
}) {
  const { t } = useTranslation()
  const [page,         setPage]         = useState(1)
  const [pageSize,     setPageSize]     = useState(25)
  const [assignTarget, setAssignTarget] = useState(null)
  const highlightRef = useRef(null)

  useEffect(() => { setPage(1) }, [reservations.length])

  useEffect(() => {
    if (!highlightId) return
    const idx = reservations.findIndex(r => r.id === highlightId)
    if (idx === -1) return
    setPage(Math.floor(idx / pageSize) + 1)
    setTimeout(() => highlightRef.current?.scrollIntoView({ behavior:'smooth', block:'center' }), 120)
  }, [highlightId, pageSize, reservations])

  const totalPages = Math.ceil(reservations.length / pageSize) || 1
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * pageSize
  const pageItems  = reservations.slice(start, start + pageSize)

  const allSelected  = reservations.length > 0 && reservations.every(r => selectedIds.includes(r.id))
  const someSelected = selectedIds.length > 0 && !allSelected
  const pageAllSel   = pageItems.length > 0 && pageItems.every(r => selectedIds.includes(r.id))
  const pageSomeSel  = pageItems.some(r => selectedIds.includes(r.id)) && !pageAllSel

  const toggleAll  = () => allSelected ? setSelectedIds([]) : setSelectedIds(reservations.map(r => r.id))
  const togglePage = () => {
    const ids = pageItems.map(r => r.id)
    pageAllSel
      ? setSelectedIds(selectedIds.filter(id => !ids.includes(id)))
      : setSelectedIds([...new Set([...selectedIds, ...ids])])
  }
  const toggleOne  = (id) => selectedIds.includes(id)
    ? setSelectedIds(selectedIds.filter(i => i !== id))
    : setSelectedIds([...selectedIds, id])

  return (
    <>
      <style>{`
        .res-table-wrap { display:block; }
        .res-cards-wrap { display:none; }
        @media(max-width:700px){
          .res-table-wrap { display:none; }
          .res-cards-wrap { display:block; }
        }
        @keyframes pulse-gold {
          0%,100%{ box-shadow:inset 3px 0 0 ${GOLD},0 0 0 3px ${GOLD}33; }
          50%    { box-shadow:inset 3px 0 0 ${GOLD},0 0 0 6px ${GOLD}11; }
        }
        .row-highlighted { animation:pulse-gold 1.8s ease 2; }
      `}</style>

      <div style={{ background:'#fff', border:`1px solid ${BORDER}`, fontFamily:"'Inter',system-ui,-apple-system,sans-serif" }}>

        {/* Selection banners */}
        {someSelected && (
          <div style={{ padding:'9px 16px', background:'#ffffff', borderBottom:`1px solid #e8e0d6`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, fontWeight:700, color:GOLD_DARK }}>{t('selected_count', { count: selectedIds.length, plural: selectedIds.length > 1 ? 's' : '' })}</span>
            <button onClick={toggleAll} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, fontWeight:800, color:DARK, textDecoration:'underline', fontFamily:'inherit', padding:0 }}>
              {t('select_all_reservations', { count: reservations.length })}
            </button>
          </div>
        )}
        {allSelected && reservations.length > pageSize && (
          <div style={{ padding:'9px 16px', background:'#ffffff', borderBottom:`1px solid #16A34A`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#16a34a' }}>{t('all_reservations_selected', { count: reservations.length })}</span>
            <button onClick={() => setSelectedIds([])} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, fontWeight:800, color:'#16a34a', textDecoration:'underline', fontFamily:'inherit', padding:0 }}>
              {t('deselect_all')}
            </button>
          </div>
        )}
        {highlightId && pageItems.some(r => r.id === highlightId) && (
          <div style={{ padding:'9px 16px', background:'#ffffff', borderBottom:`4px solid ${GOLD}66`, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:GOLD, flexShrink:0, boxShadow:`0 0 0 3px ${GOLD}33` }} />
            <span style={{ fontSize:12, fontWeight:700, color:GOLD_DARK }}>{t('reservation_selected_dashboard')}</span>
          </div>
        )}

        {/* Desktop */}
        <div className="res-table-wrap">
          <DesktopTable
            pageItems={pageItems} selectedIds={selectedIds} highlightId={highlightId}
            toggleOne={toggleOne} pageAllSel={pageAllSel} pageSomeSel={pageSomeSel}
            togglePage={togglePage} openView={openView} openEdit={openEdit}
            handleDelete={handleDelete} onOpenAssign={setAssignTarget} highlightRef={highlightRef}
          />
        </div>

        {/* Mobile */}
        <div className="res-cards-wrap">
          <MobileCards
            pageItems={pageItems} selectedIds={selectedIds} highlightId={highlightId}
            toggleOne={toggleOne} pageAllSel={pageAllSel} pageSomeSel={pageSomeSel}
            togglePage={togglePage} toggleAll={toggleAll} totalCount={reservations.length}
            openView={openView} openEdit={openEdit} handleDelete={handleDelete}
            onOpenAssign={setAssignTarget} highlightRef={highlightRef}
          />
        </div>

        {/* Pagination */}
        {reservations.length > 0 && (
          <Pagination total={reservations.length} page={safePage} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} start={start} />
        )}
      </div>

      {assignTarget && (
        <AssignTableModal
          reservation={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={updated => { if (onTableAssigned) onTableAssigned(updated); setAssignTarget(null) }}
        />
      )}
    </>
  )
}