import useCountUp from '../../hooks/Dashboard/useCountUp'
import '../../styles/Reports/SumCard.css'

const DARK = '#423428'

export default function SumCard({ icon: Icon, value, label, accent, bg, delay = 0 }) {
  const n = useCountUp(typeof value === 'number' ? value : 0, 700, delay)

  return (
    <div className="sumcard" style={{ background: bg, borderTop: `3px solid ${accent}` }}>
      <div className="sumcard__header">
        <Icon size={12} strokeWidth={2.5} color={accent} />
        <span className="sumcard__label" style={{ color: accent }}>{label}</span>
      </div>
      <p className="sumcard__value" style={{ color: DARK }}>
        {typeof value === 'string' ? value : n}
      </p>
    </div>
  )
}