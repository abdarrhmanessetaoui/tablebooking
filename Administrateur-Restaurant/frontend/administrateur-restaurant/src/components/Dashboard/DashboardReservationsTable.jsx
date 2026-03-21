import { ArrowRight, CalendarDays } from 'lucide-react'
import ResRow from './ResRow'
import {
  tableWrapper, tableHeader, headerCell,
  rowsContainer, viewAllBtn,
  emptyWrapper, emptyInner, emptyTitle, emptySubtitle,
} from '../../styles/dashboard/reservationsTable.styles'
import { DARK } from '../../styles/dashboard/tokens'

// ── View all button ───────────────────────────────────────────────
function ViewAllBtn({ onViewAll, tabLabel }) {
  return (
    <button
      onClick={onViewAll}
      style={viewAllBtn}
      onMouseEnter={e => e.currentTarget.style.background = '#3d2d1e'}
      onMouseLeave={e => e.currentTarget.style.background = DARK}
    >
      <span>Toutes les réservations — {tabLabel}</span>
      <ArrowRight size={13} strokeWidth={2.5} />
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ onViewAll, tabLabel }) {
  return (
    <div style={emptyWrapper}>
      <div style={emptyInner}>
        <CalendarDays
          size={36}
          color="rgba(43,33,24,0.1)"
          style={{ marginBottom: 14 }}
        />
        <p style={emptyTitle}>Aucune réservation</p>
        <p style={emptySubtitle}>Les réservations apparaîtront ici</p>
      </div>
      <ViewAllBtn onViewAll={onViewAll} tabLabel={tabLabel} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function DashboardReservationsTable({
  reservations,
  onViewAll,
  tabLabel,
  onRowClick,
  showDate,
}) {
  if (!reservations?.length) {
    return <EmptyState onViewAll={onViewAll} tabLabel={tabLabel} />
  }

  const COLS = [
    ...(showDate ? [{ key: 'date',       label: 'Date',      flex: 1.1  }] : []),
    { key: 'name',       label: 'Nom',       flex: 1.8  },
    { key: 'start_time', label: 'Heure',     flex: 0.7  },
    { key: 'guests',     label: 'Personnes', flex: 0.65 },
    { key: 'service',    label: 'Service',   flex: 1.0  },
    { key: 'status',     label: 'Statut',    flex: 1.1  },
    { key: '_cta',       label: '',          flex: 0.3  },
  ]
  const tpl = COLS.map(c => `${c.flex}fr`).join(' ')

  return (
    <div style={tableWrapper}>

      {/* Header */}
      <div style={tableHeader(tpl)}>
        {COLS.map(c => (
          <span key={c.key} style={headerCell}>{c.label}</span>
        ))}
      </div>

      {/* Rows */}
      <div style={rowsContainer}>
        {reservations.slice(0, 8).map((r, i) => (
          <ResRow
            key={r.id ?? i}
            r={r}
            i={i}
            tpl={tpl}
            showDate={showDate}
            onRowClick={onRowClick}
          />
        ))}
      </div>

      {/* Footer */}
      <ViewAllBtn onViewAll={onViewAll} tabLabel={tabLabel} />

    </div>
  )
}