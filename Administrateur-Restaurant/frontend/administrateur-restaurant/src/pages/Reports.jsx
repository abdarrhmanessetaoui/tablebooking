import { useState } from 'react'
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
import { doPDF } from '../utils/reportsPDF'
import { useTranslation } from 'react-i18next'
import '../styles/Reports/Reports.css'

const DARK = '#423428'
const GOLD = '#c8a97e'
const GOLD_DK = '#a8834e'
const WHITE = '#ffffff'
const GREEN = '#16A34A'
const AMBER = '#C8A97E'
const RED = '#DC2626'
const CREAM = '#ffffff'

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
      const PERIOD_OPTS = [
        { key: 'all',   label: t('reports_module.all') },
        { key: 'month', label: t('reports_module.this_month') },
        { key: 'week',  label: t('reports_module.this_week') },
        { key: 'today', label: t('reports_module.today') },
      ]
      const STATUS_OPTS = [
        { key: 'all',       label: t('reports_module.all') },
        { key: 'confirmed', label: t('reports_module.confirmed') },
        { key: 'pending',   label: t('reports_module.pending') },
        { key: 'cancelled', label: t('reports_module.cancelled') },
      ]
      const pL = PERIOD_OPTS.find(p => p.key === period)?.label ?? t('reports_module.all')
      const sL = STATUS_OPTS.find(s => s.key === status)?.label ?? t('reports_module.all')
      await doPDF(data?.summary || {}, pL, sL, t, i18n.language)
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  const s = data?.summary || {}

  return (
    <div className="rp-page">
      {/* HEADER */}
      <FadeUp delay={0}>
        <div className="rp-header">
          <div>
            <h1 className="rp-title">{t('reports_module.title')}</h1>
            <p className="rp-subtitle page-subtitle" />
          </div>
          <div className="rp-header-actions">
            <ExportButton onClick={handleExport} disabled={exporting} exporting={exporting} />
          </div>
        </div>
      </FadeUp>

      {/* DIVIDER */}
      <FadeUp delay={10}>
        <div className="rp-divider" />
      </FadeUp>

      {/* ERROR */}
      {error && (
        <FadeUp delay={5}>
          <div className="rp-error">{error}</div>
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
        <div className="rp-sum" style={{ marginBottom: 32 }}>
          <SumCard icon={BarChart2}    value={s.total ?? 0}     label={t('reports_module.total')}      accent={DARK}    bg={WHITE}  delay={40}  />
          <SumCard icon={CheckCircle}  value={s.confirmed ?? 0} label={t('reports_module.confirmed')}  accent={GREEN}   bg={WHITE}  delay={70}  />
          <SumCard icon={Clock}        value={s.pending ?? 0}   label={t('reports_module.pending')}    accent={AMBER}   bg={WHITE}  delay={100} />
          <SumCard icon={XCircle}      value={s.cancelled ?? 0} label={t('reports_module.cancelled')}  accent={RED}     bg={WHITE}  delay={130} />
          <SumCard icon={Users}        value={s.avg_guests ? `${Number(s.avg_guests).toFixed(1)}` : '0'} label={t('reports_module.avg_guests')} accent={GOLD_DK} bg={CREAM} delay={160} />
        </div>
      </FadeUp>

      <div className="rp-divider" style={{ margin: '0 0 32px' }} />

      {/* HEURE + JOUR */}
      <FadeUp delay={0}>
        <SectionTitle title={t('reports_module.temporal_title')} />
        <div className="rp-2" style={{ marginBottom: 32 }}>
          <BarChart data={data?.by_hour} title={t('reports_module.by_hour')} subtitle={t('reports_module.by_hour_sub')} barColor={GOLD} />
          <BarChart data={data?.by_day}  title={t('reports_module.by_day')}  subtitle={t('reports_module.by_day_sub')}  barColor={GOLD} />
        </div>
      </FadeUp>

      <div className="rp-divider" style={{ margin: '0 0 32px' }} />

      {/* SERVICES + COUVERTS */}
      <FadeUp delay={0}>
        <SectionTitle title={t('reports_module.services_and_guests')} />
        <div className="rp-2" style={{ marginBottom: 32 }}>
          <ServiceChart data={data?.by_service ?? {}} />
          <BarChart data={data?.by_guests} title={t('reports_module.by_guests')} subtitle={t('reports_module.by_guests_sub')} barColor={AMBER} />
        </div>
      </FadeUp>

      <div className="rp-divider" style={{ margin: '0 0 32px' }} />

      {/* SEMAINE + MOIS + ANNÉE */}
      <FadeUp delay={0}>
        <SectionTitle title={t('reports_module.trends_title')} />
        <div className="rp-3" style={{ marginBottom: 0 }}>
          <BarChart data={data?.by_week}  title={t('reports_module.by_week')}  subtitle={t('reports_module.by_week_sub')}  barColor={GOLD} />
          <BarChart data={data?.by_month} title={t('reports_module.by_month')} subtitle={t('reports_module.by_month_sub')} barColor={GOLD} />
          <BarChart data={data?.by_year}  title={t('reports_module.by_year')}  subtitle={t('reports_module.by_year_sub')}  barColor={DARK} highlight />
        </div>
      </FadeUp>

      <div style={{ height: 48 }} />
    </div>
  )
}