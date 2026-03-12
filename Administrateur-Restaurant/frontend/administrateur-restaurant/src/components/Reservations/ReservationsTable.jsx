import { useState, useEffect, useRef } from 'react'
import {
  Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  CalendarDays, Clock3, Users, Utensils,
} from 'lucide-react'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = '#ede8e2'

const STATUS = {
  Confirmed: { bg: '#f0f7f0', color: '#2d6a2d', label: 'Confirmée',  dot: '#16a34a' },
  Pending:   { bg: '#fdf6ec', color: '#a8834e', label: 'En attente', dot: '#c8a97e' },
  Cancelled: { bg: '#fdf0f0', color: '#b94040', label: 'Annulée',    dot: '#dc2626' },
}

const PAGE_SIZES = [10, 25, 50, 100]

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

function ActionBtn({ onClick, icon: Icon, danger, title }) {
  const [hov, setHov] = useState(false)
  return (
    <button title={title} onClick={e => { e.stopPropagation(); onClick() }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: danger ? (hov ? '#b94040' : '#fdf0f0') : (hov ? DARK : '#f5f0eb'),
        border: 'none', cursor: 'pointer',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      <Icon size={13} strokeWidth={2.5}
        color={danger ? (hov ? '#fff' : '#b94040') : (hov ? GOLD : DARK)} />
    </button>
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
      }}
    >
      {children}
    </button>
  )
}

