import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X, Calendar } from 'lucide-react'
import CalendarPopup from './CalendarPopup.jsx'
import { DARK, LIGHT_BROWN, DARK_LIGHT, WHITE, BORDER, RADIUS } from '../../../styles/dashboard/tokens'
import { filterInputBase, dateBtnStyle } from '../../../styles/reservations/filters.styles.js'
import { apiPath, getHeaders } from '../../../utils/api.js'

function dateLabel(filterDate, t, lang) {
  if (!filterDate) return t('choose_date')
  const date = filterDate.length === 7 ? new Date(filterDate + '-01') : new Date(filterDate)
  const options = filterDate.length === 7
    ? { month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'long', year: 'numeric' }

  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US', options).format(date)
}

// Mirrors dateBtnStyle logic but for <select> elements
function selectActiveStyle(isActive) {
  return {
    ...filterInputBase,
    cursor: 'pointer',
    ...(isActive ? {
      background: LIGHT_BROWN,
      color: WHITE,
      border: `1px solid ${LIGHT_BROWN}`,
      fontWeight: 700,
    } : {
      background: WHITE,
      color: DARK,
      border: `1px solid ${BORDER}`,
    }),
  }
}

export default function ReservationsFilters({
  search,        setSearch,
  filterStatus,  setFilterStatus,
  filterService, setFilterService,
  filterDate,    setFilterDate,
  filterTable,   setFilterTable,
  clearFilters,
  services = [],
}) {
  const { t, i18n } = useTranslation()
  const [calOpen, setCalOpen] = useState(false)
  const [tables,  setTables]  = useState([])
  const anchorRef = useRef(null)

  useEffect(() => {
    fetch(apiPath('tables'), {
      headers: getHeaders()
    })
      .then(r => r.json())
      .then(data => setTables(Array.isArray(data) ? data.filter(t => t.active) : []))
      .catch(() => {})
  }, [])

  const statusActive  = filterStatus  && filterStatus  !== 'all'
  const serviceActive = filterService && filterService !== 'all'
  const tableActive   = filterTable   && filterTable   !== 'all'

  const hasFilters = search || statusActive || filterDate || serviceActive || tableActive

  return (
    <>
      <style>{`
        .filters-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }
        .filters-search,
        .filters-date,
        .filters-clear { grid-column: 1 / -1; }
        .filters-date  { position: relative; }
        @media (min-width: 640px) {
          .filters-wrap {
            grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr auto;
          }
          .filters-search,
          .filters-date,
          .filters-clear { grid-column: auto; }
        }

        .filter-select option {
          background: #fff;
          color: ${DARK};
          font-weight: 500;
        }
      `}</style>

      <div className="filters-wrap">

        {/* ── Search ── */}
        <div className="filters-search" style={{ position: 'relative' }}>
          <Search
            size={14} color={DARK_LIGHT} strokeWidth={2}
            style={{ position:'absolute', insetInlineStart:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
          />
          <input
            type="text" placeholder={t('reservation_search_placeholder')}
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...filterInputBase, paddingInlineStart: 34, background: WHITE, border: `1px solid ${BORDER}`, color: DARK }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position:'absolute', insetInlineEnd:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}>
              <X size={12} color={DARK_LIGHT} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ── Status ── */}
        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={selectActiveStyle(statusActive)}
        >
          <option value="all">{t('all_statuses')}</option>
          <option value="Pending">{t('pending')}</option>
          <option value="Confirmed">{t('confirm')}</option>
          <option value="Cancelled">{t('cancel')}</option>
        </select>

        {/* ── Service ── */}
        <select
          className="filter-select"
          value={filterService ?? 'all'}
          onChange={e => setFilterService(e.target.value)}
          style={selectActiveStyle(serviceActive)}
        >
          <option value="all">{t('all_services')}</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* ── Table ── */}
        <select
          className="filter-select"
          value={filterTable ?? 'all'}
          onChange={e => setFilterTable(e.target.value)}
          style={selectActiveStyle(tableActive)}
        >
          <option value="all">{t('all_tables')}</option>
          {tables.map(tData => (
            <option key={tData.idx} value={String(tData.idx)}>
              {t('table_number', { number: tData.number })}{tData.location ? `   ${tData.location}` : ''}
            </option>
          ))}
          <option value="unassigned">{t('unassigned')}</option>
        </select>

        {/* ── Date ── */}
        <div className="filters-date" ref={anchorRef}>
          <button onClick={() => setCalOpen(o => !o)} style={dateBtnStyle(!!filterDate)}>
            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {dateLabel(filterDate, t, i18n.language)}
            </span>
            <Calendar size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
          </button>
          {filterDate && (
            <button
              onClick={e => { e.stopPropagation(); setFilterDate(''); setCalOpen(false) }}
              style={{ position:'absolute', right:36, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:'4px 6px', display:'flex', alignItems:'center', color: WHITE, opacity: 0.8, zIndex:1 }}
            >
              EFFACER
            </button>
          )}
        </div>

        {/* ── Clear all ── */}
        {hasFilters && (
          <div className="filters-clear">
            <button onClick={clearFilters}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                padding:'10px 14px', width:'100%',
                background: LIGHT_BROWN, border:'none',
                fontSize:12, fontWeight:700, color: WHITE,
                cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap',
                borderRadius: RADIUS.sm
              }}>
              <X size={13} strokeWidth={2.5} />
              {t('clear_filters')}
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
