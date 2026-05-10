import { useState, useEffect } from 'react'
import { apiPath, getHeaders } from '../../utils/api'

export default function useModalData() {
  const [services,     setServices]     = useState([])
  const [allOH,        setAllOH]        = useState([])
  const [workingDates, setWorkingDates] = useState([true,true,true,true,true,true,true])
  const [blockedDates, setBlockedDates] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(apiPath('restaurant/services'), { headers: getHeaders() }).then(r => r.json()),
      fetch(apiPath('time-slots'),          { headers: getHeaders() }).then(r => r.json()),
      fetch(apiPath('admin/blocked-dates'), { headers: getHeaders() }).then(r => r.json()),
    ]).then(([svcs, slots, blocked]) => {
      setServices(Array.isArray(svcs) ? svcs : [])
      setAllOH(slots?.allOH ?? [])
      setWorkingDates(slots?.working_dates ?? [true,true,true,true,true,true,true])
      setBlockedDates(Array.isArray(blocked) ? blocked.map(x => x.date) : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return { services, allOH, workingDates, blockedDates, loading }
}
