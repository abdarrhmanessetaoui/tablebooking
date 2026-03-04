export default function ReservationsFilters({ search, setSearch, filterStatus, setFilterStatus, filterDate, setFilterDate, clearFilters }) {
    const hasFilters = search || filterStatus !== 'all' || filterDate
  
    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
  
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 pl-9 text-sm text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
          />
        </div>
  
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
  
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
        />
  
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
          >
            Clear
          </button>
        )}
  
      </div>
    )
  }