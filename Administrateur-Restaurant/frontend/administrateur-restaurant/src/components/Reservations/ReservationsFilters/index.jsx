import { useState, useRef } from 'react'
import { Search, X, Calendar } from 'lucide-react'
import CalendarPopup from './CalendarPopup.jsx'
import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens.js'
import { filterInputBase, dateBtnStyle } from '../../../styles/reservations/filters.styles.js'

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

export default function ReservationsFilters({
  search, setSearch,
  filterStatus,  setFilterStatus,
  filterService, setFilterService,
  filterDate,    setFilterDate,
  clearFilters,
  services = [],
}) {
  const [calOpen, setCalOpen] = useState(false)
  const anchorRef = useRef(null)
  const hasFilters = search || filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

  return (
    <>
      <style>{`
        .filters-wrap { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
        .filters-search, .filters-date, .filters-clear { grid-column:1/-1; }
        .filters-date { position:relative; }
        @media(min-width:640px){
          .filters-wrap { grid-template-columns:1fr 1fr 1fr auto; }
          .filters-search, .filters-date, .filters-clear { grid-column:auto; }
        }
      `}</style>

      <div className="filters-wrap">

        {/* Search */}
        <div className="filters-search" style={{ position:'relative' }}>
          <Search size={14} color={MUTED} strokeWidth={2.5} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
          <input type="text" placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ ...filterInputBase, paddingLeft:34 }} />
          {search && (
            <button onClick={()=>setSearch('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}>
              <X size={12} color={MUTED} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Status */}
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ ...filterInputBase, cursor:'pointer' }}>
          <option value="all">Tous les statuts</option>
          <option value="Pending">En attente</option>
          <option value="Confirmed">Confirmées</option>
          <option value="Cancelled">Annulées</option>
        </select>

        {/* Service */}
        <select value={filterService??'all'} onChange={e=>setFilterService(e.target.value)} style={{ ...filterInputBase, cursor:'pointer' }}>
          <option value="all">Tous les services</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Date */}
        <div className="filters-date" ref={anchorRef}>
          <button onClick={()=>setCalOpen(o=>!o)} style={dateBtnStyle(!!filterDate)}>
            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {dateLabel(filterDate)}
            </span>
            <Calendar size={14} strokeWidth={2.2} style={{ flexShrink:0 }} />
          </button>
          {filterDate && (
            <button onClick={e=>{ e.stopPropagation(); setFilterDate(''); setCalOpen(false) }}
              style={{ position:'absolute', right:36, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:'4px 6px', display:'flex', alignItems:'center', color:'rgba(200,169,126,0.7)', zIndex:1 }}>
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Clear */}
        {hasFilters && (
          <div className="filters-clear">
            <button onClick={clearFilters} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 14px', width:'100%', background:DARK, border:'none', fontSize:12, fontWeight:800, color:GOLD, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
              <X size={13} strokeWidth={2.5} />
              Effacer les filtres
            </button>
          </div>
        )}
      </div>

      {calOpen && (
        <CalendarPopup
          filterDate={filterDate} setFilterDate={setFilterDate}
          onClose={()=>setCalOpen(false)} anchorRef={anchorRef}
        />
      )}
    </>
  )
}