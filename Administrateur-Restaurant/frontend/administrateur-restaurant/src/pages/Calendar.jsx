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

      <CalendarNav weekDays={weekDays} currentDate={currentDate} prevWeek={prevWeek} nextWeek={nextWeek} goToday={goToday} />

      <div className="flex gap-4 mb-5">
        {[
          { label: 'Confirmed', color: '#86efac' },
          { label: 'Pending',   color: '#fde68a' },
          { label: 'Cancelled', color: '#fca5a5' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-400 font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <div style={{ minWidth: '640px' }}>
            <CalendarWeek weekDays={weekDays} getByDate={getByDate} />
          </div>
        </div>
      )}

    </div>
  )
}