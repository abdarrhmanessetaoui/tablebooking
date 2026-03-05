import useCalendar from '../hooks/useCalendar'
import CalendarNav from '../components/CalendarNav'

export default function Calendar() {
  const {
    selectedDate, reservations,
    loading, error,
    prevDay, nextDay, goToday,
  } = useCalendar()

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Timeline</h1>
        <p className="text-sm text-gray-400 mt-1">Daily reservation view</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      <CalendarNav
        selectedDate={selectedDate}
        prevDay={prevDay}
        nextDay={nextDay}
        goToday={goToday}
      />

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">
            {reservations.length} reservation{reservations.length !== 1 ? 's' : ''}
          </p>
          <CalendarTimeline reservations={reservations} />
        </>
      )}

    </div>
  )
}