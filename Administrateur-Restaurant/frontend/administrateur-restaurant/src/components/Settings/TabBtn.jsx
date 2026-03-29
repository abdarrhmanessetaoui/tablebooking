import { useState } from 'react'
import { DARK, BORDER, CREAM } from './constants'

export default function TabBtn({ active, onClick, children, disabled }) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '9px 16px',
        background: active ? DARK : hov ? CREAM : '#fff',
        border: `4px solid ${active ? DARK : BORDER}`,
        color: active ? '#c8a97e' : DARK,
        fontSize: 12,
        fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
        opacity: disabled ? 0.4 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}