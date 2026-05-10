import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function LiveClock() {
  const { i18n } = useTranslation()
  const [t, setT] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
      {t.toLocaleDateString(i18n.language, {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
      })}
      &nbsp;·&nbsp; 
      {t.toLocaleTimeString(i18n.language, {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </span>
  )
}
