import { useState } from 'react'
import { CalendarOff } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function Btn({ children, onClick, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '14px 28px',
        background: hov ? GOLD : DARK,
        border: 'none', color: '#fff',
        fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  padding: '13px 16px',
  border: `2px solid #e8e0d6`,
  borderRadius: 0,
  fontSize: 14, fontWeight: 700, color: DARK,
  fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
  outline: 'none',
  background: '#fff',
  transition: 'border-color 0.15s',
  width: '100%',
}

export default function BlockedDateForm({ form, setForm, handleBlock, submitting }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, alignItems: 'flex-end' }}>

      <Field label="Date de début">
        <input
          type="date"
          value={form.start_date || ''}
          onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = '#e8e0d6'}
        />
      </Field>

      <Field label="Date de fin">
        <input
          type="date"
          value={form.end_date || ''}
          onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = '#e8e0d6'}
        />
      </Field>

      <Field label="Raison (optionnel)">
        <input
          type="text"
          placeholder="Ex: Fermeture annuelle"
          value={form.reason || ''}
          onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
          style={{ ...inputStyle }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = '#e8e0d6'}
        />
      </Field>

      <div style={{ paddingBottom: 0 }}>
        <Btn icon={CalendarOff} onClick={handleBlock} disabled={submitting}>
          {submitting ? 'Enregistrement…' : 'Bloquer la date'}
        </Btn>
      </div>

    </div>
  )
}