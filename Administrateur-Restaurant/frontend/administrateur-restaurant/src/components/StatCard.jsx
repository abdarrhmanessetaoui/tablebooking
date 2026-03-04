export default function StatCard({ label, value, icon }) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4">
        <div className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(200,169,126,0.12)' }}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </div>
      </div>
    )
  }