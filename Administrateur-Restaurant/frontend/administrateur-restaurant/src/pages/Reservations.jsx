import useReservations from '../hooks/useReservations'

const statusStyle = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Reservations() {
  const {
    reservations, loading, error,
    showModal, setShowModal,
    form, setForm,
    editing,
    openCreate, openEdit,
    handleSubmit, handleDelete,
  } = useReservations()

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Reservations</h1>
        <button
          onClick={openCreate}
          className="text-white text-sm font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#c8a97e' }}
        >
          + New Reservation
        </button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Guests</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 font-medium text-gray-700">{r.name}</td>
                <td className="px-6 py-3 text-gray-500">{r.phone || '—'}</td>
                <td className="px-6 py-3 text-gray-500">{r.date}</td>
                <td className="px-6 py-3 text-gray-500">{r.time}</td>
                <td className="px-6 py-3 text-gray-500">{r.guests}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-3">
                  <button onClick={() => openEdit(r)} className="text-xs text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">

            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editing ? 'Edit Reservation' : 'New Reservation'}
            </h2>

            <div className="flex flex-col gap-4">

              {[
                { label: 'Name',   key: 'name',  type: 'text' },
                { label: 'Email',  key: 'email', type: 'email' },
                { label: 'Phone',  key: 'phone', type: 'text' },
                { label: 'Date',   key: 'date',  type: 'date' },
                { label: 'Time',   key: 'time',  type: 'time' },
                { label: 'Guests', key: 'guests', type: 'number' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-500 px-4 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="text-white text-sm font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#c8a97e' }}
              >
                {editing ? 'Save Changes' : 'Create'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}