import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth.js'

export default function useReports() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/reports', {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
        })
        const json = await res.json()
        setData(json)
      } catch {
        setError('Failed to load reports.')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return { data, loading, error }
}