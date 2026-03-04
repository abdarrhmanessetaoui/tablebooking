const STATUS_COLORS = {
    confirmed: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
    pending:   { bg: '#fef9c3', border: '#eab308', text: '#854d0e' },
    cancelled: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
  }
  
  const HOURS = Array.from({ length: 12 }, (_, i) => i + 12) // 12:00 to 23:00
  const TOTAL_MINUTES = 11 * 60 // 12:00 to 23:00
  const START_HOUR = 12
  
  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number)
    return (h - START_HOUR) * 60 + (m || 0)
  }
  
  const minutesToPercent = (minutes) => (minutes / TOTAL_MINUTES) * 100
  
  export default function CalendarTimeline({ reservations }) {
    if (reservations.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-400 text-sm">
          No reservations for this day.
        </div>
      )
    }
  
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div style={{ minWidth: '700px' }}>
  
          {/* Hour labels */}
          <div className="relative flex border-b border-gray-100" style={{ paddingLeft: '0px' }}>
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-xs text-gray-400 text-center py-2 border-r border-gray-100 last:border-r-0">
                {h}:00
              </div>
            ))}
          </div>
  
          {/* Timeline grid */}
          <div className="relative" style={{ height: `${Math.max(reservations.length * 64, 120)}px` }}>
  
            {/* Hour grid lines */}
            <div className="absolute inset-0 flex pointer-events-none">
              {HOURS.map(h => (
                <div key={h} className="flex-1 border-r border-gray-50 last:border-r-0" />
              ))}
            </div>
  
            {/* Reservation blocks */}
            {reservations.map((r, i) => {
              const colors    = STATUS_COLORS[r.status] || STATUS_COLORS.pending
              const startMins = timeToMinutes(r.time)
              const left      = minutesToPercent(Math.max(startMins, 0))
              const width     = minutesToPercent(90) // default 90 min block
              const top       = i * 64 + 8
  
              return (
                <div
                  key={r.id}
                  className="absolute rounded-md px-3 py-2 text-xs overflow-hidden"
                  style={{
                    left: `${left}%`,
                    width: `${Math.min(width, 100 - left)}%`,
                    top: `${top}px`,
                    height: '52px',
                    backgroundColor: colors.bg,
                    borderLeft: `3px solid ${colors.border}`,
                    color: colors.text,
                  }}
                >
                  <p className="font-semibold truncate">{r.name}</p>
                  <p className="opacity-75">{r.time} · {r.guests} guests</p>
                </div>
              )
            })}
  
          </div>
        </div>
      </div>
    )
  }