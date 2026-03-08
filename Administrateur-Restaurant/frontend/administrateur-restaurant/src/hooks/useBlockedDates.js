import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const API = 'http://localhost:8000/api/admin/blocked-dates'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useBlockedDates() {
  const [blockedDates, setBlockedDates] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [form, setForm]                 = useState({ date: '' })
  const [submitting, setSubmitting]     = useState(false)

  useEffect(() => { fetchBlockedDates() }, [])

  const fetchBlockedDates = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: headers() })
      const data = await res.json()
      setBlockedDates(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load blocked dates.')
      setBlockedDates([])
    } finally {
      setLoading(false)
    }
  }

  const handleBlock = async () => {
    if (!form.date) return
    setSubmitting(true)
    setError('')
    try {
      const res  = await fetch(API, { method: 'POST', headers: headers(), body: JSON.stringify({ date: form.date }) })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to block date.'); return }
      // data = { date: 'Y-m-d' }
      setBlockedDates(prev => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)))
      setForm({ date: '' })
    } catch {
      setError('Failed to block date.')
    } finally {
      setSubmitting(false)
    }
  }

  // unblock by date string (Y-m-d) — no more id
  const handleUnblock = async (date) => {
    if (!window.confirm('Unblock this date?')) return
    try {
      await fetch(`${API}/${date}`, { method: 'DELETE', headers: headers() })
      setBlockedDates(prev => prev.filter(d => d.date !== date))
    } catch {
      setError('Failed to unblock date.')
    }
  }

  return {
    blockedDates, loading, error,
    form, setForm, submitting,
    handleBlock, handleUnblock,
  }
}