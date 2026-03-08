import { useState, useEffect, useCallback } from 'react'
import { getToken } from '../../utils/auth'

const DEFAULTS = {
  today: 0, today_confirmed: 0, today_pending: 0, today_cancelled: 0,
  tomorrow: 0, tomorrow_confirmed: 0, tomorrow_pending: 0, tomorrow_cancelled: 0,
  total: 0, confirmed: 0, pending: 0, cancelled: 0,
}

function sanitize(data) {
  const result = { ...DEFAULTS }
  for (const key of Object.keys(DEFAULTS)) {
    const v = Number(data?.[key])
    result[key] = isNaN(v) ? 0 : v
  }
  return result
}

export default function useDashboardStats() {
  const [stats,   setStats]   = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8000/api/stats', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data = await res.json()
      setStats(sanitize(data))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}