import { useState, useEffect } from 'react'
import { Pencil, Trash2, LayoutGrid, Users, MapPin, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK     = '#2b2118'
const GOLD     = '#c8a97e'
const GOLD_DK  = '#a8834e'
const BORDER   = '#2b2118'
const CREAM    = '#faf8f5'
const RED      = '#b94040'
const RED_BG   = '#fdf0f0'
const GREEN    = '#16a34a'
const GREEN_BG = '#f0f7f0'

const PAGE_SIZE = 10

const LOC_COLORS = {
  'Intérieur':   { bg: '#f0f4ff', color: '#3b5bdb' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#fdf6ec', color: '#a8834e' },
  'Salon privé': { bg: '#fdf0f0', color: '#b94040' },
}

function useIsMobile(bp = 600) {
  const [v, setV] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false)
  useEffect(() => {
    const h = () => setV(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return v
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={{
      width: 18, height: 18, flexShrink: 0,
      background: checked || indeterminate ? DARK : '#fff',
      border: `2px solid ${DARK}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 0.15s', padding: 2, margin: -2,
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {indeterminate && !checked && <div style={{ width: 7, height: 2, background: GOLD }} />}
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
        background: active ? DARK : hov && !disabled ? '#FBF5EA' : '#fff',
        border: `1.5px solid ${DARK}`,
        color: active ? GOLD : DARK,
        fontSize: 12, fontWeight: active ? 900 : 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'all 0.15s', flexShrink: 0,
      }}>
      {children}
    </button>
  )
}

export default function TableList({ tables, editingTbl, onEdit, onDelete, onToggle, selectedTables, setSelectedTables }) {
  const [page, setPage] = useState(1)
  const isMobile = useIsMobile(600)
  const isXs     = useIsMobile(400)

  useEffect(() => { setPage(1) }, [tables?.length])

  if (!tables || tables.length === 0) {
    return (
      <div style={{ padding: '56px 16px', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
        <LayoutGrid size={40} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK }}>Aucune table configurée</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: DARK }}>
          Utilisez le formulaire pour ajouter une table.
        </p>
      </div>
    )
  }

  const total      = Math.ceil(tables.length / PAGE_SIZE)
  const safe       = Math.min(page, total)
  const items      = tables.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)
  const allSel     = tables.length > 0 && tables.every(t => selectedTables.includes(t.idx))
  const pageAllSel = items.length > 0 && items.every(t => selectedTables.includes(t.idx))
  const pageSomeSel = items.some(t => selectedTables.includes(t.idx)) && !pageAllSel

  function togglePage() {
    const ids = items.map(t => t.idx)
    if (pageAllSel) setSelectedTables(selectedTables.filter(id => !ids.includes(id)))
    else setSelectedTables([...new Set([...selectedTables, ...ids])])
  }

  function toggleOne(idx) {
    if (selectedTables.includes(idx)) setSelectedTables(selectedTables.filter(i => i !== idx))
    else setSelectedTables([...selectedTables, idx])
  }

  function getPages() {
    if (total <= 1) return [1]
    if (isMobile) {
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
      const p = new Set([1, safe-1, safe, safe+1, total].filter(n => n >= 1 && n <= total))
      const s = [...p].sort((a,b) => a-b)
      const r = []
      s.forEach((n,i) => { if (i > 0 && n - s[i-1] > 1) r.push('…'); r.push(n) })
      return r
    }
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const p = [1]
    if (safe > 3) p.push('…')
    for (let i = Math.max(2, safe-1); i <= Math.min(total-1, safe+1); i++) p.push(i)
    if (safe < total - 2) p.push('…')
    p.push(total)
    return p
  }

  const activeCnt   = tables.filter(t => t.active).length
  const totalCap    = tables.filter(t => t.active).reduce((s, t) => s + parseInt(t.capacity||0), 0)

  return (
    <>
      <style>{`
        @media (hover: hover) { .tbl-row:hover { background: #fdf6ec !important; } }
        .tbl-act-label { display: inline; }
        @media (max-width: 599px) { .tbl-act-label { display: none !important; } }
      `}</style>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
        {[
          { label: 'Total', val: tables.length },
          { label: 'Actives', val: activeCnt },
          { label: 'Capacité', val: `${totalCap} pers.` },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: '10px 14px',
            background: i === 0 ? DARK : i === 1 ? '#3d2d1e' : '#4a3525',
            borderRight: i < 2 ? `1px solid #4a3525` : 'none',
          }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 900, color: '#fff' }}>{s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>

        {/* Partial selection banner */}
        {selectedTables.length > 0 && !allSel && (
          <div style={{ padding: '9px 14px', background: '#fdf6ec', borderBottom: `1px solid #e8d8b0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              {selectedTables.length} sélectionnée{selectedTables.length > 1 ? 's' : ''}
            </span>
            <button onClick={() => setSelectedTables(tables.map(t => t.idx))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: DARK, textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>
              Tout sélectionner ({tables.length})
            </button>
          </div>
        )}

        {/* All selected banner */}
        {allSel && tables.length > PAGE_SIZE && (
          <div style={{ padding: '9px 14px', background: GREEN_BG, borderBottom: `1px solid #b8ddb8`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{tables.length} tables sélectionnées</span>
            <button onClick={() => setSelectedTables([])}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: GREEN, textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>
              Désélectionner tout
            </button>
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '44px 1fr 80px' : '44px 1fr 110px 110px 120px',
          padding: '10px 12px', background: DARK, alignItems: 'center', gap: 8,
        }}>
          <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Table</span>
          {!isMobile && <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Capacité</span>}
          {!isMobile && <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Emplacement</span>}
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Actions</span>
        </div>

        {/* Rows */}
        {items.map((tbl, i) => {
          const selected  = selectedTables.includes(tbl.idx)
          const idx       = (safe - 1) * PAGE_SIZE + i
          const bg        = selected ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM
          const locStyle  = LOC_COLORS[tbl.location] || { bg: '#f5f5f5', color: '#666' }

          return (
            <div key={tbl.idx} className="tbl-row"
              onClick={() => toggleOne(tbl.idx)}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '44px 1fr 80px' : '44px 1fr 110px 110px 120px',
                padding: isMobile ? '13px 12px' : '14px 16px',
                background: bg,
                borderBottom: `1px solid ${BORDER}`,
                borderLeft: `3px solid ${selected ? GOLD : tbl.active ? GOLD : 'transparent'}`,
                alignItems: 'center', gap: 8,
                cursor: 'pointer', transition: 'background 0.12s',
                opacity: tbl.active ? 1 : 0.55,
                userSelect: 'none',
              }}>

              {/* Checkbox */}
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox checked={selected} onChange={() => toggleOne(tbl.idx)} />
              </div>

              {/* Name + mobile tags */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                  <p style={{ margin: 0, fontWeight: 900, color: DARK, fontSize: isMobile ? 13 : 14, letterSpacing: '-0.3px' }}>
                    Table {tbl.number}
                  </p>
                  {!tbl.active && (
                    <span style={{ padding: '1px 7px', background: '#f0f0f0', fontSize: 9, fontWeight: 900, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Inactive
                    </span>
                  )}
                </div>
                {isMobile && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: '#fdf6ec', fontSize: 10, fontWeight: 700, color: GOLD_DK }}>
                      <Users size={9} strokeWidth={2.5} color={GOLD} />{tbl.capacity} pers.
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: locStyle.bg, fontSize: 10, fontWeight: 700, color: locStyle.color }}>
                      <MapPin size={9} strokeWidth={2.5} color={locStyle.color} />{tbl.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Desktop columns */}
              {!isMobile && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 800, color: GOLD_DK }}>
                  <Users size={10} strokeWidth={2.5} color={GOLD} />{tbl.capacity} pers. max
                </span>
              )}
              {!isMobile && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: locStyle.bg, fontSize: 11, fontWeight: 700, color: locStyle.color }}>
                  <MapPin size={10} strokeWidth={2.5} color={locStyle.color} />{tbl.location}
                </span>
              )}

              {/* Actions */}
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {/* Toggle active */}
                <button
  onClick={() => onToggle(tbl)}
  title={tbl.active ? 'Désactiver' : 'Activer'}
  style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 14px', height: 36,
    background: tbl.active ? '#16a34a' : 'rgba(0,0,0,0.06)',
    border: 'none',
    borderRadius: 999,
    color: tbl.active ? '#fff' : '#6b7280',
    fontSize: 12, fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
    transition: 'background 0.18s, color 0.18s, transform 0.1s',
    boxShadow: tbl.active ? '0 1px 6px rgba(22,163,74,0.35)' : 'none',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = tbl.active ? '#15803d' : 'rgba(0,0,0,0.11)'
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = tbl.active ? '#16a34a' : 'rgba(0,0,0,0.06)'
  }}
  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
>
  {tbl.active
    ? <ToggleRight size={16} strokeWidth={2.5} />
    : <ToggleLeft  size={16} strokeWidth={2.5} />
  }
  {tbl.active ? 'Actif' : 'Inactif'}
</button>

                {/* Edit */}
                <button onClick={() => onEdit(tbl)} title="Modifier"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34,
                    background: editingTbl?.idx === tbl.idx ? DARK : 'none',
                    border: `1.5px solid ${editingTbl?.idx === tbl.idx ? DARK : '#ddd'}`,
                    color: editingTbl?.idx === tbl.idx ? GOLD : DARK,
                    cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = DARK }}
                  onMouseLeave={e => {
                    const editing = editingTbl?.idx === tbl.idx
                    e.currentTarget.style.background = editing ? DARK : 'none'
                    e.currentTarget.style.color = editing ? GOLD : DARK
                    e.currentTarget.style.borderColor = editing ? DARK : '#ddd'
                  }}
                >
                  <Pencil size={13} strokeWidth={2.5} />
                </button>

                {/* Delete */}
                <button onClick={() => onDelete(tbl)} title="Supprimer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, background: 'none',
                    border: `1.5px solid #ddd`,
                    color: DARK, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = RED_BG; e.currentTarget.style.color = RED; e.currentTarget.style.borderColor = RED }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK; e.currentTarget.style.borderColor = '#ddd' }}
                >
                  <Trash2 size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )
        })}

        {/* Pagination */}
        {total > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 8, padding: '12px 14px',
            borderTop: `1.5px solid ${BORDER}`, background: CREAM,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: DARK, flexShrink: 0 }}>
              {(safe-1)*PAGE_SIZE+1}–{Math.min(safe*PAGE_SIZE, tables.length)} / {tables.length}
            </span>
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {!isXs && <PageBtn onClick={() => setPage(1)} disabled={safe===1}><ChevronsLeft size={12} strokeWidth={2.5} /></PageBtn>}
              <PageBtn onClick={() => setPage(p => Math.max(1,p-1))} disabled={safe===1}><ChevronLeft size={12} strokeWidth={2.5} /></PageBtn>
              {getPages().map((p,i) =>
                p === '…'
                  ? <span key={`d${i}`} style={{ padding: '0 2px', fontSize: 12, color: DARK, lineHeight: '36px' }}>…</span>
                  : <PageBtn key={p} active={p===safe} onClick={() => setPage(p)}>{p}</PageBtn>
              )}
              <PageBtn onClick={() => setPage(p => Math.min(total,p+1))} disabled={safe===total}><ChevronRight size={12} strokeWidth={2.5} /></PageBtn>
              {!isXs && <PageBtn onClick={() => setPage(total)} disabled={safe===total}><ChevronsRight size={12} strokeWidth={2.5} /></PageBtn>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}