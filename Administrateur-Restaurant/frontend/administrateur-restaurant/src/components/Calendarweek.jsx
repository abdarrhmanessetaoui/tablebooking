const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const STATUS = {
  Confirmed: { border: '#86efac', bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  Pending:   { border: '#fde68a', bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  Cancelled: { border: '#fecaca', bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
}

export default function CalendarWeek({ weekDays, getByDate }) {
  const today = new Date().toDateString()

  return (
    <div className="overflow-x-auto">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))', gap: '8px', minWidth: '700px' }}>
        {weekDays.map((day, i) => {
          const isToday      = day.toDateString() === today
          const reservations = getByDate(day)

          return (
            <div
              key={i}
              className="rounded-xl border bg-white"
              style={{
                borderColor: isToday ? '#c8a97e' : '#e5e7eb',
                borderWidth: isToday ? '2px' : '1px',
              }}
            >
              {/* Day header */}
              <div
                className="px-3 py-3 border-b"
                style={{ borderColor: isToday ? '#c8a97e' : '#f3f4f6' }}
              >
                <div
                  className="text-xs font-bold tracking-widest mb-1"
                  style={{ color: isToday ? '#c8a97e' : '#9ca3af' }}
                >
                  {DAYS[i]}
                </div>
                <div
                  className="text-2xl font-bold leading-none"
                  style={{ color: isToday ? '#c8a97e' : '#1f2937' }}
                >
                  {day.getDate()}
                </div>
                {reservations.length > 0 && (
                  <div
                    className="mt-1.5 text-xs font-semibold"
                    style={{ color: isToday ? '#c8a97e' : '#6b7280' }}
                  >
                    {reservations.length} booking{reservations.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Reservations */}
              <div className="p-2 flex flex-col gap-1.5" style={{ minHeight: '180px' }}>
                {reservations.length === 0 ? (
                  <div className="flex items-center justify-center h-full" style={{ minHeight: '80px' }}>
                    <span className="text-xs text-gray-300">—</span>
                  </div>
                ) : (
                  reservations.map(r => {
                    const s = STATUS[r.status] || STATUS.Pending
                    return (
                      <div
                        key={r.id}
                        className="rounded-lg px-2.5 py-2 border"
                        style={{ background: s.bg, borderColor: s.border }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: s.dot }}
                          />
                          <span
                            className="text-xs font-bold"
                            style={{ color: s.text }}
                          >
                            {r.start_time}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-700 truncate">
                          {r.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {r.guests} guests
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}