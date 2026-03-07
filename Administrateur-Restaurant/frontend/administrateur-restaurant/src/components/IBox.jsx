export default function IBox({ icon: Icon, color, bg, size = 20 }) {
    return (
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={size} color={color} strokeWidth={1.8} />
      </div>
    )
  }