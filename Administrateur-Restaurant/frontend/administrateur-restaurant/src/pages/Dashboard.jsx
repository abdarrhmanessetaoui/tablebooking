import useDashboardStats from '../hooks/useDashboardStats'

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4">
    <div className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(200,169,126,0.12)' }}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
)

const icons = {
  total: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  today: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  confirmed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  pending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  cancelled: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
}

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