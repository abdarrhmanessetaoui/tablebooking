import { useState, useEffect, useMemo } from 'react'
import { getToken } from '../../utils/auth'

const API = 'http://localhost:8000/api/restaurant/reservations'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

const EMPTY_FORM = {
  name: '', email: '', phone: '', date: '', start_time: '', guests: '', service: '', status: 'Pending', notes: ''
}

const CURRENT_MONTH = new Date().toISOString().slice(0, 7)

export default function useReservations(initialFilters = {}) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  const [modalMode, setModalMode] = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)

  const [search,         setSearch]         = useState('')
  const [filterStatus,   setFilterStatus]   = useState(initialFilters?.filterStatus || 'all')
  const [filterService,  setFilterService]  = useState('all')
  const [filterDate,     setFilterDate]     = useState(initialFilters?.filterDate   || '')
  const [filterMonth,    setFilterMonth]    = useState(
    initialFilters?.filterDate ? '' : CURRENT_MONTH
  )

  useEffect(() => { fetchReservations() }, [])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: headers() })
      const data = await res.json()
      setReservations(Array.isArray(data) ? data : [])
    } catch {
      setError('Impossible de charger les réservations.')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!Array.isArray(reservations)) return []
    return reservations
      .filter(r => {
        const matchSearch  = search === '' ||
          (r.name  && r.name.toLowerCase().includes(search.toLowerCase())) ||
          (r.phone && r.phone.includes(search))
        const matchStatus  = filterStatus  === 'all' || r.status  === filterStatus
        const matchService = filterService === 'all' || r.service === filterService
        const matchDate    = filterDate    === ''    || r.date    === filterDate
        const matchMonth   = filterMonth   === ''    || (r.date && r.date.startsWith(filterMonth))
        return matchSearch && matchStatus && matchService && matchDate && matchMonth
      })
      .sort((a, b) => {
        const dateDiff = (b.date || '').localeCompare(a.date || '')
        if (dateDiff !== 0) return dateDiff
        return (b.start_time || '').localeCompare(a.start_time || '')
      })
  }, [reservations, search, filterStatus, filterService, filterDate, filterMonth])

  const openView   = (r) => { setEditing(r); setModalMode('view') }
  const openEdit   = (r) => { setEditing(r); setForm({ ...r }); setModalMode('edit') }
  const openCreate = ()  => { setEditing(null); setForm(EMPTY_FORM); setModalMode('create') }

  const handleSubmit = async () => {
    if (!editing) return
    try {
      const res  = await fetch(`${API}/${editing.id}/status`, {
        method: 'PATCH', headers: headers(),
        body: JSON.stringify({ status: form.status }),
      })
      const data = await res.json()
      setReservations(prev => prev.map(r => r.id === editing.id ? data : r))
      setModalMode(null)
    } catch {
      setError('Impossible de modifier le statut.')
    }
  }

  const handleCreate = async () => {
    try {
      const res  = await fetch(API, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ ...form, guests: parseInt(form.guests) || 1 }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setReservations(prev => [data, ...prev])
      setModalMode(null)
    } catch {
      setError('Impossible de créer la réservation.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette réservation ?')) return
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: headers() })
      setReservations(prev => prev.filter(r => r.id !== id))
      if (modalMode !== null) setModalMode(null)
    } catch {
      setError('Impossible de supprimer la réservation.')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilterStatus('all')
    setFilterService('all')
    setFilterDate('')
    setFilterMonth(CURRENT_MONTH)
  }

  return {
    filtered, loading, error,
    modalMode, setModalMode,
    form, setForm,
    editing,
    search,        setSearch,
    filterStatus,  setFilterStatus,
    filterService, setFilterService,
    filterDate,    setFilterDate,
    filterMonth,   setFilterMonth,
    clearFilters,
    openView, openEdit, openCreate,
    handleSubmit, handleCreate, handleDelete,
    fetchReservations,
  }
}