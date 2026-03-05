import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export default function useTimeSlots() {
  const [slots, setSlots]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/time-slots', {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
        })
        const data = await res.json()
        setSlots(Array.isArray(data) ? data : [])
      } catch {
        setError('Failed to load time slots.')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return { slots, loading, error }
}