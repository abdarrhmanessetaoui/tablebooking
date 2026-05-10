import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { apiPath, getHeaders } from '../../utils/api'

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

let cachedStats = null

export default function useDashboardStats() {
  const { t } = useTranslation()
  const [stats,   setStats]   = useState(cachedStats || DEFAULTS)
  const [loading, setLoading] = useState(!cachedStats)
  const [error,   setError]   = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiPath('stats'), {
        headers: getHeaders(),
      })
      if (!res.ok) throw new Error(`${t('error_prefix')} ${res.status}`)
      const data = await res.json()
      const sanitized = sanitize(data)
      setStats(sanitized)
      cachedStats = sanitized
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { fetchStats() }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}
