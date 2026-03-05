import { useState } from 'react'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const STATUS = {
  Confirmed: { border: '#86efac', bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  Pending:   { border: '#fde68a', bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  Cancelled: { border: '#fecaca', bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
}

function ReservationCard({ r }) {
  const s = STATUS[r.status] || STATUS.Pending
  return (
    <div
      className="rounded-lg px-2.5 py-2 border"
      style={{ background: s.bg, borderColor: s.border }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
        <span className="text-xs font-bold" style={{ color: s.text }}>{r.start_time}</span>
      </div>
      <div className="text-xs font-semibold text-gray-700 truncate">{r.name}</div>
      <div className="text-xs text-gray-400 mt-0.5">{r.guests} guests</div>
    </div>
  )
}

function DayColumn({ day, index, reservations, isToday }) {
  return (
    <div
      className="rounded-xl border bg-white"
      style={{ borderColor: isToday ? '#c8a97e' : '#e5e7eb', borderWidth: isToday ? '2px' : '1px' }}
    >
      <div className="px-3 py-3 border-b" style={{ borderColor: isToday ? '#c8a97e' : '#f3f4f6' }}>
        <div className="text-xs font-bold tracking-widest mb-1" style={{ color: isToday ? '#c8a97e' : '#9ca3af' }}>
          {DAYS[index]}
        </div>
        <div className="text-2xl font-bold leading-none" style={{ color: isToday ? '#c8a97e' : '#1f2937' }}>
          {day.getDate()}
        </div>
        {reservations.length > 0 && (
          <div className="mt-1.5 text-xs font-semibold" style={{ color: isToday ? '#c8a97e' : '#6b7280' }}>
            {reservations.length} booking{reservations.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      <div className="p-2 flex flex-col gap-1.5" style={{ minHeight: '180px' }}>
        {reservations.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '80px' }}>
            <span className="text-xs text-gray-300">—</span>
          </div>
        ) : (
          reservations.map(r => <ReservationCard key={r.id} r={r} />)
        )}
      </div>
    </div>
  )
}

export default function CalendarWeek({ weekDays, getByDate }) {
  const today = new Date().toDateString()
  const todayIndex = weekDays.findIndex(d => d.toDateString() === today)
  const [activeDay, setActiveDay] = useState(todayIndex >= 0 ? todayIndex : 0)

  return (
    <>
      {/* Mobile — day tabs + single column */}
      <div className="block md:hidden">
        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-1 mb-4 pb-1">
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const count   = getByDate(day).length
            const active  = activeDay === i
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: active ? '#c8a97e' : '#e5e7eb',
                  backgroundColor: active ? 'rgba(200,169,126,0.08)' : '#fff',
                }}
              >
                <span
                  className="text-xs font-bold tracking-widest"
                  style={{ color: active || isToday ? '#c8a97e' : '#9ca3af' }}
                >
                  {DAYS[i]}
                </span>
                <span
                  className="text-lg font-bold leading-tight"
                  style={{ color: active || isToday ? '#c8a97e' : '#1f2937' }}
                >
                  {day.getDate()}
                </span>
                {count > 0 && (
                  <span
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: active ? '#c8a97e' : '#9ca3af' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Active day detail */}
        <div className="rounded-xl border bg-white p-4" style={{ borderColor: '#e5e7eb' }}>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            {DAYS_FULL[activeDay]}, {weekDays[activeDay]?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </div>
          {(() => {
            const reservations = getByDate(weekDays[activeDay])
            return reservations.length === 0 ? (
              <div className="text-sm text-gray-300 text-center py-8">No reservations</div>
            ) : (
              <div className="flex flex-col gap-2">
                {reservations.map(r => <ReservationCard key={r.id} r={r} />)}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Desktop — full week grid */}
      <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weekDays.map((day, i) => (
          <DayColumn
            key={i}
            day={day}
            index={i}
            reservations={getByDate(day)}
            isToday={day.toDateString() === today}
          />
        ))}
      </div>
    </>
  )
}