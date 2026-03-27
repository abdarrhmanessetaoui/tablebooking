import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DARK   = '#423428'
const GOLD   = '#c8a97e'
const BORDER = '#423428'

const PRESET_COLORS = [
  '#4f6ef7', '#16a34a', '#a8834e', '#DC2626',
  '#0891b2', '#7c3aed', '#db2777', '#d97706',
  '#475569', '#15803d',
]

function ColorDot({ color, selected, onClick }) {
  return (
    <button onClick={onClick} title={color} style={{
      width: 22, height: 22, borderRadius: '50%',
      background: color,
      border: selected ? `3px solid ${DARK}` : '4px solid transparent',
      cursor: 'pointer', flexShrink: 0,
      boxShadow: selected ? `0 0 0 1px ${color}` : 'none',
      transition: 'transform 0.1s',
      transform: selected ? 'scale(1.15)' : 'scale(1)',
    }} />
  )
}

function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
      {PRESET_COLORS.map(c => (
        <ColorDot key={c} color={c} selected={value === c} onClick={() => onChange(c)} />
      ))}
      <label title="Couleur personnalisée" style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: PRESET_COLORS.includes(value) ? '#e5e7eb' : value,
          border: `4px solid ${DARK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 900, color: DARK,
        }}>+</div>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      </label>
    </div>
  )
}

const inp = {
  padding: '9px 12px', border: `4px solid ${BORDER}`,
  fontSize: 13, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none',
  background: '#fff', borderRadius: 0,
  width: '100%', boxSizing: 'border-box',
}

// Props: locations, loading, saving, onAdd, onUpdate, onDelete
// Hook (useTableLocations) is called in Tables.jsx — data flows down as props
export default function TableLocationsManager({ locations = [], loading, saving, onAdd, onUpdate, onDelete }) {
  const { t } = useTranslation()
  const [newName,   setNewName]   = useState('')
  const [newColor,  setNewColor]  = useState(PRESET_COLORS[0])
  const [editingId, setEditingId] = useState(null)
  const [editName,  setEditName]  = useState('')
  const [editColor, setEditColor] = useState('')

  function startEdit(loc) { setEditingId(loc.id); setEditName(loc.name); setEditColor(loc.color) }
  function cancelEdit()   { setEditingId(null); setEditName(''); setEditColor('') }

  async function saveEdit() {
    if (!editName.trim()) return
    await onUpdate(editingId, editName, editColor)
    cancelEdit()
  }

  return (
    <div style={{ background: '#fff', border: `4px solid ${BORDER}`, fontFamily: "'Inter',system-ui,-apple-system,sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', background: DARK, display: 'flex', alignItems: 'center', gap: 8 }}>
        <MapPin size={14} strokeWidth={2.5} color={GOLD} />
        <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {t('tables_module.locations')}
        </span>
        <span style={{ marginLeft: 'auto', minWidth: 20, height: 20, background: GOLD, color: DARK, fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
          {locations.length}
        </span>
      </div>

      <div style={{ padding: 16 }}>

        {/* Add new */}
        <div style={{ marginBottom: 16, padding: 14, background: '#ffffff', border: `1px solid rgba(66,52,40,0.1)` }}>
          <p style={{ margin: '0 0 10px', fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {t('tables_module.new_location')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text" placeholder={t('tables_module.location_placeholder')}
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onAdd(newName, newColor, () => setNewName(''))}
              style={inp}
            />
            <ColorPicker value={newColor} onChange={setNewColor} />
            <button
              onClick={() => onAdd(newName, newColor, () => setNewName(''))}
              disabled={!newName.trim() || saving}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', background: DARK, border: 'none',
                fontSize: 12, fontWeight: 800, color: GOLD,
                cursor: !newName.trim() || saving ? 'not-allowed' : 'pointer',
                opacity: !newName.trim() || saving ? 0.45 : 1,
                fontFamily: 'inherit',
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              {saving ? t('tables_module.saving') : t('tables_module.add_location')}
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ fontSize: 12, fontWeight: 700, color: DARK, textAlign: 'center', padding: '20px 0' }}>{t('tables_module.loading_tables')}</p>
        ) : locations.length === 0 ? (
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(66,52,40,0.4)', textAlign: 'center', padding: '20px 0' }}>
            {t('tables_module.no_locations')}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {locations.map(loc => (
              <div key={loc.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                border: `4px solid rgba(66,52,40,0.1)`,
                background: editingId === loc.id ? '#ffffff' : '#fff',
              }}>
                {editingId === loc.id ? (
                  <>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input type="text" value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                        style={inp} autoFocus
                      />
                      <ColorPicker value={editColor} onChange={setEditColor} />
                    </div>
                    <button onClick={saveEdit} disabled={!editName.trim() || saving} title={t('tables_module.save_changes_btn')}
                      style={{
                        padding: 6, borderRadius: '50%',
                        background: '#16A34A', border: 'none', color: '#fff',
                        cursor: !editName.trim() || saving ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transition: 'opacity 0.15s', opacity: !editName.trim() || saving ? 0.45 : 1,
                      }}
                      onMouseEnter={e => { if (editName.trim() && !saving) e.currentTarget.style.opacity = 0.85 }}
                      onMouseLeave={e => e.currentTarget.style.opacity = !editName.trim() || saving ? 0.45 : 1}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button onClick={cancelEdit} title={t('tables_module.cancel_edit')}
                      style={{
                        padding: 6, borderRadius: '50%',
                        background: DARK, border: 'none', color: '#fff',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                      onMouseLeave={e => e.currentTarget.style.opacity = 1}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: loc.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: DARK }}>{loc.name}</span>
                    <button onClick={() => startEdit(loc)} title={t('tables_module.edit')}
                      style={{
                        padding: 6, borderRadius: '50%',
                        background: GOLD, border: 'none', color: '#fff',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                      onMouseLeave={e => e.currentTarget.style.opacity = 1}
                    >
                      <Pencil size={14} strokeWidth={2.5} />
                    </button>
                    <button onClick={() => onDelete(loc)} title={t('tables_module.delete')}
                      style={{
                        padding: 6, borderRadius: '50%',
                        background: '#DC2626', border: 'none', color: '#fff',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                      onMouseLeave={e => e.currentTarget.style.opacity = 1}
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
