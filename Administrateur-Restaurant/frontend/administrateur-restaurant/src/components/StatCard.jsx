export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      {icon && (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50">
          {icon}
        </div>
      )}
      <div>
   
      </div>
    </div>
  )
}