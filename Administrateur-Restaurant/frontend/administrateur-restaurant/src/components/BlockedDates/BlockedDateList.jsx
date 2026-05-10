import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, CalendarOff, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK    = '#2D2926'
const LIGHT_BROWN    = '#C19A6B'
const BORDER  = '#E5E0DA'
const RED     = '#EF4444'

const PAGE_SIZE = 10

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange() }}
      style={{ 
        width: 18, height: 18, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: 4,
        background: checked || indeterminate ? LIGHT_BROWN : '#fff',
        border: `1.5px solid ${checked || indeterminate ? LIGHT_BROWN : BORDER}`
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div style={{ width: 8, height: 2, background: '#fff', borderRadius: 1 }} />
      )}
    </div>
  )
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        minWidth: 34, height: 34,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? LIGHT_BROWN : '#fff',
        border: `1px solid ${active ? LIGHT_BROWN : BORDER}`,
        borderRadius: '4px',
        color: active ? '#fff' : DARK,
        fontSize: '13px', fontWeight: '800',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'none', flexShrink: 0,
        fontFamily: 'inherit',
      }}>
      {children}
    </button>
  )
}

export default function BlockedDateList({ blockedDates, handleUnblock, selectedDates = [], setSelectedDates }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const [page, setPage] = useState(1)
  const isMobile = useIsMobile(600)
  const isXs = useIsMobile(400)

  useEffect(() => { setPage(1) }, [blockedDates?.length])

  function fmt(d) {
    if (!d) return ' '
    const dt = new Date(d + 'T00:00:00')
    if (isNaN(dt)) return d
    const s = dt.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function fmtShort(d) {
    if (!d) return ' '
    const dt = new Date(d + 'T00:00:00')
    if (isNaN(dt)) return d
    const s = dt.toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function isPast(d) {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return new Date(d + 'T00:00:00') < today
  }

  if (!blockedDates || blockedDates.length === 0) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', background: '#fff', borderRadius: '4px', border: `1px solid ${BORDER}` }}>
        <CalendarOff size={40} color={BORDER} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 16px' }} />
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: DARK }}>{t('calendar.no_blocked_dates')}</p>
        <p style={{ margin: '6px 0 0', fontSize: '13px', color: DARK, fontWeight: '600' }}>
          {t('calendar.use_form_to_block')}
        </p>
      </div>
    )
  }

  const sorted = [...blockedDates].sort((a, b) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const aPast = new Date(a.date + 'T00:00:00') < today
    const bPast = new Date(b.date + 'T00:00:00') < today
    if (!aPast && bPast) return -1
    if (aPast && !bPast) return 1
    if (!aPast && !bPast) return a.date.localeCompare(b.date)
    return b.date.localeCompare(a.date)
  })

  const total = Math.ceil(sorted.length / PAGE_SIZE)
  const safe = Math.min(page, total)
  const items = sorted.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)

  const allSelected = blockedDates.length > 0 && blockedDates.every(d => selectedDates.includes(d.date))
  const pageAllSel = items.length > 0 && items.every(d => selectedDates.includes(d.date))
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
      s.forEach((n, i) => { if (i > 0 && n - s[i - 1] > 1) result.push('…'); result.push(n) })
      return result
    }
    const p = [1]
    if (safe > 3) p.push('…')
    for (let i = Math.max(2, safe - 1); i <= Math.min(total - 1, safe + 1); i++) p.push(i)
    if (safe < total - 2) p.push('…')
    p.push(total)
    return p
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: '4px', border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: 'none' }}>
      
      {/* Partial selection banner */}
      {selectedDates.length > 0 && !allSelected && (
        <div style={{ padding: '10px 20px', background: LIGHT_BROWN, borderBottom: `1px solid ${LIGHT_BROWN}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>
            {t('calendar.selected_count', { count: selectedDates.length, plural: selectedDates.length > 1 ? 's' : '' })}
          </span>
          <button onClick={() => setSelectedDates(blockedDates.map(d => d.date))} 
            style={{ 
              background: '#ffffff', border: 'none', color: LIGHT_BROWN,
              padding: '6px 14px', borderRadius: '4px', fontSize: '11px',
              fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase',
              fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}>
            {t('calendar.select_all')}
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? `44px 1fr 44px` : `44px 1fr 1fr 100px`,
        padding: '12px 20px', background: '#ffffff', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${BORDER}`
      }}>
        <div />
        <span style={{ fontSize: '11px', fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('calendar.blocked_date')}</span>
        {!isMobile && <span style={{ fontSize: '11px', fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('calendar.block_reason')}</span>}
        {!isMobile && <span style={{ fontSize: '11px', fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</span>}
      </div>

      {/* Rows */}
      {items.map((d, i) => {
        const past = isPast(d.date)
        const selected = selectedDates.includes(d.date)
        const reason = d.reason || d.notes || d.label || ''

        return (
          <div key={d.date ?? i} onClick={() => toggleOne(d.date)}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? `44px 1fr 44px` : `44px 1fr 1fr 100px`,
              padding: '14px 20px',
              background: selected ? '#FAF7F4' : '#ffffff',
              borderBottom: `1px solid ${BORDER}`,
              alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'none',
              opacity: past ? 0.6 : 1,
            }}>

            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox checked={selected} onChange={() => toggleOne(d.date)} />
            </div>

            <div style={{ minWidth: 0 }}>
              <p style={{
                margin: 0, fontWeight: '900', color: DARK,
                fontSize: isMobile ? '13px' : '14px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {isMobile ? fmtShort(d.date) : fmt(d.date)}
              </p>
              {isMobile && reason && (
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: DARK, fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reason}</p>
              )}
              {past && (
                <span style={{ fontSize: '9px', fontWeight: '900', color: RED, textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{t('calendar.past')}</span>
              )}
            </div>

            {!isMobile && (
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', color: DARK, fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {reason || ' '}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button onClick={e => { e.stopPropagation(); handleUnblock(d.date) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '4px',
                  background: RED, border: 'none', color: '#fff',
                  cursor: 'pointer', transition: 'none',
                }}
                title={t('calendar.unblock_date')}>
                <Trash2 size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )
      })}

      {/* Pagination */}
      {total > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', background: '#ffffff', borderTop: `1px solid ${BORDER}`
        }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: DARK }}>
            {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, sorted.length)} / {sorted.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <PageBtn onClick={() => setPage(1)} disabled={safe === 1}><ChevronsLeft size={14} strokeWidth={2.5} /></PageBtn>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safe === 1}><ChevronLeft size={14} strokeWidth={2.5} /></PageBtn>
            {!isMobile && getPages().map((p, i) =>
              p === '…' ? <span key={i} style={{ padding: '0 4px', color: DARK }}>…</span> : <PageBtn key={i} active={p === safe} onClick={() => setPage(p)}>{p}</PageBtn>
            )}
            <PageBtn onClick={() => setPage(p => Math.min(total, p + 1))} disabled={safe === total}><ChevronRight size={14} strokeWidth={2.5} /></PageBtn>
            <PageBtn onClick={() => setPage(total)} disabled={safe === total}><ChevronsRight size={14} strokeWidth={2.5} /></PageBtn>
          </div>
        </div>
      )}
    </div>
  )
}
