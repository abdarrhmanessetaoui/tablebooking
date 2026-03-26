import { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"

export default function LiveClock() {
  const [t, setT] = useState(new Date())
  const { i18n } = useTranslation()

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // mapping language → locale
  const localeMap = {
    en: "en-US",
    fr: "fr-FR",
    ar: "ar-MA"
  }

  const locale = localeMap[i18n.language] || "fr-FR"

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
      {t.toLocaleDateString(locale, {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
      })}
      &nbsp;·&nbsp;
      {t.toLocaleTimeString(locale, {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </span>
  )
}