export default function CalendarNav({ weekDays, prevWeek, nextWeek, goToday, currentDate }) {
    const isCurrentWeek = weekDays.some(d => d.toDateString() === new Date().toDateString())
  
    const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const end   = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
  
        <button onClick={prevWeek} style={{
          width: '32px', height: '32px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
  
        <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
          {start} — {end}
        </div>
  
        <button onClick={nextWeek} style={{
          width: '32px', height: '32px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
  
        {!isCurrentWeek && (
          <button onClick={goToday} style={{
            fontSize: '11px', fontWeight: 700, padding: '5px 12px',
            borderRadius: '20px', border: '1px solid #c8a97e',
            background: 'transparent', color: '#c8a97e',
            cursor: 'pointer', letterSpacing: '0.05em',
          }}>
            TODAY
          </button>
        )}
      </div>
    )
  }