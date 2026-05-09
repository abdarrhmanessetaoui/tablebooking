import { useTranslation } from 'react-i18next'
import StatBlock                  from './StatBlock'
import DashboardReservationsTable from './DashboardReservationsTable'
import ResCardMobile              from './ResCardMobile'
import {
  tabPanelCSS,
  heroSection, heroNumber, heroLabel,
  statsList,
  mobileEmpty, mobileEmptyTitle, mobileEmptySubtitle,
  mobileViewAllBtn,
} from '../../styles/dashboard/tabPanel.styles'
import {
  DARK, WHITE,
  GREEN, GREEN_BG,
  RED,   RED_BG,
  AMBER, AMBER_BG,
} from '../../styles/dashboard/tokens'

export default function TabPanel({ tab, stats, reservations, onViewAll, tabLabel, onRowClick }) {
  const { t } = useTranslation()

  // ── Derive counts per tab ───────────────────────────────────────
  const c = tab === 'today'    ? stats.today_confirmed
          : tab === 'tomorrow' ? (stats.tomorrow_confirmed ?? 0)
          : stats.confirmed

  const p = tab === 'today'    ? stats.today_pending
          : tab === 'tomorrow' ? (stats.tomorrow_pending   ?? 0)
          : stats.pending

  const a = tab === 'today'    ? stats.today_cancelled
          : tab === 'tomorrow' ? (stats.tomorrow_cancelled ?? 0)
          : stats.cancelled

  const hero = tab === 'today'    ? stats.today
             : tab === 'tomorrow' ? (stats.tomorrow ?? 0)
             : stats.total

  const total       = c + p + a || 1
  const periodLabel = tab === 'today'    ? t('today')
                    : tab === 'tomorrow' ? t('tomorrow')
                    : t('this_month')
  const showDate    = tab === 'month'

  return (
    <>
      <style>{tabPanelCSS}</style>

      <div className="db-card">
        <div className="db-body">

          {/* ── Left: stats panel ─────────────────────────────── */}
          <div className="db-left db-stats-sticky">

            {/* Hero number   no ring chart */}
            <div style={heroSection}>
              <div>
                <p style={heroNumber}>{hero}</p>
                <p style={heroLabel}>
                  {t(hero === 1 ? 'reservation' : 'reservation_plural')}
                </p>
              </div>
            </div>

            {/* Stat blocks   stretch to fill remaining height */}
            <div className="db-stat-blocks">
              <StatBlock
                value={c}
                label={t('confirmed_plural')}
                accent={GREEN}
                bg={GREEN_BG}
                delay={50}
                total={total}
              />
              <StatBlock
                value={p}
                label={t('pending_plural')}
                accent={AMBER}
                bg={AMBER_BG}
                delay={80}
                total={total}
              />
              <StatBlock
                value={a}
                label={t('cancelled_plural')}
                accent={RED}
                bg={RED_BG}
                delay={110}
                total={total}
              />
            </div>
          </div>

          {/* ── Right: reservations ───────────────────────────── */}
          <div className="db-right">

            {/* Desktop table */}
            <div className="res-desktop">
              <DashboardReservationsTable
                reservations={reservations}
                onViewAll={onViewAll}
                tabLabel={periodLabel}
                onRowClick={onRowClick}
                showDate={showDate}
              />
            </div>

            {/* Mobile cards */}
            <div className="res-mobile">
              {reservations?.length ? (
                reservations.slice(0, 6).map((r, i) => (
                  <ResCardMobile
                    key={r.id ?? i}
                    r={r}
                    i={i}
                    onRowClick={onRowClick}
                  />
                ))
              ) : (
                <div style={mobileEmpty}>
                  <p style={mobileEmptyTitle}>{t('no_reservations')}</p>
                  <p style={mobileEmptySubtitle}>{periodLabel}</p>
                </div>
              )}

              {/* Mobile view all */}
              <button
                onClick={onViewAll}
                style={mobileViewAllBtn}
              >
                <span>{t('view_all_reservations_period', { period: periodLabel })}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
