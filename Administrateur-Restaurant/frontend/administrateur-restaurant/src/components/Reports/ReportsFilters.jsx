import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

const navBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(200,169,126,0.7)', padding: '4px 6px',
  fontFamily: 'inherit', display: 'flex', alignItems: 'center',
}

/* ── Calendar Popup (identical to Reservations) ── */
function CalendarPopup({ filterDate, setFilterDate, onClose, anchorRef }) {
  const today    = new Date()
  const initDate = filterDate
    ? (filterDate.length === 7 ? new Date(filterDate + '-01') : new Date(filterDate))
    : today
  const [viewYear,  setViewYear]  = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())
  const [mode,      setMode]      = useState('day')
  const [pos,       setPos]       = useState({ top: -9999, left: -9999, width: 280 })
  const popupRef = useRef(null)

  useEffect(() => {
    function calcPos() {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      const pw   = 280
      const vw   = window.innerWidth
      const vh   = window.innerHeight
      const ph   = popupRef.current ? popupRef.current.offsetHeight : 340
      let left   = rect.right - pw
      if (left < 8) left = 8
      if (left + pw > vw - 8) left = vw - pw - 8
      const top  = (vh - rect.bottom > ph + 8 || vh - rect.bottom > rect.top)
        ? rect.bottom + 4
        : rect.top - ph - 4
      setPos({ top, left, width: Math.min(pw, vw - 16) })
    }
    calcPos()
    window.addEventListener('resize', calcPos)
    window.addEventListener('scroll', calcPos, true)
    return () => {
      window.removeEventListener('resize', calcPos)
      window.removeEventListener('scroll', calcPos, true)
    }
  }, [anchorRef])

  useEffect(() => {
    function handler(e) {
      if (
        popupRef.current  && !popupRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, anchorRef])

  const selFull  = filterDate && filterDate.length === 10
  const selMonth = filterDate && filterDate.length === 7
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

  const firstDow   = new Date(viewYear, viewMonth, 1).getDay()
  const offset     = firstDow === 0 ? 6 : firstDow - 1
  const daysInMon  = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()

  const dayCells = []
  for (let i = 0; i < offset; i++)
    dayCells.push({ content: daysInPrev - offset + 1 + i, isOther: true })
  for (let d = 1; d <= daysInMon; d++) {
    const isToday    = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    const isSelected = selFull && selDay === d && selMon === viewMonth && selYear === viewYear
    dayCells.push({ content: d, onClick: () => pickDay(d), isToday, isSelected })
  }
  const remaining = 42 - dayCells.length
  for (let d = 1; d <= remaining; d++)
    dayCells.push({ content: d, isOther: true })

  const popup = (
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        top:   pos.top,
        left:  pos.left,
        width: pos.width,
        zIndex: 99999,
        background: '#fff',
        border: `2px solid ${DARK}`,
        boxShadow: '0 8px 32px rgba(43,33,24,0.22)',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', background: DARK, padding: '8px 6px', gap: 2 }}>
        <button onClick={() => setViewYear(y => y - 1)} style={navBtnStyle} title="Année précédente">
          <ChevronsLeft size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => navMonth(-1)} style={navBtnStyle} title="Mois précédent">
          <ChevronLeft size={13} strokeWidth={2.5} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: '0.02em' }}>
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>
        <button onClick={() => navMonth(1)} style={navBtnStyle} title="Mois suivant">
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => setViewYear(y => y + 1)} style={navBtnStyle} title="Année suivante">
          <ChevronsRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e8e0d8' }}>
        {['day', 'month'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '7px', fontSize: 11, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit',
            color: mode === m ? DARK : '#bbb',
            borderBottom: mode === m ? `2px solid ${DARK}` : 'none',
            marginBottom: mode === m ? -2 : 0,
            transition: 'all 0.12s',
          }}>
            {m === 'day' ? 'Jour' : 'Mois'}
          </button>
        ))}
      </div>

      {/* Day grid */}
      {mode === 'day' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '6px 8px 10px' }}>
          {DAYS_FR.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: 10, fontWeight: 800,
              color: '#bbb', padding: '4px 0', letterSpacing: '0.06em',
            }}>
              {d}
            </div>
          ))}
          {dayCells.map((c, i) => (
            <div
              key={i}
              onClick={c.onClick}
              onMouseEnter={e => { if (!c.isOther && !c.isSelected) e.currentTarget.style.background = '#f5f0eb' }}
              onMouseLeave={e => { if (!c.isSelected) e.currentTarget.style.background = 'transparent' }}
              style={{
                textAlign: 'center', fontSize: 12, borderRadius: 2,
                fontWeight: c.isSelected ? 800 : c.isToday ? 900 : c.isOther ? 400 : 700,
                color: c.isSelected ? GOLD : c.isToday ? GOLD : c.isOther ? '#ccc' : DARK,
                background: c.isSelected ? DARK : 'transparent',
                padding: '5px 2px',
                cursor: c.isOther ? 'default' : 'pointer',
                transition: 'background 0.1s',
              }}
            >
              {c.content}
            </div>
          ))}
        </div>
      )}

      {/* Month grid */}
      {mode === 'month' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: 8 }}>
          {MONTHS_FR.map((m, i) => {
            const isCurrent  = i === today.getMonth() && viewYear === today.getFullYear()
            const isSelected = selMonth && selMon === i && selYear === viewYear
            return (
              <div
                key={m}
                onClick={() => pickMonth(i)}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f5f0eb' }}
                onMouseLeave={e => { e.currentTarget.style.background = isSelected ? DARK : 'transparent' }}
                style={{
                  padding: '8px 4px', textAlign: 'center', fontSize: 12, cursor: 'pointer',
                  fontWeight: isSelected ? 800 : isCurrent ? 900 : 700,
                  color: isSelected ? GOLD : isCurrent ? GOLD : DARK,
                  background: isSelected ? DARK : 'transparent',
                  transition: 'background 0.1s',
                }}
              >
                {m.slice(0, 4)}
              </div>
            )
          })}
        </div>
      )}

      {/* Selected day badge */}
      {selFull && (
        <div style={{
          padding: '6px 10px', borderTop: '1px solid #e8e0d8',
          fontSize: 11, fontWeight: 700, color: DARK,
          background: '#faf8f5', textAlign: 'center', letterSpacing: '0.04em',
        }}>
          {String(selDay).padStart(2,'0')} {MONTHS_FR[selMon]} {selYear}
        </div>
      )}
    </div>
  )

  return createPortal(popup, document.body)
}

