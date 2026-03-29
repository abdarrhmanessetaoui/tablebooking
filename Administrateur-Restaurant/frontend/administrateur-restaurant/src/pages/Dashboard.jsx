import { useState, useEffect, useCallback } from 'react'
import { useNavigate }   from 'react-router-dom'
import { FileDown }      from 'lucide-react'
import { useTranslation } from 'react-i18next'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import Btn               from '../components/Dashboard/Btn'
import LiveClock         from '../components/Dashboard/LiveClock'
import TabPanel          from '../components/Dashboard/TabPanel'
import { exportPDF }     from '../utils/export'
import { getToken }      from '../utils/auth'

import {
  page, header, headerLeft,
  h1, subtitle, divider,
  errorBanner, tabsCSS,
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, GOLD, WHITE, AMBER, AMBER_BG,
  TODAY_DATE, TOMORROW_DATE,
} from '../styles/dashboard/tokens'

export default function Dashboard() {
  const { t } = useTranslation()
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info }   = useRestaurantInfo()
  const navigate   = useNavigate()

  const [tab,       setTab]       = useState('today')
  const [exporting, setExporting] = useState(false)
  const [todayRes,  setTodayRes]  = useState([])
  const [tomRes,    setTomRes]    = useState([])
  const [monthRes,  setMonthRes]  = useState([])

  // ── Fetch all reservation lists ─────────────────────────────────
  const loadAll = useCallback(() => {
    const h   = { Authorization: `Bearer ${getToken()}` }
    const now = new Date()
    const yr  = now.getFullYear()
    const mo  = String(now.getMonth() + 1).padStart(2, '0')

    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`, { headers: h })
      .then(r => r.json())
      .then(d => setTodayRes(Array.isArray(d) ? d : []))
      .catch(() => {})

    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers: h })
      .then(r => r.json())
      .then(d => setTomRes(Array.isArray(d) ? d : []))
      .catch(() => {})

    fetch(`http://localhost:8000/api/restaurant/reservations?month=${yr}-${mo}`, { headers: h })
      .then(r => r.json())
      .then(d => setMonthRes(Array.isArray(d) ? d : []))
      .catch(() => {})

    refetch()
  }, [refetch])

  useEffect(() => {
    loadAll()
    const id = setInterval(loadAll, 60_000)
    return () => clearInterval(id)
  }, [loadAll])

  // ── Tab config ──────────────────────────────────────────────────
  const TABS = [
    { key: 'today',    label: t('today'),      res: todayRes, date: TODAY_DATE    },
    { key: 'tomorrow', label: t('tomorrow'),   res: tomRes,   date: TOMORROW_DATE },
    { key: 'month',    label: t('this_month'), res: monthRes, date: null          },
  ]
  const active = TABS.find(t => t.key === tab)

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
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s    = document.createElement('script')
          s.src      = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload   = res
          s.onerror  = rej
          document.head.appendChild(s)
        })
      }
      exportPDF(stats, active?.res || [], active?.label || t('today'))
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{tabsCSS}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

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
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? t('exporting') : t('export_pdf')}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── Divider ────────────────────────────────────────── */}
        <FadeUp delay={10}>
          <div style={divider} />
        </FadeUp>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <FadeUp delay={20}>
          <div className="db-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`db-tab${tab === t.key ? ' active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                {t.key === 'today' && stats.today_pending > 0 && (
                  <span className="tab-pill">{stats.today_pending}</span>
                )}
                {t.key === 'tomorrow' && (stats.tomorrow_pending ?? 0) > 0 && (
                  <span className="tab-pill">{stats.tomorrow_pending}</span>
                )}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── Tab content ────────────────────────────────────── */}
        <FadeUp delay={30} key={tab}>
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
            <div style={errorBanner}>
              {t('error_loading')} — {error}
            </div>
          </FadeUp>
        )}

      </div>
    </>
  )
}
