import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import '../../styles/tables/TableLocationsManager.css'


// ColorPicker removed as per user request to force uniform colors

// ─── TableLocationsManager ────────────────────────────────────────
export default function TableLocationsManager({
  locations = [],
  loading,
  saving,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const { t, i18n } = useTranslation()
  const [newName,   setNewName]   = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName,  setEditName]  = useState('')

  function startEdit(loc)  { setEditingId(loc.id); setEditName(loc.name) }
  function cancelEdit()    { setEditingId(null); setEditName('') }

  async function saveEdit() {
    if (!editName.trim()) return
    await onUpdate(editingId, editName, '#C19A6B')
    cancelEdit()
  }

  return (
    <div className="tbl-locs">
      {/* Header */}
      <div className="tbl-locs__header">
        <span className="tbl-locs__header-label">{t('tables_module.locations')}</span>
      </div>

      <div className="tbl-locs__body">
        {/* Add new */}
        <div className="tbl-locs__add">
          <div className="tbl-locs__add-inner">
            <input
              type="text"
              placeholder={t('tables_module.location_placeholder')}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAdd(newName, '#C19A6B', () => setNewName(''))}
              className="tbl-locs__input"
            />
            <button
              onClick={() => onAdd(newName, '#C19A6B', () => setNewName(''))}
              disabled={!newName.trim() || saving}
              className="tbl-locs__add-btn"
              style={{
                background: '#C19A6B', color: '#fff', border: 'none',
                fontWeight: 900, textTransform: 'uppercase', fontSize: '11px',
                padding: '0 16px', height: '34px', borderRadius: '4px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              {saving ? <div className="tbl-btn-spinner" style={{ verticalAlign: 'middle' }} /> : t('tables_module.add_location')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
