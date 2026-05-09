import Label from './Label'

export default function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
