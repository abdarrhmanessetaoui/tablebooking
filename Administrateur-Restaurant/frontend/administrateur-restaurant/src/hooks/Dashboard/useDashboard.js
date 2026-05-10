import { useNavigate } from 'react-router-dom'
import { removeToken } from '../../utils/auth'
import { apiPath, getHeaders } from '../../utils/api'

export default function useDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch(apiPath('logout'), {
        method: 'POST',
        headers: getHeaders(),
      })
    } catch (e) {
      // fail silently, still log out client side
    }

    removeToken()
    navigate('/')
  }

  return { handleLogout }
}
