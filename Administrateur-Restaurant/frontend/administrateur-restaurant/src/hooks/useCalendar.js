import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const toDateString = (date) => date.toISOString().split('T')[0]

export default function useCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => { fetchReservations() }, [selectedDate])

  const fetchReservations = async () => {
    setLoading(true)
    setError('')
    try {
      const date = toDateString(selectedDate)
      const res  = await fetch(`http://localhost:8000/api/reservations/by-date?date=${date}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      })
      const data = await res.json()
      setReservations(data)
    } catch {
      setError('Failed to load reservations.')
    } finally {
      setLoading(false)
    }
  }

  const prevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
  }

  const nextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d)
  }

  const goToday = () => setSelectedDate(new Date())

  return {
    selectedDate, setSelectedDate,
    reservations, loading, error,
    prevDay, nextDay, goToday,
  }
}