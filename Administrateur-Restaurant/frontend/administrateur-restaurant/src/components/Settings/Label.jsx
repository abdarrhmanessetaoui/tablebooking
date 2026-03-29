import { DARK } from './constants'

export default function Label({ children }) {
  return (
    <p style={{
      margin: '0 0 6px',
      fontSize: 9,
      fontWeight: 900,
      color: DARK,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  )
}