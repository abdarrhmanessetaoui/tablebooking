import { B } from '../../utils/brand'

export default function Spinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: B.pageBg, gap: 14,
    }}>
      <div style={{
        width: 34, height: 34,
        border: `3px solid ${B.border}`,
        borderTop: `3px solid ${B.gold}`,
        borderRadius: '50%',
        animation: 'sp 0.7s linear infinite',
      }} />
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: B.inkMute }}>Chargement...</p>
      <style>{`@keyframes sp { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}