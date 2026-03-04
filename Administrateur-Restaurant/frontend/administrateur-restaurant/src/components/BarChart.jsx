export default function BarChart({ data, title, color = '#c8a97e' }) {
    const entries = Object.entries(data)
    const max     = Math.max(...entries.map(([, v]) => v), 1)
  
    return (
      <div style={{
        background: '#1c1c24',
        borderRadius: '16px',
        padding: '28px',
        flex: 1,
        minWidth: 0,
      }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          marginBottom: '28px',
          fontFamily: 'monospace',
        }}>
          {title}
        </h2>
  
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
          {entries.map(([label, value]) => {
            const pct     = (value / max) * 100
            const isTop   = value === max
  
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                {/* Value label on top bar */}
                <div style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: isTop ? color : 'transparent',
                  fontFamily: 'monospace',
                  height: '14px',
                }}>
                  {isTop ? value : ''}
                </div>
  
                {/* Bar */}
                <div style={{
                  width: '100%',
                  height: `${Math.max(pct, 4)}%`,
                  background: isTop ? color : 'rgba(255,255,255,0.08)',
                  borderRadius: '4px 4px 2px 2px',
                  transition: 'height 0.4s ease',
                  position: 'relative',
                }} />
  
                {/* Label */}
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }