import { useState } from 'react'
import { Plus, Check, X, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../styles/tables/TableForm.css'
import { GOLD, BORDER } from '../../styles/tables/tokens'

const EMPTY = { number: '', capacity: '', location: '' }

function Label({ children }) {
  return <label className="tbl-field__label">{children}</label>
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
  const { t } = useTranslation()
  const defaultLocation = initial.location || locations[0]?.name || ''
  const [form, setForm] = useState({ ...EMPTY, ...initial, location: initial.location || defaultLocation })

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const fo  = e => (e.target.style.borderColor = GOLD)
  const bl  = e => (e.target.style.borderColor = BORDER)

  const valid = form.number.trim() && form.capacity !== '' && form.location

  async function handleSubmit() {
    if (!valid || saving) return
    await onSave(form, () => setForm({ ...EMPTY, location: locations[0]?.name || '' }))
  }

  return (
    <div className="tbl-form">
      {/* Header */}
      <div className="tbl-form__header">
        <LayoutGrid size={14} strokeWidth={2.5} color={GOLD} />
        <span className="tbl-form__header-label">
          {editingNumber
            ? t('tables_module.edit_table_name', { number: editingNumber })
            : t('tables_module.new_table')}
        </span>
      </div>

      <div className="tbl-form__body">
        <div className="tbl-form__grid">
          <Field label={t('tables_module.number_label')}>
            <input
              type="text"
              value={form.number}
              placeholder={t('tables_module.number_placeholder')}
              onChange={e => set('number')(e.target.value)}
              className="tbl-field__input"
              onFocus={fo}
              onBlur={bl}
            />
          </Field>
          <Field label={t('tables_module.capacity_label')}>
            <input
              type="number"
              value={form.capacity}
              placeholder={t('tables_module.capacity_placeholder', { defaultValue: '4' })}
              onChange={e => set('capacity')(e.target.value)}
              className="tbl-field__input"
              onFocus={fo}
              onBlur={bl}
            />
          </Field>
        </div>

        <Field label={t('tables_module.location_label')}>
          {locations.length === 0 ? (
            <div className="tbl-field__empty">
              {t('tables_module.location_empty')}
            </div>
          ) : (
            <select
              value={form.location}
              onChange={e => set('location')(e.target.value)}
              className="tbl-field__select"
              onFocus={fo}
              onBlur={bl}
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
          className="tbl-form__submit"
          style={{ color: valid && !saving ? GOLD : '#fff' }}
        >
          {saving
            ? t('tables_module.saving')
            : editingNumber
              ? <><Check size={15} strokeWidth={2.5} /> {t('tables_module.save_changes_btn')}</>
              : <><Plus size={15} strokeWidth={2.5} /> {t('tables_module.add_table_btn')}</>
          }
        </button>

        {editingNumber && (
          <button onClick={onCancel} className="tbl-form__cancel">
            <X size={13} strokeWidth={2.5} />
            {t('tables_module.cancel_edit')}
          </button>
        )}
      </div>
    </div>
  )
}