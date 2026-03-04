import useDashboardStats from '../hooks/useDashboardStats'
import StatCard from '../components/StatCard'
import { icons } from '../data/dashboardIcons'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your restaurant</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard label="Total Reservations" value={stats.total}     icon={icons.total}     />
          <StatCard label="Today"               value={stats.today}     icon={icons.today}     />
          <StatCard label="Confirmed"           value={stats.confirmed} icon={icons.confirmed} />
          <StatCard label="Pending"             value={stats.pending}   icon={icons.pending}   />
          <StatCard label="Cancelled"           value={stats.cancelled} icon={icons.cancelled} />
        </div>
      )}

    </div>
  )
}