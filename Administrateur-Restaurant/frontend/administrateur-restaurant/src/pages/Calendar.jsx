import useCalendar from '../hooks/useCalendar'
import CalendarNav from '../components/CalendarNav'
import CalendarWeek from '../components/CalendarWeek'

export default function Calendar() {
  const {
    weekDays, currentDate,
    loading, error,
    prevWeek, nextWeek, goToday,
    getByDate,
  } = useCalendar()

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Timeline</h1>
        <p className="text-sm text-gray-400 mt-1">Weekly reservation view</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      <CalendarNav
        selectedDate={currentDate}
        prevDay={prevWeek}
        nextDay={nextWeek}
        goToday={goToday}
      />

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <CalendarWeek weekDays={weekDays} getByDate={getByDate} />
      )}

    </div>
  )
}