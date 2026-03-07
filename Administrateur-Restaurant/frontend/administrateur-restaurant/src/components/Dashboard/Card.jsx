import { useState } from 'react'
import { B } from '../../utils/brand'

export default function Card({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hov ? B.border : '#F0EBE3'}`,
        borderRadius: 18,
        padding: 24,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        boxShadow: hov ? '0 8px 28px rgba(61,31,13,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hov && onClick ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}