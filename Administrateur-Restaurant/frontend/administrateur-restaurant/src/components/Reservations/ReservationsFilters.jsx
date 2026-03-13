import { useState, useEffect, useRef } from 'react'
import { Search, X, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

function CalendarPopup({ filterDate, setFilterDate, onClose, popupStyle = {} }) {
  const today      = new Date()
  const initDate   = filterDate
    ? (filterDate.length === 7 ? new Date(filterDate + '-01') : new Date(filterDate))
    : today
  const [viewYear,  setViewYear]  = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())
  const [mode,      setMode]      = useState('day') // 'day' | 'month'

  // Parse current selection
  const selFull  = filterDate && filterDate.length === 10  // YYYY-MM-DD
  const selMonth = filterDate && filterDate.length === 7   // YYYY-MM
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

  const firstDow  = new Date(viewYear, viewMonth, 1).getDay()
  const offset    = firstDow === 0 ? 6 : firstDow - 1
  const daysInMon = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()

  const cell = (content, onClick, extra = {}) => ({
    content, onClick,
    isToday: extra.isToday, isSelected: extra.isSelected, isOther: extra.isOther,
  })

  const dayCells = []
  for (let i = 0; i < offset; i++)
    dayCells.push(cell(daysInPrev - offset + 1 + i, null, { isOther: true }))
  for (let d = 1; d <= daysInMon; d++) {
    const isToday    = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    const isSelected = selFull && selDay === d && selMon === viewMonth && selYear === viewYear
    dayCells.push(cell(d, () => pickDay(d), { isToday, isSelected }))
  }
  const remaining = 42 - dayCells.length
  for (let d = 1; d <= remaining; d++)
    dayCells.push(cell(d, null, { isOther: true }))

  const s = {
    popup: {
      position: 'fixed', zIndex: 9999,
      background: '#fff', border: `2px solid ${DARK}`,
      width: 280, boxShadow: '0 8px 32px rgba(43,33,24,0.18)',
    },
    header: {
      display: 'flex', alignItems: 'center',
      background: DARK, padding: '8px 6px', gap: 2,
    },
    headerTitle: {
      flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 800,
      color: GOLD, letterSpacing: '0.02em',
    },
    navBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: 'rgba(200,169,126,0.7)', fontSize: 15, padding: '4px 6px',
      fontFamily: 'inherit', display: 'flex', alignItems: 'center',
      transition: 'color 0.12s',
    },
    modeWrap: {
      display: 'flex', borderBottom: '2px solid #e8e0d8',
    },
    modeBtn: (active) => ({
      flex: 1, padding: '7px', fontSize: 11, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      background: 'none', border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', color: active ? DARK : '#bbb',
      borderBottom: active ? `2px solid ${DARK}` : 'none',
      marginBottom: active ? -2 : 0,
      transition: 'all 0.12s',
    }),
    dayGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
      padding: '6px 8px 10px',
    },
    dayLabel: {
      textAlign: 'center', fontSize: 10, fontWeight: 800,
      color: '#bbb', padding: '4px 0', letterSpacing: '0.06em',
    },
    dayCell: (isOther, isToday, isSelected) => ({
      textAlign: 'center', fontSize: 12,
      fontWeight: isSelected ? 800 : isToday ? 900 : isOther ? 400 : 700,
      color: isSelected ? GOLD : isToday ? GOLD : isOther ? '#ccc' : DARK,
      background: isSelected ? DARK : 'transparent',
      padding: '5px 2px', cursor: isOther ? 'default' : 'pointer',
      transition: 'background 0.1s',
      borderRadius: 2,
    }),
    monthGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
      gap: 4, padding: 8,
    },
    monthCell: (isSelected, isCurrent) => ({
      padding: '8px 4px', textAlign: 'center', fontSize: 12,
      fontWeight: isSelected ? 800 : isCurrent ? 900 : 700,
      color: isSelected ? GOLD : isCurrent ? GOLD : DARK,
      background: isSelected ? DARK : 'transparent',
      cursor: 'pointer', transition: 'background 0.1s',
    }),
    selectedBadge: {
      padding: '6px 10px', borderTop: '1px solid #e8e0d8',
      fontSize: 11, fontWeight: 700, color: DARK,
      background: '#faf8f5', textAlign: 'center', letterSpacing: '0.04em',
    },
  }

  return (
    <div style={{ ...s.popup, ...popupStyle }}>
      {/* Header nav */}
      <div style={s.header}>
        <button style={s.navBtn} onClick={() => setViewYear(y => y - 1)} title="Année précédente">
          <ChevronsLeft size={13} strokeWidth={2.5} />
        </button>
        <button style={s.navBtn} onClick={() => navMonth(-1)} title="Mois précédent">
          <ChevronLeft size={13} strokeWidth={2.5} />
        </button>
        <span style={s.headerTitle}>{MONTHS_FR[viewMonth]} {viewYear}</span>
        <button style={s.navBtn} onClick={() => navMonth(1)} title="Mois suivant">
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
        <button style={s.navBtn} onClick={() => setViewYear(y => y + 1)} title="Année suivante">
          <ChevronsRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Mode toggle */}
      <div style={s.modeWrap}>
        <button style={s.modeBtn(mode === 'day')}   onClick={() => setMode('day')}>Jour</button>
        <button style={s.modeBtn(mode === 'month')} onClick={() => setMode('month')}>Mois</button>
      </div>

      {/* Day grid */}
      {mode === 'day' && (
        <div style={s.dayGrid}>
          {DAYS_FR.map(d => <div key={d} style={s.dayLabel}>{d}</div>)}
          {dayCells.map((c, i) => (
            <div
              key={i}
              style={s.dayCell(c.isOther, c.isToday, c.isSelected)}
              onClick={c.onClick || undefined}
              onMouseEnter={e => { if (!c.isOther && !c.isSelected) e.currentTarget.style.background = '#f5f0eb' }}
              onMouseLeave={e => { if (!c.isSelected) e.currentTarget.style.background = 'transparent' }}
            >
              {c.content}
            </div>
          ))}
        </div>
      )}

      {/* Month grid */}
      {mode === 'month' && (
        <div style={s.monthGrid}>
          {MONTHS_FR.map((m, i) => {
            const isCurrent  = i === today.getMonth() && viewYear === today.getFullYear()
            const isSelected = selMonth && selMon === i && selYear === viewYear
            return (
              <div
                key={m}
                style={s.monthCell(isSelected, isCurrent)}
                onClick={() => pickMonth(i)}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f5f0eb' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? DARK : 'transparent' }}
              >
                {m.slice(0, 4)}
              </div>
            )
          })}
        </div>
      )}

      {/* Show full date when a day is selected */}
      {selFull && (
        <div style={s.selectedBadge}>
          {String(selDay).padStart(2,'0')} {MONTHS_FR[selMon]} {selYear}
        </div>
      )}
    </div>
  )
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
  const [popupPos, setPopupPos] = useState({})
  const containerRef = useRef(null)

  const hasFilters = search || filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

  function openCal() {
    if (calOpen) { setCalOpen(false); return }
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const popupW = 280
      // Prefer right-aligned to the button; fall back to left-aligned if near left edge
      let left = rect.right - popupW
      if (left < 8) left = rect.left
      setPopupPos({ top: rect.bottom + 4, left })
    }
    setCalOpen(true)
  }
  useEffect(() => {
    function handler(e) {
      if (calOpen && containerRef.current && !containerRef.current.contains(e.target))
        setCalOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [calOpen])

  // Format button label
  function dateLabel() {
    if (!filterDate) return 'Choisir une date'
    if (filterDate.length === 7) {
      const [y, m] = filterDate.split('-')
      return `${MONTHS_FR[parseInt(m) - 1]} ${y}`
    }
    if (filterDate.length === 10) {
      const [y, m, d] = filterDate.split('-')
      return `${parseInt(d)} ${MONTHS_FR[parseInt(m) - 1]} ${y}`
    }
    return filterDate
  }

  const base = {
    background: '#fff', border: '2px solid #e8e0d8',
    padding: '10px 14px', fontSize: 13, fontWeight: 600,
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
          .filters-wrap   { grid-template-columns: 1fr 1fr 1fr auto; }
          .filters-search { grid-column: auto; }
          .filters-date   { grid-column: auto; }
          .filters-clear  { grid-column: auto; }
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

        {/* Date picker */}
        <div className="filters-date" style={{ position: 'relative' }} ref={containerRef}>
          <button
            onClick={openCal}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 8, width: '100%', padding: '10px 14px',
              background: filterDate ? DARK : '#fff',
              border: filterDate ? 'none' : '2px solid #e8e0d8',
              fontSize: 13, fontWeight: 800,
              color: filterDate ? GOLD : '#bbb',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <span>{dateLabel()}</span>
            <Calendar size={14} strokeWidth={2.2} style={{ flexShrink: 0 }} />
          </button>

          {filterDate && (
            <button
              onClick={() => { setFilterDate(''); setCalOpen(false) }}
              title="Effacer la date"
              style={{
                position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
                display: 'flex', alignItems: 'center', color: 'rgba(200,169,126,0.6)',
              }}
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}

          {calOpen && (
            <CalendarPopup
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              onClose={() => setCalOpen(false)}
              popupStyle={popupPos}
            />
          )}
        </div>

        {/* Clear all */}
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