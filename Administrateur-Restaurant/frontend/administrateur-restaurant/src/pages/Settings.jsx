import useTimeSlots from '../hooks/useTimeSlots'
import { CalendarClock, Save, Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  const {
    allOH, workingDates, activeOH, setActiveOH,
    loading, saving, error, success,
    updateOH, toggleWorkingDay, handleSave,
    DAYS,
  } = useTimeSlots()

  return (
    <div className="p-4 sm:p-8 max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#c8a97e' }}>
          Configuration
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your restaurant opening hours and working days</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">

          {/* Card header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarClock size={18} color="#c8a97e" strokeWidth={1.8} />
                <h2 className="text-base font-bold text-gray-900">Opening Hours</h2>
              </div>
              <p className="text-sm text-gray-400">Changes are saved directly to your booking form</p>
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
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
              ✓ Saved to database successfully.
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Working days */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Working Days
            </p>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  onClick={() => toggleWorkingDay(i)}
                  className="flex flex-col items-center px-4 py-3 rounded-xl border transition-all min-w-[56px]"
                  style={{
                    backgroundColor: workingDates[i] ? '#c8a97e'  : '#f9fafb',
                    color:           workingDates[i] ? '#fff'     : '#9ca3af',
                    borderColor:     workingDates[i] ? '#c8a97e'  : '#f3f4f6',
                  }}
                >
                  <span className="text-xs font-bold tracking-wider">
                    {day.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="text-xs mt-0.5" style={{ opacity: 0.7 }}>
                    {workingDates[i] ? 'Open' : 'Off'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-8" />

          {/* Service hours */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Service Hours
            </p>

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

            {/* Hour editor */}
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

                <div className="pb-3 text-gray-300 font-bold text-xl">→</div>

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
      )}
    </div>
  )
}