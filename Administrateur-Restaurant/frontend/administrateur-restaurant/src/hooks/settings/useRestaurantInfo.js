import { useState, useEffect } from 'react'
import { apiPath, getHeaders } from '../../utils/api'

export default function useRestaurantInfo() {
  const [info,    setInfo]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(apiPath('restaurant/info'), {
      headers: getHeaders(),
    })
      .then(r => r.json())
      .then(d => setInfo(d))
      .catch(() => setInfo(null))
      .finally(() => setLoading(false))
  }, [])

  return { info, loading }
}
