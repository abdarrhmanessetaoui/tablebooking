import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'
import { toast }   from '../../components/ui/Toast'
import { confirm } from '../../components/ui/ConfirmDialog'

const API_GET   = 'http://localhost:8000/api/admin/blocked-dates'
const API_WRITE = 'http://localhost:8000/api/blocked-dates'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

const EMPTY_FORM = {
  mode:      'single',   // 'single' | 'interval' | 'recurring'
  date:      '',
  date_from: '',
  date_to:   '',
  weekday:   '1',        // 0=Sun … 6=Sat
  until:     '',         // optional end date for recurring
}

export default function useBlockedDates() {
  const [blockedDates, setBlockedDates] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [form,         setForm]         = useState(EMPTY_FORM)
  const [submitting,   setSubmitting]   = useState(false)

  useEffect(() => { fetchBlockedDates() }, [])

  const fetchBlockedDates = async () => {
    setLoading(true)
    try {
      const res  = await fetch(API_GET, { headers: headers() })
      const data = await res.json()
      setBlockedDates(Array.isArray(data) ? data : [])
    } catch {
      setError('Impossible de charger les dates bloquées.')
      setBlockedDates([])
    } finally {
      setLoading(false)
    }
  }

  // Build list of dates to block depending on mode
  function getDatesToBlock() {
    const dates = []

    if (form.mode === 'single') {
      if (form.date) dates.push(form.date)

    } else if (form.mode === 'interval') {
      if (!form.date_from || !form.date_to) return []
      const cur = new Date(form.date_from)
      const end = new Date(form.date_to)
      if (cur > end) return []
      while (cur <= end) {
        dates.push(cur.toISOString().slice(0, 10))
        cur.setDate(cur.getDate() + 1)
      }

    } else if (form.mode === 'recurring') {
      if (!form.date_from) return []
      const start   = new Date(form.date_from)
      const end     = form.until ? new Date(form.until) : new Date(new Date().getFullYear() + 2, 11, 31)
      const weekday = parseInt(form.weekday)
      const cur     = new Date(start)
      // advance to first matching weekday
      while (cur.getDay() !== weekday) cur.setDate(cur.getDate() + 1)
      while (cur <= end) {
        dates.push(cur.toISOString().slice(0, 10))
        cur.setDate(cur.getDate() + 7)
      }
    }

    return dates
  }

  const handleBlock = async () => {
    const dates = getDatesToBlock()
    if (dates.length === 0) return

    // Warn if blocking many dates
    if (dates.length > 10) {
      const ok = await confirm({
        title:        'Bloquer plusieurs dates',
        message:      `Vous allez bloquer ${dates.length} dates.`,
        sub:          'Cette action peut prendre un moment.',
        confirmLabel: 'Confirmer',
        type:         'warning',
      })
      if (!ok) return
    }

    setSubmitting(true)
    setError('')
    try {
      // Send all dates in one request if backend supports bulk,
      // otherwise send one by one
      const res = await fetch(API_WRITE + '/bulk', {
        method:  'POST',
        headers: headers(),
        body:    JSON.stringify({ dates }),
      })
      if (!res.ok) {
        // fallback: one by one
        const added = []
        for (const date of dates) {
          const r = await fetch(API_WRITE, {
            method:  'POST',
            headers: headers(),
            body:    JSON.stringify({ date }),
          })
          if (r.ok) {
            const d = await r.json()
            added.push(d)
          }
        }
        setBlockedDates(prev =>
          [...prev, ...added]
            .filter((v, i, a) => a.findIndex(x => x.date === v.date) === i)
            .sort((a, b) => a.date.localeCompare(b.date))
        )
      } else {
        const data = await res.json()
        const newDates = Array.isArray(data) ? data : data.dates || []
        setBlockedDates(prev =>
          [...prev, ...newDates]
            .filter((v, i, a) => a.findIndex(x => x.date === v.date) === i)
            .sort((a, b) => a.date.localeCompare(b.date))
        )
      }
      toast(
        dates.length === 1
          ? 'Date bloquée avec succès'
          : `${dates.length} dates bloquées avec succès`,
        'success'
      )
      setForm(EMPTY_FORM)
    } catch {
      toast('Impossible de bloquer les dates', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnblock = async (date) => {
    const ok = await confirm({
      title:        'Débloquer la date',
      message:      `Voulez-vous débloquer le ${new Date(date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} ?`,
      confirmLabel: 'Débloquer',
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API_WRITE}/${date}`, { method: 'DELETE', headers: headers() })
      setBlockedDates(prev => prev.filter(d => d.date !== date))
      toast('Date débloquée', 'warning')
    } catch {
      toast('Impossible de débloquer la date', 'error')
    }
  }

  return {
    blockedDates, loading, error,
    form, setForm, submitting,
    handleBlock, handleUnblock,
    getDatesToBlock,
    refetch: fetchBlockedDates,
  }
}