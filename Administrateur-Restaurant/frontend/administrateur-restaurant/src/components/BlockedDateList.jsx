export default function BlockedDateList({ blockedDates, handleUnblock }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[400px]">
        <thead>
          <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {blockedDates.map(d => (
            <tr key={d.date} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-700">{d.date}</td>
              <td className="px-6 py-3">
                <button
                  onClick={() => handleUnblock(d.date)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Unblock
                </button>
              </td>
            </tr>
          ))}
          {blockedDates.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-8 text-center text-gray-400 text-sm">
                No blocked dates.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}