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
      transform: on ? 'translateY(0px)' : 'translateY(16px)',
      transition: 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      ...style,
    }}>
      {children}
    </div>
  )
}