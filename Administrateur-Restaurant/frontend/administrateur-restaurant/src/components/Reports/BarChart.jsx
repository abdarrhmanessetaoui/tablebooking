import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/BarChart.css'

const DARK = '#2D2926'
const LIGHT_BROWN = '#C19A6B'
const BORDER = '#E5E0DA'

export default function BarChart({ data = {}, title, subtitle, highlight = false, barColor = LIGHT_BROWN }) {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 10); return () => clearTimeout(id) }, [])

  const entries = Object.entries(data)
  const max    = Math.max(...entries.map(([, v]) => v), 1)
  const total  = entries.reduce((s, [, v]) => s + v, 0)
  const topKey = entries.find(([, v]) => v === max)?.[0] ?? ' '

  if (!entries.length) return (
    <div className="barchart barchart--empty" style={{ border: `1px solid ${BORDER}` }}>
      <div className="barchart__label">{title}</div>
      {subtitle && <div className="barchart__subtitle barchart__subtitle--muted">{subtitle}</div>}
      <div className="barchart__empty-msg">{t('reports_module.no_data')}</div>
    </div>
  )

  const gap     = entries.length > 20 ? 2 : entries.length > 12 ? 3 : 6
  const lblSize = entries.length > 20 ? 7 : entries.length > 12 ? 8 : 10

  return (
    <div
      className="barchart"
      style={{ border: `1px solid ${BORDER}`, flex: 1, minWidth: 0, borderRadius: '4px', overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        className="barchart__header"
        style={{
          background: highlight ? DARK : '#fff',
        }}
      >
        <div>
          <div className="barchart__label" style={{ color: highlight ? LIGHT_BROWN : LIGHT_BROWN }}>{title}</div>

        </div>

      </div>

      {/* Bars */}
      <div className="barchart__bars-wrap">
        <div className="barchart__bars" style={{ gap, height: 160 }}>
          {entries.map(([label, value]) => {
            const pct   = (value / max) * 100
            const isTop = value === max
            return (
              <div
                key={label}
                title={`${label}: ${value}`}
                className="barchart__bar-col"
              >
                <span className="barchart__bar-top-val" style={{ color: isTop ? DARK : 'transparent' }}>
                  {isTop ? value : ''}
                </span>
                <div
                  className="barchart__bar"
                  style={{
                    height: mounted ? `${Math.max(pct, 2)}%` : '2%',
                    background: isTop ? DARK : barColor,
                    opacity: isTop ? 1 : 0.6,
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* X labels */}
        <div className="barchart__xlabels" style={{ gap, paddingBottom: entries.length > 12 ? 35 : 16 }}>
          {entries.map(([label]) => (
            <div
              key={label}
              className="barchart__xlabel"
              style={{ 
                fontSize: lblSize, 
                color: DARK,
                transform: entries.length > 12 ? 'rotate(-45deg) translateY(5px) translateX(-5px)' : 'none',
                transformOrigin: 'left center',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                textOverflow: 'clip',
                height: entries.length > 12 ? 20 : 'auto'
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
