import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import { toast } from '../components/ToastContainer'

const BASE  = 'http://localhost:8000/api'
const hGet  = () => ({ 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })
const hJson = () => ({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })

// Ensure an allOH entry has 7 day slots (one per day of week)
function normalizeDaySlots(oh) {
  const base = oh.openhours?.[0] ?? { type:'all', h1:'12', m1:'0', h2:'23', m2:'0' }
  // If already has 7 slots keep them, else expand the single global slot to 7 days
  if (oh.openhours?.length === 7) return oh
  return {
    ...oh,
    openhours: Array.from({ length: 7 }, (_, d) => ({
      ...base,
      type: 'day',
      d: String(d),
    })),
  }
}

export default function useRestaurantSettings() {

  const [info, setInfo] = useState({
    form_name: '', capacity: '', address: '',
    google_maps_link: '', website: '', phone: '',
    contact_email: '', description: '',
  })
  const [infoLoading, setInfoLoading] = useState(true)
  const [savingInfo,  setSavingInfo]  = useState(false)

  // hours.allOH[serviceIdx].openhours[dayIdx] = { h1,m1,h2,m2 }
  // hours.working_dates[dayIdx] = true/false
  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeService, setActiveServiceIdx] = useState(0)  // which service tab
  const [activeDay,     setActiveDay]        = useState(1)  // which day (0=Sun..6=Sat)
  const [hoursLoading,  setHoursLoading]     = useState(true)
  const [savingHours,   setSavingHours]      = useState(false)

  const [services,        setServices]        = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)

  const [notifications, setNotifications] = useState({
    fp_from_name: '', fp_from_email: '',
    fp_destination_emails: '', defaultstatus: 'Pending',
  })
  const [savingNotif, setSavingNotif] = useState(false)

  // ── Fetches ───────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${BASE}/restaurant/info`, { headers: hGet() })
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
      .catch(() => toast('Erreur de chargement des informations', 'error'))
      .finally(() => setInfoLoading(false))
  }, [])

  useEffect(() => {
    fetch(`${BASE}/time-slots`, { headers: hGet() })
      .then(r => r.json())
      .then(d => {
        const normalized = (d.allOH ?? []).map(normalizeDaySlots)
        setHours({
          allOH:         normalized,
          working_dates: d.working_dates ?? [false,true,true,true,true,true,true],
        })
        // default active day = first open day
        const firstOpen = (d.working_dates ?? [false,true,true,true,true,true,true]).findIndex(Boolean)
        if (firstOpen >= 0) setActiveDay(firstOpen)
      })
      .catch(() => toast('Erreur de chargement des horaires', 'error'))
      .finally(() => setHoursLoading(false))
  }, [])

  useEffect(() => {
    fetch(`${BASE}/restaurant/services`, { headers: hGet() })
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setServicesLoading(false))
  }, [])

  // ── Actions ───────────────────────────────────────────────────

  const setInfoField  = (key, val) => setInfo(p => ({ ...p, [key]: val }))
  const setNotifField = (key, val) => setNotifications(p => ({ ...p, [key]: val }))

  const toggleWorkingDay = (dayIdx) => {
    setHours(p => ({ ...p, working_dates: p.working_dates.map((v, i) => i === dayIdx ? !v : v) }))
    // if activating a closed day, switch to it
    setActiveDay(dayIdx)
  }

  // Update a specific service + day time field
  const updateDayOH = (ohindex, dayIdx, field, value) => {
    setHours(p => ({
      ...p,
      allOH: p.allOH.map((oh, i) =>
        i === ohindex
          ? { ...oh, openhours: oh.openhours.map((s, d) => d === dayIdx ? { ...s, [field]: value } : s) }
          : oh
      ),
    }))
  }

  async function saveInfo() {
    setSavingInfo(true)
    try {
      const res = await fetch(`${BASE}/restaurant/info`, { method: 'PUT', headers: hJson(), body: JSON.stringify(info) })
      if (!res.ok) throw new Error(res.status)
      toast('Informations enregistrées', 'success')
    } catch { toast("Impossible d'enregistrer les informations", 'error') }
    finally { setSavingInfo(false) }
  }

  async function saveHours() {
    setSavingHours(true)
    try {
      const res = await fetch(`${BASE}/time-slots`, {
        method: 'PUT', headers: hJson(),
        body: JSON.stringify({ allOH: hours.allOH, working_dates: hours.working_dates }),
      })
      if (!res.ok) throw new Error(res.status)
      toast('Horaires enregistrés', 'success')
    } catch { toast("Impossible d'enregistrer les horaires", 'error') }
    finally { setSavingHours(false) }
  }

  async function saveNotif() {
    setSavingNotif(true)
    try {
      const res = await fetch(`${BASE}/restaurant/notifications`, { method: 'PUT', headers: hJson(), body: JSON.stringify(notifications) })
      if (!res.ok) throw new Error(res.status)
      toast('Notifications enregistrées', 'success')
    } catch { toast("Impossible d'enregistrer les notifications", 'error') }
    finally { setSavingNotif(false) }
  }

  return {
    loading: infoLoading || hoursLoading || servicesLoading,
    info, setInfoField, saveInfo, savingInfo,
    hours, activeService, setActiveServiceIdx, activeDay, setActiveDay,
    toggleWorkingDay, updateDayOH, saveHours, savingHours,
    services,
    notifications, setNotifField, saveNotif, savingNotif,
  }
}