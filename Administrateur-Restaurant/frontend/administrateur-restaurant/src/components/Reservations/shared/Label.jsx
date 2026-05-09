import { DARK } from '../../../styles/reservations/tokens'
export default function Label({ text }) {
  return <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:900, color:DARK, letterSpacing:'0.12em', textTransform:'uppercase' }}>{text}</p>
}
