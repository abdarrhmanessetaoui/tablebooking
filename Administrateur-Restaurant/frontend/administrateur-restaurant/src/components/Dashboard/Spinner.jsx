import { B } from '../../utils/brand'

export default function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: B.bg }}>
      <div style={{
        width: 28, height: 28,
        border: `2.5px solid ${B.border}`,
        borderTop: `2.5px solid ${B.warm}`,
        borderRadius: '50%',
        animation: 'spin 0.65s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}