import ResRow from './ResRow'
import {
  tableWrapper, tableHeader, headerCell,
  rowsContainer, viewAllBtn,
  emptyWrapper, emptyInner, emptyTitle, emptySubtitle,
} from '../../styles/dashboard/reservationsTable.styles'
import { DARK, GOLD } from '../../styles/dashboard/tokens'

// ── View all button ───────────────────────────────────────────────
function ViewAllBtn({ onViewAll, tabLabel }) {
  return (
    <button
      onClick={onViewAll}
      style={{
        width: '100%', padding: '12px 16px',
        background: DARK, border: `2px solid ${DARK}`,
        color: GOLD, fontSize: 13, fontWeight: 900,
        cursor: 'pointer', fontFamily: 'inherit',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
      }}
    >
      <span>Toutes les réservations — {tabLabel}</span>
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ onViewAll, tabLabel }) {
  return (
    <div style={emptyWrapper}>
      <div style={emptyInner}>
        <p style={{ ...emptyTitle, fontSize: 16, fontWeight: 900, marginBottom: 4 }}>AUCUNE RÉSERVATION</p>
        <p style={emptySubtitle}>LES RÉSERVATIONS APPARAÎTRONT ICI</p>
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
          <span key={c.key} style={{ ...headerCell, fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}>{c.label}</span>
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