import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'
import { toast }    from '../../components/ui/Toast'
import { confirm }  from '../../components/ui/ConfirmDialog'

const API = 'http://localhost:8000/api/table-locations'

const hdrs = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useTableLocations() {
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
      toast('Impossible de charger les emplacements', 'error')
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
        toast(err.message ?? "Impossible d'ajouter", 'error')
        return
      }
      const data = await res.json()
      setLocations(prev => [...prev, data])
      toast(`Emplacement "${data.name}" ajouté`, 'success')
      if (resetForm) resetForm()
    } catch {
      toast("Impossible d'ajouter l'emplacement", 'error')
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
      toast('Emplacement mis à jour', 'success')
    } catch {
      toast("Impossible de modifier l'emplacement", 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(loc) {
    const ok = await confirm({
      title:        "Supprimer l'emplacement",
      message:      `Voulez-vous supprimer "${loc.name}" ?`,
      sub:          'Les tables utilisant cet emplacement ne seront pas supprimées.',
      confirmLabel: 'Supprimer',
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${loc.id}`, { method: 'DELETE', headers: hdrs() })
      setLocations(prev => prev.filter(l => l.id !== loc.id))
      toast(`Emplacement "${loc.name}" supprimé`, 'warning')
    } catch {
      toast("Impossible de supprimer l'emplacement", 'error')
    }
  }

  return {
    locations, loading, saving,
    handleAdd, handleUpdate, handleDelete,
  }
}