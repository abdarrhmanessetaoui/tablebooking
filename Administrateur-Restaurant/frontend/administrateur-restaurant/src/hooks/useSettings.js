import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const API = 'http://localhost:8000/api/time-slots'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function useTimeSlots() {
  const [allOH, setAllOH]               = useState([])
  const [workingDates, setWorkingDates] = useState([false,true,true,true,true,true,true])
  const [activeOH, setActiveOH]         = useState(0)
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState(false)

  useEffect(() => { fetchSlots() }, [])

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      setAllOH(data.allOH || [])
      setWorkingDates(data.working_dates || [false,true,true,true,true,true,true])
    } catch {
      setError('Failed to load.')
    } finally {
      setLoading(false)
    }
  }

  const updateOH = (index, field, value) => {
    setSuccess(false)
    setAllOH(prev => prev.map((oh, i) =>
      i === index
        ? { ...oh, openhours: oh.openhours.map((h, j) => j === 0 ? { ...h, [field]: value } : h) }
        : oh
    ))
  }

  const toggleWorkingDay = (dayIndex) => {
    setSuccess(false)
    setWorkingDates(prev => prev.map((v, i) => i === dayIndex ? !v : v))
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
        body: JSON.stringify({ allOH, working_dates: workingDates }),
      })
      if (!res.ok) { setError('Failed to save.'); return }
      setSuccess(true)
    } catch {
      setError('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return {
    allOH, workingDates, activeOH, setActiveOH,
    loading, saving, error, success,
    updateOH, toggleWorkingDay, handleSave,
    DAYS,
  }
}