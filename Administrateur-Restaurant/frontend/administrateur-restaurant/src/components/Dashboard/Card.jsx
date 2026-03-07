import { useState } from 'react'
import { B } from '../../utils/brand'

// Shared base card — use this everywhere, never repeat hover logic
export default function Card({ children, onClick, style = {}, padding = '28px 30px' }) {
  const [hov,     setHov]     = useState(false)
  const [pressed, setPressed] = useState(false)
  const clickable = !!onClick

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => clickable && setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false) }}
      onMouseDown={() => clickable && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: B.surface,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.13s ease',
        transform: pressed ? 'scale(0.975)' : hov ? 'translateY(-3px)' : 'none',
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Export hover state helper for children that need to know
export function useCardHover(onClick) {
  const [hov, setHov] = useState(false)
  return { hov, bind: {
    onMouseEnter: () => onClick && setHov(true),
    onMouseLeave: () => setHov(false),
  }}
}