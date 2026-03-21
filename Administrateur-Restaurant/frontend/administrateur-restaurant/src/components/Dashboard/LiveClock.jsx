import { useState, useEffect } from 'react'

export default function LiveClock() {
  const [t, setT] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
      {t.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
      })}
      &nbsp;·&nbsp;
      {t.toLocaleTimeString('fr-FR', {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </span>
  )
}