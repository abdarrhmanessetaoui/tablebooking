import { GOLD } from '../../../styles/reservations/tokens'
import { inputStyle } from '../../../styles/reservations/modal.styles'
import Label from './Label'
export default function TextInput({ label, value, onChange, type='text', required }) {
  return (
    <div>
      <Label text={label + (required?' *':'')} />
      <input type={type} value={value??''} onChange={e=>onChange(e.target.value)}
        style={inputStyle}
        onFocus={e=>e.target.style.borderColor=GOLD}
        onBlur={e=>e.target.style.borderColor='#e8e0d8'} />
    </div>
  )
}
