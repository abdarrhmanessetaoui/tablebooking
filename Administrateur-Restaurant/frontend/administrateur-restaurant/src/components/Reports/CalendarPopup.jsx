import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/CalendarPopup.css'

const DARK = '#423428'
const GOLD = '#c8a97e'

const navBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(200,169,126,0.7)', padding: '4px 6px',
  fontFamily: 'inherit', display: 'flex', alignItems: 'center',
}

export default function CalendarPopup({ filterDate, setFilterDate, onClose, anchorRef }) {
  const { t, i18n } = useTranslation()

  const MONTHS = [
    t('services_module.jan_full', { defaultValue: 'January' }),
    t('services_module.feb_full', { defaultValue: 'February' }),
    t('services_module.mar_full', { defaultValue: 'March' }),
    t('services_module.apr_full', { defaultValue: 'April' }),
    t('services_module.may_full', { defaultValue: 'May' }),
    t('services_module.jun_full', { defaultValue: 'June' }),
    t('services_module.jul_full', { defaultValue: 'July' }),
    t('services_module.aug_full', { defaultValue: 'August' }),
    t('services_module.sep_full', { defaultValue: 'September' }),
    t('services_module.oct_full', { defaultValue: 'October' }),
    t('services_module.nov_full', { defaultValue: 'November' }),
    t('services_module.dec_full', { defaultValue: 'December' }),
  ]
  const DAYS = [
    t('services_module.mon_short', { defaultValue: 'Mo' }),
    t('services_module.tue_short', { defaultValue: 'Tu' }),
    t('services_module.wed_short', { defaultValue: 'We' }),
    t('services_module.thu_short', { defaultValue: 'Th' }),
    t('services_module.fri_short', { defaultValue: 'Fr' }),
    t('services_module.sat_short', { defaultValue: 'Sa' }),
    t('services_module.sun_short', { defaultValue: 'Su' }),
  ]

  const today    = new Date()
  const initDate = filterDate
    ? (filterDate.length === 7 ? new Date(filterDate + '-01') : new Date(filterDate))
    : today

  const [viewYear,  setViewYear]  = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())
  const [mode,      setMode]      = useState('day')
  const [pos,       setPos]       = useState({ top: -9999, left: -9999, width: 280 })
  const popupRef = useRef(null)

  /* ── Position calculation ── */
  useEffect(() => {
    function calcPos() {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      const pw = 280
      const vw = window.innerWidth
      const vh = window.innerHeight
      const ph = popupRef.current ? popupRef.current.offsetHeight : 340
      let left = rect.right - pw
      if (left < 8) left = 8
      if (left + pw > vw - 8) left = vw - pw - 8
      const top = (vh - rect.bottom > ph + 8 || vh - rect.bottom > rect.top)
        ? rect.bottom + 4
        : rect.top - ph - 4
      setPos({ top, left, width: Math.min(pw, vw - 16) })
    }
    calcPos()
    window.addEventListener('resize', calcPos)
    window.addEventListener('scroll', calcPos, true)
    return () => {
      window.removeEventListener('resize', calcPos)
      window.removeEventListener('scroll', calcPos, true)
    }
  }, [anchorRef])

  /* ── Close on outside click ── */
  useEffect(() => {
    function handler(e) {
      if (
        popupRef.current && !popupRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, anchorRef])

  /* ── Helpers ── */
  const selFull  = filterDate && filterDate.length === 10
  const selMonth = filterDate && filterDate.length === 7
  const selYear  = selFull || selMonth ? parseInt(filterDate.slice(0, 4)) : null
  const selMon   = selFull || selMonth ? parseInt(filterDate.slice(5, 7)) - 1 : null
  const selDay   = selFull ? parseInt(filterDate.slice(8, 10)) : null

  function navMonth(d) {
    let m = viewMonth + d, y = viewYear
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setViewMonth(m); setViewYear(y)
  }

  function pickDay(d) {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    setFilterDate(`${viewYear}-${mm}-${dd}`)
    onClose()
  }

  function pickMonth(m) {
    const mm = String(m + 1).padStart(2, '0')
    setFilterDate(`${viewYear}-${mm}`)
    onClose()
  }

  /* ── Day grid cells ── */
  const firstDow   = new Date(viewYear, viewMonth, 1).getDay()
  const offset     = firstDow === 0 ? 6 : firstDow - 1
  const daysInMon  = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()

  const dayCells = []
  for (let i = 0; i < offset; i++)
    dayCells.push({ content: daysInPrev - offset + 1 + i, isOther: true })
  for (let d = 1; d <= daysInMon; d++) {
    const isToday    = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    const isSelected = selFull && selDay === d && selMon === viewMonth && selYear === viewYear
    dayCells.push({ content: d, onClick: () => pickDay(d), isToday, isSelected })
  }
  const remaining = 42 - dayCells.length
  for (let d = 1; d <= remaining; d++)
    dayCells.push({ content: d, isOther: true })

  /* ── Render ── */
  const popup = (
    <div
      ref={popupRef}
      className="cal-popup"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      {/* Header */}
      <div className="cal-popup__header">
        <button onClick={() => setViewYear(y => y - 1)} style={navBtnStyle} title={t('reports_module.prev_year')}>
          <ChevronsLeft size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => navMonth(-1)} style={navBtnStyle} title={t('reports_module.prev_month')}>
          <ChevronLeft size={13} strokeWidth={2.5} />
        </button>
        <span className="cal-popup__month-label">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={() => navMonth(1)} style={navBtnStyle} title={t('reports_module.next_month')}>
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => setViewYear(y => y + 1)} style={navBtnStyle} title={t('reports_module.next_year')}>
          <ChevronsRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Mode toggle */}
      <div className="cal-popup__mode-bar">
        {['day', 'month'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`cal-popup__mode-btn${mode === m ? ' cal-popup__mode-btn--active' : ''}`}
          >
            {m === 'day' ? t('reports_module.mode_day') : t('reports_module.mode_month')}
          </button>
        ))}
      </div>

      {/* Day grid */}
      {mode === 'day' && (
        <div className="cal-popup__day-grid">
          {DAYS.map(d => (
            <div key={d} className="cal-popup__day-header">{d.charAt(0)}</div>
          ))}
          {dayCells.map((c, i) => (
            <div
              key={i}
              onClick={c.onClick}
              onMouseEnter={e => { if (!c.isOther && !c.isSelected) e.currentTarget.style.background = '#f5f0eb' }}
              onMouseLeave={e => { if (!c.isSelected) e.currentTarget.style.background = 'transparent' }}
              className="cal-popup__day-cell"
              style={{
                fontWeight:  c.isSelected ? 800 : c.isToday ? 900 : c.isOther ? 400 : 700,
                color:       c.isSelected ? GOLD : c.isToday ? GOLD : c.isOther ? '#423428' : DARK,
                background:  c.isSelected ? DARK : 'transparent',
                cursor:      c.isOther ? 'default' : 'pointer',
              }}
            >
              {c.content}
            </div>
          ))}
        </div>
      )}

      {/* Month grid */}
      {mode === 'month' && (
        <div className="cal-popup__month-grid">
          {MONTHS.map((m, i) => {
            const isCurrent  = i === today.getMonth() && viewYear === today.getFullYear()
            const isSelected = selMonth && selMon === i && selYear === viewYear
            return (
              <div
                key={m}
                onClick={() => pickMonth(i)}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f5f0eb' }}
                onMouseLeave={e => { e.currentTarget.style.background = isSelected ? DARK : 'transparent' }}
                className="cal-popup__month-cell"
                style={{
                  fontWeight: isSelected ? 800 : isCurrent ? 900 : 700,
                  color:      isSelected ? GOLD : isCurrent ? GOLD : DARK,
                  background: isSelected ? DARK : 'transparent',
                }}
              >
                {m.slice(0, 4)}
              </div>
            )
          })}
        </div>
      )}

      {/* Selected day badge */}
      {selFull && (
        <div className="cal-popup__selected-badge">
          {String(selDay).padStart(2, '0')} {MONTHS[selMon]} {selYear}
        </div>
      )}
    </div>
  )

  return createPortal(popup, document.body)
}