import { useState, useEffect, useMemo } from 'react'
import { getToken } from '../utils/auth'

const API = 'http://localhost:8000/api/restaurant/reservations'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [editing, setEditing]           = useState(null)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate]     = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: '', status: 'pending', notes: ''
  })

  useEffect(() => { fetchReservations() }, [])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: headers() })
      const data = await res.json()
      setReservations(data)
    } catch {
      setError('Failed to load reservations.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const matchSearch = search === '' ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.phone && r.phone.includes(search))

      const matchStatus = filterStatus === 'all' || r.status === filterStatus
      const matchDate   = filterDate === '' || r.date === filterDate

      return matchSearch && matchStatus && matchDate
    })
  }, [reservations, search, filterStatus, filterDate])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', date: '', time: '', guests: '', status: 'pending', notes: '' })
    setShowModal(true)
  }

  const openEdit = (reservation) => {
    setEditing(reservation)
    setForm({ ...reservation })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        const res  = await fetch(`${API}/${editing.id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(form) })
        const data = await res.json()
        setReservations(prev => prev.map(r => r.id === editing.id ? data : r))
      } else {
        const res  = await fetch(API, { method: 'POST', headers: headers(), body: JSON.stringify(form) })
        const data = await res.json()
        setReservations(prev => [data, ...prev])
      }
      setShowModal(false)
    } catch {
      setError('Failed to save reservation.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) return
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: headers() })
      setReservations(prev => prev.filter(r => r.id !== id))
    } catch {
      setError('Failed to delete reservation.')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilterStatus('all')
    setFilterDate('')
  }

  return {
    filtered, loading, error,
    showModal, setShowModal,
    form, setForm,
    editing,
    search, setSearch,
    filterStatus, setFilterStatus,
    filterDate, setFilterDate,
    clearFilters,
    openCreate, openEdit,
    handleSubmit, handleDelete,
  }
}