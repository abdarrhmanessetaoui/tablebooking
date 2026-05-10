import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/ServiceChart.css'

const DARK   = '#2D2926'
const LIGHT_BROWN   = '#C19A6B'
const BORDER = '#E5E0DA'
const WHITE  = '#ffffff'

export default function ServiceChart({ data = {} }) {
  const { t, i18n } = useTranslation()
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a)
  const total   = entries.reduce((s, [, v]) => s + v, 0) || 1

  if (!entries.length) return (
    <div className="svchart svchart--empty" style={{ border: `1px solid ${BORDER}`, background: WHITE, borderRadius: '4px' }}>
      <div className="svchart__header">
        <div className="svchart__label">{t('reports_module.by_service')}</div>
      </div>
      <div className="svchart__empty-msg">{t('reports_module.no_data')}</div>
    </div>
  )

  return (
    <div className="svchart" style={{ border: `1px solid ${BORDER}`, background: WHITE, borderRadius: '4px', overflow: 'hidden' }}>
      {/* Header */}
      <div className="svchart__header">
        <div>
          <div className="svchart__label" style={{ color: LIGHT_BROWN }}>{t('reports_module.by_service')}</div>
        </div>
        <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>
          <div className="svchart__count" style={{ color: DARK }}>{entries.length}</div>
        </div>
      </div>

      {/* Rows */}
      <div className="svchart__rows" style={{ paddingBottom: 24 }}>
        {entries.map(([name, val]) => {
          const pct = Math.round((val / total) * 100)
          return (
            <div key={name} className="svchart__row" style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row' }}>
                <span className="svchart__name" style={{ flex: 1, color: DARK, fontSize: 13, fontWeight: 800 }}>{name}</span>
                <span
                  className="svchart__pct"
                  style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right', color: DARK, fontSize: 11, fontWeight: 700, opacity: 0.6, minWidth: 40 }}
                >
                  {pct}%
                </span>
                <span
                  className="svchart__val"
                  style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right', color: DARK, fontSize: 14, fontWeight: 900, minWidth: 30 }}
                >
                  {val}
                </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
