import { useState, useEffect, useCallback, useMemo } from 'react'
import { getToken } from '../../utils/auth'

/* ── helpers ── */
function getWeekNum(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil((((t - y0) / 86400000) + 1) / 7)
}
const FR_DAYS   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const FR_MONTHS = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc']

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

function aggregate(rows) {
  const by_hour    = {}
  const by_day     = { Lun:0, Mar:0, Mer:0, Jeu:0, Ven:0, Sam:0, Dim:0 }
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
    if (r.guests)     inc(by_guests, parseInt(r.guests) + ' pers.')

    if (r.date) {
      const d  = new Date(r.date)
      const yr = d.getFullYear(), mo = d.getMonth()
      inc(by_day, FR_DAYS[d.getDay()])
      const wn = getWeekNum(d)
      inc(by_week,  `S${String(wn).padStart(2,'0')} '${String(yr).slice(2)}`)
      inc(by_month, `${FR_MONTHS[mo]} ${yr}`)
      inc(by_year,  String(yr))
    }
  }

  const by_guests_sorted = Object.fromEntries(
    Object.entries(by_guests).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))
  )
  const by_service_sorted = Object.fromEntries(
    Object.entries(by_service).sort((a,b) => b[1] - a[1])
  )

  return {
    by_hour:    Object.fromEntries(Object.entries(by_hour).sort()),
    by_day,
    by_week:    Object.fromEntries(Object.entries(by_week).sort()),
    by_month,
    by_year:    Object.fromEntries(Object.entries(by_year).sort()),
    by_guests:  by_guests_sorted,
    by_service: by_service_sorted,
    summary: {
      total:      rows.length,
      confirmed,
      pending,
      cancelled,
      avg_guests: guests_n > 0 ? Math.round((guests_sum / guests_n) * 10) / 10 : 0,
    },
  }
}

/* ── hook ── */
export default function useReports() {
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // Filters
  const [period,        setPeriod]        = useState('all')
  const [status,        setStatus]        = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [filterDate,    setFilterDate]    = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8000/api/restaurant/reservations', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const json = await res.json()
      setRows(Array.isArray(json) ? json : [])
    } catch (e) {
      setError(e.message || 'Impossible de charger les rapports.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Derive unique services from all rows
  const services = useMemo(() => {
    const set = new Set(rows.map(r => r.service).filter(Boolean))
    return [...set].sort()
  }, [rows])

  const data = useMemo(() => {
    let filtered = filterByPeriod(rows, period)

    // Status
    if (status !== 'all') {
      const s = status.charAt(0).toUpperCase() + status.slice(1)
      filtered = filtered.filter(r => r.status === s)
    }

    // Service
    if (filterService && filterService !== 'all') {
      filtered = filtered.filter(r => r.service === filterService)
    }

    // Date (exact day or month prefix)
    filtered = filterByDate(filtered, filterDate)

    return aggregate(filtered)
  }, [rows, period, status, filterService, filterDate])

  function clearFilters() {
    setPeriod('all')
    setStatus('all')
    setSearch('')
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