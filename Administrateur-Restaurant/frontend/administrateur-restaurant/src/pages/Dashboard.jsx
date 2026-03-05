import useDashboardStats from '../hooks/useDashboardStats'
import useTimeSlots from '../hooks/useTimeSlots'
import StatCard from '../components/StatCard'
import {
  CalendarDays, CheckCircle2, Clock, XCircle,
  CalendarClock, AlarmClock, Save,
} from 'lucide-react'

export default function Dashboard() {
  const { stats, loading, error }                                      = useDashboardStats()
  const { allSlots, active, saving, success, toggleSlot, handleSave } = useTimeSlots()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  // Group slots by period
  const periods = [
    { label: 'Lunch',   range: ['12:00','12:30','13:00','13:30','14:00','14:30'] },
    { label: 'Afternoon', range: ['15:00','15:30','16:00','16:30','17:00','17:30'] },
    { label: 'Dinner',  range: ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'] },
  ]

  return (
    <div className="p-4 sm:p-8 max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#c8a97e' }}>
          Overview
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">{today}</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <>
          {/* Hero — Today */}
          <div className="rounded-2xl p-7 mb-6 relative overflow-hidden" style={{ backgroundColor: '#2b2118' }}>
            {/* Decorative circle */}
            <div
              className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10"
              style={{ backgroundColor: '#c8a97e' }}
            />
            <div
              className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full opacity-5"
              style={{ backgroundColor: '#c8a97e' }}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c8a97e' }} />
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,169,126,0.7)' }}>
                    Today
                  </p>
                </div>
                <p className="text-7xl font-black leading-none mb-3" style={{ color: '#c8a97e' }}>
                  {stats.today}
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  reservations today
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {stats.confirmed} confirmed
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {stats.pending} pending
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {stats.cancelled} cancelled
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)' }}
              >
                <CalendarDays size={34} color="#c8a97e" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Total Reservations"
              value={stats.total}
              icon={<CalendarDays size={20} color="#6b7280" strokeWidth={1.8} />}
              bg="#f9fafb"
            />
            <StatCard
              label="Confirmed"
              value={stats.confirmed}
              icon={<CheckCircle2 size={20} color="#16a34a" strokeWidth={1.8} />}
              bg="#f0fdf4"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={<Clock size={20} color="#d97706" strokeWidth={1.8} />}
              bg="#fffbeb"
            />
            <StatCard
              label="Cancelled"
              value={stats.cancelled}
              icon={<XCircle size={20} color="#dc2626" strokeWidth={1.8} />}
              bg="#fef2f2"
            />
          </div>
        </>
      )}

      {/* Time Slots */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock size={18} color="#c8a97e" strokeWidth={1.8} />
              <h2 className="text-base font-bold text-gray-900">Time Slots</h2>
            </div>
            <p className="text-sm text-gray-400">
              {active.length} of {allSlots.length} slots active
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || active.length === 0}
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40"
            style={{ backgroundColor: '#c8a97e' }}
          >
            <Save size={14} strokeWidth={2} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {success && (
          <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
            ✓ Time slots saved successfully.
          </div>
        )}

        {/* Grouped slots */}
        <div className="flex flex-col gap-5">
          {periods.map(period => (
            <div key={period.label}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                {period.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {period.range.map(slot => {
                  const isActive = active.includes(slot)
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: isActive ? '#c8a97e' : '#f9fafb',
                        color:           isActive ? '#fff'    : '#9ca3af',
                        border:          isActive ? '1.5px solid #c8a97e' : '1.5px solid #f3f4f6',
                      }}
                    >
                      <AlarmClock size={12} strokeWidth={2} />
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}