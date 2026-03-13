import { useState, useEffect } from 'react'
import {
  Pencil, Trash2, LayoutGrid, Users, MapPin,
  ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'

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
    <div
      onClick={e => { e.stopPropagation(); onChange() }}
      style={{
        width: 18, height: 18, flexShrink: 0,
        background: checked || indeterminate ? DARK : '#fff',
        border: `2px solid ${DARK}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && <div style={{ width: 7, height: 2, background: GOLD }} />}
    </div>
  )
}

function PageBtn({ onClick, disabled, active, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick} disabled={disabled}
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
      }}
    >
      {children}
    </button>
  )
}

/* ── Single table row — mirrors ServiceRow exactly ── */
function TableRow({ tbl, isEditing, isSelected, onEdit, onDelete, onToggle, onSelect, idx }) {
  const locStyle = LOC_COLORS[tbl.location] || { bg: '#f5f5f5', color: '#666' }
  const bg = isSelected ? '#fdf6ec' : isEditing ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM

  return (
    <div
      className="tbl-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '40px minmax(auto, 1fr) auto',
        background: bg,
        borderBottom: `1px solid #e8e0d8`,
        borderLeft: `3px solid ${isSelected || isEditing ? GOLD : 'transparent'}`,
        transition: 'background 0.12s',
        opacity: tbl.active ? 1 : 0.6,
      }}
    >
      {/* Checkbox cell */}
      <div
        onClick={e => { e.stopPropagation(); onSelect() }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', borderRight: `1px solid #e8e0d8`,
        }}
      >
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>

      {/* Content cell */}
      <div style={{ padding: '14px 16px' }}>
        {/* Name + inactive badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
            Table {tbl.number}
          </p>
          {!tbl.active && (
            <span style={{
              padding: '2px 8px', background: '#f0f0f0',
              fontSize: 9, fontWeight: 900, color: '#999',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Inactive
            </span>
          )}
        </div>

        {/* Tags — capacity + location */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', background: '#fdf6ec',
            fontSize: 11, fontWeight: 800, color: GOLD_DK,
            whiteSpace: 'nowrap',
          }}>
            <Users size={10} strokeWidth={2.5} color={GOLD} />
            {tbl.capacity} pers. max
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', background: locStyle.bg,
            fontSize: 11, fontWeight: 700, color: locStyle.color,
            whiteSpace: 'nowrap',
          }}>
            <MapPin size={10} strokeWidth={2.5} color={locStyle.color} />
            {tbl.location}
          </span>
        </div>
      </div>

      {/* Actions cell — stacked like ServiceRow */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid #e8e0d8` }}>

        {/* Toggle */}
        <ToggleActionBtn tbl={tbl} onToggle={onToggle} />

        {/* Edit */}
        <button
          onClick={() => onEdit(tbl)}
          title="Modifier"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 18px', minHeight: 36,
            background: isEditing ? '#fdf6ec' : 'none',
            border: 'none', borderBottom: `1px solid #e8e0d8`,
            color: isEditing ? GOLD : DARK,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isEditing ? '#fdf6ec' : 'none'
            e.currentTarget.style.color = isEditing ? GOLD : DARK
          }}
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(tbl)}
          title="Supprimer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 18px', minHeight: 36,
            background: 'none', border: 'none',
            color: DARK, cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = RED_BG; e.currentTarget.style.color = RED }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK }}
        >
          <Trash2 size={13} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  )
}

/* Toggle button — top slot of the actions column */
function ToggleActionBtn({ tbl, onToggle }) {
  const isActive = tbl.active
  return (
    <button
      onClick={() => onToggle(tbl)}
      title={isActive ? 'Désactiver' : 'Activer'}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '0 14px', minHeight: 36,
        background: isActive ? GREEN_BG : 'none',
        border: 'none', borderBottom: `1px solid #e8e0d8`,
        color: isActive ? GREEN : '#bbb',
        cursor: 'pointer', transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isActive ? RED_BG : GREEN_BG
        e.currentTarget.style.color      = isActive ? RED    : GREEN
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isActive ? GREEN_BG : 'none'
        e.currentTarget.style.color      = isActive ? GREEN   : '#bbb'
      }}
    >
      {isActive
        ? <ToggleRight size={14} strokeWidth={2.5} />
        : <ToggleLeft  size={14} strokeWidth={2.5} />
      }
      <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    </button>
  )
}

export default function TableList({ tables, editingTbl, onEdit, onDelete, onToggle, selectedTables, setSelectedTables }) {
  const [page, setPage] = useState(1)
  const isXs = useIsMobile(400)

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

  const total       = Math.ceil(tables.length / PAGE_SIZE)
  const safe        = Math.min(page, total)
  const items       = tables.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)
  const allSel      = tables.length > 0 && tables.every(t => selectedTables.includes(t.idx))
  const pageAllSel  = items.length > 0 && items.every(t => selectedTables.includes(t.idx))
  const pageSomeSel = items.some(t => selectedTables.includes(t.idx)) && !pageAllSel

  const activeCnt = tables.filter(t => t.active).length
  const totalCap  = tables.filter(t => t.active).reduce((s, t) => s + parseInt(t.capacity || 0), 0)

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
      <style>{`@media (hover: hover) { .tbl-row:hover { background: #fdf6ec !important; } }`}</style>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
        {[
          { label: 'Total',    val: tables.length },
          { label: 'Actives',  val: activeCnt },
          { label: 'Capacité', val: `${totalCap} pers` },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1,
            padding: '10px 18px',
            background: i === 0 ? DARK : i === 1 ? '#3d2d1e' : '#4a3525',
            borderRight: i < 2 ? `1px solid #4a3525` : 'none',
            overflow: 'visible',
          }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap' }}>{s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${BORDER}`, overflow: 'hidden' }}>

        {/* Partial selection banner */}
        {selectedTables.length > 0 && !allSel && (
          <div style={{ padding: '9px 14px', background: '#fdf6ec', borderBottom: `1px solid #e8d8b0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              {selectedTables.length} sélectionnée{selectedTables.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSelectedTables(tables.map(t => t.idx))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: DARK, textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}
            >
              Tout sélectionner ({tables.length})
            </button>
          </div>
        )}

        {/* All selected banner */}
        {allSel && tables.length > PAGE_SIZE && (
          <div style={{ padding: '9px 14px', background: GREEN_BG, borderBottom: `1px solid #b8ddb8`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{tables.length} tables sélectionnées</span>
            <button
              onClick={() => setSelectedTables([])}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: GREEN, textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}
            >
              Désélectionner tout
            </button>
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '40px minmax(auto, 1fr) auto',
          padding: '10px 16px', background: DARK, alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Nom de la table
          </span>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase', paddingRight: 4 }}>
            Actions
          </span>
        </div>

        {/* Rows */}
        {items.map((tbl, i) => (
          <TableRow
            key={tbl.idx}
            tbl={tbl}
            idx={(safe - 1) * PAGE_SIZE + i}
            isEditing={editingTbl?.idx === tbl.idx}
            isSelected={selectedTables.includes(tbl.idx)}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onSelect={() => toggleOne(tbl.idx)}
          />
        ))}

        {/* Pagination */}
        {total > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 8, padding: '12px 14px',
            borderTop: `1.5px solid ${BORDER}`, background: CREAM,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: DARK, flexShrink: 0 }}>
              {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, tables.length)} / {tables.length}
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