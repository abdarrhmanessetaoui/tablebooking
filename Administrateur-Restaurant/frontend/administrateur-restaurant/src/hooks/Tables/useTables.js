import { useState, useEffect } from 'react'
import { useTranslation }     from 'react-i18next'
import { getToken }           from '../../utils/auth'
import { toast }              from '../../components/ui/Toast'
import { confirm }            from '../../components/ui/ConfirmDialog'

const API  = 'http://localhost:8000/api/tables'
const hdrs = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useTables() {
  const { t } = useTranslation()
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
      setError(t('tables_module.error_loading'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form, resetForm) {
    setSaving(true)
    try {
      if (editingTbl) {
        await fetch(`${API}/${editingTbl.idx}`, {
          method: 'PUT',
          headers: hdrs(),
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
        toast(t('tables_module.table_modified', { number: form.number }), 'success')
        setEditingTbl(null)
      } else {
        const res  = await fetch(API, {
          method: 'POST',
          headers: hdrs(),
          body: JSON.stringify({
            number:   form.number,
            capacity: parseInt(form.capacity) || 1,
            location: form.location,
            active:   true,
          }),
        })
        const data = await res.json()
        setTables(prev => [...prev, data])
        toast(t('tables_module.table_added', { number: form.number }), 'success')
        resetForm?.()
      }
    } catch {
      toast(editingTbl ? t('tables_module.error_modifying') : t('tables_module.error_adding'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tbl) {
    const ok = await confirm({
      title:        t('tables_module.delete_table_title'),
      message:      t('tables_module.delete_table_msg',  { number: tbl.number }),
      sub:          t('tables_module.delete_table_sub'),
      confirmLabel: t('tables_module.delete'),
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${tbl.idx}`, { method: 'DELETE', headers: hdrs() })
      setTables(prev => prev.filter(t => t.idx !== tbl.idx))
      if (editingTbl?.idx === tbl.idx) setEditingTbl(null)
      toast(t('tables_module.table_deleted', { number: tbl.number }), 'warning')
    } catch {
      toast(t('tables_module.error_deleting'), 'error')
    }
  }

  async function handleToggle(tbl) {
    try {
      await fetch(`${API}/${tbl.idx}/toggle`, { method: 'PATCH', headers: hdrs() })
      setTables(prev => prev.map(t =>
        t.idx === tbl.idx ? { ...t, active: !t.active } : t
      ))
      toast(
        t('tables_module.table_status_changed', {
          number: tbl.number,
          status: tbl.active
            ? t('tables_module.deactivated_status')
            : t('tables_module.activated_status'),
        }),
        'success',
      )
    } catch {
      toast(t('tables_module.error_status_change'), 'error')
    }
  }

  return {
    tables, loading, error,
    editingTbl, setEditingTbl,
    saving, handleSave, handleDelete, handleToggle,
    setTables,
  }
}