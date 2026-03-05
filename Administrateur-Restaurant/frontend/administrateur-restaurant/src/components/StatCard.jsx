export default function StatCard({ label, value, icon, accent = false }) {
  return (
    <div
      className="bg-white rounded-xl border p-5 flex items-center gap-4"
      style={{ borderColor: accent ? '#c8a97e' : '#e5e7eb', borderWidth: accent ? '2px' : '1px' }}
    >
      {icon && (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: accent ? 'rgba(200,169,126,0.15)' : '#f9fafb' }}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
      </div>
    </div>
  )
}