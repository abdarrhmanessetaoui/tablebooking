import { useState, useEffect } from 'react'
import { Trash2, CalendarOff, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK   = '#2b2118'
const GOLD   = '#c8a97e'
const BORDER = '#2b2118'
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

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={{
      width: 18, height: 18, flexShrink: 0,
      background: checked || indeterminate ? DARK : '#fff',
      border: `2px solid ${checked || indeterminate ? DARK : DARK}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 0.15s', padding: 2, margin: -2,
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
        minWidth: 36, height: 36, padding: '0 6px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? DARK : hov && !disabled ? '#f0ebe4' : '#fff',
        border: `1.5px solid ${active ? DARK : DARK}`,
        color: active ? GOLD : disabled ? DARK : DARK,
        fontSize: 12, fontWeight: active ? 900 : 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'all 0.15s', flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}>
      {children}
    </button>
  )
}

export default function BlockedDateList({ blockedDates, handleUnblock, selectedDates = [], setSelectedDates }) {
  const [page, setPage] = useState(1)
  const isMobile = useIsMobile(600)
  const isXs     = useIsMobile(400)

  useEffect(() => { setPage(1) }, [blockedDates?.length])

  if (!blockedDates || blockedDates.length === 0) {
    return (
      <div style={{ padding: '56px 16px', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
        <CalendarOff size={40} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK }}>Aucune date bloquée</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: DARK }}>
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

  const total    = Math.ceil(sorted.length / PAGE_SIZE)
  const safe     = Math.min(page, total)
  const items    = sorted.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)

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
    if (total <= 1) return [1]
    if (isMobile) {
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
      const p = new Set([1, safe - 1, safe, safe + 1, total].filter(n => n >= 1 && n <= total))
      const s = [...p].sort((a, b) => a - b)
      const result = []
      s.forEach((n, i) => { if (i > 0 && n - s[i-1] > 1) result.push('…'); result.push(n) })
      return result
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
    <>
      <style>{`
        .unblock-label { display: inline; }
        @media (max-width: 599px) { .unblock-label { display: none !important; } }
        @media (hover: hover) { .bd-row:hover { background: #faf5ee !important; } }
      `}</style>

      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>

        {selectedDates.length > 0 && !allSelected && (
          <div style={{ padding: '9px 14px', background: '#fdf6ec', borderBottom: `1px solid #e8d8b0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>
              {selectedDates.length} sélectionné{selectedDates.length > 1 ? 's' : ''}
            </span>
            <button onClick={() => setSelectedDates(blockedDates.map(d => d.date))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: DARK, textDecoration: 'underline', fontFamily: 'inherit', padding: 0, WebkitTapHighlightColor: 'transparent' }}>
              Tout sélectionner ({blockedDates.length})
            </button>
          </div>
        )}

        {allSelected && blockedDates.length > PAGE_SIZE && (
          <div style={{ padding: '9px 14px', background: '#f0f7f0', borderBottom: `1px solid #b8ddb8`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2d6a2d' }}>
              {blockedDates.length} dates sélectionnées
            </span>
            <button onClick={() => setSelectedDates([])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: '#2d6a2d', textDecoration: 'underline', fontFamily: 'inherit', padding: 0, WebkitTapHighlightColor: 'transparent' }}>
              Désélectionner tout
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: `44px 1fr ${isMobile ? '44px' : '120px'}`, padding: '10px 12px', background: DARK, alignItems: 'center', gap: 8 }}>
          <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Date bloquée</span>
          {!isMobile && <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Action</span>}
        </div>

        {items.map((d, i) => {
          const past     = isPast(d.date)
          const selected = selectedDates.includes(d.date)
          const idx      = (safe - 1) * PAGE_SIZE + i
          const bg       = selected ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM
          return (
            <div key={d.date ?? i} className="bd-row" onClick={() => toggleOne(d.date)}
              style={{
                display: 'grid', gridTemplateColumns: `44px 1fr ${isMobile ? '44px' : '120px'}`,
                padding: isMobile ? '13px 12px' : '14px 16px', background: bg,
                borderBottom: `1px solid ${BORDER}`,
                borderLeft: `3px solid ${selected ? GOLD : 'transparent'}`,
                alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.12s',
                opacity: past ? 0.6 : 1, userSelect: 'none', WebkitUserSelect: 'none',
              }}>
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox checked={selected} onChange={() => toggleOne(d.date)} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  margin: 0, fontWeight: 700, color: DARK, lineHeight: 1.35,
                  fontSize: isMobile ? 13 : 14,
                  whiteSpace: isMobile ? 'normal' : 'nowrap',
                  overflow: 'hidden',
                  textOverflow: isMobile ? 'unset' : 'ellipsis',
                  wordBreak: isMobile ? 'break-word' : 'normal',
                }}>
                  {isMobile ? fmtShort(d.date) : fmt(d.date)}
                </p>
                {d.reason && (
                  <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 600, color: GOLD, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.reason}
                  </p>
                )}
                {past && (
                  <span style={{ display: 'inline-block', marginTop: 3, fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Passée
                  </span>
                )}
              </div>
              <button onClick={e => { e.stopPropagation(); handleUnblock(d.date) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%',
                  padding: isMobile ? '10px 0' : '10px 18px',
                  background: DARK, border: 'none', color: '#fff',
                  fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'background 0.15s',
                  fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 40,
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#b94040'}
                onMouseLeave={e => e.currentTarget.style.background = DARK}
                title="Débloquer">
                <Trash2 size={14} strokeWidth={2.2} />
                <span className="unblock-label">Débloquer</span>
              </button>
            </div>
          )
        })}

        {total > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, padding: '12px 14px', borderTop: `1.5px solid ${BORDER}`, background: CREAM }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: DARK, flexShrink: 0 }}>
              {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, sorted.length)} / {sorted.length}
            </span>
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {!isXs && <PageBtn onClick={() => setPage(1)} disabled={safe === 1}><ChevronsLeft size={12} strokeWidth={2.5} /></PageBtn>}
              <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safe === 1}><ChevronLeft size={12} strokeWidth={2.5} /></PageBtn>
              {getPages().map((p, i) =>
                p === '…'
                  ? <span key={`d${i}`} style={{ padding: '0 2px', fontSize: 12, color: DARK, lineHeight: '36px' }}>…</span>
                  : <PageBtn key={p} active={p === safe} onClick={() => setPage(p)}>{p}</PageBtn>
              )}
              <PageBtn onClick={() => setPage(p => Math.min(total, p + 1))} disabled={safe === total}><ChevronRight size={12} strokeWidth={2.5} /></PageBtn>
              {!isXs && <PageBtn onClick={() => setPage(total)} disabled={safe === total}><ChevronsRight size={12} strokeWidth={2.5} /></PageBtn>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}