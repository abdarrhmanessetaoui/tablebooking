import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/settings/useRestaurantInfo.js'
import FadeUp from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import Btn from '../components/Dashboard/Btn'
import LiveClock from '../components/Dashboard/LiveClock'
import TabPanel from '../components/Dashboard/TabPanel'
import { exportPDF } from '../utils/export'
import { getToken } from '../utils/auth'
import { apiPath } from '../utils/api'

import {
  page, header, headerLeft,
  h1, subtitle, divider,
  errorBanner, tabsCSS,
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, WHITE, AMBER, AMBER_BG,
  TODAY_DATE, TOMORROW_DATE
} from '../styles/dashboard/tokens'

export default function Dashboard() {
  const { t } = useTranslation()
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info } = useRestaurantInfo()
  const navigate = useNavigate()

  const [tab, setTab] = useState('today')
  const [exporting, setExporting] = useState(false)
  const [todayRes, setTodayRes] = useState([])
  const [tomRes, setTomRes] = useState([])
  const [monthRes, setMonthRes] = useState([])

  // ── Fetch all reservation lists ─────────────────────────────────
  const loadAll = useCallback(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const yr = now.getFullYear()
    const mo = String(now.getMonth() + 1).padStart(2, '0')

    fetch(apiPath(`restaurant/reservations?date=${TODAY_DATE}`), { headers: h })
      .then(r => r.json())
      .then(d => setTodayRes(Array.isArray(d) ? d : []))
      .catch(() => { })

    fetch(apiPath(`restaurant/reservations?date=${TOMORROW_DATE}`), { headers: h })
      .then(r => r.json())
      .then(d => setTomRes(Array.isArray(d) ? d : []))
      .catch(() => { })

    fetch(apiPath(`restaurant/reservations?month=${yr}-${mo}`), { headers: h })
      .then(r => r.json())
      .then(d => {
        setMonthRes(Array.isArray(d) ? d : [])
      })
      .catch(() => { })

    refetch()
  }, [refetch])


  useEffect(() => {
    loadAll()
    const id = setInterval(loadAll, 60_000)
    return () => clearInterval(id)
  }, [loadAll])

  // ── Tab config ──────────────────────────────────────────────────
  const TABS = [
    { key: 'today', label: t('today'), res: todayRes, date: TODAY_DATE },
    { key: 'tomorrow', label: t('tomorrow'), res: tomRes, date: TOMORROW_DATE },
    { key: 'month', label: t('this_month'), res: monthRes, date: null },
  ]
  const active = TABS.find(tb => tb.key === tab)

  // ── Row click → navigate to reservation ─────────────────────────
  function handleRowClick(r) {
    navigate('/reservations', {
      state: { openId: r.id, filterDate: active?.date ?? null }
    })
  }

  // ── PDF export ──────────────────────────────────────────────────
  async function handleExport() {
    setExporting(true)
    try {
      await exportPDF(stats, active?.res || [], active?.label || t('today'))
    } catch (e) {
      console.error('Export failed:', e)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    if (!loading && stats) {
      window.dispatchEvent(new CustomEvent('app-ready'))
    }
  }, [loading, stats])

  if (loading) return <Spinner fullPage />

  return (
    <>
      <style>{tabsCSS}</style>

      <div style={page}>

        {/* ── Header ─────────────────────────────────────────── */}
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1}>{t('dashboard_title')}</h1>
              <p className="page-subtitle" style={subtitle}>
                <LiveClock />
              </p>
            </div>
          </div>
        </FadeUp>

        <div style={divider} />

        {/* ── Tabs ───────────────────────────────────────────── */}
        <FadeUp delay={40}>
          <div className="db-tabs">
            {TABS.map(tb => (
              <button
                key={tb.key}
                className={`db-tab${tab === tb.key ? ' active' : ''}`}
                onClick={() => setTab(tb.key)}
              >
                {tb.label}
                {tb.key === 'today' && stats.today_pending > 0 && (
                  <span className="tab-pill">{stats.today_pending}</span>
                )}
                {tb.key === 'tomorrow' && (stats.tomorrow_pending ?? 0) > 0 && (
                  <span className="tab-pill">{stats.tomorrow_pending}</span>
                )}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── Tab content ────────────────────────────────────── */}
        <FadeUp delay={80} key={tab}>
          <TabPanel
            tab={tab}
            stats={stats}
            reservations={active?.res ?? []}
            tabLabel={active?.label ?? ''}
            onViewAll={() => navigate('/reservations', {
              state: active?.date ? { filterDate: active.date } : {}
            })}
            onRowClick={handleRowClick}
          />
        </FadeUp>

        {/* ── Error ──────────────────────────────────────────── */}
        {error && (
          <FadeUp delay={0}>
              {t('error_loading')} {error}
          </FadeUp>
        )}

      </div>
    </>
  )
}
