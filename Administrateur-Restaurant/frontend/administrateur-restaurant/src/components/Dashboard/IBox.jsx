export default function IBox({ icon: Icon, color, bg, size = 22 }) {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 15, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={size} color={color} strokeWidth={2} />
    </div>
  )
}