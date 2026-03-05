export default function StatCard({ label, value, icon, color = '#6b7280', bg = '#f9fafb' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  )
}