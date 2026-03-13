import { useState, useEffect } from 'react'
import { getToken }  from '../../utils/auth'
import { toast }     from '../../components/ui/Toast'
import { confirm }   from '../../components/ui/ConfirmDialog'

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
      setError('Impossible de charger les tables.')
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
        toast(`Table ${form.number} modifiée`, 'success')
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
        toast(`Table ${form.number} ajoutée`, 'success')
        if (resetForm) resetForm()
      }
    } catch {
      toast(editingTbl ? 'Impossible de modifier' : "Impossible d'ajouter", 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(tbl) {
    const ok = await confirm({
      title:        'Supprimer la table',
      message:      `Voulez-vous supprimer la table ${tbl.number} ?`,
      sub:          'Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${tbl.idx}`, { method: 'DELETE', headers: hdrs() })
      setTables(prev => prev.filter(t => t.idx !== tbl.idx))
      if (editingTbl?.idx === tbl.idx) setEditingTbl(null)
      toast(`Table ${tbl.number} supprimée`, 'warning')
    } catch {
      toast('Impossible de supprimer', 'error')
    }
  }

  async function handleToggle(tbl) {
    try {
      await fetch(`${API}/${tbl.idx}/toggle`, { method: 'PATCH', headers: hdrs() })
      setTables(prev => prev.map(t =>
        t.idx === tbl.idx ? { ...t, active: !t.active } : t
      ))
      toast(`Table ${tbl.number} ${tbl.active ? 'désactivée' : 'activée'}`, 'success')
    } catch {
      toast('Impossible de modifier le statut', 'error')
    }
  }

  return {
    tables, loading, error,
    editingTbl, setEditingTbl,
    saving, handleSave, handleDelete, handleToggle,
    // ✅ FIX 1: export setTables — required by Tables.jsx bulk handlers
    setTables,
  }
}