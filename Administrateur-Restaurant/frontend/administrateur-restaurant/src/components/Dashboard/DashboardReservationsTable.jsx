import { ArrowRight, CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ResRow from './ResRow'
import {
  tableWrapper, tableHeader, headerCell,
  rowsContainer, viewAllBtn,
  emptyWrapper, emptyInner, emptyTitle, emptySubtitle,
} from '../../styles/dashboard/reservationsTable.styles'
import { DARK } from '../../styles/dashboard/tokens'

// ── View all button ───────────────────────────────────────────────
function ViewAllBtn({ onViewAll, tabLabel }) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onViewAll}
      style={viewAllBtn}
      onMouseEnter={e => e.currentTarget.style.background = '#3d2d1e'}
      onMouseLeave={e => e.currentTarget.style.background = DARK}
    >
      <span>{t('view_all_reservations_period', { period: tabLabel })}</span>
      <ArrowRight size={13} strokeWidth={2.5} />
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ onViewAll, tabLabel }) {
  const { t } = useTranslation()
  return (
    <div style={emptyWrapper}>
      <div style={emptyInner}>
        <CalendarDays
          size={36}
          color="rgba(200,169,126,0.9)"
          style={{ marginBottom: 14 }}
        />
        <p style={emptyTitle}>{t('no_reservations')}</p>
        <p style={emptySubtitle}>{t('reservations_will_appear_here')}</p>
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
  const { t } = useTranslation()
  if (!reservations?.length) {
    return <EmptyState onViewAll={onViewAll} tabLabel={tabLabel} />
  }

  const COLS = [
    ...(showDate ? [{ key: 'date',       label: t('date'),      flex: 1.1  }] : []),
    { key: 'name',       label: t('name'),       flex: 1.8  },
    { key: 'start_time', label: t('time'),     flex: 0.7  },
    { key: 'guests',     label: t('guests'),     flex: 0.65 },
    { key: 'service',    label: t('service'),   flex: 1.0  },
    { key: 'status',     label: t('status'),    flex: 1.1  },
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
