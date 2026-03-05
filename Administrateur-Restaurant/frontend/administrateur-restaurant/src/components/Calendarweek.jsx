const DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const DAYS_FULL  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MONTHS     = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const STATUS = {
  Confirmed: { border: '#86efac', bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  Pending:   { border: '#fde68a', bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  Cancelled: { border: '#fecaca', bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
}

const ClockIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const UserIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

function ReservationCard({ r, compact = false }) {
  const s = STATUS[r.status] || STATUS.Pending
  if (compact) {
    return (
      <div className="rounded px-1.5 py-1 border truncate" style={{ background: s.bg, borderColor: s.border }}>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
          <span className="text-xs font-semibold truncate" style={{ color: s.text }}>{r.start_time} {r.name}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-lg px-3 py-2.5 border" style={{ background: s.bg, borderColor: s.border }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
          <span className="text-xs font-bold" style={{ color: s.text }}>{r.status}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <ClockIcon />
          <span className="text-xs font-semibold">{r.start_time}</span>
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-800 truncate mb-1">{r.name}</div>
      <div className="flex items-center gap-1 text-gray-400">
        <UserIcon />
        <span className="text-xs">{r.guests} guests</span>
      </div>
    </div>
  )
}

// DAY VIEW
function DayView({ date, getByDate }) {
  const reservations = getByDate(date)
  const hours = Array.from({ length: 8 }, (_, i) => `${18 + i}:00`)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-gray-800">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-sm text-gray-400 mt-0.5">
            {reservations.length} reservation{reservations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {hours.map(hour => {
          const slotRes = reservations.filter(r => r.start_time && r.start_time.startsWith(hour.slice(0, 2)))
          return (
            <div key={hour} className="flex gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="w-14 flex-shrink-0 text-xs font-semibold text-gray-300 pt-0.5">{hour}</div>
              <div className="flex-1 flex flex-col gap-1.5">
                {slotRes.length === 0 ? (
                  <div className="h-6" />
                ) : (
                  slotRes.map(r => <ReservationCard key={r.id} r={r} />)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// WEEK VIEW
function WeekView({ weekDays, getByDate }) {
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().toDateString()
    const i = weekDays.findIndex(d => d.toDateString() === today)
    return i >= 0 ? i : 0
  })
  const today = new Date().toDateString()

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today
            const count   = getByDate(day).length
            const active  = activeDay === i
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border transition-all"
                style={{
                  borderColor: active ? '#c8a97e' : '#e5e7eb',
                  backgroundColor: active ? 'rgba(200,169,126,0.08)' : '#fff',
                }}
              >
                <span className="text-xs font-bold tracking-wider" style={{ color: active || isToday ? '#c8a97e' : '#9ca3af' }}>
                  {DAYS_SHORT[i]}
                </span>
                <span className="text-xl font-bold" style={{ color: active || isToday ? '#c8a97e' : '#1f2937' }}>
                  {day.getDate()}
                </span>
                {count > 0 && (
                  <span className="w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                    style={{ background: active ? '#c8a97e' : '#f3f4f6', color: active ? '#fff' : '#6b7280' }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-600 mb-3">
            {DAYS_FULL[activeDay]}, {weekDays[activeDay]?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </div>
          {(() => {
            const res = getByDate(weekDays[activeDay])
            return res.length === 0
              ? <div className="text-sm text-gray-300 text-center py-10">No reservations</div>
              : <div className="flex flex-col gap-2">{res.map(r => <ReservationCard key={r.id} r={r} />)}</div>
          })()}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weekDays.map((day, i) => {
          const isToday      = day.toDateString() === today
          const reservations = getByDate(day)
          return (
            <div key={i} className="rounded-xl border bg-white"
              style={{ borderColor: isToday ? '#c8a97e' : '#e5e7eb', borderWidth: isToday ? '2px' : '1px' }}>
              <div className="px-3 py-3 border-b" style={{ borderColor: isToday ? '#c8a97e' : '#f3f4f6' }}>
                <div className="text-xs font-bold tracking-widest mb-1" style={{ color: isToday ? '#c8a97e' : '#9ca3af' }}>
                  {DAYS_SHORT[i]}
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
                {reservations.length === 0
                  ? <div className="flex items-center justify-center" style={{ minHeight: '80px' }}><span className="text-xs text-gray-300">—</span></div>
                  : reservations.map(r => <ReservationCard key={r.id} r={r} compact />)
                }
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// MONTH VIEW
function MonthView({ monthDays, currentDate, getByDate, setCurrentDate, setView }) {
  const today = new Date().toDateString()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS_SHORT.map(d => (
          <div key={d} className="py-2 text-center text-xs font-bold tracking-wider text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {monthDays.map(({ date, current }, i) => {
          const isToday      = date.toDateString() === today
          const reservations = getByDate(date)
          return (
            <div
              key={i}
              onClick={() => { setCurrentDate(date); setView('day') }}
              className="border-b border-r border-gray-50 p-2 cursor-pointer hover:bg-gray-50 transition-colors"
              style={{
                minHeight: '90px',
                opacity: current ? 1 : 0.35,
                backgroundColor: isToday ? 'rgba(200,169,126,0.06)' : undefined,
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1.5 mx-auto"
                style={{
                  backgroundColor: isToday ? '#c8a97e' : 'transparent',
                  color: isToday ? '#fff' : current ? '#1f2937' : '#9ca3af',
                }}
              >
                {date.getDate()}
              </div>
              <div className="flex flex-col gap-0.5">
                {reservations.slice(0, 2).map(r => (
                  <ReservationCard key={r.id} r={r} compact />
                ))}
                {reservations.length > 2 && (
                  <div className="text-xs text-gray-400 font-medium pl-1">+{reservations.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// YEAR VIEW
function YearView({ currentDate, getByMonth, setCurrentDate, setView }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {MONTHS_FULL.map((month, i) => {
        const reservations = getByMonth(currentDate.getFullYear(), i)
        const isCurrentMonth = new Date().getMonth() === i && new Date().getFullYear() === currentDate.getFullYear()
        return (
          <div
            key={i}
            onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), i, 1)); setView('month') }}
            className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-all"
            style={{ borderColor: isCurrentMonth ? '#c8a97e' : '#e5e7eb', borderWidth: isCurrentMonth ? '2px' : '1px' }}
          >
            <div className="text-sm font-bold mb-1" style={{ color: isCurrentMonth ? '#c8a97e' : '#1f2937' }}>
              {month}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{reservations.length}</div>
            <div className="text-xs text-gray-400">reservation{reservations.length !== 1 ? 's' : ''}</div>
            {reservations.length > 0 && (
              <div className="mt-2 flex gap-1 flex-wrap">
                {['Confirmed', 'Pending', 'Cancelled'].map(status => {
                  const count = reservations.filter(r => r.status === status).length
                  if (!count) return null
                  const s = STATUS[status]
                  return (
                    <span key={status} className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ background: s.bg, color: s.text }}>
                      {count} {status.slice(0, 4)}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// MAIN EXPORT
import { useState } from 'react'

export default function CalendarWeek({ view, weekDays, monthDays, currentDate, setCurrentDate, setView, getByDate, getByMonth }) {
  return (
    <div>
      {view === 'day'   && <DayView   date={currentDate} getByDate={getByDate} />}
      {view === 'week'  && <WeekView  weekDays={weekDays} getByDate={getByDate} />}
      {view === 'month' && <MonthView monthDays={monthDays} currentDate={currentDate} getByDate={getByDate} setCurrentDate={setCurrentDate} setView={setView} />}
      {view === 'year'  && <YearView  currentDate={currentDate} getByMonth={getByMonth} setCurrentDate={setCurrentDate} setView={setView} />}
    </div>
  )
}