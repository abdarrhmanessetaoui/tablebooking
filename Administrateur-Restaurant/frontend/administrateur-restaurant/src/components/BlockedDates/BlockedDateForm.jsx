import { useState } from 'react'
import { CalendarOff, Calendar, RefreshCw } from 'lucide-react'

const DARK   = '#2b2118'
const GOLD   = '#c8a97e'
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

const inp = {
  padding: '11px 14px',
  border: `2px solid ${BORDER}`,
  fontSize: 13, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s',
  width: '100%', boxSizing: 'border-box',
}

function Label({ children }) {
  return (
    <label style={{
      fontSize: 9, fontWeight: 900, color: '#aaa',
      letterSpacing: '0.18em', textTransform: 'uppercase',
      display: 'block', marginBottom: 6,
    }}>{children}</label>
  )
}

function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ModeTab({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} title={label} style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '12px 8px',
      background: active ? DARK : '#f5f0eb',
      border: 'none',
      color: active ? GOLD : '#bbb',
      fontSize: 11, fontWeight: 800,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'all 0.15s',
    }}>
      <Icon size={14} strokeWidth={2.5} />
      <span className="mode-label">{label}</span>
    </button>
  )
}

export default function BlockedDateForm({ form, setForm, handleBlock, submitting, getDatesToBlock }) {
  const preview = getDatesToBlock ? getDatesToBlock() : []
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const fo = e => e.target.style.borderColor = GOLD
  const bl = e => e.target.style.borderColor = BORDER

  const valid = () => {
    if (form.mode === 'single')    return !!form.date
    if (form.mode === 'interval')  return !!form.date_from && !!form.date_to && form.date_from <= form.date_to
    if (form.mode === 'recurring') return !!form.date_from
    return false
  }

  return (
    <>
      <style>{`
        @media (max-width: 480px) { .mode-label { display: none !important; } }
        .rec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 480px) { .rec-grid { grid-template-columns: 1fr 1fr 1fr; } }
      `}</style>

      <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>

        {/* Mode tabs */}
        <div style={{ display: 'flex', borderBottom: `2px solid ${DARK}` }}>
          <ModeTab active={form.mode === 'single'}    onClick={() => set('mode','single')}    icon={CalendarOff} label="Date unique" />
          <ModeTab active={form.mode === 'interval'}  onClick={() => set('mode','interval')}  icon={Calendar}    label="Intervalle" />
          <ModeTab active={form.mode === 'recurring'} onClick={() => set('mode','recurring')} icon={RefreshCw}   label="Récurrent" />
        </div>

        <div style={{ padding: 'clamp(16px,3vw,24px)', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* SINGLE */}
          {form.mode === 'single' && (
            <Field label="Date à bloquer">
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                style={inp} onFocus={fo} onBlur={bl} />
            </Field>
          )}

          {/* INTERVAL */}
          {form.mode === 'interval' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Du">
                <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)}
                  style={inp} onFocus={fo} onBlur={bl} />
              </Field>
              <Field label="Au">
                <input type="date" value={form.date_to} min={form.date_from}
                  onChange={e => set('date_to', e.target.value)}
                  style={inp} onFocus={fo} onBlur={bl} />
              </Field>
            </div>
          )}

          {/* RECURRING */}
          {form.mode === 'recurring' && (
            <div className="rec-grid">
              <Field label="Jour">
                <select value={form.weekday} onChange={e => set('weekday', e.target.value)}
                  style={{ ...inp, cursor: 'pointer' }}>
                  {WEEKDAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </Field>
              <Field label="À partir du">
                <input type="date" value={form.date_from} onChange={e => set('date_from', e.target.value)}
                  style={inp} onFocus={fo} onBlur={bl} />
              </Field>
              <Field label="Jusqu'au" style={{ gridColumn: 'span 1' }}>
                <input type="date" value={form.until} min={form.date_from}
                  onChange={e => set('until', e.target.value)}
                  style={inp} onFocus={fo} onBlur={bl} />
              </Field>
            </div>
          )}

          {/* REASON */}
          <Field label="Raison (optionnel)">
            <input type="text"
              placeholder="Ex: Fermeture, Événement privé…"
              value={form.reason || ''}
              onChange={e => set('reason', e.target.value)}
              style={inp} onFocus={fo} onBlur={bl} />
          </Field>

          {/* PREVIEW */}
          {preview.length > 0 && (
            <div style={{
              padding: '10px 13px',
              background: '#fdf6ec', borderLeft: `3px solid ${GOLD}`,
              fontSize: 12, fontWeight: 700, color: '#a8834e', lineHeight: 1.5,
            }}>
              {preview.length === 1
                ? `1 date : ${new Date(preview[0]).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}`
                : `${preview.length} dates — du ${new Date(preview[0]).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })} au ${new Date(preview[preview.length-1]).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}`
              }
            </div>
          )}

          {/* SUBMIT */}
          <button onClick={handleBlock} disabled={submitting || !valid()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px',
              background: valid() && !submitting ? DARK : '#ccc',
              border: 'none', color: valid() && !submitting ? GOLD : '#fff',
              fontSize: 13, fontWeight: 800,
              cursor: submitting || !valid() ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              fontFamily: 'inherit', width: '100%',
            }}
            onMouseEnter={e => { if (!submitting && valid()) e.currentTarget.style.background = '#3d2d1e' }}
            onMouseLeave={e => { e.currentTarget.style.background = valid() && !submitting ? DARK : '#ccc' }}
          >
            <CalendarOff size={14} strokeWidth={2.5} />
            {submitting ? 'Enregistrement…' : preview.length > 1 ? `Bloquer ${preview.length} dates` : 'Bloquer la date'}
          </button>

        </div>
      </div>
    </>
  )
}