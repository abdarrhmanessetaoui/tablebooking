import { useState } from 'react'
import { LayoutGrid, Link2 } from 'lucide-react'
import { DARK, GOLD, GREEN, BORDER } from '../../../styles/reservations/tokens'

export default function AssignTableCell({ r, onOpenAssign }) {
  const [hov, setHov] = useState(false)
  const hasTable = !!r.table_idx

  // Prefer the real table number/name returned by the API.
  // Fall back to the raw idx so it never shows blank.
  const tableLabel = r.table_number ?? r.table_name ?? r.table_idx

  if (hasTable) {
    return (
      <div
        onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        title="Changer la table"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px',
          background: hov ? DARK : '#f0fdf4',
          border: `1px solid ${hov ? DARK : GREEN}`,
          fontSize: 11, fontWeight: 800,
          color: hov ? GOLD : '#16a34a',
          cursor: 'pointer', transition: 'all 0.12s', whiteSpace: 'nowrap',
        }}
      >
        <LayoutGrid size={10} strokeWidth={2.5} />
        Table {tableLabel}
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', background: 'none',
        border: `1.5px dashed ${hov ? DARK : BORDER}`,
        fontSize: 11, fontWeight: 800,
        color: hov ? DARK : 'rgba(43,33,24,0.4)',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.12s', whiteSpace: 'nowrap',
      }}
    >
      <Link2 size={10} strokeWidth={2.5} />
      Assigner
    </button>
  )
}