import { useState, useRef, useEffect } from 'react'

import CalendarPopup from './CalendarPopup.jsx'
import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens.js'
import { filterInputBase, dateBtnStyle } from '../../../styles/reservations/filters.styles.js'
import { getToken } from '../../../utils/auth.js'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const MUTED     = 'rgba(43,33,24,0.35)'

function dateLabel(filterDate) {
  if (!filterDate) return 'Choisir une date'
  if (filterDate.length === 7) {
    const [y, m] = filterDate.split('-')
    return `${MONTHS_FR[parseInt(m)-1]} ${y}`
  }
  if (filterDate.length === 10) {
    const [y, m, d] = filterDate.split('-')
    return `${parseInt(d)} ${MONTHS_FR[parseInt(m)-1]} ${y}`
  }
  return filterDate
}

// Mirrors dateBtnStyle logic but for <select> elements
function selectActiveStyle(isActive) {
  return {
    ...filterInputBase,
    cursor: 'pointer',
    ...(isActive ? {
      background: DARK,
      color: GOLD,
      border: 'none',
      fontWeight: 800,
    } : {}),
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
  const [calOpen, setCalOpen] = useState(false)
  const [tables,  setTables]  = useState([])
  const anchorRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/tables', {
      headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
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
          margin-bottom: 14px;
        }
        .filters-search,
        .filters-date,
        .filters-clear { grid-column: 1 / -1; }
        .filters-date  { position: relative; }
        @media (min-width: 640px) {
          .filters-wrap {
            grid-template-columns: 1fr 1fr 1fr 1fr auto;
          }
          .filters-search,
          .filters-date,
          .filters-clear { grid-column: auto; }
        }

        /* Unified active select: gold options stay readable in dropdown */
        .filter-select option {
          background: #fff;
          color: #2b2118;
          font-weight: 600;
        }
      `}</style>

      <div className="filters-wrap">

        {/* ── Search ── */}
        <div className="filters-search" style={{ position: 'relative' }}>
          <input
            type="text" placeholder="RECHERCHER…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...filterInputBase, paddingLeft: 14, fontWeight: 900, textTransform: 'uppercase' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:DARK, border:'none', cursor:'pointer', padding:'4px 8px', display:'flex', alignItems:'center', fontSize: 9, fontWeight: 900, color: GOLD }}>
              VIDER
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
          <option value="all">Tous les statuts</option>
          <option value="Pending">En attente</option>
          <option value="Confirmed">Confirmées</option>
          <option value="Cancelled">Annulées</option>
        </select>

        {/* ── Service ── */}
        <select
          className="filter-select"
          value={filterService ?? 'all'}
          onChange={e => setFilterService(e.target.value)}
          style={selectActiveStyle(serviceActive)}
        >
          <option value="all">Tous les services</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* ── Table ── */}
        <select
          className="filter-select"
          value={filterTable ?? 'all'}
          onChange={e => setFilterTable(e.target.value)}
          style={selectActiveStyle(tableActive)}
        >
          <option value="all">Toutes les tables</option>
          {tables.map(t => (
            <option key={t.idx} value={String(t.idx)}>
              Table {t.number}{t.location ? ` — ${t.location}` : ''}
            </option>
          ))}
          <option value="unassigned">Non assignées</option>
        </select>

        {/* ── Date ── */}
        <div className="filters-date" ref={anchorRef}>
          <button onClick={() => setCalOpen(o => !o)} style={dateBtnStyle(!!filterDate)}>
            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', textTransform: 'uppercase' }}>
              {dateLabel(filterDate)}
            </span>
            {!filterDate && <span style={{ fontSize: 9, fontWeight: 900, opacity: 0.7, marginLeft: 6 }}>DATES</span>}
          </button>
          {filterDate && (
            <button
              onClick={e => { e.stopPropagation(); setFilterDate(''); setCalOpen(false) }}
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:GOLD, border:'none', cursor:'pointer', padding:'4px 8px', display:'flex', alignItems:'center', color:DARK, zIndex:1, fontSize: 9, fontWeight: 900 }}
            >
              EFFACER
            </button>
          )}
        </div>

        {/* ── Clear all ── */}
        {hasFilters && (
          <div className="filters-clear">
            <button onClick={clearFilters}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 14px', width:'100%', background:'#FF0000', border:'none', fontSize:11, fontWeight:900, color:'#FFF', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', textTransform: 'uppercase' }}>
              EFFACER TOUT
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