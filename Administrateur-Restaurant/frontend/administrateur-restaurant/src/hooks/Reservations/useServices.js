import { useState, useEffect } from 'react'
import { apiPath, getHeaders } from '../../utils/api'

/**
 * Fetches the list of services from the API.
 * Returns { services: string[], loading, error }
 */
let cachedServices = null

export default function useServices() {
  const [services, setServices] = useState(cachedServices || [])
  const [loading,  setLoading]  = useState(!cachedServices)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    fetch(apiPath('restaurant/services'), { headers: getHeaders() })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(data => {
        const list = Array.isArray(data)
          ? data.map(s => typeof s === 'string' ? s : s.name ?? s.service ?? '')
          : []
        setServices(list.filter(Boolean))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { services, loading, error }
}
