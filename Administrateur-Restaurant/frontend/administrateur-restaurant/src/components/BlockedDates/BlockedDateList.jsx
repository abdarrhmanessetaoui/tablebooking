import { useState, useEffect } from 'react'
import { Trash2, CalendarOff, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK   = '#2b2118'
const GOLD   = '#c8a97e'
const BORDER = '#ece6de'
const CREAM  = '#faf8f5'

const PAGE_SIZE = 10

function fmt(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  const s = dt.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function fmtShort(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  const s = dt.toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isPast(d) {
  return new Date(d) < new Date(new Date().toDateString())
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={{
      width: 17, height: 17, flexShrink: 0,
      background: checked || indeterminate ? DARK : '#fff',
      border: `2px solid ${checked || indeterminate ? DARK : '#d0c8be'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {indeterminate && !checked && (
        <div style={{ width: 7, height: 2, background: GOLD }} />
      )}
    </div>
  )
}

function PageBtn({ onClick, disabled, active, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        minWidth: 32, height: 32, padding: '0 6px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? DARK : hov && !disabled ? '#f0ebe4' : '#fff',
        border: `1.5px solid ${active ? DARK : BORDER}`,
        color: active ? GOLD : disabled ? '#ccc' : DARK,
        fontSize: 12, fontWeight: active ? 900 : 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s', flexShrink: 0,
      }}>
      {children}
    </button>
  )
}

export default function BlockedDateList({
  blockedDates,
  handleUnblock,
  selectedDates = [],
  setSelectedDates,
}) {
  const [page, setPage] = useState(1)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => { setPage(1) }, [blockedDates?.length])

  if (!blockedDates || blockedDates.length === 0) {
    return (
      <div style={{ padding: '56px 0', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
        <CalendarOff size={40} color='#d8d0c8' strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#c8bfb4' }}>Aucune date bloquée</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: '#d8d0c8' }}>
          Utilisez le formulaire pour bloquer des dates.
        </p>
      </div>
    )
  }

  const sorted = [...blockedDates].sort((a, b) => {
    const now   = new Date().toDateString()
    const aPast = new Date(a.date) < new Date(now)
    const bPast = new Date(b.date) < new Date(now)
    if (!aPast && bPast)  return -1
    if (aPast  && !bPast) return  1
    if (!aPast && !bPast) return a.date.localeCompare(b.date)
    return b.date.localeCompare(a.date)
  })

  const total     = Math.ceil(sorted.length / PAGE_SIZE)
  const safe      = Math.min(page, total)
  const items     = sorted.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)

  const allSelected = blockedDates.length > 0 && blockedDates.every(d => selectedDates.includes(d.date))
  const pageAllSel  = items.length > 0 && items.every(d => selectedDates.includes(d.date))
  const pageSomeSel = items.some(d => selectedDates.includes(d.date)) && !pageAllSel

  function togglePage() {
    const ids = items.map(d => d.date)
    if (pageAllSel) setSelectedDates(selectedDates.filter(id => !ids.includes(id)))
    else setSelectedDates([...new Set([...selectedDates, ...ids])])
  }

  function toggleOne(date) {
    if (selectedDates.includes(date)) setSelectedDates(selectedDates.filter(d => d !== date))
    else setSelectedDates([...selectedDates, date])
  }

  function getPages() {
    // On mobile show fewer page buttons
    if (isMobile) {
      const p = []
      if (safe > 1) p.push(safe - 1 > 1 ? '…' : null)
      p.push(safe)
      if (safe < total) p.push(safe + 1 < total ? '…' : null)
      return [1, ...p.filter(Boolean), total].filter((v, i, a) => a.indexOf(v) === i)
    }
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const p = [1]
    if (safe > 3) p.push('…')
    for (let i = Math.max(2, safe - 1); i <= Math.min(total - 1, safe + 1); i++) p.push(i)
    if (safe < total - 2) p.push('…')
    p.push(total)
    return p
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>

      {/* Partial selection banner */}
      {selectedDates.length > 0 && !allSelected && (
        <div style={{
          padding: '9px 16px', background: '#fdf6ec',
          borderBottom: `1px solid #e8d8b0`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>
            {selectedDates.length} sélectionné{selectedDates.length > 1 ? 's' : ''}
          </span>
          <button onClick={() => setSelectedDates(blockedDates.map(d => d.date))} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 800, color: DARK,
            textDecoration: 'underline', fontFamily: 'inherit', padding: 0,
          }}>
            Tout sélectionner ({blockedDates.length})
          </button>
        </div>
      )}

      {/* All selected banner */}
      {allSelected && blockedDates.length > PAGE_SIZE && (
        <div style={{
          padding: '9px 16px', background: '#f0f7f0',
          borderBottom: `1px solid #b8ddb8`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2d6a2d' }}>
            {blockedDates.length} dates sélectionnées
          </span>
          <button onClick={() => setSelectedDates([])} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 800, color: '#2d6a2d',
            textDecoration: 'underline', fontFamily: 'inherit', padding: 0,
          }}>
            Désélectionner tout
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        padding: '10px 12px',
        background: DARK, alignItems: 'center', gap: 8,
      }}>
        <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
        <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Date bloquée
        </span>
        <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Action
        </span>
      </div>

      {/* Rows */}
      {items.map((d, i) => {
        const past     = isPast(d.date)
        const selected = selectedDates.includes(d.date)
        const idx      = (safe - 1) * PAGE_SIZE + i
        return (
          <div key={d.date ?? i}
            onClick={() => toggleOne(d.date)}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              padding: isMobile ? '12px 12px' : '14px 16px',
              background: selected ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM,
              borderBottom: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${selected ? GOLD : 'transparent'}`,
              alignItems: 'center', gap: 8,
              cursor: 'pointer',
              transition: 'background 0.12s',
              opacity: past ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#faf5ee' }}
            onMouseLeave={e => { e.currentTarget.style.background = selected ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM }}
          >
            {/* Checkbox */}
            <div onClick={e => e.stopPropagation()}>
              <Checkbox checked={selected} onChange={() => toggleOne(d.date)} />
            </div>

            {/* Date info */}
            <div style={{ minWidth: 0 }}>
              <p style={{
                margin: 0, fontWeight: 700, color: DARK, lineHeight: 1.3,
                fontSize: isMobile ? 12 : 14,
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {isMobile ? fmtShort(d.date) : fmt(d.date)}
              </p>
              {d.reason && (
                <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 600, color: GOLD, fontStyle: 'italic',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {d.reason}
                </p>
              )}
              {past && (
                <span style={{
                  display: 'inline-block', marginTop: 3,
                  fontSize: 9, fontWeight: 900, color: '#bbb',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  Passée
                </span>
              )}
            </div>

            {/* Action button */}
            <button
              onClick={e => { e.stopPropagation(); handleUnblock(d.date) }}
              style={{
                display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 8,
                padding: isMobile ? '9px 10px' : '10px 20px',
                background: DARK, border: 'none', color: '#fff',
                fontSize: 13, fontWeight: 800,
                cursor: 'pointer', transition: 'background 0.15s',
                fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#b94040'}
              onMouseLeave={e => e.currentTarget.style.background = DARK}
              title="Débloquer"
            >
              <Trash2 size={14} strokeWidth={2.2} />
              {!isMobile && <span>Débloquer</span>}
            </button>
          </div>
        )
      })}

      {/* Pagination */}
      {total > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-between',
          flexWrap: 'wrap', gap: 8,
          padding: '12px 16px',
          borderTop: `1.5px solid ${BORDER}`,
          background: CREAM,
        }}>
          {!isMobile && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#bbb' }}>
              {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, sorted.length)} / {sorted.length}
            </span>
          )}
          <div style={{ display: 'flex', gap: 3 }}>
            <PageBtn onClick={() => setPage(1)} disabled={safe === 1}>
              <ChevronsLeft size={12} strokeWidth={2.5} />
            </PageBtn>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safe === 1}>
              <ChevronLeft size={12} strokeWidth={2.5} />
            </PageBtn>
            {getPages().map((p, i) =>
              p === '…'
                ? <span key={`d${i}`} style={{ padding: '0 2px', fontSize: 12, color: '#bbb', lineHeight: '32px' }}>…</span>
                : <PageBtn key={p} active={p === safe} onClick={() => setPage(p)}>{p}</PageBtn>
            )}
            <PageBtn onClick={() => setPage(p => Math.min(total, p + 1))} disabled={safe === total}>
              <ChevronRight size={12} strokeWidth={2.5} />
            </PageBtn>
            <PageBtn onClick={() => setPage(total)} disabled={safe === total}>
              <ChevronsRight size={12} strokeWidth={2.5} />
            </PageBtn>
          </div>
          {isMobile && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#bbb', width: '100%', textAlign: 'center' }}>
              {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, sorted.length)} / {sorted.length}
            </span>
          )}
        </div>
      )}
    </div>
  )
}