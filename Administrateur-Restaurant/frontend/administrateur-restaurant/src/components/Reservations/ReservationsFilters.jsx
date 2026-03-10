import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown, Check, SlidersHorizontal, Filter } from 'lucide-react'

const T = {
  dark:      '#2b2118',
  darkMid:   '#3d2d1e',
  gold:      '#c8a97e',
  goldDk:    '#a8834e',
  goldLight: '#f5ebe0',
  white:     '#ffffff',
  cream:     '#faf7f4',
  border:    'rgba(43,33,24,0.12)',
  muted:     'rgba(43,33,24,0.4)',
  green:     '#166534', greenBg: '#f0fdf4', greenBdr: '#bbf7d0',
  amber:     '#92400e', amberBg: '#fffbeb', amberBdr: '#fde68a',
  red:       '#991b1b', redBg:   '#fef2f2', redBdr:   '#fecaca',
}

const STATUSES = [
  { value: 'Pending',   label: 'En attente', dot: T.gold,     bg: T.amberBg,  color: T.amber },
  { value: 'Confirmed', label: 'Confirmée',  dot: '#16a34a',  bg: T.greenBg,  color: T.green },
  { value: 'Cancelled', label: 'Annulée',    dot: '#dc2626',  bg: T.redBg,    color: T.red   },
]

const SERVICES = [
  'Dîner', 'Déjeuner', 'Brunch', 'Formule Midi', 'A la Carte',
]

