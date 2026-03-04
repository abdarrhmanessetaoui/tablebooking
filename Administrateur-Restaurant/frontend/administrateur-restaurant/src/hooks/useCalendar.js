import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const toDateString = (date) => date.toISOString().split('T')[0]

const getWeekDays = (date) => {
  const day  = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date)
  monday.setDate(diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function useCalendar() {
  const [currentDate, setCurrentDate]   = useState(new Date())
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  const weekDays = getWeekDays(currentDate)
  const weekStart = toDateString(weekDays[0])
  const weekEnd   = toDateString(weekDays[6])

  useEffect(() => { fetchWeek() }, [weekStart])

  const fetchWeek = async () => {
    setLoading(true)
    setError('')
    try {
      const promises = weekDays.map(d =>
        fetch(`http://localhost:8000/api/reservations/by-date?date=${toDateString(d)}`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
        }).then(r => r.json())
      )
      const results = await Promise.all(promises)
      setReservations(results.flat())
    } catch {
      setError('Failed to load reservations.')
    } finally {
      setLoading(false)
    }
  }

  const prevWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const nextWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date())

  const getByDate = (date) => {
    const str = toDateString(date)
    return reservations.filter(r => r.date === str).sort((a, b) => a.time.localeCompare(b.time))
  }

  return {
    weekDays, currentDate,
    loading, error,
    prevWeek, nextWeek, goToday,
    getByDate,
  }
}