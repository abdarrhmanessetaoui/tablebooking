import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../../styles/tables/TableLocationsManager.css'
import { PRESET_COLORS } from '../../../styles/tables/tokens'

// ─── ColorDot ────────────────────────────────────────────────────
function ColorDot({ color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      title={color}
      className={`color-dot ${selected ? 'color-dot--selected' : ''}`}
      style={{ background: color, boxShadow: selected ? `0 0 0 1px ${color}` : 'none' }}
    />
  )
}

// ─── ColorPicker ─────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {PRESET_COLORS.map(c => (
        <ColorDot key={c} color={c} selected={value === c} onClick={() => onChange(c)} />
      ))}
      <label title="Couleur personnalisée" style={{ position: 'relative', cursor: 'pointer' }}>
        <div
          className="color-dot color-dot--custom"
          style={{ background: PRESET_COLORS.includes(value) ? '#e5e7eb' : value }}
        >
          +
        </div>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
      </label>
    </div>
  )
}

// ─── TableLocationsManager ────────────────────────────────────────
export default function TableLocationsManager({
  locations = [],
  loading,
  saving,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const { t } = useTranslation()
  const [newName,   setNewName]   = useState('')
  const [newColor,  setNewColor]  = useState(PRESET_COLORS[0])
  const [editingId, setEditingId] = useState(null)
  const [editName,  setEditName]  = useState('')
  const [editColor, setEditColor] = useState('')

  function startEdit(loc)  { setEditingId(loc.id); setEditName(loc.name); setEditColor(loc.color) }
  function cancelEdit()    { setEditingId(null); setEditName(''); setEditColor('') }

  async function saveEdit() {
    if (!editName.trim()) return
    await onUpdate(editingId, editName, editColor)
    cancelEdit()
  }

  return (
    <div className="tbl-locs">
      {/* Header */}
      <div className="tbl-locs__header">
        <MapPin size={14} strokeWidth={2.5} color="#c8a97e" />
        <span className="tbl-locs__header-label">{t('tables_module.locations')}</span>
        <span className="tbl-locs__count">{locations.length}</span>
      </div>

      <div className="tbl-locs__body">
        {/* Add new */}
        <div className="tbl-locs__add">
          <p className="tbl-locs__add-title">{t('tables_module.new_location')}</p>
          <div className="tbl-locs__add-inner">
            <input
              type="text"
              placeholder={t('tables_module.location_placeholder')}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAdd(newName, newColor, () => setNewName(''))}
              className="tbl-locs__input"
            />
            <ColorPicker value={newColor} onChange={setNewColor} />
            <button
              onClick={() => onAdd(newName, newColor, () => setNewName(''))}
              disabled={!newName.trim() || saving}
              className="tbl-locs__add-btn"
            >
              <Plus size={13} strokeWidth={2.5} />
              {saving ? t('tables_module.saving') : t('tables_module.add_location')}
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p className="tbl-locs__loading">{t('tables_module.loading_tables')}</p>
        ) : locations.length === 0 ? (
          <p className="tbl-locs__empty">{t('tables_module.no_locations')}</p>
        ) : (
          <div className="tbl-locs__list">
            {locations.map(loc => (
              <div
                key={loc.id}
                className={`tbl-locs__item ${editingId === loc.id ? 'tbl-locs__item--editing' : ''}`}
              >
                {editingId === loc.id ? (
                  <>
                    <div className="tbl-locs__item-edit-inner">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter')  saveEdit()
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="tbl-locs__input"
                        autoFocus
                      />
                      <ColorPicker value={editColor} onChange={setEditColor} />
                    </div>
                    <button
                      onClick={saveEdit}
                      disabled={!editName.trim() || saving}
                      className="tbl-locs__icon-btn tbl-locs__icon-btn--save"
                      title={t('tables_module.save_changes_btn')}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="tbl-locs__icon-btn tbl-locs__icon-btn--cancel"
                      title={t('tables_module.cancel_edit')}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="tbl-locs__dot" style={{ background: loc.color }} />
                    <span className="tbl-locs__name">{loc.name}</span>
                    <button
                      onClick={() => startEdit(loc)}
                      className="tbl-locs__icon-btn tbl-locs__icon-btn--edit"
                      title={t('tables_module.edit')}
                    >
                      <Pencil size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onDelete(loc)}
                      className="tbl-locs__icon-btn tbl-locs__icon-btn--delete"
                      title={t('tables_module.delete')}
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}