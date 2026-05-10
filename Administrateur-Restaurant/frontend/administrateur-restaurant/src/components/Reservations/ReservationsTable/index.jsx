import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import DesktopTable    from './DesktopTable'
import MobileCards     from './MobileCards'
import Pagination      from './Pagination'
import AssignTableModal from '../AssignTableModal'
import { DARK, LIGHT_BROWN, DARK_LIGHT, WHITE, BORDER, RADIUS } from '../../../styles/dashboard/tokens'

export default function ReservationsTable({
  reservations, openView, openEdit, handleDelete,
  selectedIds, setSelectedIds, highlightId, onTableAssigned,
}) {
  const { t, i18n } = useTranslation()
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
        .row-highlighted { background: rgba(193, 154, 107, 0.05) !important; }
        
        .tbl-list__banner {
          background: #C19A6B;
          color: #ffffff;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .tbl-list__banner--green { background: #51a351; }
        .tbl-list__banner-text { font-size: 13px; font-weight: 900; flex-grow: 1; }
        .tbl-list__banner-action {
          background: #ffffff; border: none; color: #C19A6B;
          padding: 6px 14px; border-radius: 4px; font-size: 11px;
          font-weight: 900; cursor: pointer; text-transform: uppercase;
          transition: opacity 0.2s ease; font-family: inherit;
          line-height: 1; display: inline-flex; align-items: center; justify-content: center;
        }
        .tbl-list__banner-action:hover { opacity: 0.95; }
      `}</style>

      <div style={{ background: WHITE, border:`1px solid ${BORDER}`, borderRadius: RADIUS.sm, overflow: 'hidden' }}>

        {/* Partial selection banner */}
        {selectedIds.length > 0 && !allSelected && (
          <div className="tbl-list__banner">
            <button onClick={toggleAll} className="tbl-list__banner-action">
              {i18n.language === 'ar' ? 'تحديد الكل' : 'TOUT SÉLECTIONNER'}
            </button>
          </div>
        )}

        {/* All selected banner */}
        {allSelected && reservations.length > pageSize && (
          <div className="tbl-list__banner tbl-list__banner--green">
            <span className="tbl-list__banner-text">
              {i18n.language === 'ar'
                ? `تم اختيار جميع الحجوزات`
                : `Toutes les réservations sélectionnées`
              }
            </span>
            <button onClick={() => setSelectedIds([])} className="tbl-list__banner-action">
              {i18n.language === 'ar' ? 'إلغاء التحديد' : 'DÉSÉLECTIONNER'}
            </button>
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
