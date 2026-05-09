import { LIGHT_BROWN } from '../../../styles/reservations/tokens'

export default function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange() }}
      style={{ 
        width: 18, height: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: 5,
        background: checked || indeterminate ? LIGHT_BROWN : '#fff',
        border: `1.5px solid ${checked || indeterminate ? LIGHT_BROWN : '#d1d5db'}`
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div style={{ width: 8, height: 2, background: '#fff', borderRadius: 1 }} />
      )}
    </div>
  )
}
