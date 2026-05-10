import { useState, useEffect } from 'react'
import {
  Pencil, Trash2, LayoutGrid, Users, MapPin,
  ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../styles/tables/TableList.css'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DK } from '../../styles/tables/tokens'

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
      style={{ 
        width: 18, height: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: 5,
        background: checked || indeterminate ? LIGHT_BROWN : '#fff',
        border: `1.5px solid ${checked || indeterminate ? LIGHT_BROWN : '#d1d5db'}`
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
  const bg = isSelected ? '#ffffff' : isEditing ? '#ffffff' : idx % 2 === 0 ? '#fff' : '#ffffff'

  return (
    <div
      className={`tbl-row ${!tbl.active ? 'tbl-row--inactive' : ''}`}
      style={{
        background: bg,
      }}
    >
      {/* Checkbox */}
      <div className="tbl-row__check-cell" onClick={e => { e.stopPropagation(); onSelect() }}>
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>

      {/* Name Column */}
      <div className="tbl-row__content" style={{ padding: '12px 0' }}>
        <div className="tbl-row__name-row">
          <p className="tbl-row__name">
            {t('tables_module.header_table')} {tbl.number}
          </p>

        </div>
      </div>

      {/* Capacity Column */}
      <div className="tbl-row__col-cell tbl-row__col-cell--center">
        <span className="tbl-row__text">{tbl.capacity}</span>
      </div>

      {/* Location Column */}
      <div className="tbl-row__col-cell">
        <span className="tbl-row__text">{tbl.location}</span>
      </div>

      {/* Actions */}
      <div className="tbl-row__actions">

        <button
          onClick={() => onEdit(tbl)}
          title={t('tables_module.edit')}
          className="tbl-row__action-btn tbl-row__action-btn--edit"
        >
          <Pencil size={14} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onDelete(tbl)}
          title={t('tables_module.delete')}
          className="tbl-row__action-btn tbl-row__action-btn--delete"
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
  selectedTables,
  setSelectedTables,
}) {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState(1)
  const isXs = useIsMobile(400)

  useEffect(() => { setPage(1) }, [tables?.length])

  if (!tables || tables.length === 0) {
    return (
      <div className="tbl-list__empty">
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


      <div className="tbl-list">
        {/* Partial selection banner */}
        {selectedTables.length > 0 && !allSel && (
          <div className="tbl-list__banner">
            <span className="tbl-list__banner-text">
              {t('tables_module.tables_selected_count', { count: selectedTables.length })}
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
          <div className="tbl-list__banner tbl-list__banner--green">
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

        <div className="tbl-list__header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          </div>
          <span className="tbl-list__col-label" style={{ fontWeight: '900' }}>
            {t('tables_module.header_table')}
          </span>
          <span className="tbl-list__col-label" style={{ fontWeight: '900', textAlign: 'center' }}>
            {t('tables_module.header_capacity')}
          </span>
          <span className="tbl-list__col-label" style={{ fontWeight: '900' }}>
            {t('tables_module.header_location')}
          </span>
          <span className="tbl-list__col-label" style={{ fontWeight: '900', textAlign: 'right', paddingRight: 10 }}>
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
            onSelect={() => toggleOne(tbl.idx)}
          />
        ))}

        {/* Pagination */}
        {total > 1 && (
          <div className="tbl-pagination">
            <span className="tbl-pagination__info"></span>
            <div className="tbl-pagination__pages">

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

            </div>
          </div>
        )}
      </div>
    </>
  )
}
