import { useState, useRef } from 'react'
import { X, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CalendarPopup from './CalendarPopup'
import '../../styles/Reports/ReportsFilters.css'

const DARK = '#2D2926'
const LIGHT_BROWN = '#C19A6B'

export default function ReportsFilters({
  filterStatus,   setFilterStatus,
  filterService,  setFilterService,
  filterDate,     setFilterDate,
  clearFilters,
  services = [],
}) {
  const { t } = useTranslation()
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

  const [calOpen, setCalOpen] = useState(false)
  const anchorRef = useRef(null)

  const hasFilters = filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

  function dateLabel() {
    if (!filterDate) return t('reports_module.choose_date')
    if (filterDate.length === 7) {
      const [y, m] = filterDate.split('-')
      return `${MONTHS[parseInt(m) - 1]} ${y}`
    }
    if (filterDate.length === 10) {
      const [y, m, d] = filterDate.split('-')
      return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`
    }
    return filterDate
  }

  return (
    <>
      <div className="rp-filters-wrap">

        {/* Status */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rp-filter-select"
        >
          <option value="all">{t('reports_module.all_statuses')}</option>
          <option value="Pending">{t('reports_module.pending')}</option>
          <option value="Confirmed">{t('reports_module.confirmed')}</option>
          <option value="Cancelled">{t('reports_module.cancelled')}</option>
        </select>

        {/* Service */}
        <select
          value={filterService ?? 'all'}
          onChange={e => setFilterService(e.target.value)}
          className="rp-filter-select"
        >
          <option value="all">{t('reports_module.all_services')}</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Date picker */}
        <div className="rp-filters-date" ref={anchorRef}>
          <button
            onClick={() => setCalOpen(o => !o)}
            className="rp-date-btn"
            style={{
              background: filterDate ? DARK : '#fff',
              border:     filterDate ? 'none' : '1px solid #E5E0DA',
              color:      filterDate ? '#fff' : DARK,
            }}
          >
            <span className="rp-date-btn__label">{dateLabel()}</span>
            <Calendar size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          </button>

          {filterDate && (
            <button
              onClick={e => { e.stopPropagation(); setFilterDate(''); setCalOpen(false) }}
              title={t('reports_module.clear_date_btn')}
              className="rp-date-clear"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Clear all */}
        {hasFilters && (
          <div className="rp-filters-clear">
            <button onClick={clearFilters} className="rp-clear-btn">
              <X size={13} strokeWidth={2.5} />
              {t('reports_module.clear_filters')}
            </button>
          </div>
        )}
      </div>

      {calOpen && (
        <CalendarPopup
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          onClose={() => setCalOpen(false)}
          anchorRef={anchorRef}
        />
      )}
    </>
  )
}
