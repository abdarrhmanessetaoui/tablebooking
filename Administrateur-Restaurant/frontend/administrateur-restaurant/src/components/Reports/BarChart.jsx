import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/BarChart.css'

const DARK = '#423428'
const GOLD = '#c8a97e'
const CREAM = '#ffffff'

export default function BarChart({ data = {}, title, subtitle, highlight = false, barColor = GOLD }) {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id) }, [])

  const entries = Object.entries(data)
  const max    = Math.max(...entries.map(([, v]) => v), 1)
  const total  = entries.reduce((s, [, v]) => s + v, 0)
  const topKey = entries.find(([, v]) => v === max)?.[0] ?? '—'

  if (!entries.length) return (
    <div className="barchart barchart--empty" style={{ border: `4px solid ${DARK}` }}>
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
      style={{ border: `4px solid ${DARK}`, flex: 1, minWidth: 0 }}
    >
      {/* Header */}
      <div
        className="barchart__header"
        style={{
          borderBottom: `4px solid ${DARK}`,
          background: highlight ? DARK : '#fff',
        }}
      >
        <div>
          <div className="barchart__label">{title}</div>
          {subtitle && (
            <div
              className="barchart__subtitle"
              style={{ color: highlight ? 'rgba(255,255,255,0.7)' : DARK }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right', flexShrink: 0 }}>
          <div
            className="barchart__max-val"
            style={{ color: highlight ? '#fff' : DARK }}
          >
            {max}
          </div>
          <div className="barchart__max-label">
            {t('reports_module.max_label')} · {topKey}
          </div>
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
                    opacity: isTop ? 1 : 0.55 + (value / max) * 0.45,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* X labels */}
        <div className="barchart__xlabels" style={{ gap }}>
          {entries.map(([label]) => (
            <div
              key={label}
              className="barchart__xlabel"
              style={{ fontSize: lblSize }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="barchart__footer" style={{ background: CREAM, borderTop: '1px solid rgba(66,52,40,0.1)' }}>
        <span className="barchart__footer-label">{t('reports_module.total')}</span>
        <span className="barchart__footer-val">{total}</span>
      </div>
    </div>
  )
}