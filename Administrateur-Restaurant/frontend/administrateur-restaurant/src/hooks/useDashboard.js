import { useNavigate } from 'react-router-dom'
import { getToken, removeToken } from '../utils/auth'

export default function useDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      })
    } catch (e) {
      // fail silently, still log out client side
    }

    removeToken()
    navigate('/')
  }

  return { handleLogout }
}