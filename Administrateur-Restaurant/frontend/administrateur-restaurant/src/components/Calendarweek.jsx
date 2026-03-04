const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const STATUS = {
  confirmed: { accent: '#4ade80', bg: 'rgba(74,222,128,0.08)', label: '#4ade80' },
  pending:   { accent: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  label: '#fbbf24' },
  cancelled: { accent: '#f87171', bg: 'rgba(248,113,113,0.08)', label: '#f87171' },
}

export default function CalendarWeek({ weekDays, getByDate }) {
  const today = new Date().toDateString()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
      {weekDays.map((day, i) => {
        const isToday      = day.toDateString() === today
        const reservations = getByDate(day)

        return (
          <div
            key={i}
            style={{
              background: isToday ? 'rgba(200,169,126,0.06)' : '#1c1c24',
              padding: '16px 12px',
              minHeight: '280px',
              position: 'relative',
            }}
          >
            {/* Top accent line for today */}
            {isToday && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '2px', background: '#c8a97e'
              }} />
            )}

            {/* Day header */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: isToday ? '#c8a97e' : 'rgba(255,255,255,0.25)',
                marginBottom: '4px',
                fontFamily: 'monospace',
              }}>
                {DAYS[i]}
              </div>
              <div style={{
                fontSize: '26px',
                fontWeight: 800,
                color: isToday ? '#c8a97e' : 'rgba(255,255,255,0.7)',
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}>
                {day.getDate()}
              </div>
              {reservations.length > 0 && (
                <div style={{
                  marginTop: '6px',
                  display: 'inline-block',
                  background: '#c8a97e',
                  color: '#1c1c24',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '20px',
                  letterSpacing: '0.05em',
                }}>
                  {reservations.length} RES
                </div>
              )}
            </div>

            {/* Reservation blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reservations.length === 0 ? (
                <div style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.05)',
                  marginTop: '8px',
                }} />
              ) : (
                reservations.map(r => {
                  const s = STATUS[r.status] || STATUS.pending
                  return (
                    <div
                      key={r.id}
                      style={{
                        background: s.bg,
                        borderLeft: `2px solid ${s.accent}`,
                        borderRadius: '4px',
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: s.accent,
                        fontFamily: 'monospace',
                        marginBottom: '3px',
                      }}>
                        {r.time}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '2px',
                      }}>
                        {r.name}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.35)',
                        fontWeight: 500,
                      }}>
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
  )
}