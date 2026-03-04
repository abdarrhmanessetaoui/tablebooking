export default function StatCard({ label, value, change }) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4" style={{ borderLeftColor: '#c8a97e' }}>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">{label}</p>
        <p className="text-5xl font-bold text-gray-900">{value}</p>
        {change && <p className="text-xs text-gray-400 mt-3">{change}</p>}
      </div>
    )
  }