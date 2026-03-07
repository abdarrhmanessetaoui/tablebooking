export default function IBox({ icon: Icon, color, bg, size = 18 }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 9,
      background: bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={size} color={color} strokeWidth={1.8} />
    </div>
  )
}