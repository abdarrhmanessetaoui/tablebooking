import { useState, useEffect } from 'react'

export default function FadeUp({ children, delay = 0, style = {} }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity 0.45s ease, transform 0.45s ease',
      ...style,
    }}>
      {children}
    </div>
  )
}