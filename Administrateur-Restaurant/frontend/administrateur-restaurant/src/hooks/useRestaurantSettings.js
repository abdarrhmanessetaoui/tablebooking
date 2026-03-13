import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const BASE = 'http://localhost:8000/api/restaurant'

const h = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useRestaurantSettings() {

  // ── 1. INFO ───────────────────────────────────────────────────
  const [info, setInfo] = useState({
    form_name:        '',
    capacity:         '',
    address:          '',
    google_maps_link: '',
    website:          '',
    phone:            '',
    contact_email:    '',
    description:      '',
  })
  const [infoLoading,  setInfoLoading]  = useState(true)
  const [savingInfo,   setSavingInfo]   = useState(false)
  const [successInfo,  setSuccessInfo]  = useState(false)
  const [errorInfo,    setErrorInfo]    = useState('')

  useEffect(() => {
    fetch(`${BASE}/info`, { headers: h() })
      .then(r => r.json())
      .then(d => {
        // d is the raw row from wpjn_cpappbk_forms
        // form_structure is a JSON string — parse it to get allOH + working_dates
        let parsed = null
        try { parsed = JSON.parse(d.form_structure) } catch {}
        const fapp = parsed?.[0]?.[0] ?? {}   // first element of first page = fapp field

        setInfo({
          form_name:        d.form_name        ?? '',
          capacity:         fapp.services?.[0]?.capacity ?? '',
          address:          d.address          ?? '',
          google_maps_link: d.google_maps_link ?? '',
          website:          d.website          ?? '',
          phone:            d.phone            ?? '',
          contact_email:    d.fp_from_email    ?? '',
          description:      d.description      ?? '',
        })

        // Stash parsed form_structure so hours section can use it
        _formStructureRef.allOH         = fapp.allOH         ?? []
        _formStructureRef.working_dates = fapp.working_dates ?? [false,true,true,true,true,true,true]
        setHours({
          allOH:         fapp.allOH         ?? [],
          working_dates: fapp.working_dates ?? [false,true,true,true,true,true,true],
        })
        setHoursLoading(false)
      })
      .catch(() => { setHoursLoading(false) })
      .finally(() => setInfoLoading(false))
  }, [])

  // mutable ref — avoids stale closure in saveHours
  const _formStructureRef = {}

  const setInfoField = (key, val) => setInfo(p => ({ ...p, [key]: val }))

  async function saveInfo() {
    setSavingInfo(true); setErrorInfo(''); setSuccessInfo(false)
    try {
      const res = await fetch(`${BASE}/info`, {
        method: 'PUT', headers: h(),
        body: JSON.stringify(info),
      })
      if (!res.ok) throw new Error()
      const d = await res.json()
      setInfo(p => ({ ...p, ...d }))
      setSuccessInfo(true)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch { setErrorInfo("Impossible d'enregistrer les informations.") }
    finally  { setSavingInfo(false) }
  }

  // ── 2. HOURS ─────────────────────────────────────────────────
  // Loaded above in the same fetch as info (both come from form_structure)
  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeOH,     setActiveOH]     = useState(0)
  const [hoursLoading, setHoursLoading] = useState(true)
  const [savingHours,  setSavingHours]  = useState(false)
  const [successHours, setSuccessHours] = useState(false)
  const [errorHours,   setErrorHours]   = useState('')

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
  // These ARE top-level columns: fp_from_name, fp_from_email,
  // fp_destination_emails, defaultstatus — loaded from same /info response
  const [notifications,  setNotifications] = useState({
    fp_from_name:          'TableBooking.ma',
    fp_from_email:         '',
    fp_destination_emails: '',
    defaultstatus:         'Pending',
  })
  const [notifLoading, setNotifLoading] = useState(true)
  const [savingNotif,  setSavingNotif]  = useState(false)
  const [successNotif, setSuccessNotif] = useState(false)
  const [errorNotif,   setErrorNotif]   = useState('')

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
  const error   = ''

  return {
    loading, error,
    info, setInfoField,
    saveInfo, savingInfo, successInfo, errorInfo,
    hours, activeOH,
    setActiveService, toggleWorkingDay, updateOH,
    saveHours, savingHours, successHours, errorHours,
    notifications, setNotifField,
    saveNotif, savingNotif, successNotif, errorNotif,
  }
}