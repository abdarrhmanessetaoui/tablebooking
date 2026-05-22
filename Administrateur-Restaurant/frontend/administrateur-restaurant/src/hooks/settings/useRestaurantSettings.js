import { useState, useEffect } from 'react'
import { apiPath, getHeaders } from '../../utils/api'
import { toast } from '../../components/ui/Toast'
import i18n from '../../i18n'

function normalizeDaySlots(oh) {
  const base = oh.openhours?.[0] ?? { type: 'all', h1: '12', m1: '0', h2: '23', m2: '0' }
  if (oh.openhours?.length === 7) return oh
  return {
    ...oh,
    openhours: Array.from({ length: 7 }, (_, d) => ({ ...base, type: 'day', d: String(d) })),
  }
}

export default function useRestaurantSettings() {

  // ── Info ─────────────────────────────────────────────────────
  const [info, setInfo] = useState({
    form_name: '', capacity: '', address: '',
    google_maps_link: '', website: '', phone: '',
    contact_email: '', description: '',
  })
  const [infoLoading, setInfoLoading] = useState(true)
  const [savingInfo,  setSavingInfo]  = useState(false)

  // ── Hours ────────────────────────────────────────────────────
  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeService,setActiveServiceIdx] = useState(0)
  const [activeDay,    setActiveDay]    = useState(1)
  const [hoursLoading, setHoursLoading] = useState(true)
  const [savingHours,  setSavingHours]  = useState(false)

  // ── Services ─────────────────────────────────────────────────
  const [services,        setServices]        = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)

  // ── Notifications ─────────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    fp_from_name: '', fp_from_email: '',
    fp_destination_emails: '', defaultstatus: 'Pending',
  })
  const [savingNotif, setSavingNotif] = useState(false)

  // ── Fetches ──────────────────────────────────────────────────

  useEffect(() => {
    fetch(apiPath('restaurant/info'), { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        setInfo({
          form_name:        d.form_name        ?? '',
          contact_email:    d.contact_email    ?? '',
          description:      d.description      ?? '',
          address:          d.address          ?? '',
          website:          d.website          ?? '',
          phone:            d.phone            ?? '',
          google_maps_link: d.google_maps_link ?? '',
          capacity:         d.capacity         ?? '',
        })
        setNotifications({
          fp_from_name:          d.contact_name   ?? '',
          fp_from_email:         d.contact_email  ?? '',
          fp_destination_emails: d.dest_emails    ?? '',
          defaultstatus:         d.default_status ?? 'Pending',
        })
      })
      .catch(() => toast(i18n.t('settings_module.error_loading_info'), 'error'))
      .finally(() => setInfoLoading(false))
  }, [])

  useEffect(() => {
    Promise.all([
      fetch(apiPath('time-slots'),          { headers: getHeaders() }).then(r => r.json()),
      fetch(apiPath('restaurant/services'), { headers: getHeaders() }).then(r => r.json()),
    ])
      .then(([d, svcs]) => {
        const normalized = (d.allOH ?? []).map(normalizeDaySlots)
        const svcList    = Array.isArray(svcs) ? svcs : []
        const maxOh      = Math.max(0, ...svcList.map(s => s.ohindex ?? 0))
        const paddedOH   = [...normalized]
        for (let i = paddedOH.length; i <= maxOh; i++) {
          paddedOH.push(normalizeDaySlots({ openhours: [] }))
        }
        setHours({ allOH: paddedOH, working_dates: d.working_dates ?? [false,true,true,true,true,true,true] })
        setServices(svcList)
        const firstOpen = (d.working_dates ?? [false,true,true,true,true,true,true]).findIndex(Boolean)
        if (firstOpen >= 0) setActiveDay(firstOpen)
      })
      .catch(() => toast(i18n.t('settings_module.error_loading_hours'), 'error'))
      .finally(() => { setHoursLoading(false); setServicesLoading(false) })
  }, [])

  // ── Derived ──────────────────────────────────────────────────

  const servicesOnActiveDay = services.filter(svc =>
    (svc.available_days ?? [0,1,2,3,4,5,6]).includes(activeDay)
  )

  // ── Setters ──────────────────────────────────────────────────

  const setInfoField  = (key, val) => setInfo(p => ({ ...p, [key]: val }))
  const setNotifField = (key, val) => setNotifications(p => ({ ...p, [key]: val }))

  const toggleWorkingDay = dayIdx =>
    setHours(p => ({ ...p, working_dates: p.working_dates.map((v, i) => i === dayIdx ? !v : v) }))

  const updateDayOH = (ohindex, dayIdx, field, value) =>
    setHours(p => ({
      ...p,
      allOH: p.allOH.map((oh, i) =>
        i === ohindex
          ? { ...oh, openhours: oh.openhours.map((s, d) => d === dayIdx ? { ...s, [field]: value } : s) }
          : oh
      ),
    }))

  // ── Saves ────────────────────────────────────────────────────

  async function saveInfo() {
    setSavingInfo(true)
    try {
      const res = await fetch(apiPath('restaurant/info'), { method: 'PUT', headers: getHeaders(), body: JSON.stringify(info) })
      if (!res.ok) throw new Error(res.status)
      toast(i18n.t('settings_module.info_saved'), 'success')
    } catch { toast(i18n.t('settings_module.error_saving_info'), 'error') }
    finally { setSavingInfo(false) }
  }

  async function saveHours() {
    setSavingHours(true)
    try {
      const res = await fetch(apiPath('time-slots'), {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ allOH: hours.allOH, working_dates: hours.working_dates }),
      })
      if (!res.ok) throw new Error(res.status)
      toast(i18n.t('settings_module.hours_saved'), 'success')
    } catch { toast(i18n.t('settings_module.error_saving_hours'), 'error') }
    finally { setSavingHours(false) }
  }

  async function saveNotif() {
    setSavingNotif(true)
    try {
      const res = await fetch(apiPath('restaurant/notifications'), { method: 'PUT', headers: getHeaders(), body: JSON.stringify(notifications) })
      if (!res.ok) throw new Error(res.status)
      toast(i18n.t('settings_module.notif_saved'), 'success')
    } catch { toast(i18n.t('settings_module.error_saving_notif'), 'error') }
    finally { setSavingNotif(false) }
  }

  return {
    loading: infoLoading || hoursLoading || servicesLoading,
    info, setInfoField, saveInfo, savingInfo,
    hours, activeService, setActiveServiceIdx, activeDay, setActiveDay,
    toggleWorkingDay, updateDayOH, saveHours, savingHours,
    services, servicesOnActiveDay,
    notifications, setNotifField, saveNotif, savingNotif,
  }
}
