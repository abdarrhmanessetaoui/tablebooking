import { useTranslation } from 'react-i18next'
import { ToggleRight, ToggleLeft, Trash2 } from 'lucide-react'
import '../../../styles/tables/Shared.css'

// ─── Btn ─────────────────────────────────────────────────────────
export function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`tbl-btn ${primary ? 'tbl-btn--primary' : 'tbl-btn--secondary'}`}
      style={{
        background: primary ? '#c8a97e' : '#423428',
        color: primary ? '#423428' : '#fff',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = primary ? '#423428' : '#c8a97e'
        e.currentTarget.style.color      = primary ? '#c8a97e' : '#423428'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = primary ? '#c8a97e' : '#423428'
        e.currentTarget.style.color      = primary ? '#423428' : '#fff'
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

// ─── BulkBar ─────────────────────────────────────────────────────
export function BulkBar({ count, onDelete, onActivate, onDeactivate, onClear }) {
  const { t } = useTranslation()

  return (
    <div className="bulk-bar">
      <span className="bulk-bar__count">{count}</span>
      <span className="bulk-label" style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginRight: 2 }}>
        {t('tables_module.selected_count', { count })}
      </span>

      <div className="bulk-bar__divider" />

      <button onClick={onActivate} className="bulk-bar__btn bulk-bar__btn--activate">
        <ToggleRight size={13} strokeWidth={2.5} />
        <span className="bulk-label">{t('tables_module.activate')}</span>
      </button>

      <button onClick={onDeactivate} className="bulk-bar__btn bulk-bar__btn--deactivate">
        <ToggleLeft size={13} strokeWidth={2.5} />
        <span className="bulk-label">{t('tables_module.deactivate')}</span>
      </button>

      <button onClick={onDelete} className="bulk-bar__btn bulk-bar__btn--delete">
        <Trash2 size={13} strokeWidth={2.5} />
        <span className="bulk-label">{t('tables_module.delete')}</span>
      </button>

      <button onClick={onClear} className="bulk-bar__btn bulk-bar__btn--clear">
        <span style={{ fontSize: 16, lineHeight: 1 }}>✕</span>
        <span className="bulk-label">{t('tables_module.deselect_all')}</span>
      </button>
    </div>
  )
}