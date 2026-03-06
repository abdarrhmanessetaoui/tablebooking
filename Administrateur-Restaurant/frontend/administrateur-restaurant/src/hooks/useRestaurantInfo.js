import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'

export default function useRestaurantInfo() {
  const [info, setInfo] = useState({ name: '', location: 'Marrakech', email: '' })

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/me', {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        })
        const user = await res.json()
        setInfo({
          name:     user.name  || '',
          email:    user.email || '',
          location: 'Marrakech',
        })
      } catch {}
    }
    fetch_()
  }, [])

  return { info }
}