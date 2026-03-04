import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export default function useDashboardStats() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/stats', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
        })
        const data = await res.json()
        setStats(data)
      } catch {
        setError('Failed to load stats.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}