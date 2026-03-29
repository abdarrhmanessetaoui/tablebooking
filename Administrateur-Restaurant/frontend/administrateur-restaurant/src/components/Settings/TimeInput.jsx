import { DARK, GOLD, BORDER } from './constants'

export default function TimeInput({ value, onChange, max }) {
  return (
    <input
      type="number"
      min="0"
      max={max}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      onFocus={e => (e.target.style.borderColor = GOLD)}
      onBlur={e => (e.target.style.borderColor = BORDER)}
      style={{
        width: 52,
        textAlign: 'center',
        border: `4px solid ${BORDER}`,
        padding: '10px 6px',
        fontSize: 15,
        fontWeight: 900,
        color: DARK,
        fontFamily: 'inherit',
        outline: 'none',
        background: '#fff',
        borderRadius: 0,
        WebkitAppearance: 'none',
        transition: 'border-color 0.15s',
      }}
    />
  )
}