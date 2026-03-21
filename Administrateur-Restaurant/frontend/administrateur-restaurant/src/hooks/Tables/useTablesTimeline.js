import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../utils/auth'

const BASE = 'http://localhost:8000/api'

export default function useTablesTimeline(initialDate = null) {
  const today = new Date().toISOString().slice(0, 10)

  const [date,     setDate]     = useState(initialDate ?? today)
  const [timeline, setTimeline] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const headers = () => ({
    'Accept':        'application/json',
    'Authorization': `Bearer ${getToken()}`,
  })

  const fetchTimeline = useCallback(async (d) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/tables/timeline?date=${d}`, { headers: headers() })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTimeline(Array.isArray(data) ? data : [])
    } catch {
      setError('Impossible de charger le planning des tables.')
      setTimeline([])
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    fetchTimeline(date)
  }, [date, fetchTimeline])

  return {
    timeline,
    loading,
    error,
    date,
    setDate,
    refresh: () => fetchTimeline(date),
  }
}