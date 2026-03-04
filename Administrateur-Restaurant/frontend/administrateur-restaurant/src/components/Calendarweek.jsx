const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const STATUS = {
  confirmed: { bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  pending:   { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
}

export default function CalendarWeek({ weekDays, getByDate }) {
  const today = new Date().toDateString()

  return (
    <div className="grid grid-cols-7 gap-3">
      {weekDays.map((day, i) => {
        const isToday      = day.toDateString() === today
        const reservations = getByDate(day)
        const dayNum       = day.getDate()

        return (
          <div key={i} className="flex flex-col min-h-48">

            {/* Day header */}
            <div className={`flex flex-col items-center pb-3 mb-3 border-b-2 ${isToday ? 'border-[#c8a97e]' : 'border-gray-200'}`}>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{DAYS[i]}</span>
              <span className={`text-2xl font-black mt-1 ${isToday ? 'text-[#c8a97e]' : 'text-gray-800'}`}>
                {dayNum}
              </span>
              {reservations.length > 0 && (
                <span className="text-xs font-bold text-gray-400 mt-0.5">{reservations.length}</span>
              )}
            </div>

            {/* Reservation blocks */}
            <div className="flex flex-col gap-2">
              {reservations.length === 0 ? (
                <div className="text-xs text-gray-300 text-center mt-4">—</div>
              ) : (
                reservations.map(r => {
                  const colors = STATUS[r.status] || STATUS.pending
                  return (
                    <div
                      key={r.id}
                      className="rounded-lg px-2 py-2"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.dot }} />
                        <span className="text-xs font-bold truncate" style={{ color: colors.text }}>{r.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 truncate">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.guests} guests</p>
                    </div>
                  )
                })
              )}
            </div>

          </div>
        )
      })}
    </div>
  )
}