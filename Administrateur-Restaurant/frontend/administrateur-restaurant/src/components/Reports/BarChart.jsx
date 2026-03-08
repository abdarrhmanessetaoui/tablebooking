export default function BarChart({ data, title, color = '#c8a97e' }) {
    const entries = Object.entries(data)
    const max     = Math.max(...entries.map(([, v]) => v), 1)
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex-1" style={{ minWidth: 0 }}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">{title}</h2>
  
        <div className="flex items-end gap-1.5" style={{ height: '160px' }}>
          {entries.map(([label, value]) => {
            const pct   = (value / max) * 100
            const isTop = value === max
  
            return (
              <div key={label} className="flex flex-col items-center flex-1" style={{ height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                <span className="text-xs font-bold" style={{ color: isTop ? color : 'transparent', height: '16px', fontVariantNumeric: 'tabular-nums' }}>
                  {isTop ? value : ''}
                </span>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(pct, 3)}%`,
                    backgroundColor: isTop ? color : '#f0ebe4',
                  }}
                />
                <span className="text-gray-400 text-center" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }