import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const API = 'http://localhost:8000/api/time-slots'

const ALL_SLOTS = [
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30',
  '21:00','21:30','22:00','22:30','23:00','23:30',
]

export default function useTimeSlots() {
  const [active, setActive]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  useEffect(() => { fetchSlots() }, [])

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setActive(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load time slots.')
      setActive([])
    } finally {
      setLoading(false)
    }
  }

  const toggleSlot = (slot) => {
    setActive(prev =>
      Array.isArray(prev)
        ? prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot].sort()
        : [slot]
    )
    setSuccess(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch(API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ slots: active }),
      })
      if (!res.ok) { setError('Failed to save.'); return }
      setSuccess(true)
    } catch {
      setError('Failed to save time slots.')
    } finally {
      setSaving(false)
    }
  }

  return {
    allSlots: ALL_SLOTS,
    active: Array.isArray(active) ? active : [],
    loading, saving, error, success,
    toggleSlot, handleSave,
  }
}