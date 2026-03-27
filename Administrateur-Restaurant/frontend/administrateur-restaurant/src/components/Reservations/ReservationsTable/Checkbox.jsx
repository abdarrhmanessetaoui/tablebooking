import { DARK, GOLD } from '../../../styles/reservations/tokens'
import { checkboxStyle } from '../../../styles/reservations/table.styles'

export default function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <div onClick={e => { e.stopPropagation(); onChange() }} style={checkboxStyle(checked || indeterminate)}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {indeterminate && !checked && <div style={{ width:7, height:4, background:GOLD }} />}
    </div>
  )
}
