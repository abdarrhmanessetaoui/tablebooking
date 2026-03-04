const fields = [
    { label: 'Name',   key: 'name',   type: 'text'   },
    { label: 'Email',  key: 'email',  type: 'email'  },
    { label: 'Phone',  key: 'phone',  type: 'text'   },
    { label: 'Date',   key: 'date',   type: 'date'   },
    { label: 'Time',   key: 'time',   type: 'time'   },
    { label: 'Guests', key: 'guests', type: 'number' },
  ]
  
  export default function ReservationModal({ editing, form, setForm, handleSubmit, setShowModal }) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 sm:p-6 max-h-screen overflow-y-auto">
  
          <h2 className="text-base font-semibold text-gray-800 mb-5">
            {editing ? 'Edit Reservation' : 'New Reservation'}
          </h2>
  
          <div className="flex flex-col gap-4">
            {fields.map(field => (
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
    )
  }