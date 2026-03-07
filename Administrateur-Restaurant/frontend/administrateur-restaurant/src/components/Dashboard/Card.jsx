// Flat card — no background, no border, no hover. Just a layout wrapper.
export default function Card({ children, onClick, style = {}, padding = '28px 30px' }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function useCardHover() {
  return { hov: false, bind: {} }
}