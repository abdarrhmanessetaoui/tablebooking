import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getToken } from '../../utils/auth'
import { toast }   from '../../components/ui/Toast'
import { confirm } from '../../components/ui/ConfirmDialog'

const API = 'http://localhost:8000/api/restaurant/reservations'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

const EMPTY_FORM = {
  name: '', email: '', phone: '', date: '', start_time: '',
  guests: '', service: '', status: 'Pending', notes: ''
}

// A reservation is considered unassigned when table_idx is absent, null, 0, or empty string
function isUnassigned(r) {
  return r.table_idx === null || r.table_idx === undefined || r.table_idx === 0 || r.table_idx === ''
}

export default function useReservations(initialFilters = {}) {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  const [modalMode, setModalMode] = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)

  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState(initialFilters?.filterStatus || 'all')
  const [filterService, setFilterService] = useState('all')
  const [filterDate,    setFilterDate]    = useState(initialFilters?.filterDate || '')
  const [filterTable,   setFilterTable]   = useState('all')

  const fetchReservations = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res  = await fetch(API, { headers: headers() })
      const data = await res.json()
      setReservations(Array.isArray(data) ? data : [])
    } catch {
      if (!silent) setError(t('error_loading_reservations'))
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  useEffect(() => {
    const id = setInterval(() => fetchReservations(true), 30000)
    return () => clearInterval(id)
  }, [])

  // Only search + status + service + table — date filtering handled in Reservations.jsx
  const filtered = useMemo(() => {
    if (!Array.isArray(reservations)) return []
    return reservations
      .filter(r => {
        const matchSearch  = search === '' ||
          (r.name  && r.name.toLowerCase().includes(search.toLowerCase())) ||
          (r.phone && r.phone.includes(search))

        const matchStatus  = filterStatus  === 'all' || r.status  === filterStatus
        const matchService = filterService === 'all' || r.service === filterService

        const matchTable =
          filterTable === 'all'        ? true :
          filterTable === 'unassigned' ? isUnassigned(r) :
          String(r.table_idx) === String(filterTable)

        return matchSearch && matchStatus && matchService && matchTable
      })
      .sort((a, b) => {
        const d = (b.date || '').localeCompare(a.date || '')
        return d !== 0 ? d : (b.start_time || '').localeCompare(a.start_time || '')
      })
  }, [reservations, search, filterStatus, filterService, filterTable])

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
      toast(t('status_updated_toast'), 'success')
    } catch {
      toast(t('error_status_update_toast'), 'error')
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
      toast(t('reservation_created_toast', { name: form.name }), 'success')
    } catch {
      toast(t('error_creating_toast'), 'error')
    }
  }

  const handleDelete = async (id) => {
    const r = reservations.find(x => x.id === id)
    const ok = await confirm({
      title:        t('confirm_delete_one_title'),
      message:      t('confirm_delete_one_msg', { name: r?.name || t('this_client') }),
      sub:          t('action_irreversible'),
      confirmLabel: t('delete_btn'),
      type:         'danger',
    })

    if (!ok) return
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: headers() })
      setReservations(prev => prev.filter(r => r.id !== id))
      if (modalMode !== null) setModalMode(null)
      toast(t('reservation_deleted_toast'), 'warning')
    } catch {
      toast(t('error_deleting_one_toast'), 'error')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilterStatus('all')
    setFilterService('all')
    setFilterDate('')
    setFilterTable('all')
  }

  return {
    filtered, loading, error,
    modalMode, setModalMode,
    form, setForm, editing,
    search,        setSearch,
    filterStatus,  setFilterStatus,
    filterService, setFilterService,
    filterDate,    setFilterDate,
    filterTable,   setFilterTable,
    clearFilters,
    openView, openEdit, openCreate,
    handleSubmit, handleCreate, handleDelete,
    fetchReservations,
    reservations, setReservations,
  }
}