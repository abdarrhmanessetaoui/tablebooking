import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

export default function ReservationsFilters({
  search, setSearch,
  filterStatus, setFilterStatus,
  filterService, setFilterService,
  filterDate, setFilterDate,
  clearFilters,
  services = [],
}) {
  const hasFilters = search || filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

  // Parse current month/year from filterDate
  const currentDate = filterDate ? new Date(filterDate) : new Date()
  const currentYear  = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  function goMonth(delta) {
    const d = new Date(currentYear, currentMonth + delta, 1)
    // Set filterDate to first day of that month
    setFilterDate(d.toISOString().slice(0, 10))
  }

  const base = {
    background: '#fff',
    border: '2px solid #e8e0d8',
    padding: '10px 14px',
    fontSize: 13, fontWeight: 600,
    color: DARK, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    width: '100%', borderRadius: 0,
  }

  return (
    <>
      <style>{`
        .filters-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .filters-search { grid-column: 1 / -1; }
        .filters-date   { grid-column: 1 / -1; }
        .filters-clear  { grid-column: 1 / -1; }
        @media (min-width: 640px) {
          .filters-wrap   { grid-template-columns: 1fr 1fr 1fr 1fr auto; }
          .filters-search { grid-column: auto; }
          .filters-date   { grid-column: auto; }
          .filters-clear  { grid-column: auto; }
        }
        .month-nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 40px; flex-shrink: 0;
          background: #f5f0eb;
          border: 2px solid #e8e0d8;
          color: #999;
          cursor: pointer;
          transition: all 0.15s;
        }
        .month-nav-btn:hover {
          background: ${DARK};
          border-color: ${DARK};
          color: ${GOLD};
        }
      `}</style>

      <div className="filters-wrap">

        {/* Search */}
        <div className="filters-search" style={{ position: 'relative' }}>
          <Search size={14} color="#bbb" strokeWidth={2.5} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            type="text" placeholder="Rechercher…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...base, paddingLeft: 34 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              display: 'flex', alignItems: 'center',
            }}>
              <X size={12} color="#bbb" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Status */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ ...base, cursor: 'pointer' }}>
          <option value="all">Tous les statuts</option>
          <option value="Pending">En attente</option>
          <option value="Confirmed">Confirmées</option>
          <option value="Cancelled">Annulées</option>
        </select>

        {/* Service */}
        <select value={filterService ?? 'all'} onChange={e => setFilterService(e.target.value)}
          style={{ ...base, cursor: 'pointer' }}>
          <option value="all">Tous les services</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Month navigator — prev arrow + label + next arrow */}
        <div className="filters-date" style={{ display: 'flex' }}>
          <button className="month-nav-btn" onClick={() => goMonth(-1)} title="Mois précédent">
            <ChevronLeft size={15} strokeWidth={2.5} />
          </button>

          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: filterDate ? DARK : '#fff',
            border: '2px solid #e8e0d8',
            borderLeft: 'none', borderRight: 'none',
            fontSize: 13, fontWeight: 800,
            color: filterDate ? GOLD : '#bbb',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            padding: '0 12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onClick={() => setFilterDate(new Date().toISOString().slice(0, 10))}
            title="Revenir au mois actuel"
          >
            {MONTHS_FR[currentMonth]} {currentYear}
          </div>

          <button className="month-nav-btn" onClick={() => goMonth(1)} title="Mois suivant">
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Clear */}
        {hasFilters && (
          <div className="filters-clear">
            <button onClick={clearFilters} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 14px', width: '100%',
              background: DARK, border: 'none',
              fontSize: 12, fontWeight: 800, color: GOLD,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              <X size={13} strokeWidth={2.5} />
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </>
  )
}