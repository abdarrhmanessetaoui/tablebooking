export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      {icon && (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50">
          {}
        </div>
      )}
      <div>
        <p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
      </div>
    </div>
  )
}