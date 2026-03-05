export default function ReservationModal({ editing, form, setForm, handleSubmit, setShowModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 sm:p-6">

        <h2 className="text-base font-semibold text-gray-800 mb-5">Edit Reservation</h2>

        {/* Readonly info */}
        <div className="flex flex-col gap-2 mb-5 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-medium text-gray-800">{editing.name || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Phone</span><span>{editing.phone || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{editing.date || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Time</span><span>{editing.start_time || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Guests</span><span>{editing.guests || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Service</span><span>{editing.service || '—'}</span></div>
          {editing.notes && <div className="flex justify-between"><span className="text-gray-400">Notes</span><span>{editing.notes}</span></div>}
        </div>

        {/* Only editable field */}
        <div className="mb-5">
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => setShowModal(false)} className="text-sm text-gray-500 px-4 py-1.5 rounded border border-gray-300 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-white text-sm font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#c8a97e' }}
          >
            Save Status
          </button>
        </div>

      </div>
    </div>
  )
}