/* ── Main ReportsFilters component ── */
export default function ReportsFilters({
  filterStatus,  setFilterStatus,
  filterService, setFilterService,
  filterDate,    setFilterDate,
  clearFilters,
  services = [],
}) {
  const [calOpen, setCalOpen] = useState(false)
  const anchorRef = useRef(null)

  const hasFilters = filterStatus !== 'all' || filterDate || (filterService && filterService !== 'all')

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
        .rp-filters-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }
        .rp-filters-date   { grid-column: 1 / -1; position: relative; }
        .rp-filters-clear  { grid-column: 1 / -1; }
        @media (min-width: 640px) {
          .rp-filters-wrap   { grid-template-columns: 1fr 1fr 1fr auto; }
          .rp-filters-date   { grid-column: auto; }
          .rp-filters-clear  { grid-column: auto; }
        }
      `}</style>

      <div className="rp-filters-wrap">

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
        <div className="rp-filters-date" ref={anchorRef}>
          <button
            onClick={() => setCalOpen(o => !o)}
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
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {dateLabel()}
            </span>
            <Calendar size={14} strokeWidth={2.2} style={{ flexShrink: 0 }} />
          </button>

          {filterDate && (
            <button
              onClick={e => { e.stopPropagation(); setFilterDate(''); setCalOpen(false) }}
              title="Effacer la date"
              style={{
                position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
                display: 'flex', alignItems: 'center', color: 'rgba(200,169,126,0.6)',
                zIndex: 1,
              }}
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Clear all */}
        {hasFilters && (
          <div className="rp-filters-clear">
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