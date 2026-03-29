import '../../styles/Reports/SectionTitle.css'

const DARK = '#423428'
const GOLD = '#c8a97e'
const GOLD_DK = '#a8834e'

export default function SectionTitle({ title, sub, count }) {
  return (
    <div className="section-title">
      <div>
        <h2 className="section-title__h2">{title}</h2>
        {sub && <p className="section-title__sub">{sub}</p>}
      </div>
      {count !== undefined && (
        <span className="section-title__badge">{count}</span>
      )}
    </div>
  )
}