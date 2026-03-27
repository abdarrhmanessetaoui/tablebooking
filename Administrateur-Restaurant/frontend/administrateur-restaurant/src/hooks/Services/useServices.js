import { useState, useEffect } from 'react'
import { getToken }  from '../../utils/auth'
import { toast }     from '../../components/ui/Toast'
import { confirm }   from '../../components/ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'

const API = 'http://localhost:8000/api/services'

const hdrs = () => ({
  'Content-Type': 'application/json',
  'Accept':       'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useServices() {
  const { t } = useTranslation()
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
      setError(t('services_module.error_loading'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form, resetForm) {
    setSaving(true)
    const body = {
      name:           form.name,
      price:          parseFloat(form.price)    || 0,
      capacity:       parseInt(form.capacity)   || 1,
      duration:       parseInt(form.duration)   || 60,
      available_days: form.available_days       ?? [0,1,2,3,4,5,6],
    }
    try {
      if (editingSvc) {
        await fetch(`${API}/${editingSvc.idx}`, {
          method: 'PUT', headers: hdrs(), body: JSON.stringify(body),
        })
        setServices(prev => prev.map(s =>
          s.idx === editingSvc.idx ? { ...s, ...body } : s
        ))
        toast(t('services_module.service_modified', { name: form.name }), 'success')
        setEditingSvc(null)
      } else {
        const res  = await fetch(API, { method: 'POST', headers: hdrs(), body: JSON.stringify(body) })
        const data = await res.json()
        setServices(prev => [...prev, data])
        toast(t('services_module.service_added', { name: form.name }), 'success')
        if (resetForm) resetForm()
      }
    } catch {
      toast(editingSvc ? t('services_module.error_modifying') : t('services_module.error_adding'), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(svc) {
    const ok = await confirm({
      title: t('services_module.delete_service_title'), 
      message: t('services_module.delete_service_msg', { name: svc.name }),
      sub: t('services_module.delete_service_sub'),
      confirmLabel: t('services_module.delete'), type: 'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${svc.idx}`, { method: 'DELETE', headers: hdrs() })
      setServices(prev => prev.filter(s => s.idx !== svc.idx))
      if (editingSvc?.idx === svc.idx) setEditingSvc(null)
      toast(t('services_module.service_deleted', { name: svc.name }), 'warning')
    } catch {
      toast(t('services_module.error_deleting'), 'error')
    }
  }

  return {
    services, loading, error,
    editingSvc, setEditingSvc,
    saving, handleSave, handleDelete,
  }
}
