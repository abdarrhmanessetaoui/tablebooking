import { useState, useEffect, useMemo } from 'react'

function generateSlots(oh, durationMin = 30) {
  if (!oh) return []
  const h1 = parseInt(oh.h1 ?? 12), m1 = parseInt(oh.m1 ?? 0)
  const h2 = parseInt(oh.h2 ?? 23), m2 = parseInt(oh.m2 ?? 0)
  const dur = Math.max(15, parseInt(durationMin) || 30)
  const start = h1 * 60 + m1, end = h2 * 60 + m2
  const slots = []
  for (let t = start; t + dur <= end; t += dur) {
    slots.push(`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`)
  }
  return slots
}

export default function useTimeSlots({
  form = {},
  setForm = () => {},
  services = [],
  allOH = [],
  workingDates = []
}) {

  // اختر الخدمة المحددة بأمان
  const selectedSvc = useMemo(() => {
    if (!services || services.length === 0 || !form?.service) return null
    return services.find(s => s?.name === form.service) ?? null
  }, [form?.service, services])

  const maxGuests = selectedSvc?.capacity ? parseInt(selectedSvc.capacity) : 15

  // الأيام المعطلة
  const disabledDays = useMemo(() => {
    if (!selectedSvc) return []
    const avail = selectedSvc?.available_days ?? [0,1,2,3,4,5,6]
    return [0,1,2,3,4,5,6].filter(d => !(avail.includes(d) && (workingDates?.[d] ?? true)))
  }, [selectedSvc, workingDates])

  // المواعيد المتاحة
  const timeSlots = useMemo(() => {
    if (!form?.date || !selectedSvc) return []
    const jsDay = new Date(form.date + 'T00:00:00').getDay()
    const oh    = allOH?.[selectedSvc?.ohindex ?? 0]
    if (!oh) return []
    const slot = oh.openhours?.[jsDay] ?? oh.openhours?.[0]
    return slot ? generateSlots(slot, selectedSvc?.duration ?? 30) : []
  }, [form?.date, selectedSvc, allOH])

  // تسمية الأيام المفتوحة
  const openDaysLabel = useMemo(() => {
    if (!selectedSvc) return ''
    const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
    return (selectedSvc.available_days ?? [0,1,2,3,4,5,6])
      .filter(d => workingDates?.[d] !== false)
      .map(d => days[d])
      .join(' · ')
  }, [selectedSvc, workingDates])

  // Reset start_time if invalid
  useEffect(() => {
    if (form?.start_time && timeSlots.length && !timeSlots.includes(form.start_time))
      setForm(f => ({ ...f, start_time: '' }))
  }, [timeSlots]) // eslint-disable-line

  // Reset guests if over cap
  useEffect(() => {
    if (form?.guests && parseInt(form.guests) > maxGuests)
      setForm(f => ({ ...f, guests: '' }))
  }, [maxGuests]) // eslint-disable-line

  return { selectedSvc, maxGuests, disabledDays, timeSlots, openDaysLabel }
}