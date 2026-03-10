import { useState } from 'react'
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const STATUS = {
  Confirmed: { bg: '#f0f7f0', color: '#2d6a2d', label: 'Confirmée',  dot: '#16a34a' },
  Pending:   { bg: '#fdf6ec', color: '#a8834e', label: 'En attente', dot: '#c8a97e' },
  Cancelled: { bg: '#fdf0f0', color: '#b94040', label: 'Annulée',    dot: '#dc2626' },
}

const PAGE_SIZES = [10, 25, 50, 100]

function ActionBtn({ onClick, icon: Icon, danger, title }) {
  const [hov, setHov] = useState(false)
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: danger ? (hov ? '#b94040' : '#fdf0f0') : (hov ? DARK : '#f5f0eb'),
        border: 'none', cursor: 'pointer', borderRadius: 6,
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      <Icon size={13} strokeWidth={2.5}
        color={danger ? (hov ? '#fff' : '#b94040') : (hov ? GOLD : DARK)} />
    </button>
  )
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 17, height: 17, borderRadius: 4, flexShrink: 0,
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
        <div style={{ width: 7, height: 2, background: GOLD, borderRadius: 99 }} />
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
        minWidth: 34, height: 34, padding: '0 6px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? DARK : hov && !disabled ? '#f0ebe4' : '#fff',
        border: `1.5px solid ${active ? DARK : '#e8e0d8'}`,
        borderRadius: 8,
        color: active ? GOLD : disabled ? '#ccc' : DARK,
        fontSize: 13, fontWeight: active ? 900 : 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

export default function ReservationsTable({ reservations, openView, openEdit, handleDelete, selectedIds, setSelectedIds }) {
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const totalPages = Math.ceil(reservations.length / pageSize) || 1
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * pageSize
  const pageItems  = reservations.slice(start, start + pageSize)

  const allSelected  = pageItems.length > 0 && pageItems.every(r => selectedIds.includes(r.id))
  const someSelected = pageItems.some(r => selectedIds.includes(r.id)) && !allSelected

  function toggleAll() {
    const pageIds = pageItems.map(r => r.id)
    if (allSelected) setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)))
    else setSelectedIds([...new Set([...selectedIds, ...pageIds])])
  }

  function toggleOne(id) {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id))
    else setSelectedIds([...selectedIds, id])
  }

  // Reset to page 1 when reservations change
  useState(() => { setPage(1) }, [reservations.length])

  // Pagination window
  function getPages() {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push('...')
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #ede8e2', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>

      {/* ── TABLE ── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
          <thead>
            <tr style={{ background: DARK }}>
              <th style={{ padding: '12px 16px', width: 40 }}>
                <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
              </th>
              {[
                { label: 'Nom',       w: 'auto' },
                { label: 'Téléphone', w: 130    },
                { label: 'Date',      w: 110    },
                { label: 'Heure',     w: 80     },
                { label: 'Cvts',      w: 60     },
                { label: 'Service',   w: 120    },
                { label: 'Statut',    w: 110    },
                { label: 'Actions',   w: 100    },
              ].map(col => (
                <th key={col.label} style={{
                  padding: '12px 14px', textAlign: 'left',
                  fontSize: 9, fontWeight: 900, color: GOLD,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', width: col.w,
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((r, i) => {
              const s        = STATUS[r.status] || { bg: '#f5f5f5', color: '#888', label: r.status || '—', dot: '#aaa' }
              const selected = selectedIds.includes(r.id)
              return (
                <tr key={r.id} style={{
                  background: selected ? '#fdf6ec' : i % 2 === 0 ? '#fff' : '#faf8f5',
                  borderBottom: '1px solid #f0ebe4',
                  borderLeft: selected ? `3px solid ${GOLD}` : '3px solid transparent',
                  transition: 'background 0.1s, border-color 0.1s',
                }}>
                  <td style={{ padding: '11px 16px' }}>
                    <Checkbox checked={selected} onChange={() => toggleOne(r.id)} />
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: DARK, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                      {r.name || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 600, color: '#999', whiteSpace: 'nowrap' }}>
                    {r.phone || '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>
                    {r.date || '—'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 44, padding: '3px 8px',
                      background: '#f5f0eb', borderRadius: 6,
                      fontSize: 12, fontWeight: 900, color: GOLD_DARK,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {r.start_time || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, background: '#f5f0eb', borderRadius: 8,
                      fontSize: 12, fontWeight: 900, color: DARK,
                    }}>
                      {r.guests || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#888',
                      background: '#f5f0eb', padding: '3px 8px', borderRadius: 6,
                      whiteSpace: 'nowrap', display: 'inline-block',
                    }}>
                      {r.service || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 99,
                      background: s.bg, fontSize: 10, fontWeight: 800, color: s.color,
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <ActionBtn icon={Eye}    title="Voir"      onClick={() => openView(r)} />
                      <ActionBtn icon={Pencil} title="Modifier"  onClick={() => openEdit(r)} />
                      <ActionBtn icon={Trash2} title="Supprimer" onClick={() => handleDelete(r.id)} danger />
                    </div>
                  </td>
                </tr>
              )
            })}

            {pageItems.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '52px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ccc' }}>Aucune réservation trouvée</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ── */}
      {reservations.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          padding: '14px 18px',
          borderTop: '1.5px solid #f0ebe4',
          background: '#faf8f5',
        }}>

          {/* Left: count + page size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#aaa' }}>
              {start + 1}–{Math.min(start + pageSize, reservations.length)} sur {reservations.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#bbb' }}>Lignes:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                style={{
                  padding: '4px 8px', border: '1.5px solid #e8e0d8',
                  borderRadius: 7, fontSize: 12, fontWeight: 700,
                  color: DARK, background: '#fff', cursor: 'pointer',
                  outline: 'none', fontFamily: 'inherit',
                }}
              >
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Right: page buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <PageBtn onClick={() => setPage(1)} disabled={safePage === 1}>
              <ChevronsLeft size={13} strokeWidth={2.5} />
            </PageBtn>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>
              <ChevronLeft size={13} strokeWidth={2.5} />
            </PageBtn>

            {getPages().map((p, i) =>
              p === '...'
                ? <span key={`dot${i}`} style={{ padding: '0 4px', fontSize: 13, color: '#aaa', userSelect: 'none' }}>…</span>
                : <PageBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PageBtn>
            )}

            <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              <ChevronRight size={13} strokeWidth={2.5} />
            </PageBtn>
            <PageBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>
              <ChevronsRight size={13} strokeWidth={2.5} />
            </PageBtn>
          </div>

        </div>
      )}
    </div>
  )
}