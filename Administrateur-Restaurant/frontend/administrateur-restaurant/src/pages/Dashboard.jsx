import useDashboardStats from '../hooks/useDashboardStats'
import useTimeSlots from '../hooks/useTimeSlots'
import StatCard from '../components/StatCard'

const TodayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const TotalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const ConfirmedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const CancelledIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

export default function Dashboard() {
  const { stats, loading, error }                              = useDashboardStats()
  const { allSlots, active, saving, success, toggleSlot, handleSave } = useTimeSlots()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div className="p-4 sm:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">{today}</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Today hero */}
          <div
            className="rounded-2xl p-6 mb-6 flex items-center justify-between"
            style={{ backgroundColor: '#2b2118' }}
          >
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(200,169,126,0.7)' }}>
                Today's Reservations
              </p>
              <p className="text-6xl font-bold" style={{ color: '#c8a97e' }}>
                {stats.today}
              </p>
              <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {stats.confirmed} confirmed · {stats.pending} pending
              </p>
            </div>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(200,169,126,0.12)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c8a97e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="8" y1="14" x2="16" y2="14"/>
              </svg>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total"     value={stats.total}     icon={<TotalIcon />}     />
            <StatCard label="Confirmed" value={stats.confirmed} icon={<ConfirmedIcon />} />
            <StatCard label="Pending"   value={stats.pending}   icon={<PendingIcon />}   />
            <StatCard label="Cancelled" value={stats.cancelled} icon={<CancelledIcon />} />
          </div>
        </>
      )}

      {/* Time Slots */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <ClockIcon />
          <h2 className="text-base font-semibold text-gray-800">Time Slots</h2>
        </div>
        <p className="text-sm text-gray-400 mb-5">Select available booking times for clients.</p>

        {success && (
          <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded text-xs text-green-600">
            Time slots saved successfully.
          </div>
        )}

        <p className="text-xs text-gray-400 mb-3">
          {active.length} slot{active.length !== 1 ? 's' : ''} selected
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {allSlots.map(slot => {
            const isActive = active.includes(slot)
            return (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? '#c8a97e' : '#f9fafb',
                  color: isActive ? '#fff' : '#6b7280',
                  border: isActive ? '1px solid #c8a97e' : '1px solid #e5e7eb',
                }}
              >
                {slot}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || active.length === 0}
          className="flex items-center gap-2 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#c8a97e' }}
        >
          <ClockIcon />
          {saving ? 'Saving...' : 'Save Slots'}
        </button>
      </div>

    </div>
  )
}