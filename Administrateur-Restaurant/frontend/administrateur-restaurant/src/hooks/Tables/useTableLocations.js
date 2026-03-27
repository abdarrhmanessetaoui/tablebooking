import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'
import { toast }    from '../../components/ui/Toast'
import { confirm }  from '../../components/ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'

const API = 'http://localhost:8000/api/table-locations'

const hdrs = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useTableLocations() {
  const { t } = useTranslation()
  const [locations, setLocations] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => { fetchLocations() }, [])

  async function fetchLocations() {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: hdrs() })
      const data = await res.json()
      setLocations(Array.isArray(data) ? data : [])
    } catch {
      toast(t('tables_module.error_loading_locations'), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(name, color, resetForm) {
    if (!name.trim()) return
    setSaving(true)
    try {
      const res = await fetch(API, {
        method: 'POST', headers: hdrs(),
        body: JSON.stringify({ name: name.trim(), color }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast(err.message ?? t('tables_module.error_adding_location'), 'error')
        return
      }
      const data = await res.json()
      setLocations(prev => [...prev, data])
      toast(t('tables_module.location_added', { name: data.name }), 'success')
      if (resetForm) resetForm()
    } catch {
      toast(t('tables_module.error_adding_location'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(id, name, color) {
    setSaving(true)
    try {
      const res  = await fetch(`${API}/${id}`, {
        method: 'PUT', headers: hdrs(),
        body: JSON.stringify({ name: name.trim(), color }),
      })
      const data = await res.json()
      setLocations(prev => prev.map(l => l.id === id ? data : l))
      toast(t('tables_module.location_updated'), 'success')
    } catch {
      toast(t('tables_module.error_modifying_location'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(loc) {
    const ok = await confirm({
      title:        t('tables_module.delete_location_title'),
      message:      t('tables_module.delete_location_msg', { name: loc.name }),
      sub:          t('tables_module.delete_location_sub'),
      confirmLabel: t('tables_module.delete'),
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${loc.id}`, { method: 'DELETE', headers: hdrs() })
      setLocations(prev => prev.filter(l => l.id !== loc.id))
      toast(t('tables_module.location_deleted', { name: loc.name }), 'warning')
    } catch {
      toast(t('tables_module.error_deleting_location'), 'error')
    }
  }

  return {
    locations, loading, saving,
    handleAdd, handleUpdate, handleDelete,
  }
}
