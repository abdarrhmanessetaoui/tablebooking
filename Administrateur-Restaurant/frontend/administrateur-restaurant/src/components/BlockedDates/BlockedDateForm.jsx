import { useState } from 'react'
import { CalendarOff, Calendar, RefreshCw } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const BORDER = '#e8e0d6'

const WEEKDAYS = [
  { value: '1', label: 'Lundi' },
  { value: '2', label: 'Mardi' },
  { value: '3', label: 'Mercredi' },
  { value: '4', label: 'Jeudi' },
  { value: '5', label: 'Vendredi' },
  { value: '6', label: 'Samedi' },
  { value: '0', label: 'Dimanche' },
]

const inputStyle = {
  padding: '13px 16px',
  border: `2px solid ${BORDER}`,
  fontSize: 13, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s', width: '100%', boxSizing: 'border-box',
}

function Label({ children }) {
  return (
    <label style={{ fontSize: 10, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
      {children}
    </label>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ModeTab({ active, onClick, icon: Icon, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      padding: '11px 16px',
      background: active ? DARK : '#f5f0eb',
      border: 'none',
      color: active ? GOLD : '#999',
      fontSize: 12, fontWeight: 800,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'all 0.15s',
    }}>
      <Icon size={13} strokeWidth={2.5} />
      {children}
    </button>
  )
}

export default function BlockedDateForm({ form, setForm, handleBlock, submitting, getDatesToBlock }) {
  const previewDates = getDatesToBlock ? getDatesToBlock() : []

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const focusStyle  = e => e.target.style.borderColor = GOLD
  const blurStyle   = e => e.target.style.borderColor = BORDER

  const isValid = () => {
    if (form.mode === 'single')    return !!form.date
    if (form.mode === 'interval')  return !!form.date_from && !!form.date_to && form.date_from <= form.date_to
    if (form.mode === 'recurring') return !!form.date_from
    return false
  }

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>

      {/* Mode tabs */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${DARK}` }}>
        <ModeTab active={form.mode === 'single'}    onClick={() => set('mode', 'single')}    icon={CalendarOff}>Date unique</ModeTab>
        <ModeTab active={form.mode === 'interval'}  onClick={() => set('mode', 'interval')}  icon={Calendar}>Intervalle</ModeTab>
        <ModeTab active={form.mode === 'recurring'} onClick={() => set('mode', 'recurring')} icon={RefreshCw}>Récurrent</ModeTab>
      </div>

      <div style={{ padding: '24px 24px 20px' }}>

        {/* SINGLE */}
        {form.mode === 'single' && (
          <Field label="Date à bloquer">
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
        )}

        {/* INTERVAL */}
        {form.mode === 'interval' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Du">
              <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label="Au">
              <input type="date" value={form.date_to} onChange={e => set('date_to', e.target.value)}
                min={form.date_from}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
        )}

        {/* RECURRING */}
        {form.mode === 'recurring' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Field label="Jour de la semaine">
              <select value={form.weekday} onChange={e => set('weekday', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {WEEKDAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="À partir du">
              <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label="Jusqu'au (optionnel)">
              <input type="date" value={form.until} onChange={e => set('until', e.target.value)}
                min={form.date_from}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
        )}

        {/* Preview */}
        {previewDates.length > 0 && (
          <div style={{
            marginTop: 16, padding: '11px 14px',
            background: '#fdf6ec', borderLeft: `3px solid ${GOLD}`,
            fontSize: 12, fontWeight: 700, color: '#a8834e',
          }}>
            {previewDates.length === 1
              ? `1 date sera bloquée : ${new Date(previewDates[0]).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}`
              : `${previewDates.length} dates seront bloquées — du ${new Date(previewDates[0]).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })} au ${new Date(previewDates[previewDates.length-1]).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}`
            }
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: 20 }}>
          <button onClick={handleBlock} disabled={submitting || !isValid()}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '13px 28px',
              background: DARK, border: 'none', color: GOLD,
              fontSize: 13, fontWeight: 800,
              cursor: submitting || !isValid() ? 'not-allowed' : 'pointer',
              opacity: submitting || !isValid() ? 0.5 : 1,
              transition: 'background 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!submitting && isValid()) e.currentTarget.style.background = '#3d2d1e' }}
            onMouseLeave={e => e.currentTarget.style.background = DARK}
          >
            <CalendarOff size={14} strokeWidth={2.5} />
            {submitting ? 'Enregistrement…' : previewDates.length > 1 ? `Bloquer ${previewDates.length} dates` : 'Bloquer la date'}
          </button>
        </div>
      </div>
    </div>
  )
}