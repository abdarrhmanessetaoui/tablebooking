import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'
import { toast }   from '../../components/ui/Toast'
import { confirm } from '../../components/ui/ConfirmDialog'

const API = 'http://localhost:8000/api/services'

const hdrs = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useServices() {
  const [services,   setServices]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [editingSvc, setEditingSvc] = useState(null)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => { fetchServices() }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: hdrs() })
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      setError('Impossible de charger les services.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form, resetForm) {
    setSaving(true)
    try {
      if (editingSvc) {
        await fetch(`${API}/${editingSvc.idx}`, {
          method: 'PUT', headers: hdrs(),
          body: JSON.stringify({
            name:     form.name,
            price:    parseFloat(form.price)    || 0,
            capacity: parseInt(form.capacity)   || 1,
            duration: parseInt(form.duration)   || 60,
          }),
        })
        setServices(prev => prev.map(s =>
          s.idx === editingSvc.idx
            ? { ...s, name: form.name, price: parseFloat(form.price), capacity: String(form.capacity), duration: String(form.duration) }
            : s
        ))
        toast(`Service "${form.name}" modifié`, 'success')
        setEditingSvc(null)
      } else {
        const res  = await fetch(API, {
          method: 'POST', headers: hdrs(),
          body: JSON.stringify({
            name:     form.name,
            price:    parseFloat(form.price)    || 0,
            capacity: parseInt(form.capacity)   || 1,
            duration: parseInt(form.duration)   || 60,
          }),
        })
        const data = await res.json()
        setServices(prev => [...prev, data])
        toast(`Service "${form.name}" ajouté`, 'success')
        if (resetForm) resetForm()
      }
    } catch {
      toast(editingSvc ? 'Impossible de modifier' : "Impossible d'ajouter", 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(svc) {
    const ok = await confirm({
      title:        'Supprimer le service',
      message:      `Voulez-vous supprimer "${svc.name}" ?`,
      sub:          'Les réservations existantes ne seront pas affectées.',
      confirmLabel: 'Supprimer',
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${svc.idx}`, { method: 'DELETE', headers: hdrs() })
      setServices(prev => prev.filter(s => s.idx !== svc.idx))
      if (editingSvc?.idx === svc.idx) setEditingSvc(null)
      toast(`Service "${svc.name}" supprimé`, 'warning')
    } catch {
      toast('Impossible de supprimer', 'error')
    }
  }

  return {
    services, loading, error,
    editingSvc, setEditingSvc,
    saving, handleSave, handleDelete,
  }
}