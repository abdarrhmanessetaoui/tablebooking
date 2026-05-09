import useCountUp from '../../hooks/Dashboard/useCountUp'
import '../../styles/Reports/SumCard.css'

const DARK = '#2D2926'

export default function SumCard({ icon: Icon, value, label, accent, bg, delay = 0 }) {
  const n = useCountUp(typeof value === 'number' ? value : 0, 700, delay)

  return (
    <div className="sumcard" style={{ background: bg }}>
      <div className="sumcard__header">
        <span className="sumcard__label" style={{ color: DARK }}>{label}</span>
      </div>
      <p className="sumcard__value" style={{ color: DARK }}>
        {typeof value === 'string' ? value : n}
      </p>
    </div>
  )
}