function MobileCard({ r, selected, highlighted, onToggle, openView, openEdit, handleDelete, rowRef }) {
  const s = STATUS[r.status] || { bg: '#f5f5f5', color: '#888', label: r.status || '—', dot: '#aaa' }
  return (
    <div ref={rowRef} style={{
      background: highlighted ? '#fff8ec' : selected ? '#fdf6ec' : '#fff',
      borderLeft: `3px solid ${highlighted ? GOLD : selected ? GOLD : 'transparent'}`,
      borderBottom: `1px solid ${BORDER}`,
      padding: '14px 16px',
      transition: 'all 0.15s',
      position: 'relative',
    }}>
      {/* "Sélectionnée" badge */}
      {highlighted && (
        <div style={{
          position: 'absolute', top: 10, right: 14,
          fontSize: 9, fontWeight: 900, color: GOLD_DARK,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: '#fdf6ec', padding: '2px 7px',
          border: `1px solid ${GOLD}55`,
        }}>
          Sélectionnée
        </div>
      )}
      {/* Row 1: checkbox + name + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Checkbox checked={selected} onChange={onToggle} />
        <div style={{ flex: 1, minWidth: 0, paddingRight: highlighted ? 90 : 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.name || '—'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 600, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.phone || r.email || '—'}
          </p>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px',
          background: s.bg, fontSize: 10, fontWeight: 800, color: s.color,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
          {s.label}
        </span>
      </div>

      {/* Row 2: chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {[
          { Icon: CalendarDays, value: r.date,       gold: false },
          { Icon: Clock3,       value: r.start_time, gold: false },
          { Icon: Users,        value: r.guests ? `${r.guests} personnes` : null, gold: false },
          { Icon: Utensils,     value: r.service,    gold: true  },
        ].filter(item => item.value).map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px',
            background: item.gold ? '#f5f0eb' : CREAM,
            fontSize: 11, fontWeight: 700,
            color: item.gold ? GOLD_DARK : DARK,
          }}>
            <item.Icon size={11} strokeWidth={2.5} color={item.gold ? GOLD_DARK : '#999'} />
            {item.value}
          </span>
        ))}
      </div>

      {/* Row 3: actions */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => openView(r)} style={{
          flex: 1, padding: '8px',
          background: highlighted ? GOLD : '#f5f0eb', border: 'none',
          fontSize: 11, fontWeight: 700, color: highlighted ? DARK : DARK,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          fontFamily: 'inherit',
        }}>
          <Eye size={12} strokeWidth={2.5} /> Voir
        </button>
        <button onClick={() => openEdit(r)} style={{
          flex: 1, padding: '8px',
          background: DARK, border: 'none',
          fontSize: 11, fontWeight: 700, color: GOLD,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          fontFamily: 'inherit',
        }}>
          <Pencil size={12} strokeWidth={2.5} /> Modifier
        </button>
        <button onClick={() => handleDelete(r.id)} style={{
          width: 36, padding: '8px',
          background: '#fdf0f0', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trash2 size={12} strokeWidth={2.5} color="#b94040" />
        </button>
      </div>
    </div>
  )
}


function TableRow({ r, i, selected, highlighted, highlightRef, toggleOne, openView, openEdit, handleDelete }) {
  const [hov, setHov] = useState(false)
  const s = STATUS[r.status] || { bg: '#f5f5f5', color: '#888', label: r.status || '—', dot: '#aaa' }

  let rowBg = i % 2 === 0 ? '#fff' : CREAM
  if (selected)    rowBg = '#fdf6ec'
  if (highlighted) rowBg = '#fff8ec'
  const bg = (!selected && !highlighted && hov) ? '#f5ede0' : rowBg

  return (
    <tr
      ref={highlighted ? highlightRef : null}
      className={highlighted ? 'row-highlighted' : ''}
      onClick={() => toggleOne(r.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: bg,
        borderBottom: `1px solid ${BORDER}`,
        borderLeft: highlighted
          ? `4px solid ${GOLD}`
          : selected
          ? `4px solid ${GOLD}88`
          : hov ? `4px solid ${GOLD}44` : '4px solid transparent',
        transition: 'background 0.12s, border-color 0.12s',
        cursor: 'pointer',
      }}
    >
      <td style={{ padding: '11px 16px' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={() => toggleOne(r.id)} />
      </td>
      <td style={{ padding: '11px 14px' }}>
        <span style={{
          fontSize: 13, fontWeight: highlighted ? 900 : 800,
          color: highlighted ? GOLD_DARK : DARK,
          display: 'block', maxWidth: 160,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {r.name || '—'}
        </span>
        {highlighted && (
          <span style={{
            fontSize: 9, fontWeight: 900, color: GOLD,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            ← depuis tableau de bord
          </span>
        )}
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
          padding: '3px 8px', background: highlighted ? `${GOLD}22` : '#f5f0eb',
          fontSize: 12, fontWeight: 900, color: GOLD_DARK, fontVariantNumeric: 'tabular-nums',
        }}>
          {r.start_time || '—'}
        </span>
      </td>
      <td style={{ padding: '11px 14px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26,
          background: highlighted ? `${GOLD}22` : '#f5f0eb',
          fontSize: 12, fontWeight: 900, color: DARK,
        }}>
          {r.guests || '—'}
        </span>
      </td>
      <td style={{ padding: '11px 14px' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#888',
          background: '#f5f0eb', padding: '3px 8px',
          whiteSpace: 'nowrap', display: 'inline-block',
        }}>
          {r.service || '—'}
        </span>
      </td>
      <td style={{ padding: '11px 14px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px',
          background: s.bg, fontSize: 10, fontWeight: 800, color: s.color, whiteSpace: 'nowrap',
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
}

export default function ReservationsTable({
  reservations, openView, openEdit, handleDelete,
  selectedIds, setSelectedIds,
  highlightId,
}) {
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const highlightRef = useRef(null)

  useEffect(() => { setPage(1) }, [reservations.length])

  // When highlightId changes, jump to the right page and scroll to that row
  useEffect(() => {
    if (!highlightId) return
    const idx = reservations.findIndex(r => r.id === highlightId)
    if (idx === -1) return
    const targetPage = Math.floor(idx / pageSize) + 1
    setPage(targetPage)
    // Scroll after render
    setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 120)
  }, [highlightId, pageSize, reservations])

  const totalPages = Math.ceil(reservations.length / pageSize) || 1
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * pageSize
  const pageItems  = reservations.slice(start, start + pageSize)

  const allSelected  = reservations.length > 0 && reservations.every(r => selectedIds.includes(r.id))
  const someSelected = selectedIds.length > 0 && !allSelected
  const pageAllSel   = pageItems.length > 0 && pageItems.every(r => selectedIds.includes(r.id))
  const pageSomeSel  = pageItems.some(r => selectedIds.includes(r.id)) && !pageAllSel

  function toggleAll()  {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(reservations.map(r => r.id))
  }
  function togglePage() {
    const ids = pageItems.map(r => r.id)
    if (pageAllSel) setSelectedIds(selectedIds.filter(id => !ids.includes(id)))
    else setSelectedIds([...new Set([...selectedIds, ...ids])])
  }
  function toggleOne(id) {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id))
    else setSelectedIds([...selectedIds, id])
  }

  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (safePage > 3) pages.push('...')
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
    if (safePage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <>
      <style>{`
        .res-table-wrap { display: block; }
        .res-cards-wrap { display: none;  }
        @media (max-width: 700px) {
          .res-table-wrap { display: none;  }
          .res-cards-wrap { display: block; }
        }
        @keyframes pulse-gold {
          0%   { box-shadow: inset 3px 0 0 ${GOLD}, 0 0 0 3px ${GOLD}33; }
          50%  { box-shadow: inset 3px 0 0 ${GOLD}, 0 0 0 6px ${GOLD}11; }
          100% { box-shadow: inset 3px 0 0 ${GOLD}, 0 0 0 3px ${GOLD}33; }
        }
        .row-highlighted {
          animation: pulse-gold 1.8s ease 2;
        }
      `}</style>

      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>

        {/* Select-all banner */}
        {someSelected && (
          <div style={{
            padding: '9px 16px', background: '#fdf6ec',
            borderBottom: `1px solid #e8d8b0`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD_DARK }}>
              {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''} sur cette page
            </span>
            <button onClick={toggleAll} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 800, color: DARK,
              textDecoration: 'underline', fontFamily: 'inherit', padding: 0,
            }}>
              Sélectionner les {reservations.length} réservations
            </button>
          </div>
        )}

        {allSelected && reservations.length > pageSize && (
          <div style={{
            padding: '9px 16px', background: '#f0f7f0',
            borderBottom: `1px solid #b8ddb8`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2d6a2d' }}>
              Toutes les {reservations.length} réservations sélectionnées
            </span>
            <button onClick={() => setSelectedIds([])} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 800, color: '#2d6a2d',
              textDecoration: 'underline', fontFamily: 'inherit', padding: 0,
            }}>
              Désélectionner tout
            </button>
          </div>
        )}

        {/* ── HIGHLIGHT BANNER ── */}
        {highlightId && pageItems.some(r => r.id === highlightId) && (
          <div style={{
            padding: '9px 16px',
            background: '#fff8ec',
            borderBottom: `2px solid ${GOLD}66`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: GOLD, flexShrink: 0,
              boxShadow: `0 0 0 3px ${GOLD}33`,
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD_DARK }}>
              Réservation sélectionnée depuis le tableau de bord
            </span>
          </div>
        )}

        {/* ── DESKTOP TABLE ── */}
        <div className="res-table-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
            <thead>
              <tr style={{ background: DARK }}>
                <th style={{ padding: '12px 16px', width: 40 }}>
                  <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
                </th>
                {['Nom', 'Téléphone', 'Date', 'Heure', 'Personnes', 'Service', 'Statut', 'Actions'].map(c => (
                  <th key={c} style={{
                    padding: '12px 14px', textAlign: 'left',
                    fontSize: 9, fontWeight: 900, color: GOLD,
                    letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r, i) => (
                <TableRow
                  key={r.id} r={r} i={i}
                  selected={selectedIds.includes(r.id)}
                  highlighted={r.id === highlightId}
                  highlightRef={highlightRef}
                  toggleOne={toggleOne}
                  openView={openView} openEdit={openEdit} handleDelete={handleDelete}
                />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '52px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#ccc' }}>
                    Aucune réservation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="res-cards-wrap">
          <div style={{
            padding: '11px 16px', background: DARK,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', flex: 1 }}>
              {selectedIds.length > 0 ? `${selectedIds.length} sélectionné${selectedIds.length > 1 ? 's' : ''}` : 'Sélectionner la page'}
            </span>
            {someSelected && (
              <button onClick={toggleAll} style={{
                background: 'none', border: `1px solid rgba(200,169,126,0.4)`,
                padding: '4px 10px',
                fontSize: 10, fontWeight: 700, color: GOLD,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Tout ({reservations.length})
              </button>
            )}
          </div>

          {pageItems.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#ccc' }}>
              Aucune réservation trouvée
            </div>
          ) : pageItems.map(r => (
            <MobileCard
              key={r.id} r={r}
              selected={selectedIds.includes(r.id)}
              highlighted={r.id === highlightId}
              rowRef={r.id === highlightId ? highlightRef : null}
              onToggle={() => toggleOne(r.id)}
              openView={openView} openEdit={openEdit} handleDelete={handleDelete}
            />
          ))}
        </div>

        {/* ── PAGINATION ── */}
        {reservations.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 10,
            padding: '12px 16px',
            borderTop: `1.5px solid ${BORDER}`,
            background: CREAM,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#aaa' }}>
                {start + 1}–{Math.min(start + pageSize, reservations.length)} / {reservations.length}
              </span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                style={{
                  padding: '4px 8px', border: `1.5px solid ${BORDER}`,
                  fontSize: 12, fontWeight: 700,
                  color: DARK, background: '#fff', cursor: 'pointer',
                  outline: 'none', fontFamily: 'inherit',
                }}
              >
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <PageBtn onClick={() => setPage(1)} disabled={safePage === 1}><ChevronsLeft size={12} strokeWidth={2.5} /></PageBtn>
              <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}><ChevronLeft size={12} strokeWidth={2.5} /></PageBtn>
              {getPages().map((p, i) =>
                p === '...'
                  ? <span key={`d${i}`} style={{ padding: '0 4px', fontSize: 12, color: '#bbb', userSelect: 'none' }}>…</span>
                  : <PageBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PageBtn>
              )}
              <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}><ChevronRight size={12} strokeWidth={2.5} /></PageBtn>
              <PageBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages}><ChevronsRight size={12} strokeWidth={2.5} /></PageBtn>
            </div>
          </div>
        )}
      </div>
    </>
  )
}