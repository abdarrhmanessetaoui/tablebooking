import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../utils/auth'

const BASE = 'http://localhost:8000/api'

/**
 * Returns today's date as YYYY-MM-DD using LOCAL timezone.
 * new Date().toISOString() is UTC — in timezones ahead of UTC
 * it returns "yesterday" after midnight local time.
 */
export function localToday() {
  const d = new Date()
  return (
    d.getFullYear() +
    '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0')
  )
}

import { useTranslation } from 'react-i18next'

export default function useTablesTimeline(initialDate = null) {
  const { t } = useTranslation()
  const [date,     setDate]     = useState(initialDate ?? localToday())
  const [timeline, setTimeline] = useState([])
  const [allOH,    setAllOH]    = useState([])
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const hdrs = () => ({
    'Accept':        'application/json',
    'Authorization': `Bearer ${getToken()}`,
  })

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/time-slots`,          { headers: hdrs() }).then(r => r.json()),
      fetch(`${BASE}/restaurant/services`, { headers: hdrs() }).then(r => r.json()),
    ]).then(([slots, svcs]) => {
      setAllOH(Array.isArray(slots?.allOH) ? slots.allOH : [])
      setServices(Array.isArray(svcs) ? svcs : [])
    }).catch(() => {})
  }, []) // eslint-disable-line

  const fetchTimeline = useCallback(async (d) => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${BASE}/tables/timeline?date=${d}`, { headers: hdrs() })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTimeline(Array.isArray(data) ? data : [])
    } catch {
      setError(t('tables_module.error_loading'))
      setTimeline([])
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => { fetchTimeline(date) }, [date, fetchTimeline])

  return {
    timeline, loading, error,
    date, setDate,
    allOH, services,
    refresh: () => fetchTimeline(date),
  }
} 
