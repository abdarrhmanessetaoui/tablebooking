import useCalendar from '../hooks/useCalendar'
import CalendarNav from '../components/CalendarNav'
import CalendarWeek from '../components/CalendarWeek'

export default function Calendar() {
  const { weekDays, currentDate, loading, error, prevWeek, nextWeek, goToday, getByDate } = useCalendar()

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Calendar</h1>
        <p className="text-sm text-gray-400 mt-1">Weekly reservation overview</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      <CalendarNav
        weekDays={weekDays}
        currentDate={currentDate}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
        goToday={goToday}
      />

      {/* Legend */}
      <div className="flex gap-4 mb-5">
        {[
          { label: 'Confirmed', bg: '#dbeafe', dot: '#3b82f6' },
          { label: 'Pending',   bg: '#fef3c7', dot: '#f59e0b' },
          { label: 'Cancelled', bg: '#fee2e2', dot: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.dot }} />
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto">
          <div style={{ minWidth: '640px' }}>
            <CalendarWeek weekDays={weekDays} getByDate={getByDate} />
          </div>
        </div>
      )}

    </div>
  )
}