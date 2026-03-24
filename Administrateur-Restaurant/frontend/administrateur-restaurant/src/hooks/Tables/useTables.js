import { useState, useEffect } from 'react'
import { getToken }  from '../../utils/auth'
import { toast } from '../../components/ui/Toast.jsx'
import { confirm } from '../../components/ui/ConfirmDialog.jsx'
import i18n from '../../i18next'
const API = 'http://localhost:8000/api/tables'

const hdrs = () => ({
  'Content-Type': 'application/json',
  'Accept':       'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useTables() {
  const [tables,     setTables]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [editingTbl, setEditingTbl] = useState(null)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => { fetchTables() }, [])

  async function fetchTables() {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: hdrs() })
      const data = await res.json()
      setTables(Array.isArray(data) ? data : [])
    } catch {
      setError(i18n.t('errors.load_tables'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form, resetForm) {
    setSaving(true)
    try {
      if (editingTbl) {
        await fetch(`${API}/${editingTbl.idx}`, {
          method: 'PUT', headers: hdrs(),
          body: JSON.stringify({
            number:   form.number,
            capacity: parseInt(form.capacity) || 1,
            location: form.location,
            active:   editingTbl.active ?? true,
          }),
        })
        setTables(prev => prev.map(t =>
          t.idx === editingTbl.idx
            ? { ...t, number: form.number, capacity: parseInt(form.capacity), location: form.location }
            : t
        ))
        toast(i18n.t('toast.table_updated', { number: form.number }), 'success')
        setEditingTbl(null)
      } else {
        const res  = await fetch(API, {
          method: 'POST', headers: hdrs(),
          body: JSON.stringify({
            number:   form.number,
            capacity: parseInt(form.capacity) || 1,
            location: form.location,
            active:   true,
          }),
        })
        const data = await res.json()
        setTables(prev => [...prev, data])
        toast(i18n.t('toast.table_created', { number: form.number }), 'success')
        if (resetForm) resetForm()
      }
    } catch {
      toast(i18n.t(editingTbl ? 'toast.table_update_failed' : 'toast.table_create_failed'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tbl) {
    const ok = await confirm({
      title:        i18n.t('confirm.delete_table_title'),
      message:      i18n.t('confirm.delete_table_message', { number: tbl.number }),
      sub:          i18n.t('confirm.delete_table_sub'),
      confirmLabel: i18n.t('confirm.delete_table_button'),
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${tbl.idx}`, { method: 'DELETE', headers: hdrs() })
      setTables(prev => prev.filter(t => t.idx !== tbl.idx))
      if (editingTbl?.idx === tbl.idx) setEditingTbl(null)
      toast(i18n.t('toast.table_deleted', { number: tbl.number }), 'warning')
    } catch {
      toast(i18n.t('toast.table_delete_failed'), 'error')
    }
  }

  async function handleToggle(tbl) {
    try {
      await fetch(`${API}/${tbl.idx}/toggle`, { method: 'PATCH', headers: hdrs() })
      setTables(prev => prev.map(t =>
        t.idx === tbl.idx ? { ...t, active: !t.active } : t
      ))
      toast(
        i18n.t(tbl.active ? 'toast.table_deactivated' : 'toast.table_activated', { number: tbl.number }),
        'success'
      )
    } catch {
      toast(i18n.t('toast.table_toggle_failed'), 'error')
    }
  }

  return {
    tables, loading, error,
    editingTbl, setEditingTbl,
    saving, handleSave, handleDelete, handleToggle,
    setTables,
  }
}