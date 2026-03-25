import { useState, useEffect } from 'react'

export default function FadeUp({ children, delay = 0, style = {} }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{
      opacity: 1,
      transform: 'translateY(0px)',
      ...style,
    }}>
      {children}
    </div>
  )
}