export default function BlockedDateForm({ form, setForm, handleBlock, submitting }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Block a Date</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleBlock}
            disabled={submitting || !form.date}
            className="text-white text-sm font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#c8a97e' }}
          >
            {submitting ? 'Blocking...' : 'Block Date'}
          </button>
        </div>
      </div>
    </div>
  )
}