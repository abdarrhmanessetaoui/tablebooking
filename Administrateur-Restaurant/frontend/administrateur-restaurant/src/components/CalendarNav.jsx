export default function CalendarNav({ weekDays, prevWeek, nextWeek, goToday, currentDate }) {
    const isCurrentWeek = (() => {
      const today = new Date()
      return weekDays.some(d => d.toDateString() === today.toDateString())
    })()
  
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
    return (
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={prevWeek} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
  
        <span className="text-sm font-semibold text-gray-800">{monthYear}</span>
  
        <button onClick={nextWeek} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
  
        {!isCurrentWeek && (
          <button onClick={goToday} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
            Today
          </button>
        )}
      </div>
    )
  }