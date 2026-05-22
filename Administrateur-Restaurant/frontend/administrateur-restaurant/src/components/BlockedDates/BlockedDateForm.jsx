import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarOff, Calendar, RefreshCw } from 'lucide-react'
import { ThreeDot } from 'react-loading-indicators'

const DARK    = '#2D2926'
const LIGHT_BROWN    = '#C19A6B'
const BORDER  = '#E5E0DA'

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
    }}>{children}</label>
  )
}

function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ModeTab({ active, onClick, label }) {
  return (
    <button onClick={onClick} title={label} style={{
      flex: '1 1 0', minWidth: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '14px 4px',
      background: active ? DARK : 'transparent',
      border: 'none',
      color: active ? '#fff' : DARK,
      fontSize: '12px', fontWeight: '900',
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'none',
      borderRadius: '8px',
    }}>
      <span className="mode-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {label}
      </span>
    </button>
  )
}

export default function BlockedDateForm({ form, setForm, handleBlock, submitting, getDatesToBlock }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'

  const WEEKDAYS = [
    { value: '1', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, 1)) },
    { value: '2', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, 2)) },
    { value: '3', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, 3)) },
    { value: '4', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, 4)) },
    { value: '5', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, 5)) },
    { value: '6', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2024, 0, 6)) },
    { value: '0', label: new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(new Date(2023, 11, 31)) },
  ]

  const preview = getDatesToBlock ? getDatesToBlock() : []
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const valid = () => {
    if (form.mode === 'single')    return !!form.date
    if (form.mode === 'interval')  return !!form.date_from && !!form.date_to && form.date_from <= form.date_to
    if (form.mode === 'recurring') return !!form.date_from
    return false
  }

  const fmt = (d, opt) => new Date(d).toLocaleDateString(lang, opt)

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: 'none' }}>
      <div style={{ padding: '6px', background: '#ffffff', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 4 }}>
        <ModeTab active={form.mode === 'single'}    onClick={() => set('mode','single')}    label={t('calendar.mode_unique')} />
        <ModeTab active={form.mode === 'interval'}  onClick={() => set('mode','interval')}  label={t('calendar.mode_interval')} />
        <ModeTab active={form.mode === 'recurring'} onClick={() => set('mode','recurring')} label={t('calendar.mode_recurring')} />
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {form.mode === 'single' && (
          <Field label={t('calendar.block_date')}>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inputStyle} 
              onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
          </Field>
        )}

        {form.mode === 'interval' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label={t('calendar.from')}>
              <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
            </Field>
            <Field label={t('calendar.to')}>
              <input type="date" value={form.date_to} min={form.date_from} onChange={e => set('date_to', e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
            </Field>
          </div>
        )}

        {form.mode === 'recurring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label={t('calendar.day')}>
              <select value={form.weekday} onChange={e => set('weekday', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {WEEKDAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t('calendar.start_from')}>
                <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
              </Field>
              <Field label={t('calendar.until_optional')}>
                <input type="date" value={form.until} min={form.date_from} onChange={e => set('until', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
              </Field>
            </div>
          </div>
        )}

        <Field label={t('calendar.block_reason')}>
          <input type="text" placeholder={t('calendar.reason_placeholder')} value={form.reason || ''} onChange={e => set('reason', e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = LIGHT_BROWN} onBlur={e => e.target.style.borderColor = BORDER} />
        </Field>



        <button onClick={handleBlock} disabled={submitting || !valid()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px', background: LIGHT_BROWN, border: 'none',
            color: '#fff', fontSize: '14px', fontWeight: '900',
            cursor: submitting || !valid() ? 'not-allowed' : 'pointer',
            opacity: submitting || !valid() ? 0.5 : 1,
            transition: 'none',
            fontFamily: 'inherit', width: '100%', borderRadius: '12px',
          }}
        >
          {submitting ? t('services_module.saving') : preview.length > 1 ? t('calendar.block_count_dates', { count: preview.length }) : t('calendar.block_date')}
        </button>
      </div>
    </div>
  )
}
