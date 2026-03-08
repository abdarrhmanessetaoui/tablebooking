import { useState } from 'react'
import { CalendarOff } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function Btn({ children, onClick, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '15px 28px',
        background: hov ? GOLD : DARK,
        border: 'none', color: '#fff',
        fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}>
      {Icon && <Icon size={15} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

export default function BlockedDateForm({ form, setForm, handleBlock, submitting }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'flex-end' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <label style={{ fontSize:11, fontWeight:900, color:DARK, letterSpacing:'0.2em', textTransform:'uppercase' }}>
          Date
        </label>
        <input
          type="date"
          value={form.date || ''}
          onChange={e => setForm({ ...form, date: e.target.value })}
          style={{
            padding: '15px 18px',
            border: '2px solid #e8e0d6',
            fontSize: 15, fontWeight: 700, color: DARK,
            fontFamily: 'inherit', outline: 'none', background: '#fff',
            transition: 'border-color 0.15s',
            minWidth: 210,
          }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = '#e8e0d6'}
        />
      </div>
      <Btn icon={CalendarOff} onClick={handleBlock} disabled={submitting || !form.date}>
        {submitting ? 'Enregistrement…' : 'Bloquer la date'}
      </Btn>
    </div>
  )
}