import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'

export default function useDashboardStats() {
  const [stats, setStats] = useState({
    total: 0, today: 0,
    today_confirmed: 0, today_pending: 0, today_cancelled: 0,
    confirmed: 0, pending: 0, cancelled: 0, tomorrow: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/stats', {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        })
        const data = await res.json()
        setStats(data)
      } catch {
        setError('Failed to load stats.')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return { stats, loading, error }
}