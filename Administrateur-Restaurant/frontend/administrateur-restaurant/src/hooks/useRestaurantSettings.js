import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import { toast } from '../components/ToastContainer'

const BASE  = 'http://localhost:8000/api'
const hGet  = () => ({ 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })
const hJson = () => ({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })

export default function useRestaurantSettings() {

  const [info, setInfo] = useState({
    form_name: '', capacity: '', address: '',
    google_maps_link: '', website: '', phone: '',
    contact_email: '', description: '',
  })
  const [infoLoading,  setInfoLoading]  = useState(true)
  const [savingInfo,   setSavingInfo]   = useState(false)

  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeOH,     setActiveOH]     = useState(0)
  const [hoursLoading, setHoursLoading] = useState(true)
  const [savingHours,  setSavingHours]  = useState(false)

  const [notifications, setNotifications] = useState({
    fp_from_name: '', fp_from_email: '',
    fp_destination_emails: '', defaultstatus: 'Pending',
  })
  const [savingNotif, setSavingNotif] = useState(false)

  useEffect(() => {
    fetch(`${BASE}/restaurant/info`, { headers: hGet() })
      .then(r => r.json())
      .then(d => {
        setInfo({
          form_name:        d.form_name         ?? '',
          contact_email:    d.contact_email      ?? '',
          description:      d.description        ?? '',
          address:          d.address            ?? '',
          website:          d.website            ?? '',
          phone:            d.phone              ?? '',
          google_maps_link: d.google_maps_link   ?? '',
          capacity:         d.capacity           ?? '',
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

  const setInfoField     = (key, val) => setInfo(p => ({ ...p, [key]: val }))
  const setNotifField    = (key, val) => setNotifications(p => ({ ...p, [key]: val }))
  const setActiveService = (i) => setActiveOH(i)

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
    } catch { toast('Impossible d\'enregistrer les informations', 'error') }
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
    } catch { toast('Impossible d\'enregistrer les horaires', 'error') }
    finally { setSavingHours(false) }
  }

  async function saveNotif() {
    setSavingNotif(true)
    try {
      const res = await fetch(`${BASE}/restaurant/notifications`, { method: 'PUT', headers: hJson(), body: JSON.stringify(notifications) })
      if (!res.ok) throw new Error(res.status)
      toast('Notifications enregistrées', 'success')
    } catch { toast('Impossible d\'enregistrer les notifications', 'error') }
    finally { setSavingNotif(false) }
  }

  return {
    loading: infoLoading || hoursLoading,
    info, setInfoField, saveInfo, savingInfo,
    hours, activeOH, setActiveService, toggleWorkingDay, updateOH, saveHours, savingHours,
    notifications, setNotifField, saveNotif, savingNotif,
  }
}