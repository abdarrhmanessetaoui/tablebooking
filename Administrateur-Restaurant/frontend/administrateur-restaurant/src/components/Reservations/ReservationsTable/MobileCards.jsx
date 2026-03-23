import MobileCard from './MobileCard.jsx'

export default function MobileCards({
  pageItems = [],
  selectedIds = [],
  highlightId,
  toggleOne = () => {},
  pageAllSel,
  pageSomeSel,
  togglePage = () => {},
  toggleAll = () => {},
  totalCount = 0,
  openView,
  openEdit,
  handleDelete,
  onOpenAssign,
  highlightRef
}) {

  if (!pageItems || pageItems.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#777' }}>
        No reservations
      </div>
    )
  }

  return (
    <div style={{ padding: 12, display: 'grid', gap: 12 }}>

      {pageItems.map((reservation) => {
        if (!reservation) return null

        return (
          <MobileCard
            key={reservation.id}
            reservation={reservation}
            isSelected={selectedIds.includes(reservation.id)}
            isHighlighted={reservation.id === highlightId}
            toggleOne={toggleOne}
            openView={openView}
            openEdit={openEdit}
            handleDelete={handleDelete}
            onOpenAssign={onOpenAssign}
            highlightRef={reservation.id === highlightId ? highlightRef : null}
          />
        )
      })}

    </div>
  )
}