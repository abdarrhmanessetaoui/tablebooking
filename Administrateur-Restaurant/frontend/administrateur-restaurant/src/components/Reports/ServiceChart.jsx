import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/ServiceChart.css'

const DARK   = '#423428'
const GOLD   = '#c8a97e'
const GREEN  = '#16A34A'
const AMBER  = '#C8A97E'
const RED    = '#DC2626'
const WHITE  = '#ffffff'
const CREAM  = '#ffffff'
const BORDER = '#423428'
const MUTED  = '#423428'

const COLORS = [DARK, GOLD, GREEN, AMBER, RED, '#6b4f3a', '#3d6b5a']

export default function ServiceChart({ data = {} }) {
  const { t, i18n } = useTranslation()
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a)
  const total   = entries.reduce((s, [, v]) => s + v, 0) || 1

  const [mounted, setMounted] = useState(false)
  useState(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id) })

  if (!entries.length) return (
    <div className="svchart svchart--empty" style={{ border: `4px solid ${DARK}`, background: WHITE }}>
      <div className="svchart__header" style={{ borderBottom: `4px solid ${DARK}` }}>
        <div className="svchart__label">{t('reports_module.by_service')}</div>
        <div className="svchart__subtitle">{t('reports_module.by_service_sub')}</div>
      </div>
      <div className="svchart__empty-msg">{t('reports_module.no_data')}</div>
    </div>
  )

  return (
    <div className="svchart" style={{ border: `4px solid ${DARK}`, background: WHITE }}>
      {/* Header */}
      <div className="svchart__header" style={{ borderBottom: `4px solid ${DARK}` }}>
        <div>
          <div className="svchart__label">{t('reports_module.by_service')}</div>
          <div className="svchart__subtitle">{t('reports_module.by_service_sub')}</div>
        </div>
        <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>
          <div className="svchart__count">{entries.length}</div>
          <div className="svchart__count-label">{t('reports_module.services')}</div>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="svchart__stack-wrap">
        <div className="svchart__stack">
          {entries.map(([name, val], i) => (
            <div
              key={name}
              title={`${name}: ${val}`}
              style={{
                flex: mounted ? val : 0,
                background: COLORS[i % COLORS.length],
                minWidth: mounted ? 2 : 0,
                transition: 'flex 0.75s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="svchart__rows">
        {entries.map(([name, val], i) => {
          const pct = Math.round((val / total) * 100)
          return (
            <div key={name} className="svchart__row">
              <div className="svchart__row-info">
                <div className="svchart__dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="svchart__name">{name}</span>
                <span
                  className="svchart__pct"
                  style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right' }}
                >
                  {pct}%
                </span>
                <span
                  className="svchart__val"
                  style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right' }}
                >
                  {val}
                </span>
              </div>
              <div className="svchart__track" style={{ background: BORDER }}>
                <div
                  className="svchart__fill"
                  style={{
                    width: mounted ? `${pct}%` : '0%',
                    background: COLORS[i % COLORS.length],
                    transitionDelay: `${i * 60}ms`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="svchart__footer" style={{ background: CREAM, borderTop: `1px solid ${BORDER}` }}>
        <span className="svchart__footer-label">{t('reports_module.total')}</span>
        <span className="svchart__footer-val">{total}</span>
      </div>
    </div>
  )
}