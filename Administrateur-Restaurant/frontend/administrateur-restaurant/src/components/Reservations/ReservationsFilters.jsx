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

  const inputStyle = {
    background: '#fff',
    border: '2px solid #e8e0d8',
    borderRadius: 0,
    padding: '11px 16px',
    fontSize: 14, fontWeight: 600,
    color: DARK, fontFamily: 'inherit',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .res-filters { flex-direction: column !important; }
          .res-filters select,
          .res-filters input[type="date"] { width: 100% !important; flex: 1 1 auto !important; }
        }
      `}</style>

      <div className="res-filters" style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={14} color="#bbb" strokeWidth={2.5} style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }}
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
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ ...inputStyle, flex: '0 0 auto', width: 'auto', cursor: 'pointer', paddingRight: 32 }}
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
          style={{ ...inputStyle, flex: '0 0 auto', width: 'auto', cursor: 'pointer', paddingRight: 32 }}
        >
          <option value="all">Tous les services</option>
          {SERVICES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{ ...inputStyle, flex: '0 0 auto', width: 'auto', cursor: 'pointer' }}
        />

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '11px 16px',
              background: DARK, border: 'none',
              fontSize: 13, fontWeight: 800, color: GOLD,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            <X size={13} strokeWidth={2.5} />
            Réinitialiser
          </button>
        )}
      </div>
    </>
  )
}