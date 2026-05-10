import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { apiPath, getHeaders } from '../../utils/api'
import { toast } from '../../components/ui/Toast'
import { confirm } from '../../components/ui/ConfirmDialog'

const API_GET   = apiPath('admin/blocked-dates')
const API_WRITE = apiPath('blocked-dates')

const EMPTY_FORM = {
  mode: 'single',
  date: '',
  date_from: '',
  date_to: '',
  weekday: '1',
  until: '',
  reason: '',
}

export default function useBlockedDates() {
  const { t, i18n } = useTranslation()
  const [blockedDates, setBlockedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'

  useEffect(() => { fetchBlockedDates() }, [])

  const fetchBlockedDates = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_GET, { headers: getHeaders() })
      const data = await res.json()
      setBlockedDates(Array.isArray(data) ? data : [])
    } catch {
      setError(t('calendar.error_loading_blocked'))
      setBlockedDates([])
    } finally {
      setLoading(false)
    }
  }

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
      const start = new Date(form.date_from)
      const end = form.until ? new Date(form.until) : new Date(new Date().getFullYear() + 2, 11, 31)
      const weekday = parseInt(form.weekday)
      const cur = new Date(start)
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
    const reason = form.reason || null
    if (dates.length === 0) return

    if (dates.length > 10) {
      const ok = await confirm({
        title: t('calendar.block_multiple_title'),
        message: t('calendar.block_multiple_msg', { count: dates.length }),
        sub: t('calendar.block_multiple_sub'),
        confirmLabel: t('calendar.confirm'),
        type: 'warning',
      })
      if (!ok) return
    }

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(API_WRITE + '/bulk', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ dates, reason }),
      })

      if (!res.ok) {
        // fallback: one by one
        const added = []
        for (const date of dates) {
          const r = await fetch(API_WRITE, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ date, reason }),
          })
          if (r.ok) added.push(await r.json())
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
          ? t('calendar.date_success_blocked')
          : t('calendar.dates_success_blocked', { count: dates.length }),
        'success'
      )
      setForm(EMPTY_FORM)
    } catch {
      toast(t('calendar.error_blocking'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnblock = async (date) => {
    const dt = new Date(date + 'T00:00:00')
    const label = dt.toLocaleDateString(lang, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    const ok = await confirm({
      title: t('calendar.unblock_date'),
      message: t('calendar.unblock_single_msg', { date: label }),
      confirmLabel: t('calendar.unblock'),
      type: 'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API_WRITE}/${date}`, { method: 'DELETE', headers: getHeaders() })
      setBlockedDates(prev => prev.filter(d => d.date !== date))
      toast(t('calendar.date_success_unblocked'), 'warning')
    } catch {
      toast(t('calendar.error_unblocking'), 'error')
    }
  }

  return {
    blockedDates, loading, error,
    form, setForm, submitting,
    handleBlock, handleUnblock,
    getDatesToBlock,
    setBlockedDates,
    refetch: fetchBlockedDates,
  }
}
