const VIEWS = ['day', 'week', 'month', 'year']

const ChevronLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

export default function CalendarNav({ view, setView, navLabel, navigate, goToday, currentDate }) {
  const isToday = new Date().toDateString() === currentDate.toDateString()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

      {/* Left — nav controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('prev')}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-gray-500 transition-colors"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 min-w-[180px] justify-center">
          <span style={{ color: '#c8a97e' }}><CalendarIcon /></span>
          <span className="text-sm font-semibold text-gray-700">{navLabel()}</span>
        </div>

        <button
          onClick={() => navigate('next')}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-gray-500 transition-colors"
        >
          <ChevronRight />
        </button>

        {!isToday && (
          <button
            onClick={goToday}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      {/* Right — view switcher */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
        {VIEWS.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="text-xs font-semibold px-3 py-1.5 rounded-md capitalize transition-all"
            style={{
              backgroundColor: view === v ? '#c8a97e' : 'transparent',
              color: view === v ? '#fff' : '#6b7280',
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}