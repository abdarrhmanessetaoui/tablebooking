import { useState } from 'react'
import { Plus, Check, X, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import '../../styles/tables/TableForm.css'
import { LIGHT_BROWN, BORDER } from '../../styles/tables/tokens'

const EMPTY = { number: '', capacity: '', location: '' }

function Label({ children }) {
  return <label className="tbl-field__label" style={{ textAlign: 'inherit', display: 'block' }}>{children}</label>
}

function Field({ label, children }) {
  return (
    <div className="tbl-field">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export default function TableForm({
  initial = EMPTY,
  onSave,
  saving,
  editingNumber,
  onCancel,
  locations = [],
}) {
  const { t, i18n } = useTranslation()
  const defaultLocation = initial.location || locations[0]?.name || ''
  const [form, setForm] = useState({ ...EMPTY, ...initial, location: initial.location || defaultLocation })

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const fo  = e => (e.target.style.borderColor = LIGHT_BROWN)
  const bl  = e => (e.target.style.borderColor = BORDER)

  const valid = form.number.trim() && form.capacity !== '' && form.location

  async function handleSubmit() {
    if (!valid || saving) return
    await onSave(form, () => setForm({ ...EMPTY, location: locations[0]?.name || '' }))
  }

  return (
    <div className="tbl-form">
      {/* Header */}


      <div className="tbl-form__body" style={{ padding: '12px 14px', gap: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Field label={t('tables_module.number_label')}>
            <input
              type="text"
              value={form.number}
              placeholder={t('tables_module.number_placeholder')}
              onChange={e => set('number')(e.target.value)}
              className="tbl-field__input"
              style={{ padding: '8px 10px', fontSize: '13px' }}
              onFocus={fo} onBlur={bl}
            />
          </Field>
          <Field label={t('tables_module.capacity_label')}>
            <input
              type="number"
              value={form.capacity}
              placeholder={t('tables_module.capacity_placeholder', { defaultValue: '4' })}
              onChange={e => set('capacity')(e.target.value)}
              className="tbl-field__input"
              style={{ padding: '8px 10px', fontSize: '13px' }}
              onFocus={fo} onBlur={bl}
            />
          </Field>
        </div>

        <Field label={t('tables_module.location_label')}>
          {locations.length === 0 ? (
            <div className="tbl-field__empty" style={{ padding: '8px 10px', fontSize: '12px', minHeight: '33px' }}>
              {t('tables_module.location_empty')}
            </div>
          ) : (
            <select
              value={form.location}
              onChange={e => set('location')(e.target.value)}
              className="tbl-field__select"
              style={{ padding: '8px 10px', fontSize: '13px', height: '33px' }}
              onFocus={fo} onBlur={bl}
            >
              <option value="">{t('tables_module.location_choose')}</option>
              {locations.map(l => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          )}
        </Field>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleSubmit}
            disabled={!valid || saving}
            className="tbl-form__submit"
            style={{ 
              color: '#fff', flex: 1, padding: '8px', minHeight: '34px', fontSize: '11px', fontWeight: 900,
              background: LIGHT_BROWN, border: `1px solid ${LIGHT_BROWN}`, borderRadius: '4px',
              textTransform: 'uppercase'
            }}
          >
            {saving
              ? <div className="tbl-btn-spinner" />
              : editingNumber
                ? <><Check size={14} strokeWidth={2.5} /> {t('tables_module.save_changes_btn')}</>
                : <><Plus size={14} strokeWidth={2.5} /> {t('tables_module.add_table_btn')}</>
            }
          </button>
          {editingNumber && (
            <button onClick={onCancel} className="tbl-form__cancel" style={{ flex: 1, padding: '8px', minHeight: '34px', fontSize: '12px' }}>
              <X size={14} strokeWidth={2.5} /> {t('tables_module.cancel_edit')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