/* ── Generic multi-select dropdown ── */
function MultiDropdown({ label, icon: Icon, options, selected, onChange, renderOption, renderTag, color = T.dark }) {
  const [open, setOpen] = useState(false)
  const ref             = useRef(null)
  const allSelected     = selected.length === 0
  const count           = selected.length

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(val) {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val))
    else onChange([...selected, val])
  }

  function selectAll() { onChange([]) }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: count > 0 ? T.dark : T.white,
          border: `1.5px solid ${count > 0 ? T.dark : T.border}`,
          borderRadius: 12,
          color: count > 0 ? T.white : T.dark,
          fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          transition: 'all 0.15s',
          minWidth: 0,
        }}
      >
        {Icon && <Icon size={14} strokeWidth={2} />}
        <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {count === 0 ? label : count === 1 ? renderTag(selected[0]) : `${count} sélectionnés`}
        </span>
        {count > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 18, height: 18, borderRadius: 99,
            background: T.gold, color: T.dark,
            fontSize: 9, fontWeight: 900, flexShrink: 0,
          }}>{count}</span>
        )}
        <ChevronDown size={13} strokeWidth={2.5} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
          background: T.white,
          border: `1.5px solid ${T.border}`,
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(43,33,24,0.14)',
          minWidth: 200, overflow: 'hidden',
          animation: 'dropIn 0.15s ease',
        }}>
          {/* Select all */}
          <button
            onClick={selectAll}
            style={{
              width: '100%', padding: '11px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: allSelected ? T.goldLight : 'transparent',
              border: 'none', borderBottom: `1px solid ${T.border}`,
              fontSize: 12, fontWeight: 800, color: T.dark,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.12s',
            }}
          >
            <span>Tout sélectionner</span>
            {allSelected && <Check size={13} color={T.goldDk} strokeWidth={2.5} />}
          </button>

          {/* Options */}
          {options.map(opt => {
            const isSelected = selected.includes(typeof opt === 'string' ? opt : opt.value)
            return (
              <button
                key={typeof opt === 'string' ? opt : opt.value}
                onClick={() => toggle(typeof opt === 'string' ? opt : opt.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  background: isSelected ? T.cream : 'transparent',
                  border: 'none', borderBottom: `1px solid ${T.border}`,
                  fontSize: 13, fontWeight: 600, color: T.dark,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.12s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = T.cream }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                {renderOption(opt)}
                <div style={{
                  width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                  background: isSelected ? T.dark : 'transparent',
                  border: `1.5px solid ${isSelected ? T.dark : T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isSelected && <Check size={10} color={T.gold} strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
   Props:
     search, setSearch
     filterStatuses  → string[]   (replaces filterStatus)
     setFilterStatuses
     filterServices  → string[]
     setFilterServices
     filterDate, setFilterDate
     clearFilters
   (still exports filterStatus = filterStatuses[0] for backward compat)
───────────────────────────────────────── */
export default function ReservationsFilters({
  search,           setSearch,
  filterStatuses,   setFilterStatuses,
  filterServices,   setFilterServices,
  filterDate,       setFilterDate,
  clearFilters,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // support legacy single-value callers
  const statuses = filterStatuses ?? []
  const services = filterServices ?? []

  const hasFilters = search || statuses.length > 0 || services.length > 0 || filterDate
  const activeCount = (statuses.length > 0 ? 1 : 0) + (services.length > 0 ? 1 : 0) + (filterDate ? 1 : 0) + (search ? 1 : 0)

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-6px) }
          to   { opacity:1; transform:translateY(0)    }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 16 }}>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="filters-desktop" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <Search size={14} color={T.muted} strokeWidth={2.5} style={{
              position: 'absolute', left: 13, top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Nom, téléphone, email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '10px 14px 10px 36px',
                background: T.white,
                border: `1.5px solid ${search ? T.dark : T.border}`,
                borderRadius: 12, outline: 'none',
                fontSize: 13, fontWeight: 600, color: T.dark,
                fontFamily: 'inherit', transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = T.dark}
              onBlur={e => e.target.style.borderColor = search ? T.dark : T.border}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                display: 'flex', color: T.muted,
              }}>
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Status multi-select */}
          <MultiDropdown
            label="Statut"
            options={STATUSES}
            selected={statuses}
            onChange={setFilterStatuses}
            renderOption={opt => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                <span>{opt.label}</span>
              </div>
            )}
            renderTag={val => STATUSES.find(s => s.value === val)?.label ?? val}
          />

          {/* Service multi-select */}
          <MultiDropdown
            label="Service"
            options={SERVICES}
            selected={services}
            onChange={setFilterServices}
            renderOption={opt => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  background: T.goldLight, color: T.goldDk, borderRadius: 6,
                }}>{opt}</span>
              </div>
            )}
            renderTag={val => val}
          />

          {/* Date */}
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{
              padding: '10px 14px',
              background: filterDate ? T.dark : T.white,
              border: `1.5px solid ${filterDate ? T.dark : T.border}`,
              borderRadius: 12, outline: 'none',
              fontSize: 13, fontWeight: 600,
              color: filterDate ? T.white : T.dark,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'all 0.15s',
              colorScheme: filterDate ? 'dark' : 'light',
            }}
          />

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 14px', borderRadius: 12,
                background: 'transparent',
                border: `1.5px solid ${T.border}`,
                color: T.muted, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.color = T.red }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted }}
            >
              <X size={13} strokeWidth={2.5} />
              Effacer
            </button>
          )}
        </div>

        {/* ── MOBILE: compact toggle bar ── */}
        <div className="filters-mobile" style={{ display: 'none' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Search always visible */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} color={T.muted} strokeWidth={2.5} style={{
                position: 'absolute', left: 13, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '11px 14px 11px 36px',
                  background: T.white, border: `1.5px solid ${search ? T.dark : T.border}`,
                  borderRadius: 12, outline: 'none',
                  fontSize: 13, fontWeight: 600, color: T.dark, fontFamily: 'inherit',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: T.muted,
                }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '11px 14px', borderRadius: 12,
                background: mobileOpen || activeCount > 1 ? T.dark : T.white,
                border: `1.5px solid ${mobileOpen || activeCount > 1 ? T.dark : T.border}`,
                color: mobileOpen || activeCount > 1 ? T.white : T.dark,
                fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
              }}
            >
              <SlidersHorizontal size={15} strokeWidth={2} />
              Filtres
              {activeCount > (search ? 1 : 0) && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 99, padding: '0 5px',
                  background: T.gold, color: T.dark,
                  fontSize: 9, fontWeight: 900,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activeCount - (search ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Mobile expanded filters */}
          {mobileOpen && (
            <div style={{
              marginTop: 8,
              background: T.white,
              border: `1.5px solid ${T.border}`,
              borderRadius: 16,
              padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              animation: 'slideDown 0.18s ease',
              boxShadow: '0 4px 20px rgba(43,33,24,0.1)',
            }}>

              {/* Status pills */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Statut</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <button
                    onClick={() => setFilterStatuses([])}
                    style={{
                      padding: '7px 14px', borderRadius: 99,
                      background: statuses.length === 0 ? T.dark : T.cream,
                      border: `1.5px solid ${statuses.length === 0 ? T.dark : T.border}`,
                      color: statuses.length === 0 ? T.white : T.dark,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Tous</button>
                  {STATUSES.map(s => {
                    const sel = statuses.includes(s.value)
                    return (
                      <button
                        key={s.value}
                        onClick={() => {
                          if (sel) setFilterStatuses(statuses.filter(v => v !== s.value))
                          else setFilterStatuses([...statuses, s.value])
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '7px 12px', borderRadius: 99,
                          background: sel ? s.bg : T.cream,
                          border: `1.5px solid ${sel ? s.dot : T.border}`,
                          color: sel ? s.color : T.dark,
                          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'all 0.12s',
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Service pills */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Service</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <button
                    onClick={() => setFilterServices([])}
                    style={{
                      padding: '7px 14px', borderRadius: 99,
                      background: services.length === 0 ? T.dark : T.cream,
                      border: `1.5px solid ${services.length === 0 ? T.dark : T.border}`,
                      color: services.length === 0 ? T.white : T.dark,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Tous</button>
                  {SERVICES.map(s => {
                    const sel = services.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          if (sel) setFilterServices(services.filter(v => v !== s))
                          else setFilterServices([...services, s])
                        }}
                        style={{
                          padding: '7px 12px', borderRadius: 99,
                          background: sel ? T.goldLight : T.cream,
                          border: `1.5px solid ${sel ? T.gold : T.border}`,
                          color: sel ? T.goldDk : T.dark,
                          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'all 0.12s',
                        }}
                      >{s}</button>
                    )
                  })}
                </div>
              </div>

              {/* Date */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Date</p>
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px 14px',
                    background: filterDate ? T.dark : T.white,
                    border: `1.5px solid ${filterDate ? T.dark : T.border}`,
                    borderRadius: 12, outline: 'none',
                    fontSize: 13, fontWeight: 600,
                    color: filterDate ? T.white : T.dark,
                    fontFamily: 'inherit', cursor: 'pointer',
                    colorScheme: filterDate ? 'dark' : 'light',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {hasFilters && (
                  <button
                    onClick={() => { clearFilters(); setMobileOpen(false) }}
                    style={{
                      flex: 1, padding: '11px',
                      borderRadius: 12, border: `1.5px solid ${T.border}`,
                      background: 'transparent', color: T.muted,
                      fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <X size={13} /> Effacer tout
                  </button>
                )}
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, padding: '11px',
                    borderRadius: 12, border: 'none',
                    background: T.dark, color: T.white,
                    fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active filter chips (both layouts) */}
        {(statuses.length > 0 || services.length > 0 || filterDate) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {statuses.map(s => {
              const opt = STATUSES.find(o => o.value === s)
              return (
                <span key={s} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 99,
                  background: opt?.bg, border: `1px solid ${opt?.dot}`,
                  fontSize: 11, fontWeight: 700, color: opt?.color,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: opt?.dot }} />
                  {opt?.label}
                  <button onClick={() => setFilterStatuses(statuses.filter(v => v !== s))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: opt?.color, opacity: 0.6 }}>
                    <X size={11} />
                  </button>
                </span>
              )
            })}
            {services.map(s => (
              <span key={s} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 99,
                background: T.goldLight, border: `1px solid ${T.gold}`,
                fontSize: 11, fontWeight: 700, color: T.goldDk,
              }}>
                {s}
                <button onClick={() => setFilterServices(services.filter(v => v !== s))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: T.goldDk, opacity: 0.6 }}>
                  <X size={11} />
                </button>
              </span>
            ))}
            {filterDate && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 99,
                background: T.dark, fontSize: 11, fontWeight: 700, color: T.white,
              }}>
                📅 {filterDate}
                <button onClick={() => setFilterDate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'rgba(255,255,255,0.6)' }}>
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 640px) {
          .filters-desktop { display: none !important; }
          .filters-mobile  { display: block !important; }
        }
      `}</style>
    </>
  )
}