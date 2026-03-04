import useDashboard from '../hooks/useDashboard'

const Dashboard = () => {
  const { handleLogout } = useDashboard()

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