import useDashboardStats from '../hooks/useDashboardStats'
import useTimeSlots from '../hooks/useTimeSlots'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const { allSlots, active, saving, success, toggleSlot, handleSave } = useTimeSlots()

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your restaurant</p>
      </div>

      {/* Stats */}
      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <StatCard label="Total Reservations" value={stats.total}     />
          <StatCard label="Today"               value={stats.today}     />
          <StatCard label="Confirmed"           value={stats.confirmed} />
          <StatCard label="Pending"             value={stats.pending}   />
          <StatCard label="Cancelled"           value={stats.cancelled} />
        </div>
      )}

      {/* Time Slots */}
      <div className="mb-2">
        <h2 className="text-base font-semibold text-gray-800">Time Slots</h2>
        <p className="text-sm text-gray-400 mt-0.5">Select available booking times for clients.</p>
      </div>

      {success && (
        <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded text-xs text-green-600">
          Time slots saved successfully.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <p className="text-xs text-gray-400 mb-4">{active.length} slot{active.length !== 1 ? 's' : ''} selected</p>
        <div className="flex flex-wrap gap-3">
          {allSlots.map(slot => {
            const isActive = active.includes(slot)
            return (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? '#c8a97e' : '#f5f0eb',
                  color: isActive ? '#fff' : '#6b7280',
                  border: isActive ? '1px solid #c8a97e' : '1px solid #e5e7eb',
                }}
              >
                {slot}
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || active.length === 0}
        className="text-white text-sm font-medium px-6 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ backgroundColor: '#c8a97e' }}
      >
        {saving ? 'Saving...' : 'Save Slots'}
      </button>

    </div>
  )
}