import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import useRestaurantInfo from './useRestaurantInfo'

const BASE = 'http://localhost:8000/api/restaurant'

const h = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useRestaurantSettings() {

  // ── 1. INFO (reuses existing hook) ───────────────────────────
  const { info: rawInfo, loading: infoLoading } = useRestaurantInfo()

  const [info, setInfo] = useState({
    form_name:       '',
    capacity:        '',
    address:         '',
    google_maps_link:'',
    website:         '',
    phone:           '',
    contact_email:   '',
    description:     '',
  })

  useEffect(() => {
    if (rawInfo) setInfo(p => ({ ...p, ...rawInfo }))
  }, [rawInfo])

  const setInfoField = (key, val) => setInfo(p => ({ ...p, [key]: val }))

  const [savingInfo,  setSavingInfo]  = useState(false)
  const [successInfo, setSuccessInfo] = useState(false)
  const [errorInfo,   setErrorInfo]   = useState('')

  async function saveInfo() {
    setSavingInfo(true); setErrorInfo(''); setSuccessInfo(false)
    try {
      const res = await fetch(`${BASE}/info`, { method: 'PUT', headers: h(), body: JSON.stringify(info) })
      if (!res.ok) throw new Error()
      const d = await res.json()
      setInfo(p => ({ ...p, ...d }))
      setSuccessInfo(true)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch { setErrorInfo("Impossible d'enregistrer les informations.") }
    finally  { setSavingInfo(false) }
  }

  // ── 2. HOURS (allOH + working_dates) ─────────────────────────
  const [hours,        setHours]       = useState({ allOH: [], working_dates: [] })
  const [activeOH,     setActiveOH]    = useState(0)
  const [hoursLoading, setHoursLoading]= useState(true)
  const [savingHours,  setSavingHours] = useState(false)
  const [successHours, setSuccessHours]= useState(false)
  const [errorHours,   setErrorHours]  = useState('')

  useEffect(() => {
    fetch(`${BASE}/time-slots`, { headers: h() })
      .then(r => r.json())
      .then(d => setHours({
        allOH:         d.allOH         ?? [],
        working_dates: d.working_dates ?? [false,true,true,true,true,true,true],
      }))
      .catch(() => {})
      .finally(() => setHoursLoading(false))
  }, [])

  const setActiveService  = (i) => setActiveOH(i)

  const toggleWorkingDay  = (i) => {
    setSuccessHours(false)
    setHours(p => ({ ...p, working_dates: p.working_dates.map((v, idx) => idx === i ? !v : v) }))
  }

  const updateOH = (index, field, value) => {
    setSuccessHours(false)
    setHours(p => ({
      ...p,
      allOH: p.allOH.map((oh, i) =>
        i === index
          ? { ...oh, openhours: oh.openhours.map((slot, j) => j === 0 ? { ...slot, [field]: value } : slot) }
          : oh
      ),
    }))
  }

  async function saveHours() {
    setSavingHours(true); setErrorHours(''); setSuccessHours(false)
    try {
      const res = await fetch(`${BASE}/time-slots`, {
        method: 'PUT', headers: h(),
        body: JSON.stringify({ allOH: hours.allOH, working_dates: hours.working_dates }),
      })
      if (!res.ok) throw new Error()
      setSuccessHours(true)
      setTimeout(() => setSuccessHours(false), 3000)
    } catch { setErrorHours("Impossible d'enregistrer les horaires.") }
    finally  { setSavingHours(false) }
  }

  // ── 3. NOTIFICATIONS ─────────────────────────────────────────
  // Fields mapped directly from wpjn_cpappbk_forms columns:
  //   fp_from_name, fp_from_email, fp_destination_emails, defaultstatus
  const [notifications,    setNotifications]   = useState({
    fp_from_name:          'TableBooking.ma',
    fp_from_email:         '',
    fp_destination_emails: '',
    defaultstatus:         'Pending',
  })
  const [notifLoading, setNotifLoading]= useState(true)
  const [savingNotif,  setSavingNotif] = useState(false)
  const [successNotif, setSuccessNotif]= useState(false)
  const [errorNotif,   setErrorNotif]  = useState('')

  useEffect(() => {
    fetch(`${BASE}/notifications`, { headers: h() })
      .then(r => r.json())
      .then(d => setNotifications({
        fp_from_name:          d.fp_from_name          ?? 'TableBooking.ma',
        fp_from_email:         d.fp_from_email          ?? '',
        fp_destination_emails: d.fp_destination_emails  ?? '',
        defaultstatus:         d.defaultstatus           ?? 'Pending',
      }))
      .catch(() => {})
      .finally(() => setNotifLoading(false))
  }, [])

  const setNotifField = (key, val) => setNotifications(p => ({ ...p, [key]: val }))

  async function saveNotif() {
    setSavingNotif(true); setErrorNotif(''); setSuccessNotif(false)
    try {
      const res = await fetch(`${BASE}/notifications`, {
        method: 'PUT', headers: h(),
        body: JSON.stringify(notifications),
      })
      if (!res.ok) throw new Error()
      setSuccessNotif(true)
      setTimeout(() => setSuccessNotif(false), 3000)
    } catch { setErrorNotif("Impossible d'enregistrer les notifications.") }
    finally  { setSavingNotif(false) }
  }

  // ── Shared ────────────────────────────────────────────────────
  const loading = infoLoading || hoursLoading || notifLoading
  const error   = ''   // individual section errors handle their own display

  return {
    loading, error,
    // info
    info, setInfoField,
    saveInfo, savingInfo, successInfo, errorInfo,
    // hours
    hours, activeOH,
    setActiveService, toggleWorkingDay, updateOH,
    saveHours, savingHours, successHours, errorHours,
    // notifications
    notifications, setNotifField,
    saveNotif, savingNotif, successNotif, errorNotif,
  }
}