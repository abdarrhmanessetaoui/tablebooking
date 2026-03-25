import { DARK, GOLD } from '../../../styles/reservations/tokens'

export default function AssignTableCell({ r, onOpenAssign }) {
  const hasTable = !!r.table_idx

  if (hasTable) {
    return (
      <div
        onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px',
          background: DARK,
          border: `2px solid ${DARK}`,
          fontSize: 10, fontWeight: 900,
          color: GOLD,
          cursor: 'pointer', whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }}
      >
        T{r.table_number ?? r.table_idx}
        {r.table_location && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            marginLeft: 3,
            fontSize: 9, fontWeight: 900,
            opacity: 0.8,
          }}>
            ({r.table_location})
          </span>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', background: GOLD,
        border: `2px solid ${DARK}`,
        fontSize: 10, fontWeight: 900,
        color: DARK,
        cursor: 'pointer', fontFamily: 'inherit',
        whiteSpace: 'nowrap', textTransform: 'uppercase',
      }}
    >
      Assigner
    </button>
  )
}