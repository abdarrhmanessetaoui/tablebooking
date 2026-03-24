// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileDown, CalendarDays, Users, Utensils } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { exportPDF } from '../utils/exportPDF'
import { getToken } from '../utils/auth'

// Helper component for export button
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg = primary ? (hov ? '#2b2118' : '#c8a97e') : (hov ? '#c8a97e' : '#2b2118')
  const color = primary ? (hov ? '#c8a97e' : '#2b2118') : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px', background: bg, color, border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 700,
        transition: 'all 0.15s', fontFamily: 'inherit',
      }}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info } = useRestaurantInfo()

  const [tab, setTab] = useState('today')
  const [exporting, setExporting] = useState(false)
  const [todayRes, setTodayRes] = useState([])
  const [tomRes, setTomRes] = useState([])
  const [monthRes, setMonthRes] = useState([])

  const TODAY_DATE = new Date().toISOString().slice(0, 10)
  const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  const loadAll = useCallback(() => {
    const headers = { Authorization: `Bearer ${getToken()}` }

    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`, { headers })
      .then(r => r.json()).then(d => setTodayRes(Array.isArray(d) ? d : [])).catch(() => {})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, { headers })
      .then(r => r.json()).then(d => setTomRes(Array.isArray(d) ? d : [])).catch(() => {})
    const ym = TODAY_DATE.slice(0, 7)
    fetch(`http://localhost:8000/api/restaurant/reservations?month=${ym}`, { headers })
      .then(r => r.json()).then(d => setMonthRes(Array.isArray(d) ? d : [])).catch(() => {})

    refetch()
  }, [refetch])

  useEffect(() => {
    loadAll()
    const interval = setInterval(loadAll, 60_000)
    return () => clearInterval(interval)
  }, [loadAll])

  const TABS = [
    { key: 'today', label: t('today'), res: todayRes, date: TODAY_DATE },
    { key: 'tomorrow', label: t('tomorrow'), res: tomRes, date: TOMORROW_DATE },
    { key: 'month', label: t('this_month'), res: monthRes, date: null },
  ]
  const activeTab = TABS.find(tTab => tTab.key === tab)

  const handleRowClick = (r) => {
    navigate('/reservations', { state: { openId: r.id, filterDate: activeTab?.date ?? null } })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = res; s.onerror = rej; document.head.appendChild(s)
        })
      }
      exportPDF(stats, activeTab?.res || [], activeTab?.label || t('today'))
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ padding: '20px', fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}>
      {/* HEADER */}
      <FadeUp delay={0}>
        <h1>{t('dashboard')}</h1>
        <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
          {exporting ? t('in_progress') : t('export_pdf')}
        </Btn>
      </FadeUp>

      {/* TABS */}
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        {TABS.map(tTab => (
          <button key={tTab.key} onClick={() => setTab(tTab.key)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: 6,
              background: tTab.key === tab ? '#c8a97e' : '#faf8f5',
              color: tTab.key === tab ? '#2b2118' : '#000',
              cursor: 'pointer'
            }}
          >
            {tTab.label}
            {tTab.key === 'today' && stats.today_pending > 0 && <span> ({stats.today_pending})</span>}
            {tTab.key === 'tomorrow' && (stats.tomorrow_pending ?? 0) > 0 && <span> ({stats.tomorrow_pending})</span>}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ marginTop: 20 }}>
        {activeTab?.res.length === 0 && <div>{t('no_reservations')}</div>}
        {activeTab?.res.map(r => (
          <div key={r.id} style={{
            padding: '12px', marginBottom: 6, border: '1px solid #eee', borderRadius: 6,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
          }} onClick={() => handleRowClick(r)}>
            <div>
              <div><strong>{r.name || '—'}</strong></div>
              <div>{r.time || r.start_time} | {r.guests} {t('guests')}</div>
            </div>
            <div>{r.status}</div>
          </div>
        ))}
        {activeTab?.res.length > 0 &&
          <button onClick={() => navigate('/reservations', { state: activeTab.date ? { filterDate: activeTab.date } : {} })}
            style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, border: '1px solid #c8a97e', cursor: 'pointer' }}>
            {t('view_all_reservations')}
          </button>
        }
      </div>

      {/* ERROR */}
      {error && <div style={{ marginTop: 20, color: 'red' }}>{t('loading_error')} — {error}</div>}
    </div>
  )
}