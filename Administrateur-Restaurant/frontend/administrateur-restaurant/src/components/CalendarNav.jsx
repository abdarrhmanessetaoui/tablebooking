export default function CalendarNav({ selectedDate, prevDay, nextDay, goToday }) {
    const formatted = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  
    const isToday = selectedDate.toDateString() === new Date().toDateString()
  
    return (
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={prevDay}
          className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
  
        <span className="text-sm font-medium text-gray-700">{formatted}</span>
  
        <button
          onClick={nextDay}
          className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
  
        {!isToday && (
          <button
            onClick={goToday}
            className="text-xs font-medium px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 text-gray-600"
          >
            Today
          </button>
        )}
      </div>
    )
  }