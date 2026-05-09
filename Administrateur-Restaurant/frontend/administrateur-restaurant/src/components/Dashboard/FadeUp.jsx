import { useState, useEffect } from 'react'

export default function FadeUp({ children, delay = 0, style = {} }) {
  const [on, setOn] = useState(delay === 0)
  useEffect(() => {
    if (delay === 0) return
    const t = setTimeout(() => setOn(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0px)' : 'translateY(14px)',
      transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
      ...style,
    }}>
      {children}
    </div>
  )
}
