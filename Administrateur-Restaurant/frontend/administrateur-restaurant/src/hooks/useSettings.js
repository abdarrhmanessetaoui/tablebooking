import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import useRestaurantInfo from './useRestaurantInfo'

const BASE = 'http://localhost:8000/api/restaurant'

const headers = () => ({
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export default function useSettings() {
  // ── Restaurant info (reuse existing hook) ──────────────────
  const { info: rawInfo, loading: infoLoading } = useRestaurantInfo()

  const [info, setInfo]           = useState(null)
  const [infoSaving,  setInfoSaving]  = useState(false)
  const [infoSuccess, setInfoSuccess] = useState(false)
  const [infoError,   setInfoError]   = useState('')

  // Sync rawInfo into editable state once loaded
  useEffect(() => {
    if (rawInfo) setInfo(rawInfo)
  }, [rawInfo])

  async function saveInfo() {
    setInfoSaving(true); setInfoError(''); setInfoSuccess(false)
    try {
      const res = await fetch(`${BASE}/info`, {
        method: 'PUT', headers: headers(),
        body: JSON.stringify(info),
      })
      if (!res.ok) throw new Error()
      const d = await res.json()
      setInfo(d)
      setInfoSuccess(true)
      setTimeout(() => setInfoSuccess(false), 3000)
    } catch { setInfoError("Impossible d'enregistrer les informations.") }
    finally  { setInfoSaving(false) }
  }

  // ── Time slots ─────────────────────────────────────────────
  const [timeSlots,    setTimeSlots]   = useState(null)
  const [slotsLoading, setSlotsLoading]= useState(true)
  const [slotsSaving,  setSlotsSaving] = useState(false)
  const [slotsSuccess, setSlotsSuccess]= useState(false)
  const [slotsError,   setSlotsError]  = useState('')

  useEffect(() => {
    fetch(`${BASE}/time-slots`, { headers: headers() })
      .then(r => r.json())
      .then(d => setTimeSlots({
        allOH:         d.allOH         ?? [],
        working_dates: d.working_dates ?? [false,true,true,true,true,true,true],
        activeOH:      0,
      }))
      .catch(() => setTimeSlots({ allOH:[], working_dates:[false,true,true,true,true,true,true], activeOH:0 }))
      .finally(() => setSlotsLoading(false))
  }, [])

  function setActiveOH(i) {
    setTimeSlots(p => ({ ...p, activeOH: i }))
  }

  function updateOH(index, field, value) {
    setSlotsSuccess(false)
    setTimeSlots(p => ({
      ...p,
      allOH: p.allOH.map((oh, i) =>
        i === index
          ? { ...oh, openhours: oh.openhours.map((h, j) => j === 0 ? { ...h, [field]: value } : h) }
          : oh
      ),
    }))
  }

  function toggleWorkingDay(dayIndex) {
    setSlotsSuccess(false)
    setTimeSlots(p => ({
      ...p,
      working_dates: p.working_dates.map((v, i) => i === dayIndex ? !v : v),
    }))
  }

  async function saveSlots() {
    setSlotsSaving(true); setSlotsError(''); setSlotsSuccess(false)
    try {
      const res = await fetch(`${BASE}/time-slots`, {
        method: 'PUT', headers: headers(),
        body: JSON.stringify({
          allOH:         timeSlots.allOH,
          working_dates: timeSlots.working_dates,
        }),
      })
      if (!res.ok) throw new Error()
      setSlotsSuccess(true)
      setTimeout(() => setSlotsSuccess(false), 3000)
    } catch { setSlotsError("Impossible d'enregistrer les horaires.") }
    finally  { setSlotsSaving(false) }
  }

  // ── Notifications ──────────────────────────────────────────
  const [notif,        setNotif]       = useState(null)
  const [notifLoading, setNotifLoading]= useState(true)
  const [notifSaving,  setNotifSaving] = useState(false)
  const [notifSuccess, setNotifSuccess]= useState(false)
  const [notifError,   setNotifError]  = useState('')

  useEffect(() => {
    fetch(`${BASE}/notifications`, { headers: headers() })
      .then(r => r.json())
      .then(d => setNotif({
        from_name:     d.from_name     ?? d.fp_from_name         ?? 'TableBooking.ma',
        from_email:    d.from_email    ?? d.fp_from_email         ?? '',
        dest_emails:   d.dest_emails   ?? d.fp_destination_emails ?? '',
        email_new:     d.email_new     ?? (d.rep_enable === 'yes') ?? true,
        email_confirm: d.email_confirm ?? (d.cu_enable_copy_to_user === 'true') ?? true,
        email_cancel:  d.email_cancel  ?? true,
      }))
      .catch(() => setNotif({ from_name:'TableBooking.ma', from_email:'', dest_emails:'', email_new:true, email_confirm:true, email_cancel:true }))
      .finally(() => setNotifLoading(false))
  }, [])

  async function saveNotif() {
    setNotifSaving(true); setNotifError(''); setNotifSuccess(false)
    try {
      const res = await fetch(`${BASE}/notifications`, {
        method: 'PUT', headers: headers(),
        body: JSON.stringify(notif),
      })
      if (!res.ok) throw new Error()
      setNotifSuccess(true)
      setTimeout(() => setNotifSuccess(false), 3000)
    } catch { setNotifError("Impossible d'enregistrer les notifications.") }
    finally  { setNotifSaving(false) }
  }

  // ── Shared ─────────────────────────────────────────────────
  const loading = infoLoading || slotsLoading || notifLoading
  const FR_DAYS = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

  return {
    // info
    info, setInfo, infoSaving, infoSuccess, infoError, saveInfo,
    // slots
    timeSlots, slotsSaving, slotsSuccess, slotsError,
    saveSlots, setActiveOH, updateOH, toggleWorkingDay,
    // notif
    notif, setNotif, notifSaving, notifSuccess, notifError, saveNotif,
    // shared
    loading, FR_DAYS,
  }
}