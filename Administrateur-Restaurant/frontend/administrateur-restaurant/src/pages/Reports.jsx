import { useState, useEffect } from 'react'
import { FileDown, BarChart2, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import useReports from '../hooks/Reports/useReports'
import useServices from '../hooks/Reservations/useServices'
import FadeUp from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import ReportsFilters from '../components/Reports/ReportsFilters'
import BarChart from '../components/Reports/BarChart'
import SumCard from '../components/Reports/SumCard'
import SectionTitle from '../components/Reports/SectionTitle'
import ServiceChart from '../components/Reports/ServiceChart'
import ExportButton from '../components/Reports/ExportButton'
import { exportPDF } from '../utils/export'
import { useTranslation } from 'react-i18next'
import {
  page, header, headerLeft, h1, divider, errorBanner
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, WHITE, BORDER, RADIUS, FONT_URL, BROWN_BG
} from '../styles/dashboard/tokens'

export default function Reports() {
  const { t, i18n } = useTranslation()
  const {
    data, loading, error,
    period, setPeriod,
    status, setStatus,
    search, setSearch,
    filterService, setFilterService,
    filterDate, setFilterDate,
    clearFilters,
    services: hookServices,
  } = useReports()

  const { services: extraServices } = useServices()
  const services = hookServices?.length ? hookServices : (extraServices || [])

  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const summary = data?.summary || {}
      const statsMap = {
        today:           summary.total     || 0,
        today_confirmed: summary.confirmed || 0,
        today_pending:   summary.pending   || 0,
        today_cancelled: summary.cancelled || 0,
        tomorrow:        ' ',
        total:           summary.total     || 0,
        avg:             summary.avg_guests || 0
      }
      await exportPDF(statsMap, [], t('reports_module.title'))
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  useEffect(() => { if (!loading) window.dispatchEvent(new CustomEvent("app-ready")) }, [loading]); if (loading) return <Spinner fullPage />

  const s = data?.summary || {}

  const GREEN = '#22C55E'
  const AMBER = LIGHT_BROWN
  const RED   = '#EF4444'

  return (
    <div style={page}>
      <link href={FONT_URL} rel="stylesheet" />
      <style>{`
        .rp-sum { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .rp-2 { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 32px; }
        .rp-3 { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 32px; }
        @media (min-width: 768px) {
          .rp-2 { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .rp-3 { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* HEADER */}
      <FadeUp delay={0}>
        <div style={header}>
          <div style={headerLeft}>
            <h1 style={h1}>{t('reports_module.title')}</h1>
          </div>
        </div>
      </FadeUp>

      <div style={divider} />

      {/* ERROR */}
      {error && (
        <FadeUp delay={5}>
          <div style={errorBanner}>{error}</div>
        </FadeUp>
      )}

      {/* FILTERS */}
      <FadeUp delay={15}>
        <ReportsFilters
          filterStatus={status}        setFilterStatus={setStatus}
          filterService={filterService} setFilterService={setFilterService}
          filterDate={filterDate}       setFilterDate={setFilterDate}
          clearFilters={clearFilters}
          services={services}
        />
      </FadeUp>

      {/* SUMMARY */}
      <FadeUp delay={20}>
        <SectionTitle title={t('reports_module.summary_title')} count={s.total ?? 0} />
        <div className="rp-sum">
          <SumCard icon={BarChart2}    value={s.total ?? 0}     label={t('reports_module.total')}      accent={DARK}    bg={WHITE}  delay={40}  />
          <SumCard icon={CheckCircle}  value={s.confirmed ?? 0} label={t('reports_module.confirmed')}  accent={GREEN}   bg={WHITE}  delay={70}  />
          <SumCard icon={Clock}        value={s.pending ?? 0}   label={t('reports_module.pending')}    accent={AMBER}   bg={WHITE}  delay={100} />
          <SumCard icon={XCircle}      value={s.cancelled ?? 0} label={t('reports_module.cancelled')}  accent={RED}     bg={WHITE}  delay={130} />
          <SumCard icon={Users}        value={s.avg_guests ? `${Number(s.avg_guests).toFixed(1)}` : '0'} label={t('reports_module.avg_guests')} accent={DARK} bg={WHITE} delay={160} />
        </div>
      </FadeUp>

      <div style={{ ...divider, margin: '0 0 32px' }} />

      {/* HEURE + JOUR */}
      <FadeUp delay={0}>
        <SectionTitle title={t('reports_module.temporal_title')} />
        <div className="rp-2">
          <BarChart data={data?.by_hour} title={t('reports_module.by_hour')} subtitle={t('reports_module.by_hour_sub')} barColor={LIGHT_BROWN} />
          <BarChart data={data?.by_day}  title={t('reports_module.by_day')}  subtitle={t('reports_module.by_day_sub')}  barColor={LIGHT_BROWN} />
        </div>
      </FadeUp>

      <div style={{ ...divider, margin: '0 0 32px' }} />

      {/* SERVICES + COUVERTS */}
      <FadeUp delay={0}>
        <SectionTitle title={t('reports_module.services_and_guests')} />
        <div className="rp-2">
          <ServiceChart data={data?.by_service ?? {}} />
          <BarChart data={data?.by_guests} title={t('reports_module.by_guests')} subtitle={t('reports_module.by_guests_sub')} barColor={LIGHT_BROWN} />
        </div>
      </FadeUp>

      <div style={{ ...divider, margin: '0 0 32px' }} />

      {/* SEMAINE + MOIS + ANNÉE */}
      <FadeUp delay={0}>
        <SectionTitle title={t('reports_module.trends_title')} />
        <div className="rp-3">
          <BarChart data={data?.by_week}  title={t('reports_module.by_week')}  subtitle={t('reports_module.by_week_sub')}  barColor={LIGHT_BROWN} />
          <BarChart data={data?.by_month} title={t('reports_module.by_month')} subtitle={t('reports_module.by_month_sub')} barColor={LIGHT_BROWN} />
          <BarChart data={data?.by_year}  title={t('reports_module.by_year')}  subtitle={t('reports_module.by_year_sub')}  barColor={DARK} highlight />
        </div>
      </FadeUp>

      <div style={{ height: 48 }} />
    </div>
  )
}
