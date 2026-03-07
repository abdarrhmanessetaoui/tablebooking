import { useState } from 'react'
import { B } from '../../utils/brand'

export default function Card({ children, onClick, style = {}, padding = 20 }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: B.surface,
        border: `1px solid ${hov ? B.borderHov : B.border}`,
        borderRadius: 12,
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
        boxShadow: hov && onClick
          ? '0 4px 16px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        transform: hov && onClick ? 'translateY(-1px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}