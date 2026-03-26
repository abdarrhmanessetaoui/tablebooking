import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, LayoutGrid, Users, MapPin, Check, Loader, AlertTriangle, Clock } from 'lucide-react'
import { useTranslation } from "react-i18next"
import { getToken } from '../../utils/auth'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const BORDER    = 'rgba(43,33,24,0.12)'
const CREAM     = '#faf8f5'
const BASE      = 'http://localhost:8000/api'

const LOC_COLORS = {
  'Intérieur':   { bg: '#eef2ff', color: '#4f6ef7' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#fdf6ec', color: '#a8834e' },
  'Salon privé': { bg: '#fdf0f0', color: '#b94040' },
}

export default function AssignTableModal({ reservation, onClose, onAssigned }) {

  const { t } = useTranslation()

  const [tables,   setTables]   = useState([])
  const [busyIdxs, setBusyIdxs] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)
  const [selected, setSelected] = useState(reservation?.table_idx ?? null)

  const guestCount = parseInt(reservation?.guests ?? 1)

  const hdrs = () => ({
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': `Bearer ${getToken()}`,
  })

  useEffect(() => {
    const params = new URLSearchParams({
      date:       reservation?.date       ?? '',
      start_time: reservation?.start_time ?? '',
      ...(reservation?.end_time ? { end_time: reservation.end_time } : {}),
      exclude_id: reservation?.id ?? 0,
    })

    Promise.all([
      fetch(`${BASE}/tables`,               { headers: hdrs() }).then(r => r.json()),
      fetch(`${BASE}/tables/busy?${params}`, { headers: hdrs() }).then(r => r.json()),
    ])
      .then(([tableData, busyData]) => {
        setTables(Array.isArray(tableData) ? tableData.filter(t => t.active) : [])
        setBusyIdxs(Array.isArray(busyData) ? busyData : [])
      })
      .catch(() => setError(t('error_loading_tables')))
      .finally(() => setLoading(false))
  }, [])

  const sortedTables = [...tables].sort((a, b) => {
    const aOk = !busyIdxs.includes(a.idx) && parseInt(a.capacity) >= guestCount
    const bOk = !busyIdxs.includes(b.idx) && parseInt(b.capacity) >= guestCount
    if (aOk && !bOk) return -1
    if (!aOk && bOk) return 1
    return String(a.number).localeCompare(String(b.number))
  })

  function tableState(table) {
    const isBusy         = busyIdxs.includes(table.idx)
    const isInsufficient = parseInt(table.capacity) < guestCount
    const isSelected     = selected === table.idx
    const isCurrent      = reservation?.table_idx === table.idx
    if (isBusy)         return 'busy'
    if (isInsufficient) return 'insufficient'
    if (isSelected)     return 'selected'
    if (isCurrent)      return 'current'
    return 'available'
  }

  async function handleAssign() {
    setSaving(true)
    setError(null)
    try {
      const res  = await fetch(
        `${BASE}/restaurant/reservations/${reservation.id}/assign-table`,
        { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ table_idx: selected }) }
      )
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? `Erreur ${res.status}`); return }
      onAssigned(data)
      onClose()
    } catch {
      setError(t('connection_error'))
    } finally {
      setSaving(false)
    }
  }

  const hasChanged = selected !== reservation?.table_idx

  return createPortal(
    <div>
      {/* Header */}
      <p>{t('assign_table')}</p>

      {/* Summary */}
      {[
        [t('date'), reservation?.date],
        [t('time'), reservation?.start_time],
        [t('guests'), `${guestCount} ${t('persons')}`],
      ].map(([label, val]) => (
        <div key={label}>
          <p>{label}</p>
          <p>{val}</p>
        </div>
      ))}

      {/* Example table */}
      <p>{t('available_tables')}</p>

      <button>{t('cancel')}</button>

      <button>
        {saving
          ? t('saving')
          : selected === null
          ? t('remove_table')
          : t('confirm')}
      </button>
    </div>,
    document.body
  )
}