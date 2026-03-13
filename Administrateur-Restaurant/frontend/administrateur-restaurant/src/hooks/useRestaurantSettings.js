import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

const BASE = 'http://localhost:8000/api/restaurant'

const h = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useRestaurantSettings() {

  // ── ALL STATE UP TOP — no hooks after this block ──────────────

  // info
  const [info, setInfo] = useState({
    form_name: '', capacity: '', address: '',
    google_maps_link: '', website: '', phone: '',
    contact_email: '', description: '',
  })
  const [infoLoading,  setInfoLoading]  = useState(true)
  const [savingInfo,   setSavingInfo]   = useState(false)
  const [successInfo,  setSuccessInfo]  = useState(false)
  const [errorInfo,    setErrorInfo]    = useState('')

  // hours (parsed from form_structure in same /info fetch)
  const [hours,        setHours]        = useState({ allOH: [], working_dates: [] })
  const [activeOH,     setActiveOH]     = useState(0)
  const [savingHours,  setSavingHours]  = useState(false)
  const [successHours, setSuccessHours] = useState(false)
  const [errorHours,   setErrorHours]   = useState('')

  // notifications
  const [notifications, setNotifications] = useState({
    fp_from_name: 'TableBooking.ma', fp_from_email: '',
    fp_destination_emails: '', defaultstatus: 'Pending',
  })
  const [notifLoading, setNotifLoading] = useState(true)
  const [savingNotif,  setSavingNotif]  = useState(false)
  const [successNotif, setSuccessNotif] = useState(false)
  const [errorNotif,   setErrorNotif]   = useState('')

  // ── EFFECTS ───────────────────────────────────────────────────

  // Single fetch — /info returns the full wpjn_cpappbk_forms row
  // allOH + working_dates live inside form_structure JSON
  useEffect(() => {
    fetch(`${BASE}/info`, { headers: h() })
      .then(r => r.json())
      .then(d => {
        // parse form_structure to get allOH + working_dates
        let fapp = {}
        try {
          const fs = typeof d.form_structure === 'string'
            ? JSON.parse(d.form_structure)
            : d.form_structure
          fapp = fs?.[0]?.[0] ?? {}
        } catch {}

        setInfo({
          form_name:        d.form_name        ?? '',
          capacity:         fapp.services?.[0]?.capacity ?? d.capacity ?? '',
          address:          d.address          ?? '',
          google_maps_link: d.google_maps_link  ?? '',
          website:          d.website           ?? '',
          phone:            d.phone             ?? '',
          contact_email:    d.fp_from_email     ?? '',
          description:      d.description       ?? '',
        })

        setHours({
          allOH:         fapp.allOH         ?? [],
          working_dates: fapp.working_dates ?? [false,true,true,true,true,true,true],
        })

        // notifications also come from the same row
        setNotifications({
          fp_from_name:          d.fp_from_name          ?? 'TableBooking.ma',
          fp_from_email:         d.fp_from_email          ?? '',
          fp_destination_emails: d.fp_destination_emails  ?? '',
          defaultstatus:         d.defaultstatus           ?? 'Pending',
        })
        setNotifLoading(false)
      })
      .catch(() => { setNotifLoading(false) })
      .finally(() => setInfoLoading(false))
  }, [])

  // ── ACTIONS ───────────────────────────────────────────────────

  const setInfoField  = (key, val) => setInfo(p => ({ ...p, [key]: val }))
  const setNotifField = (key, val) => setNotifications(p => ({ ...p, [key]: val }))
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

  async function saveInfo() {
    setSavingInfo(true); setErrorInfo(''); setSuccessInfo(false)
    try {
      const res = await fetch(`${BASE}/info`, { method: 'PUT', headers: h(), body: JSON.stringify(info) })
      if (!res.ok) throw new Error()
      setSuccessInfo(true)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch { setErrorInfo("Impossible d'enregistrer les informations.") }
    finally  { setSavingInfo(false) }
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

  // ── RETURN ────────────────────────────────────────────────────

  const loading = infoLoading || notifLoading

  return {
    loading, error: '',
    info, setInfoField,
    saveInfo, savingInfo, successInfo, errorInfo,
    hours, activeOH,
    setActiveService, toggleWorkingDay, updateOH,
    saveHours, savingHours, successHours, errorHours,
    notifications, setNotifField,
    saveNotif, savingNotif, successNotif, errorNotif,
  }
}