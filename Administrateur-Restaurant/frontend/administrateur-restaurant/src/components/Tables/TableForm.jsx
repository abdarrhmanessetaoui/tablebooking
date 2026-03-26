import { useState } from 'react'
import { Plus, Check, X, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DARK   = '#2b2118'
const GOLD   = '#c8a97e'
const BORDER = '#2b2118'

const EMPTY = { number: '', capacity: '', location: '' }

const inp = {
  padding: '12px 14px',
  border: `4px solid ${BORDER}`,
  fontSize: 14, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s',
  width: '100%', boxSizing: 'border-box',
  minWidth: 0, WebkitAppearance: 'none', borderRadius: 0,
}

function Label({ children }) {
  return (
    <label style={{
      fontSize: 9, fontWeight: 900, color: DARK,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      display: 'block', marginBottom: 6,
    }}>
      {children}
    </label>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

// locations = [{ id, name, color }, ...]  — passed from parent via useTableLocations
export default function TableForm({ initial = EMPTY, onSave, saving, editingNumber, onCancel, locations = [] }) {
  const { t } = useTranslation()
  const defaultLocation = initial.location || locations[0]?.name || ''
  const [form, setForm] = useState({ ...EMPTY, ...initial, location: initial.location || defaultLocation })

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const fo  = e => e.target.style.borderColor = GOLD
  const bl  = e => e.target.style.borderColor = BORDER

  const valid = form.number.trim() && form.capacity !== '' && form.location

  async function handleSubmit() {
    if (!valid || saving) return
    await onSave(form, () => setForm({ ...EMPTY, location: locations[0]?.name || '' }))
  }

  return (
    <div style={{ background: '#fff', border: `4px solid ${BORDER}`, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', background: DARK, display: 'flex', alignItems: 'center', gap: 8 }}>
        <LayoutGrid size={14} strokeWidth={2.5} color={GOLD} />
        <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {editingNumber ? t('tables_module.edit_table_name', { number: editingNumber }) : t('tables_module.new_table')}
        </span>
      </div>

      <div style={{ padding: 'clamp(14px,4vw,24px)', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label={t('tables_module.number_label')}>
            <input
              type="text" value={form.number} placeholder={t('tables_module.number_placeholder')}
              onChange={e => set('number')(e.target.value)}
              style={inp} onFocus={fo} onBlur={bl}
            />
          </Field>
          <Field label={t('tables_module.capacity_label')}>
            <input
              type="number" value={form.capacity} placeholder={t('tables_module.capacity_placeholder', { defaultValue: '4' })}
              onChange={e => set('capacity')(e.target.value)}
              style={inp} onFocus={fo} onBlur={bl}
            />
          </Field>
        </div>

        <Field label={t('tables_module.location_label')}>
          {locations.length === 0 ? (
            <div style={{ ...inp, color: 'rgba(43,33,24,0.4)', fontSize: 12, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              {t('tables_module.location_empty')}
            </div>
          ) : (
            <select
              value={form.location}
              onChange={e => set('location')(e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}
              onFocus={fo} onBlur={bl}
            >
              <option value="">{t('tables_module.location_choose')}</option>
              {locations.map(l => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          )}
        </Field>

        <button
          onClick={handleSubmit}
          disabled={!valid || saving}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '15px', background: DARK, border: 'none',
            color: valid && !saving ? GOLD : '#fff',
            fontSize: 14, fontWeight: 800,
            cursor: valid && !saving ? 'pointer' : 'not-allowed',
            opacity: !valid || saving ? 0.45 : 1,
            transition: 'background 0.15s, opacity 0.15s',
            fontFamily: 'inherit', width: '100%', minHeight: 50,
          }}
          onMouseEnter={e => { if (valid && !saving) e.currentTarget.style.background = '#3d2d1e' }}
          onMouseLeave={e => { e.currentTarget.style.background = DARK }}
        >
          {saving
            ? t('tables_module.saving')
            : editingNumber
              ? <><Check size={15} strokeWidth={2.5} /> {t('tables_module.save_changes_btn')}</>
              : <><Plus size={15} strokeWidth={2.5} /> {t('tables_module.add_table_btn')}</>
          }
        </button>

        {editingNumber && (
          <button onClick={onCancel} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '11px', background: 'none', border: `4px solid ${BORDER}`,
            fontSize: 12, fontWeight: 800, color: DARK,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', width: '100%',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#a8834e'; e.currentTarget.style.borderColor = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK; e.currentTarget.style.borderColor = BORDER }}
          >
            <X size={13} strokeWidth={2.5} /> {t('tables_module.cancel_edit')}
          </button>
        )}
      </div>
    </div>
  )
}