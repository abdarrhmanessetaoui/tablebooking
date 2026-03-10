import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export default function useRestaurantInfo() {
  const [info, setInfo] = useState({
    name:           'Dal Corso',
    location:       'Marrakech',
    email:          '',
    contact_name:   '',
    language:       'fr_FR',
    default_status: 'Pending',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/restaurant/info', {
          headers: {
            'Accept':        'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
        })
        const data = await res.json()
        if (data.name) setInfo(prev => ({ ...prev, ...data }))
      } catch {
        // keep defaults
      } finally {
        setLoading(false)
      }
    }
    fetchInfo()
  }, [])

  return { info, loading }
}