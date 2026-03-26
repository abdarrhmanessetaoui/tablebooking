import { CheckCircle, Clock, XCircle, CalendarDays, ArrowRight } from 'lucide-react'
import { useTranslation }        from 'react-i18next'
import Ring                       from './Ring'
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

            {/* Hero number + ring */}
            <div style={heroSection}>
              <div>
                <p style={heroNumber}>{hero}</p>
                <p style={heroLabel}>
                  {t(hero === 1 ? 'reservation' : 'reservation_plural')}
                </p>
              </div>
              <Ring c={c} p={p} a={a} size={88} />
            </div>

{/* Stat blocks — stretch to fill remaining height */}
<div className="db-stat-blocks">
  <StatBlock
    icon={CheckCircle}
    value={c}
    label={t('confirmed_plural')}
    accent={GREEN}
    bg={GREEN_BG}
    delay={50}
    total={total}
  />
  <StatBlock
    icon={Clock}
    value={p}
    label={t('pending_plural')}
    accent={AMBER}
    bg={AMBER_BG}
    delay={80}
    total={total}
  />
  <StatBlock
    icon={XCircle}
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
          {/* Right: reservations */}
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
                  <CalendarDays
                    size={32}
                    color="rgba(43,33,24,0.1)"
                    style={{ display: 'block', margin: '0 auto 12px' }}
                  />
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
                <ArrowRight size={13} strokeWidth={2.5} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}