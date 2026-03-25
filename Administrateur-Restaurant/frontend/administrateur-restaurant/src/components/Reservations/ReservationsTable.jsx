
import AssignTableModal from './AssignTableModal'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = '#e8e0d8'

const STATUS = {
  Confirmed: { bg: '#00A651', color: '#fff', label: 'Confirmée' },
  Pending:   { bg: '#c8a97e', color: '#fff', label: 'En attente' },
  Cancelled: { bg: '#FF0000', color: '#fff', label: 'Annulée'   },
}

const PAGE_SIZES = [10, 25, 50, 100]

function trunc(str, max = 14) {
  if (!str) return '—'
  return str.length > max ? str.slice(0, max) + '…' : str
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={{
      width: 17, height: 17, flexShrink: 0,
      background: checked || indeterminate ? DARK : '#fff',
      border: `2px solid ${DARK}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
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

function ActionBtn({ onClick, label, danger, title }) {
  return (
    <button title={title} onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: danger ? '#FF0000' : DARK,
        border: 'none', cursor: 'pointer', flexShrink: 0,
        color: danger ? '#fff' : GOLD, fontSize: 10, fontWeight: 900, textTransform: 'uppercase'
      }}
    >
      {label}
    </button>
  )
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 6px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? DARK : '#fff',
        border: `1.5px solid ${DARK}`,
        color: active ? GOLD : DARK,
        fontSize: 12, fontWeight: active ? 900 : 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

// ── Assign table cell — inline compact button ──────────────────────
function AssignTableCell({ r, onOpenAssign }) {
  const hasTable = !!r.table_idx

  return (
    <button
      onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '5px 10px',
        background: hasTable ? '#00A651' : GOLD,
        border: `none`,
        fontSize: 11, fontWeight: 900,
        color: hasTable ? '#fff' : DARK,
        cursor: 'pointer', fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {hasTable ? `Table ${r.table_idx}` : 'Assigner table'}
    </button>
  )
}

// ── Mobile card ────────────────────────────────────────────────────
function MobileCard({ r, selected, highlighted, onToggle, openView, openEdit, handleDelete, rowRef, onOpenAssign }) {
  const s = STATUS[r.status] || { bg: '#fdf6ec', color: DARK, label: r.status || '—', dot: '#c8a97e' }
  return (
    <div ref={rowRef} style={{
      background: highlighted ? '#fff8ec' : selected ? '#fdf6ec' : '#fff',
      borderLeft: `3px solid ${highlighted ? GOLD : selected ? GOLD : 'transparent'}`,
      borderBottom: `1px solid ${BORDER}`,
      padding: '14px 16px', position: 'relative',
    }}>
      {highlighted && (
        <div style={{ position: 'absolute', top: 10, right: 14, fontSize: 9, fontWeight: 900, color: GOLD_DARK, letterSpacing: '0.12em', textTransform: 'uppercase', background: '#fdf6ec', padding: '2px 7px', border: `1px solid ${GOLD}55` }}>
          Sélectionnée
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Checkbox checked={selected} onChange={onToggle} />
        <div style={{ flex: 1, minWidth: 0, paddingRight: highlighted ? 90 : 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name || '—'}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 700, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.phone || r.email || '—'}</p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: s.bg, fontSize: 10, fontWeight: 800, color: s.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
          {s.label}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {[
          { value: r.date },
          { value: r.start_time },
          { value: r.guests ? `${r.guests}p` : null },
          { value: r.service ? trunc(r.service, 16) : null, gold: true },
        ].filter(item => item.value).map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', background: item.gold ? GOLD : CREAM, fontSize: 11, fontWeight: 800, color: DARK }}>
            {item.value}
          </span>
        ))}
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => openView(r)} style={{ flex: 1, padding: '10px', background: GOLD, border: 'none', fontSize: 11, fontWeight: 900, color: DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit' }}>
          VOIR
        </button>
        <button onClick={() => openEdit(r)} style={{ flex: 1, padding: '10px', background: DARK, border: 'none', fontSize: 11, fontWeight: 900, color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit' }}>
          MODIFIER
        </button>
        <button onClick={() => handleDelete(r.id)} style={{ width: 64, padding: '10px', background: '#FF0000', border: 'none', color: '#fff', fontSize: 10, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          SUPPR
        </button>
      </div>
    </div>
  )
}

// ── Desktop row ────────────────────────────────────────────────────
function TableRow({ r, i, selected, highlighted, highlightRef, toggleOne, openView, openEdit, handleDelete, onOpenAssign }) {
  const [hov, setHov] = useState(false)
  const s = STATUS[r.status] || { bg: '#fdf6ec', color: DARK, label: r.status || '—', dot: '#c8a97e' }

  let rowBg = i % 2 === 0 ? '#fff' : CREAM
  if (selected)    rowBg = '#fdf6ec'
  if (highlighted) rowBg = '#fff8ec'
  const bg = (!selected && !highlighted && hov) ? '#f5ede0' : rowBg
  const cell = { padding: '9px 8px' }

  return (
    <tr
      ref={highlighted ? highlightRef : null}
      className={highlighted ? 'row-highlighted' : ''}
      onClick={() => toggleOne(r.id)}
      style={{
        background: bg, borderBottom: `1px solid ${BORDER}`,
        borderLeft: highlighted ? `4px solid ${GOLD}` : selected ? `4px solid ${GOLD}` : '4px solid transparent',
        cursor: 'pointer',
      }}
    >
      <td style={{ ...cell, width: 36, padding: '9px 10px' }} onClick={e => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={() => toggleOne(r.id)} />
      </td>
      <td style={cell}>
        <span style={{ fontSize: 12, fontWeight: highlighted ? 900 : 800, color: highlighted ? GOLD_DARK : DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>
          {r.name || '—'}
        </span>
      </td>
      <td style={cell}>
        <span style={{ fontSize: 11, fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>
          {r.phone || '—'}
        </span>
      </td>
      <td style={cell}>
        <span style={{ fontSize: 11, fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>
          {r.date || '—'}
        </span>
      </td>
      <td style={cell}>
        <span style={{ display: 'inline-flex', padding: '3px 7px', background: highlighted ? GOLD : '#f5f0eb', fontSize: 11, fontWeight: 800, color: DARK, whiteSpace: 'nowrap' }}>
          {r.start_time || '—'}
        </span>
      </td>
      <td style={cell}>
        <span style={{ fontSize: 11, fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>
          {r.guests || '—'}
        </span>
      </td>
      <td style={cell}>
        <span style={{ display: 'inline-flex', padding: '3px 7px', background: '#f5f0eb', fontSize: 11, fontWeight: 800, color: DARK, maxWidth: 110, overflow: 'hidden' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.service || '—'}</span>
        </span>
      </td>
      {/* TABLE — always visible, compact */}
      <td style={cell} onClick={e => e.stopPropagation()}>
        <AssignTableCell r={r} onOpenAssign={onOpenAssign} />
      </td>
      <td style={cell}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', background: s.bg, fontSize: 10, fontWeight: 900, color: s.color, whiteSpace: 'nowrap' }}>
          {s.label}
        </span>
      </td>
      <td style={{ ...cell, padding: '9px 10px' }}>
        <div style={{ display: 'flex', gap: 3 }}>
          <ActionBtn label="VOIR"    title="Voir"      onClick={() => openView(r)} />
          <ActionBtn label="EDIT"    title="Modifier"  onClick={() => openEdit(r)} />
          <ActionBtn label="SUPPR"   title="Supprimer" onClick={() => handleDelete(r.id)} danger />
        </div>
      </td>
    </tr>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function ReservationsTable({
  reservations, openView, openEdit, handleDelete,
  selectedIds, setSelectedIds, highlightId, onTableAssigned,
}) {
  const [page,         setPage]         = useState(1)
  const [pageSize,     setPageSize]     = useState(25)
  const [assignTarget, setAssignTarget] = useState(null)
  const highlightRef = useRef(null)

  useEffect(() => { setPage(1) }, [reservations.length])

  useEffect(() => {
    if (!highlightId) return
    const idx = reservations.findIndex(r => r.id === highlightId)
    if (idx === -1) return
    setPage(Math.floor(idx / pageSize) + 1)
    setTimeout(() => { highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 120)
  }, [highlightId, pageSize, reservations])

  const totalPages = Math.ceil(reservations.length / pageSize) || 1
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * pageSize
  const pageItems  = reservations.slice(start, start + pageSize)

  const allSelected  = reservations.length > 0 && reservations.every(r => selectedIds.includes(r.id))
  const someSelected = selectedIds.length > 0 && !allSelected
  const pageAllSel   = pageItems.length > 0 && pageItems.every(r => selectedIds.includes(r.id))
  const pageSomeSel  = pageItems.some(r => selectedIds.includes(r.id)) && !pageAllSel

  function toggleAll()  { if (allSelected) setSelectedIds([]); else setSelectedIds(reservations.map(r => r.id)) }
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

  // ── Column definitions — NO responsive hiding, use scroll instead
  const HEADERS = [
    { label: 'Nom'       },
    { label: 'Tél.'      },
    { label: 'Date'      },
    { label: 'Heure'     },
    { label: 'Pers.'     },
    { label: 'Service'   },
    { label: 'Table'     },
    { label: 'Statut'    },
    { label: 'Actions'   },
  ]

  return (
    <>
      <style>{`
        .res-table-wrap { display: block; }
        .res-cards-wrap { display: none;  }
        @media (max-width: 700px) {
          .res-table-wrap { display: none; }
          .res-cards-wrap { display: block; }
        }
        @keyframes pulse-gold {
          0%,100% { box-shadow: inset 3px 0 0 ${GOLD}, 0 0 0 3px ${GOLD}33; }
          50%     { box-shadow: inset 3px 0 0 ${GOLD}, 0 0 0 6px ${GOLD}11; }
        }
        .row-highlighted { animation: pulse-gold 1.8s ease 2; }
      `}</style>

      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>

        {someSelected && (
          <div style={{ padding: '9px 16px', background: '#fdf6ec', borderBottom: `1px solid #e8d8b0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD_DARK }}>{selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}</span>
            <button onClick={toggleAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: DARK, textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>
              Sélectionner les {reservations.length} réservations
            </button>
          </div>
        )}

        {allSelected && reservations.length > pageSize && (
          <div style={{ padding: '9px 16px', background: '#f0fdf4', borderBottom: `1px solid #bbf7d0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>Toutes les {reservations.length} réservations sélectionnées</span>
            <button onClick={() => setSelectedIds([])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: '#16a34a', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>
              Désélectionner tout
            </button>
          </div>
        )}

        {highlightId && pageItems.some(r => r.id === highlightId) && (
          <div style={{ padding: '9px 16px', background: '#fff8ec', borderBottom: `2px solid ${GOLD}66`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, flexShrink: 0, boxShadow: `0 0 0 3px ${GOLD}33` }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD_DARK }}>Réservation sélectionnée depuis le tableau de bord</span>
          </div>
        )}

        {/* Desktop — horizontal scroll, ALL columns always visible */}
        <div className="res-table-wrap" style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: DARK }}>
                <th style={{ padding: '11px 10px', width: 36 }}>
                  <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
                </th>
                {HEADERS.map(({ label }) => (
                  <th key={label} style={{ padding: '11px 8px', textAlign: 'left', fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {label}
                  </th>
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
                  onOpenAssign={setAssignTarget}
                />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '52px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: DARK }}>
                    Aucune réservation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="res-cards-wrap">
          <div style={{ padding: '11px 16px', background: DARK, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', flex: 1 }}>
              {selectedIds.length > 0 ? `${selectedIds.length} sélectionné${selectedIds.length > 1 ? 's' : ''}` : 'Sélectionner la page'}
            </span>
            {someSelected && (
              <button onClick={toggleAll} style={{ background: 'none', border: `1px solid rgba(200,169,126,0.4)`, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: GOLD, cursor: 'pointer', fontFamily: 'inherit' }}>
                Tout ({reservations.length})
              </button>
            )}
          </div>
          {pageItems.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: DARK }}>Aucune réservation trouvée</div>
          ) : pageItems.map(r => (
            <MobileCard key={r.id} r={r}
              selected={selectedIds.includes(r.id)} highlighted={r.id === highlightId}
              rowRef={r.id === highlightId ? highlightRef : null}
              onToggle={() => toggleOne(r.id)}
              openView={openView} openEdit={openEdit} handleDelete={handleDelete}
              onOpenAssign={setAssignTarget}
            />
          ))}
        </div>

        {/* Pagination */}
        {reservations.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '12px 16px', borderTop: `1.5px solid ${BORDER}`, background: CREAM }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: DARK }}>
                {start + 1}–{Math.min(start + pageSize, reservations.length)} / {reservations.length}
              </span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                style={{ padding: '4px 8px', border: `1.5px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: DARK, background: '#fff', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <PageBtn onClick={() => setPage(1)} disabled={safePage === 1}>«</PageBtn>
              <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>‹</PageBtn>
              {getPages().map((p, i) =>
                p === '...'
                  ? <span key={`d${i}`} style={{ padding: '0 4px', fontSize: 12, color: DARK, userSelect: 'none' }}>…</span>
                  : <PageBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PageBtn>
              )}
              <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>›</PageBtn>
              <PageBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>»</PageBtn>
            </div>
          </div>
        )}
      </div>

      {assignTarget && (
        <AssignTableModal
          reservation={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={updated => {
            if (onTableAssigned) onTableAssigned(updated)
            setAssignTarget(null)
          }}
        />
      )}
    </>
  )
}