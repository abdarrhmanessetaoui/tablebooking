import { useState, useEffect } from 'react'
import { Plus, Check, X, Utensils } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ThreeDot } from 'react-loading-indicators'

const DARK    = '#2D2926'
const LIGHT_BROWN    = '#C19A6B'
const BORDER  = '#E5E0DA'

const EMPTY = { name: '', price: '', capacity: '', duration: '', available_days: [0,1,2,3,4,5,6] }

const inputStyle = {
  padding: '12px 14px',
  border: `1px solid ${BORDER}`,
  borderRadius: '12px',
  fontSize: '14px', fontWeight: '800', color: DARK,
  fontFamily: 'inherit', outline: 'none', background: '#fff',
  transition: 'none',
  width: '100%', boxSizing: 'border-box',
}

function Label({ children }) {
  return (
    <label style={{
      fontSize: '11px', fontWeight: '900', color: DARK,
      textTransform: 'uppercase', letterSpacing: '0.04em',
      display: 'block', marginBottom: '8px',
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

function DayPicker({ value = [0,1,2,3,4,5,6], onChange }) {
  const { t } = useTranslation()
  const DAYS = [
    { idx: 0, short: t('services_module.dim_short'), full: t('services_module.dim_full') },
    { idx: 1, short: t('services_module.lun_short'), full: t('services_module.lun_full') },
    { idx: 2, short: t('services_module.mar_short'), full: t('services_module.mar_full') },
    { idx: 3, short: t('services_module.mer_short'), full: t('services_module.mer_full') },
    { idx: 4, short: t('services_module.jeu_short'), full: t('services_module.jeu_full') },
    { idx: 5, short: t('services_module.ven_short'), full: t('services_module.ven_full') },
    { idx: 6, short: t('services_module.sam_short'), full: t('services_module.sam_full') },
  ]

  function toggle(idx) {
    if (value.includes(idx)) {
      if (value.length === 1) return
      onChange(value.filter(d => d !== idx))
    } else {
      onChange([...value, idx].sort((a, b) => a - b))
    }
  }

  return (
    <div>
      <Label>{t('services_module.available_days')}</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginTop: 12 }}>
        {DAYS.map(d => {
          const active = value.includes(d.idx)
          return (
            <div key={d.idx}
              onClick={() => toggle(d.idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer', userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => {}} // handled by parent div onClick
                style={{
                  width: '16px', height: '16px',
                  cursor: 'pointer',
                  accentColor: LIGHT_BROWN
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: '800', color: DARK, textTransform: 'uppercase' }}>
                {d.full}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ServiceForm({ initial = EMPTY, onSave, saving, editingName, onCancel }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ ...EMPTY, ...initial })

  useEffect(() => {
    setForm({
      ...EMPTY,
      ...initial,
      available_days: Array.isArray(initial?.available_days)
        ? initial.available_days
        : [0, 1, 2, 3, 4, 5, 6],
    })
  }, [initial?.idx, editingName])

  const set   = k => v => setForm(f => ({ ...f, [k]: v }))
  const valid = form.name.trim() && form.price !== '' && form.capacity !== '' && form.duration !== ''

  async function handleSubmit() {
    if (!valid || saving) return
    await onSave(form, () => setForm(EMPTY))
  }

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: 'none' }}>

      {/* Header */}
      <div style={{ padding: '8px 20px', background: 'transparent', borderBottom: 'none', display: 'flex', alignItems: 'center' }}>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <Field label={t('services_module.service_name_label')}>
          <input type="text" value={form.name} placeholder={t('services_module.service_name_placeholder')}
            onChange={e => set('name')(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label={t('services_module.price_label')}>
            <input type="number" value={form.price} placeholder="0"
              onChange={e => set('price')(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
          </Field>
          <Field label={t('services_module.capacity_label')}>
            <input type="number" value={form.capacity} placeholder="15"
              onChange={e => set('capacity')(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
          </Field>
        </div>

        <Field label={t('services_module.duration_label')}>
          <input type="number" value={form.duration} placeholder="60"
            onChange={e => set('duration')(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
        </Field>

        <DayPicker
          value={form.available_days ?? [0,1,2,3,4,5,6]}
          onChange={v => set('available_days')(v)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button onClick={handleSubmit} disabled={!valid || saving}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px', background: LIGHT_BROWN, border: 'none',
              color: '#fff',
              fontSize: '14px', fontWeight: '900',
              cursor: valid && !saving ? 'pointer' : 'not-allowed',
              opacity: !valid || saving ? 0.5 : 1,
              transition: 'none',
              fontFamily: 'inherit', width: '100%', borderRadius: '12px',
            }}
          >
            {saving ? t('services_module.saving') : editingName
                ? <><Check size={16} strokeWidth={2.5} /> {t('services_module.save_changes_btn')}</>
                : <><Plus size={16} strokeWidth={2.5} /> {t('services_module.add_service_btn')}</>
            }
          </button>

          {editingName && (
            <button onClick={onCancel} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '12px', background: LIGHT_BROWN, border: 'none',
              borderRadius: '12px', fontSize: '13px', fontWeight: '900', color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'none', width: '100%',
            }}
            >
              {t('services_module.cancel_edit')}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
