import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'

const BASE = 'http://localhost:8000/api'

export default function useModalData() {
  const [services,     setServices]     = useState([])
  const [allOH,        setAllOH]        = useState([])
  const [workingDates, setWorkingDates] = useState([true,true,true,true,true,true,true])
  const [blockedDates, setBlockedDates] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const h = { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
    Promise.all([
      fetch(`${BASE}/restaurant/services`, { headers: h }).then(r => r.json()),
      fetch(`${BASE}/time-slots`,          { headers: h }).then(r => r.json()),
      fetch(`${BASE}/admin/blocked-dates`, { headers: h }).then(r => r.json()),
    ]).then(([svcs, slots, blocked]) => {
      setServices(Array.isArray(svcs) ? svcs : [])
      setAllOH(slots?.allOH ?? [])
      setWorkingDates(slots?.working_dates ?? [true,true,true,true,true,true,true])
      setBlockedDates(Array.isArray(blocked) ? blocked.map(x => x.date) : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return { services, allOH, workingDates, blockedDates, loading }
}
