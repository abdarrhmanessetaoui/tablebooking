import useCalendar from '../hooks/useCalendar'
import CalendarNav from '../components/CalendarNav'
import CalendarWeek from '../components/CalendarWeek'

export default function Calendar() {
  const { weekDays, currentDate, loading, error, prevWeek, nextWeek, goToday, getByDate } = useCalendar()

  return (
    <div style={{ padding: '32px', minHeight: '100vh', background: '#15151c' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'Georgia, serif', margin: 0 }}>
          Calendar
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
          Weekly reservation overview
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', fontSize: '12px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Nav */}
      <CalendarNav
        weekDays={weekDays}
        currentDate={currentDate}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
        goToday={goToday}
      />

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {[
          { label: 'Confirmed', color: '#4ade80' },
          { label: 'Pending',   color: '#fbbf24' },
          { label: 'Cancelled', color: '#f87171' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {s.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Week grid */}
      {loading ? (
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
      ) : (
        <div style={{ borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
          <div style={{ minWidth: '700px' }}>
            <CalendarWeek weekDays={weekDays} getByDate={getByDate} />
          </div>
        </div>
      )}

    </div>
  )
}