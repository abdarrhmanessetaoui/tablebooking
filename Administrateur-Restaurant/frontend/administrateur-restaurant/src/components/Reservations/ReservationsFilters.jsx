import { useState } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

const STATUS_OPTIONS = [
  { value: 'all',       label: 'Tous les statuts' },
  { value: 'Pending',   label: 'En attente' },
  { value: 'Confirmed', label: 'Confirmées' },
  { value: 'Cancelled', label: 'Annulées' },
]

const STATUS_COLORS = {
  Pending:   { dot: '#c8a97e', bg: '#fdf6ec', color: '#a8834e' },
  Confirmed: { dot: '#16a34a', bg: '#f0f7f0', color: '#2d6a2d' },
  Cancelled: { dot: '#dc2626', bg: '#fdf0f0', color: '#b94040' },
}

export default function ReservationsFilters({
  search, setSearch,
  filterStatus, setFilterStatus,
  filterService, setFilterService,
  filterDate, setFilterDate,
  clearFilters,
  services = [],
}) {
  const [dateMode, setDateMode] = useState('month')

  const hasFilters = search || filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

  function handleDateModeToggle(mode) {
    setDateMode(mode)
    setFilterDate('')
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
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .filters-row-1 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .filters-row-2 {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }
        @media (min-width: 640px) {
          .filters-row-1 {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .filters-row-1 {
            grid-template-columns: 1fr auto;
          }
        }
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 2px solid #e8e0d8;
          background: #fff;
          font-size: 12px;
          font-weight: 700;
          color: #888;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
          position: relative;
        }
        .filter-pill:hover {
          border-color: ${DARK};
          color: ${DARK};
        }
        .filter-pill.active {
          background: ${DARK};
          border-color: ${DARK};
          color: #fff;
        }
        .filter-pill.active-gold {
          background: #fdf6ec;
          border-color: ${GOLD};
          color: #a8834e;
        }
        .date-mode-btn {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border: 2px solid #e8e0d8;
          background: #fff;
          font-size: 11px;
          font-weight: 800;
          color: #bbb;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .date-mode-btn.active {
          background: ${DARK};
          border-color: ${DARK};
          color: ${GOLD};
        }
        .date-mode-btn:not(.active):hover {
          border-color: ${DARK};
          color: ${DARK};
        }
      `}</style>

      <div className="filters-wrap">

        {/* Row 1 — Search + Date */}
        <div className="filters-row-1">

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#bbb" strokeWidth={2.5} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              type="text" placeholder="Rechercher par nom ou téléphone…"
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

          {/* Date — toggle + input inline */}
          <div style={{ display: 'flex' }}>
            <button
              className={`date-mode-btn${dateMode === 'month' ? ' active' : ''}`}
              onClick={() => handleDateModeToggle('month')}
              title="Filtrer par mois"
            >
              Mois
            </button>
            <button
              className={`date-mode-btn${dateMode === 'day' ? ' active' : ''}`}
              onClick={() => handleDateModeToggle('day')}
              title="Filtrer par jour"
              style={{ borderLeft: 'none' }}
            >
              Jour
            </button>
            <input
              type={dateMode === 'month' ? 'month' : 'date'}
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              style={{
                ...base,
                flex: 1, minWidth: 0,
                borderLeft: 'none',
                padding: '10px 12px',
              }}
            />
          </div>
        </div>

        {/* Row 2 — Status pills + Service pills + Clear */}
        <div className="filters-row-2">

          {/* Status pills */}
          <div style={{ display: 'flex', gap: 0 }}>
            {STATUS_OPTIONS.map((opt, i) => {
              const active = filterStatus === opt.value
              const sc     = STATUS_COLORS[opt.value]
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '7px 13px',
                    background: active
                      ? (sc ? sc.bg : DARK)
                      : '#fff',
                    border: `2px solid ${active ? (sc ? sc.dot : DARK) : '#e8e0d8'}`,
                    borderLeft: i > 0 ? 'none' : undefined,
                    color: active ? (sc ? sc.color : '#fff') : '#aaa',
                    fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {sc && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: active ? sc.dot : '#ddd',
                      flexShrink: 0, transition: 'background 0.15s',
                    }} />
                  )}
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Divider */}
          {services.length > 0 && (
            <div style={{ width: 1, height: 24, background: '#e8e0d8', flexShrink: 0 }} />
          )}

          {/* Service pills */}
          {services.length > 0 && (
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterService('all')}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '7px 13px',
                  background: filterService === 'all' ? DARK : '#fff',
                  border: `2px solid ${filterService === 'all' ? DARK : '#e8e0d8'}`,
                  color: filterService === 'all' ? GOLD : '#aaa',
                  fontSize: 12, fontWeight: 800,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                Tous
              </button>
              {services.map((s, i) => {
                const active = filterService === s
                return (
                  <button
                    key={s}
                    onClick={() => setFilterService(s)}
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '7px 13px',
                      background: active ? DARK : '#fff',
                      border: `2px solid ${active ? DARK : '#e8e0d8'}`,
                      borderLeft: 'none',
                      color: active ? GOLD : '#aaa',
                      fontSize: 12, fontWeight: 800,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          )}

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 14px',
              background: 'none',
              border: '2px solid #e8e0d8',
              color: '#b94040',
              fontSize: 12, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
              marginLeft: 'auto',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf0f0'; e.currentTarget.style.borderColor = '#b94040' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#e8e0d8' }}
            >
              <X size={12} strokeWidth={2.5} />
              Effacer
            </button>
          )}
        </div>
      </div>
    </>
  )
}