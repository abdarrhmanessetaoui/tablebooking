import { useState, useEffect } from 'react'
import { getToken } from '../../utils/auth'

/**
 * Fetches the list of services from the API.
 * Returns { services: string[], loading, error }
 *
 * The API endpoint GET /api/restaurant/services should return either:
 *   ["A la Carte", "Formule Midi à 170 dh", ...]
 * OR an array of objects like:
 *   [{ name: "A la Carte" }, ...]
 */
export default function useServices() {
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const h = { Authorization: `Bearer ${getToken()}` }
    fetch('http://localhost:8000/api/restaurant/services', { headers: h })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(data => {
        // Handle both string[] and object[] responses
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