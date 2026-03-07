const statusStyle = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-600',
}

export default function ReservationsTable({ reservations, openEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
            <th className="px-4 sm:px-6 py-3">Name</th>
            <th className="px-4 sm:px-6 py-3">Phone</th>
            <th className="px-4 sm:px-6 py-3">Date</th>
            <th className="px-4 sm:px-6 py-3">Time</th>
            <th className="px-4 sm:px-6 py-3">Guests</th>
            <th className="px-4 sm:px-6 py-3">Service</th>
            <th className="px-4 sm:px-6 py-3">Status</th>
            <th className="px-4 sm:px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-4 sm:px-6 py-3 font-medium text-gray-700">{r.name || '—'}</td>
              <td className="px-4 sm:px-6 py-3 text-gray-500">{r.phone || '—'}</td>
              <td className="px-4 sm:px-6 py-3 text-gray-500">{r.date || '—'}</td>
              <td className="px-4 sm:px-6 py-3 text-gray-500">{r.start_time || '—'}</td>
              <td className="px-4 sm:px-6 py-3 text-gray-500">{r.guests || '—'}</td>
              <td className="px-4 sm:px-6 py-3 text-gray-500">{r.service || '—'}</td>
              <td className="px-4 sm:px-6 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[r.status] || 'bg-gray-100 text-gray-600'}`}>
                  {r.status || '—'}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-3">
                <button onClick={() => openEdit(r)} className="text-xs text-blue-500 hover:underline">
                  Edit Status
                </button>
              </td>
            </tr>
          ))}
          {reservations.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-400 text-sm">
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}