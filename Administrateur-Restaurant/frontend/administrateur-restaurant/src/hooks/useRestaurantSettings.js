import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import { toast } from '../components/ui/Toast'

const BASE  = 'http://localhost:8000/api'
const hGet  = () => ({ 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })
const hJson = () => ({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })

export default function useRestaurantSettings() {

  const [info, setInfo] = useState({
    form_name: '', capacity: '', address: '',
    google_maps_link: '', website: '', phone: '',
    contact_email: '', description: '',
  })
  const [infoLoading, setInfoLoading] = useState(true)
  const [savingInfo,  setSavingInfo]  = useState(false)

  // hours: allOH indexed by service (ohindex on each service points to allOH entry)
  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeOH,     setActiveOH]     = useState(0)
  const [hoursLoading, setHoursLoading] = useState(true)
  const [savingHours,  setSavingHours]  = useState(false)

  // services from /restaurant/services
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
      .then(d => setHours({
        allOH:         d.allOH         ?? [],
        working_dates: d.working_dates ?? [false,true,true,true,true,true,true],
      }))
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

  const setInfoField     = (key, val) => setInfo(p => ({ ...p, [key]: val }))
  const setNotifField    = (key, val) => setNotifications(p => ({ ...p, [key]: val }))

  // activeOH is the index into allOH — clicking a service tab sets it to that service's ohindex
  // If no allOH entry exists at that index yet, create a default one
  const setActiveService = (ohindex) => {
    setHours(p => {
      if (p.allOH[ohindex]) return p   // already exists, nothing to do
      // fill any gaps up to ohindex with defaults
      const filled = [...p.allOH]
      while (filled.length <= ohindex) {
        const svc = services[filled.length] ?? {}
        filled.push({
          name: svc.name ?? `Service ${filled.length + 1}`,
          openhours: [{ type: 'all', d: '', h1: '12', m1: '0', h2: '23', m2: '0' }],
        })
      }
      return { ...p, allOH: filled }
    })
    setActiveOH(ohindex)
  }

  const toggleWorkingDay = (i) =>
    setHours(p => ({ ...p, working_dates: p.working_dates.map((v, idx) => idx === i ? !v : v) }))

  const updateOH = (index, field, value) =>
    setHours(p => ({
      ...p,
      allOH: p.allOH.map((oh, i) =>
        i === index
          ? { ...oh, openhours: oh.openhours.map((s, j) => j === 0 ? { ...s, [field]: value } : s) }
          : oh
      ),
    }))

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
    hours, activeOH, setActiveService, toggleWorkingDay, updateOH, saveHours, savingHours,
    services,
    notifications, setNotifField, saveNotif, savingNotif,
  }
}