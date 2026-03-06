import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth.js'

const toDateString = (date) => date.toISOString().split('T')[0]

const getWeekDays = (date) => {
  const day    = date.getDay()
  const diff   = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date)
  monday.setDate(diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const getMonthDays = (date) => {
  const year  = date.getFullYear()
  const month = date.getMonth()
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const startPad = (first.getDay() + 6) % 7
  const days = []
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1)
    days.push({ date: d, current: false })
  }
  for (let i = 1; i <= last.getDate(); i++) {
    days.push({ date: new Date(year, month, i), current: true })
  }
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - last.getDate() - startPad + 1)
    days.push({ date: d, current: false })
  }
  return days
}

export default function useCalendar() {
  const [currentDate, setCurrentDate]   = useState(new Date())
  const [view, setView]                 = useState('week')
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  const weekDays  = getWeekDays(currentDate)
  const monthDays = getMonthDays(currentDate)

  useEffect(() => { fetchReservations() }, [])

  const fetchReservations = async () => {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('http://localhost:8000/api/restaurant/reservations', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        }
      })
      const data = await res.json()
      setReservations(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load reservations.')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const navigate = (direction) => {
    const d = new Date(currentDate)
    const n = direction === 'prev' ? -1 : 1
    if (view === 'day')   d.setDate(d.getDate() + n)
    if (view === 'week')  d.setDate(d.getDate() + n * 7)
    if (view === 'month') d.setMonth(d.getMonth() + n)
    if (view === 'year')  d.setFullYear(d.getFullYear() + n)
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date())

  const getByDate = (date) => {
    const str = toDateString(date)
    return reservations.filter(r => r.date === str).sort((a, b) =>
      (a.start_time || '').localeCompare(b.start_time || '')
    )
  }

  const getByMonth = (year, month) =>
    reservations.filter(r => {
      if (!r.date) return false
      const d = new Date(r.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

  const getByYear = (year) =>
    reservations.filter(r => {
      if (!r.date) return false
      return new Date(r.date).getFullYear() === year
    })

  const navLabel = () => {
    const opts = { month: 'long', year: 'numeric' }
    if (view === 'day')   return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    if (view === 'week') {
      const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const end   = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${start} — ${end}`
    }
    if (view === 'month') return currentDate.toLocaleDateString('en-US', opts)
    if (view === 'year')  return currentDate.getFullYear().toString()
    return ''
  }

  return {
    view, setView,
    currentDate, setCurrentDate,
    weekDays, monthDays,
    loading, error,
    navigate, goToday,
    getByDate, getByMonth, getByYear,
    navLabel,
  }
}