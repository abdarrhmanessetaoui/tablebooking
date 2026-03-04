import { useNavigate } from 'react-router-dom'
import { getToken, removeToken } from '../utils/auth'

const Dashboard = () => {
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-white text-sm font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#c8a97e' }}
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Dashboard