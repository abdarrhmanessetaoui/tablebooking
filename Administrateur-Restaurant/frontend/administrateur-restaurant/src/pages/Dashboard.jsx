import useDashboardStats from '../hooks/useDashboardStats'
import useTimeSlots from '../hooks/useTimeSlots'
import StatCard from '../components/StatCard'
import {
  CalendarDays, CheckCircle2, Clock, XCircle,
  CalendarClock, Save,
} from 'lucide-react'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()
  const {
    allOH, workingDates, activeOH, setActiveOH,
    saving, error: slotsError, success,
    updateOH, toggleWorkingDay, handleSave,
    DAYS,
  } = useTimeSlots()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

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
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#c8a97e' }} />
            <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full opacity-5" style={{ backgroundColor: '#c8a97e' }} />

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
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.confirmed} confirmed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.pending} pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.cancelled} cancelled</span>
                  </div>
                </div>
              </div>
              <div
                className="w-20 h-20 rounded-2xl items-center justify-center flex-shrink-0 hidden sm:flex"
                style={{ backgroundColor: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.2)' }}
              >
                <CalendarDays size={34} color="#c8a97e" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total"     value={stats.total}     icon={<CalendarDays  size={20} color="#6b7280" strokeWidth={1.8} />} bg="#f9fafb" />
            <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle2  size={20} color="#16a34a" strokeWidth={1.8} />} bg="#f0fdf4" />
            <StatCard label="Pending"   value={stats.pending}   icon={<Clock         size={20} color="#d97706" strokeWidth={1.8} />} bg="#fffbeb" />
            <StatCard label="Cancelled" value={stats.cancelled} icon={<XCircle       size={20} color="#dc2626" strokeWidth={1.8} />} bg="#fef2f2" />
          </div>
        </>
      )}

      {/* Opening Hours */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock size={18} color="#c8a97e" strokeWidth={1.8} />
              <h2 className="text-base font-bold text-gray-900">Opening Hours</h2>
            </div>
            <p className="text-sm text-gray-400">Edit your booking form configuration directly</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40"
            style={{ backgroundColor: '#c8a97e' }}
          >
            <Save size={14} strokeWidth={2} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
            ✓ Saved to database successfully.
          </div>
        )}

        {slotsError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            {slotsError}
          </div>
        )}

        {/* Working days */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Working Days</p>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleWorkingDay(i)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                style={{
                  backgroundColor: workingDates[i] ? '#c8a97e' : '#f9fafb',
                  color:           workingDates[i] ? '#fff'    : '#9ca3af',
                  borderColor:     workingDates[i] ? '#c8a97e' : '#f3f4f6',
                }}
              >
                {day.slice(0, 3).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Service hours */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Service Hours</p>

          {/* Service tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {allOH.map((oh, i) => (
              <button
                key={i}
                onClick={() => setActiveOH(i)}
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                style={{
                  backgroundColor: activeOH === i ? '#c8a97e' : '#f9fafb',
                  color:           activeOH === i ? '#fff'    : '#9ca3af',
                  borderColor:     activeOH === i ? '#c8a97e' : '#f3f4f6',
                }}
              >
                {oh.name}
              </button>
            ))}
          </div>

          {/* Hour inputs */}
          {allOH[activeOH] && (
            <div className="bg-gray-50 rounded-2xl p-5 flex items-end gap-6 flex-wrap">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number" min="0" max="23"
                    value={allOH[activeOH].openhours[0]?.h1 ?? ''}
                    onChange={e => updateOH(activeOH, 'h1', e.target.value)}
                    className="w-14 text-center border border-gray-200 rounded-xl px-2 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  />
                  <span className="text-gray-300 font-bold text-lg">:</span>
                  <input
                    type="number" min="0" max="59" step="30"
                    value={allOH[activeOH].openhours[0]?.m1 ?? ''}
                    onChange={e => updateOH(activeOH, 'm1', e.target.value)}
                    className="w-14 text-center border border-gray-200 rounded-xl px-2 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  />
                </div>
              </div>

              <div className="pb-2 text-gray-300 font-bold text-xl">→</div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Close</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number" min="0" max="23"
                    value={allOH[activeOH].openhours[0]?.h2 ?? ''}
                    onChange={e => updateOH(activeOH, 'h2', e.target.value)}
                    className="w-14 text-center border border-gray-200 rounded-xl px-2 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  />
                  <span className="text-gray-300 font-bold text-lg">:</span>
                  <input
                    type="number" min="0" max="59" step="30"
                    value={allOH[activeOH].openhours[0]?.m2 ?? ''}
                    onChange={e => updateOH(activeOH, 'm2', e.target.value)}
                    className="w-14 text-center border border-gray-200 rounded-xl px-2 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preview</label>
                <div
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border"
                  style={{ backgroundColor: 'rgba(200,169,126,0.08)', borderColor: 'rgba(200,169,126,0.3)', color: '#c8a97e' }}
                >
                  {String(allOH[activeOH].openhours[0]?.h1 ?? 0).padStart(2,'0')}:
                  {String(allOH[activeOH].openhours[0]?.m1 ?? 0).padStart(2,'0')}
                  {' → '}
                  {String(allOH[activeOH].openhours[0]?.h2 ?? 0).padStart(2,'0')}:
                  {String(allOH[activeOH].openhours[0]?.m2 ?? 0).padStart(2,'0')}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  )
}