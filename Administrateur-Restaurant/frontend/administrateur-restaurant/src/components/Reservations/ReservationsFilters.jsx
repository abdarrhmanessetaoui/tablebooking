import { useState } from 'react'
import { Search, X } from 'lucide-react'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const SERVICES = ['A la Carte', 'Dîner', 'Déjeuner', 'Brunch', 'Formule Midi']

export default function ReservationsFilters({
  search, setSearch,
  filterStatus, setFilterStatus,
  filterService, setFilterService,
  filterDate, setFilterDate,
  clearFilters
}) {
  const hasFilters = search || filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

  const base = {
    background: '#fff',
    border: '1.5px solid #e8e0d8',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13, fontWeight: 600,
    color: DARK, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    width: '100%',
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
        .filters-search {
          grid-column: 1 / -1;
        }
        .filters-date {
          grid-column: 1 / -1;
        }
        @media (min-width: 640px) {
          .filters-wrap {
            grid-template-columns: 1fr 1fr 1fr auto auto;
          }
          .filters-search { grid-column: auto; }
          .filters-date   { grid-column: auto; }
        }
      `}</style>

      <div className="filters-wrap">

        {/* Search — full width on mobile */}
        <div className="filters-search" style={{ position: 'relative' }}>
          <Search size={14} color="#bbb" strokeWidth={2.5} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...base, paddingLeft: 34 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center',
            }}>
              <X size={12} color="#bbb" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Status */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ ...base, cursor: 'pointer' }}
        >
          <option value="all">Tous les statuts</option>
          <option value="Pending">En attente</option>
          <option value="Confirmed">Confirmées</option>
          <option value="Cancelled">Annulées</option>
        </select>

        {/* Service */}
        <select
          value={filterService ?? 'all'}
          onChange={e => setFilterService(e.target.value)}
          style={{ ...base, cursor: 'pointer' }}
        >
          <option value="all">Tous les services</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Date — full width on mobile */}
        <div className="filters-date">
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{ ...base, cursor: 'pointer' }}
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 14px', borderRadius: 10,
              background: DARK, border: 'none',
              fontSize: 12, fontWeight: 800, color: GOLD,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap', width: '100%',
            }}
          >
            <X size={13} strokeWidth={2.5} />
            Effacer
          </button>
        )}
      </div>
    </>
  )
}