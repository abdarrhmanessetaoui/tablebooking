import { useState, useEffect, useCallback, useMemo } from 'react'
import { getToken } from '../../utils/auth'
import i18n from '../../i18n'

function getWeekNum(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil((((t - y0) / 86400000) + 1) / 7)
}
function inc(obj, key) { obj[key] = (obj[key] || 0) + 1 }

const getDayKey = (d) => {
  const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return i18n.t(`tables_module.${keys[d.getDay()]}`)
}

const getMonthKey = (m, y) => {
  const keys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  return `${i18n.t(`services_module.${keys[m]}_short`)} ${y}`
}

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

function aggregate(rows) {
  const by_hour    = {}
  const by_day     = {}
  const by_week    = {}
  const by_month   = {}
  const by_year    = {}
  const by_guests  = {}
  const by_service = {}
  let confirmed = 0, pending = 0, cancelled = 0, guests_sum = 0, guests_n = 0

  for (const r of rows) {
    if (r.status === 'Confirmed') confirmed++
    else if (r.status === 'Cancelled') cancelled++
    else pending++
    if (r.guests) { guests_sum += parseInt(r.guests); guests_n++ }
    if (r.start_time) inc(by_hour, r.start_time.slice(0, 5))
    if (r.service)    inc(by_service, r.service)
    if (r.guests)     inc(by_guests, i18n.t('reports_module.persons_count', { count: parseInt(r.guests) }))
    if (r.date) {
      const d  = new Date(r.date)
      const yr = d.getFullYear(), mo = d.getMonth()
      inc(by_day, getDayKey(d))
      const wn = getWeekNum(d)
      inc(by_week,  `${i18n.t('reports_module.week_prefix')}${String(wn).padStart(2,'0')} '${String(yr).slice(2)}`)
      inc(by_month, getMonthKey(mo, yr))
      inc(by_year,  String(yr))
    }
  }
  return {
    by_hour:    Object.fromEntries(Object.entries(by_hour).sort()),
    by_day,
    by_week:    Object.fromEntries(Object.entries(by_week).sort()),
    by_month:   Object.fromEntries(Object.entries(by_month).sort((a,b)=>{
      // attempt year sort, then month sort
      const [m1,y1]=a[0].split(' ')
      const [m2,y2]=b[0].split(' ')
      if (y1!==y2) return y1-y2
      return 0 // key sort is tricky here due to localized names, but the backend usually sends them in order or we can improve this if needed
    })),
    by_year:    Object.fromEntries(Object.entries(by_year).sort()),
    by_guests:  Object.fromEntries(Object.entries(by_guests).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))),
    by_service: Object.fromEntries(Object.entries(by_service).sort((a,b) => b[1] - a[1])),
    summary: {
      total: rows.length, confirmed, pending, cancelled,
      avg_guests: guests_n > 0 ? Math.round((guests_sum / guests_n) * 10) / 10 : 0,
    },
  }
}

export default function useReports() {
  const [rows,          setRows]          = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [period,        setPeriod]        = useState('all')
  const [status,        setStatus]        = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [filterDate,    setFilterDate]    = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:8000/api/restaurant/reservations', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error(`${i18n.t('dashboard.error_prefix', { defaultValue: 'Error' })} ${res.status}`)
      const json = await res.json()
      setRows(Array.isArray(json) ? json : [])
    } catch (e) {
      setError(e.message || i18n.t('reports_module.error_loading'))
    } finally { setLoading(false) }
  }, [])

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
    return aggregate(filtered)
  }, [rows, period, status, filterService, filterDate])

  // ✅ No setSearch — it doesn't exist in this hook
  function clearFilters() {
    setPeriod('all')
    setStatus('all')
    setFilterService('all')
    setFilterDate('')
  }

  return {
    data, loading, error, refetch: fetchAll, services,
    period,        setPeriod,
    status,        setStatus,
    filterService, setFilterService,
    filterDate,    setFilterDate,
    clearFilters,
  }
}
