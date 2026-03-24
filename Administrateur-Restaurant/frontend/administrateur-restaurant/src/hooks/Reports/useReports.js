import { useState, useEffect, useCallback, useMemo } from 'react'
import { getToken } from '../../utils/auth'
import { useTranslation } from "react-i18next"
import i18n from '../../i18next'
function getWeekNum(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil((((t - y0) / 86400000) + 1) / 7)
}

function inc(obj, key) { obj[key] = (obj[key] || 0) + 1 }

function filterByPeriod(rows, period) {
  if (period === 'all') return rows
  const now   = new Date()
  const today = now.toISOString().slice(0, 10)

  if (period === 'today') return rows.filter(r => r.date === today)

  if (period === 'week') {
    const wn = getWeekNum(now), yr = now.getFullYear()
    return rows.filter(r => {
      if (!r.date) return false
      const d = new Date(r.date)
      return d.getFullYear() === yr && getWeekNum(d) === wn
    })
  }

  if (period === 'month') {
    const ym = today.slice(0, 7)
    return rows.filter(r => r.date?.startsWith(ym))
  }

  return rows
}

function filterByDate(rows, filterDate) {
  if (!filterDate) return rows
  if (filterDate.length === 10) return rows.filter(r => r.date === filterDate)
  if (filterDate.length === 7)  return rows.filter(r => (r.date || '').startsWith(filterDate))
  return rows
}

export default function useReports() {
  const { t } = useTranslation()

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('all')
  const [status, setStatus] = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [filterDate, setFilterDate] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:8000/api/restaurant/reservations', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (!res.ok) throw new Error(t("errors.fetch_reports"))

      const json = await res.json()
      setRows(Array.isArray(json) ? json : [])

    } catch (e) {
      setError(e.message || t("errors.fetch_reports"))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { fetchAll() }, [fetchAll])

  const services = useMemo(() => {
    const set = new Set(rows.map(r => r.service).filter(Boolean))
    return [...set].sort()
  }, [rows])

  const data = useMemo(() => {
    let filtered = filterByPeriod(rows, period)

    if (status !== 'all') {
      const s = status.charAt(0).toUpperCase() + status.slice(1)
      filtered = filtered.filter(r => r.status === s)
    }

    if (filterService && filterService !== 'all')
      filtered = filtered.filter(r => r.service === filterService)

    filtered = filterByDate(filtered, filterDate)

    // ✅ هنا translation ديال days/months
    const lang = i18n.language

    const by_hour = {}
    const by_day  = {}
    const by_week = {}
    const by_month = {}
    const by_year = {}
    const by_guests = {}
    const by_service = {}

    let confirmed = 0, pending = 0, cancelled = 0, guests_sum = 0, guests_n = 0

    for (const r of filtered) {
      if (r.status === 'Confirmed') confirmed++
      else if (r.status === 'Cancelled') cancelled++
      else pending++

      if (r.guests) {
        guests_sum += parseInt(r.guests)
        guests_n++
        inc(by_guests, `${r.guests} ${t("guests_label")}`)
      }

      if (r.start_time) inc(by_hour, r.start_time.slice(0, 5))
      if (r.service) inc(by_service, r.service)

      if (r.date) {
        const d = new Date(r.date)
        const yr = d.getFullYear()

        const dayLabel = d.toLocaleDateString(lang, { weekday: 'short' })
        const monthLabel = d.toLocaleDateString(lang, { month: 'short', year: 'numeric' })

        inc(by_day, dayLabel)
        inc(by_month, monthLabel)
        inc(by_year, String(yr))

        const wn = getWeekNum(d)
        inc(by_week, `W${wn}`)
      }
    }

    return {
      by_hour: Object.fromEntries(Object.entries(by_hour).sort()),
      by_day,
      by_week,
      by_month,
      by_year: Object.fromEntries(Object.entries(by_year).sort()),
      by_guests,
      by_service: Object.fromEntries(Object.entries(by_service).sort((a,b) => b[1] - a[1])),

      summary: {
        total: filtered.length,
        confirmed,
        pending,
        cancelled,
        avg_guests: guests_n > 0 ? Math.round((guests_sum / guests_n) * 10) / 10 : 0,
      },
    }
  }, [rows, period, status, filterService, filterDate, t])

  function clearFilters() {
    setPeriod('all')
    setStatus('all')
    setFilterService('all')
    setFilterDate('')
  }

  return {
    data, loading, error, refetch: fetchAll, services,
    period, setPeriod,
    status, setStatus,
    filterService, setFilterService,
    filterDate, setFilterDate,
    clearFilters,
  }
}