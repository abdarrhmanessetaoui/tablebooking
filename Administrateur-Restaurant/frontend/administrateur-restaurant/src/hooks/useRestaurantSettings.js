import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const BASE   = 'http://localhost:8000/api'
const hGet   = () => ({ 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })
const hJson  = () => ({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` })

export default function useRestaurantSettings() {

  // ── STATE ─────────────────────────────────────────────────────
  const [info, setInfo] = useState({
    form_name: '', capacity: '', address: '',
    google_maps_link: '', website: '', phone: '',
    contact_email: '', description: '',
  })
  const [infoLoading,  setInfoLoading]  = useState(true)
  const [savingInfo,   setSavingInfo]   = useState(false)
  const [successInfo,  setSuccessInfo]  = useState(false)
  const [errorInfo,    setErrorInfo]    = useState('')

  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeOH,     setActiveOH]     = useState(0)
  const [hoursLoading, setHoursLoading] = useState(true)
  const [savingHours,  setSavingHours]  = useState(false)
  const [successHours, setSuccessHours] = useState(false)
  const [errorHours,   setErrorHours]   = useState('')

  const [notifications, setNotifications] = useState({
    fp_from_name: '', fp_from_email: '',
    fp_destination_emails: '', defaultstatus: 'Pending',
  })
  const [savingNotif,  setSavingNotif]  = useState(false)
  const [successNotif, setSuccessNotif] = useState(false)
  const [errorNotif,   setErrorNotif]   = useState('')

  // ── FETCH — /restaurant/info returns: name, form_name, email,
  //   contact_name, dest_emails, default_status, location ────────
  useEffect(() => {
    fetch(`${BASE}/restaurant/info`, { headers: hGet() })
      .then(r => r.json())
      .then(d => {
        setInfo(p => ({
          ...p,
          form_name:     d.form_name  ?? d.name ?? '',
          contact_email: d.email      ?? '',
          description:   d.description ?? '',
          address:       d.address    ?? d.location ?? '',
          website:       d.website    ?? '',
          phone:         d.phone      ?? '',
          google_maps_link: d.google_maps_link ?? '',
          capacity:      d.capacity   ?? '',
        }))
        setNotifications(p => ({
          ...p,
          fp_from_name:          d.contact_name  ?? '',
          fp_from_email:         d.email         ?? '',
          fp_destination_emails: d.dest_emails   ?? '',
          defaultstatus:         d.default_status ?? 'Pending',
        }))
      })
      .catch(e => console.error('[Settings/info]', e))
      .finally(() => setInfoLoading(false))
  }, [])

  // ── FETCH — /time-slots returns: allOH, working_dates ─────────
  useEffect(() => {
    fetch(`${BASE}/time-slots`, { headers: hGet() })
      .then(r => r.json())
      .then(d => {
        setHours({
          allOH:         d.allOH         ?? [],
          working_dates: d.working_dates ?? [false,true,true,true,true,true,true],
        })
      })
      .catch(e => console.error('[Settings/time-slots]', e))
      .finally(() => setHoursLoading(false))
  }, [])

  // ── ACTIONS ───────────────────────────────────────────────────
  const setInfoField     = (key, val) => setInfo(p => ({ ...p, [key]: val }))
  const setNotifField    = (key, val) => setNotifications(p => ({ ...p, [key]: val }))
  const setActiveService = (i) => setActiveOH(i)

  const toggleWorkingDay = (i) => {
    setSuccessHours(false)
    setHours(p => ({ ...p, working_dates: p.working_dates.map((v, idx) => idx === i ? !v : v) }))
  }

  const updateOH = (index, field, value) => {
    setSuccessHours(false)
    setHours(p => ({
      ...p,
      allOH: p.allOH.map((oh, i) =>
        i === index
          ? { ...oh, openhours: oh.openhours.map((s, j) => j === 0 ? { ...s, [field]: value } : s) }
          : oh
      ),
    }))
  }

  async function saveInfo() {
    setSavingInfo(true); setErrorInfo(''); setSuccessInfo(false)
    try {
      const res = await fetch(`${BASE}/restaurant/info`, {
        method: 'PUT', headers: hJson(), body: JSON.stringify(info),
      })
      if (!res.ok) throw new Error(res.status)
      setSuccessInfo(true)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch (e) { setErrorInfo(`Erreur ${e.message}`) }
    finally { setSavingInfo(false) }
  }

  async function saveHours() {
    setSavingHours(true); setErrorHours(''); setSuccessHours(false)
    try {
      const res = await fetch(`${BASE}/time-slots`, {
        method: 'PUT', headers: hJson(),
        body: JSON.stringify({ allOH: hours.allOH, working_dates: hours.working_dates }),
      })
      if (!res.ok) throw new Error(res.status)
      setSuccessHours(true)
      setTimeout(() => setSuccessHours(false), 3000)
    } catch (e) { setErrorHours(`Erreur ${e.message}`) }
    finally { setSavingHours(false) }
  }

  async function saveNotif() {
    setSavingNotif(true); setErrorNotif(''); setSuccessNotif(false)
    try {
      const res = await fetch(`${BASE}/restaurant/notifications`, {
        method: 'PUT', headers: hJson(), body: JSON.stringify(notifications),
      })
      if (!res.ok) throw new Error(res.status)
      setSuccessNotif(true)
      setTimeout(() => setSuccessNotif(false), 3000)
    } catch (e) { setErrorNotif(`Erreur ${e.message}`) }
    finally { setSavingNotif(false) }
  }

  return {
    loading: infoLoading || hoursLoading, error: '',
    info, setInfoField,
    saveInfo, savingInfo, successInfo, errorInfo,
    hours, activeOH,
    setActiveService, toggleWorkingDay, updateOH,
    saveHours, savingHours, successHours, errorHours,
    notifications, setNotifField,
    saveNotif, savingNotif, successNotif, errorNotif,
  }
}