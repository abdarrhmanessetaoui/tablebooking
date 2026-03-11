import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../utils/auth'

const DEFAULT = {
  by_hour:    {},
  by_day:     {},
  by_week:    {},
  by_month:   {},
  by_year:    {},
  by_guests:  {},
  by_service: {},   // ← was missing
  summary:    { total: 0, confirmed: 0, pending: 0, cancelled: 0, avg_guests: 0 },
}

export default function useReports() {
  const [data,    setData]    = useState(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8000/api/reports', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const json = await res.json()
      // Merge with DEFAULT so missing keys never cause undefined errors
      setData({
        ...DEFAULT,
        ...json,
        summary: { ...DEFAULT.summary, ...(json.summary ?? {}) },
      })
    } catch (e) {
      setError(e.message || 'Impossible de charger les rapports.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  return { data, loading, error, refetch: fetchReports }
}