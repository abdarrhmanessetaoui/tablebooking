export default function CalendarNav({ selectedDate, prevDay, nextDay, goToday }) {
  const formatted = selectedDate.toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  })

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={prevDay}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors text-gray-500"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <span className="text-sm font-semibold text-gray-700 min-w-[140px] text-center">
          {formatted}
        </span>

        <button
          onClick={nextDay}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors text-gray-500"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {!isToday && (
        <button
          onClick={goToday}
          className="text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
        >
          Today
        </button>
      )}
    </div>
  )
}