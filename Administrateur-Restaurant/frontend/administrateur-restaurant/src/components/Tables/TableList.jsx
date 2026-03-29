import { useState, useEffect } from 'react'
import {
  Pencil, Trash2, LayoutGrid, Users, MapPin,
  ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../styles/tables/TableList.css'
import { DARK, GOLD, GOLD_DK, LOC_COLORS } from '../../styles/tables/tokens'

const PAGE_SIZE = 10

function useIsMobile(bp = 600) {
  const [v, setV] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < bp : false
  )
  useEffect(() => {
    const h = () => setV(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return v
}

// ─── Checkbox ────────────────────────────────────────────────────
function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange() }}
      className="tbl-checkbox"
      style={{ background: checked || indeterminate ? DARK : '#fff' }}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div style={{ width: 7, height: 4, background: GOLD }} />
      )}
    </div>
  )
}

// ─── PageBtn ─────────────────────────────────────────────────────
function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`tbl-page-btn ${active ? 'tbl-page-btn--active' : ''}`}
    >
      {children}
    </button>
  )
}

// ─── TableRow ────────────────────────────────────────────────────
function TableRow({ tbl, isEditing, isSelected, onEdit, onDelete, onToggle, onSelect, idx }) {
  const { t } = useTranslation()
  const locStyle = LOC_COLORS[tbl.location] || { bg: '#f5f5f5', color: '#666' }
  const bg = isSelected ? '#ffffff' : isEditing ? '#ffffff' : idx % 2 === 0 ? '#fff' : '#ffffff'

  return (
    <div
      className={`tbl-row ${!tbl.active ? 'tbl-row--inactive' : ''}`}
      style={{
        background: bg,
        borderLeft: `3px solid ${isSelected || isEditing ? GOLD : 'transparent'}`,
      }}
    >
      {/* Checkbox */}
      <div className="tbl-row__check-cell" onClick={e => { e.stopPropagation(); onSelect() }}>
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>

      {/* Content */}
      <div className="tbl-row__content">
        <div className="tbl-row__name-row">
          <p className="tbl-row__name">
            {t('tables_module.header_table', { defaultValue: 'Table' })} {tbl.number}
          </p>
          {!tbl.active && (
            <span className="tbl-row__inactive-badge">{t('tables_module.inactive')}</span>
          )}
        </div>
        <div className="tbl-row__tags">
          <span className="tbl-row__tag" style={{ background: '#ffffff', color: GOLD_DK }}>
            <Users size={10} strokeWidth={2.5} color={GOLD} />
            {tbl.capacity} {t('tables_module.persons_max')}
          </span>
          <span className="tbl-row__tag" style={{ background: locStyle.bg, color: locStyle.color }}>
            <MapPin size={10} strokeWidth={2.5} color={locStyle.color} />
            {tbl.location}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="tbl-row__actions">
        {/* Toggle */}
        <button
          onClick={() => onToggle(tbl)}
          title={tbl.active ? t('tables_module.deactivate') : t('tables_module.activate')}
          className={`tbl-icon-btn ${tbl.active ? 'tbl-icon-btn--green' : 'tbl-icon-btn--grey'}`}
        >
          {tbl.active
            ? <ToggleRight size={14} strokeWidth={2.5} />
            : <ToggleLeft  size={14} strokeWidth={2.5} />
          }
        </button>

        <button
          onClick={() => onEdit(tbl)}
          title={t('tables_module.edit')}
          className="tbl-icon-btn tbl-icon-btn--gold"
        >
          <Pencil size={14} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onDelete(tbl)}
          title={t('tables_module.delete')}
          className="tbl-icon-btn tbl-icon-btn--red"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

// ─── TableList ────────────────────────────────────────────────────
export default function TableList({
  tables,
  editingTbl,
  onEdit,
  onDelete,
  onToggle,
  selectedTables,
  setSelectedTables,
}) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const isXs = useIsMobile(400)

  useEffect(() => { setPage(1) }, [tables?.length])

  if (!tables || tables.length === 0) {
    return (
      <div className="tbl-list__empty">
        <LayoutGrid size={40} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto' }} />
        <p className="tbl-list__empty-title">{t('tables_module.no_tables_found')}</p>
        <p className="tbl-list__empty-sub">{t('tables_module.use_form_to_add')}</p>
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
      {/* Stats bar */}
      <div className="tbl-stats">
        {[
          { label: t('tables_module.total'),    val: tables.length,    bg: '#423428' },
          { label: t('tables_module.actives'),  val: activeCnt,        bg: '#3d2d1e' },
          { label: t('tables_module.capacity'), val: `${totalCap} ${t('tables_module.persons')}`, bg: '#4a3525' },
        ].map((s, i) => (
          <div key={i} className="tbl-stats__item" style={{ background: s.bg }}>
            <p className="tbl-stats__label">{s.label}</p>
            <p className="tbl-stats__value">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="tbl-list">
        {/* Partial selection banner */}
        {selectedTables.length > 0 && !allSel && (
          <div className="tbl-list__banner" style={{ background: '#ffffff' }}>
            <span className="tbl-list__banner-text">
              {t('tables_module.selected_count', { count: selectedTables.length })}
            </span>
            <button
              onClick={() => setSelectedTables(tables.map(t => t.idx))}
              className="tbl-list__banner-action"
            >
              {t('tables_module.select_all', { count: tables.length })}
            </button>
          </div>
        )}

        {/* All selected banner */}
        {allSel && tables.length > PAGE_SIZE && (
          <div className="tbl-list__banner tbl-list__banner--green" style={{ background: '#ffffff', borderBottom: '1px solid #b8ddb8' }}>
            <span className="tbl-list__banner-text">
              {t('tables_module.tables_selected_count', { count: tables.length })}
            </span>
            <button
              onClick={() => setSelectedTables([])}
              className="tbl-list__banner-action"
            >
              {t('tables_module.deselect_all')}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="tbl-list__header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
          </div>
          <span className="tbl-list__col-label">{t('tables_module.table_name_col')}</span>
          <span className="tbl-list__col-label" style={{ paddingRight: 4 }}>
            {t('tables_module.actions_col')}
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
          <div className="tbl-pagination">
            <span className="tbl-pagination__info">
              {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, tables.length)} / {tables.length}
            </span>
            <div className="tbl-pagination__pages">
              {!isXs && (
                <PageBtn onClick={() => setPage(1)} disabled={safe === 1}>
                  <ChevronsLeft size={12} strokeWidth={2.5} />
                </PageBtn>
              )}
              <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safe === 1}>
                <ChevronLeft size={12} strokeWidth={2.5} />
              </PageBtn>
              {getPages().map((p, i) =>
                p === '…'
                  ? <span key={`d${i}`} style={{ padding: '0 2px', fontSize: 12, color: DARK, lineHeight: '36px' }}>…</span>
                  : <PageBtn key={p} active={p === safe} onClick={() => setPage(p)}>{p}</PageBtn>
              )}
              <PageBtn onClick={() => setPage(p => Math.min(total, p + 1))} disabled={safe === total}>
                <ChevronRight size={12} strokeWidth={2.5} />
              </PageBtn>
              {!isXs && (
                <PageBtn onClick={() => setPage(total)} disabled={safe === total}>
                  <ChevronsRight size={12} strokeWidth={2.5} />
                </PageBtn>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}