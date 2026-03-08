import { useState, useEffect, useMemo } from 'react'
import { getToken } from '../../utils/auth'

const API = 'http://localhost:8000/api/restaurant/reservations'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useReservations(initialFilters = {}) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [editing, setEditing]           = useState(null)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState(initialFilters?.filterStatus || 'all')
  const [filterDate, setFilterDate]     = useState(initialFilters?.filterDate   || '')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', start_time: '', guests: '', status: 'Pending', notes: ''
  })

  useEffect(() => { fetchReservations() }, [])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: headers() })
      const data = await res.json()
      setReservations(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load reservations.')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!Array.isArray(reservations)) return []
    return reservations.filter(r => {
      const matchSearch = search === '' ||
        (r.name  && r.name.toLowerCase().includes(search.toLowerCase())) ||
        (r.phone && r.phone.includes(search))
      const matchStatus = filterStatus === 'all' || r.status === filterStatus
      const matchDate   = filterDate === '' || r.date === filterDate
      return matchSearch && matchStatus && matchDate
    })
  }, [reservations, search, filterStatus, filterDate])

  const openEdit = (reservation) => {
    setEditing(reservation)
    setForm({ ...reservation })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!editing) return
    try {
      const res = await fetch(`${API}/${editing.id}/status`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ status: form.status }),
      })
      const data = await res.json()
      setReservations(prev => prev.map(r => r.id === editing.id ? data : r))
      setShowModal(false)
    } catch {
      setError('Failed to update reservation.')
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
    openEdit,
    handleSubmit,
  }
}