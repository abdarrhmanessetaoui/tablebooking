// Replace these states:
const [filterStatus,   setFilterStatus]   = useState('all')
// With:
const [filterStatuses, setFilterStatuses] = useState([])
const [filterServices, setFilterServices] = useState([])

// Update clearFilters:
function clearFilters() {
  setSearch('')
  setFilterStatuses([])
  setFilterServices([])
  setFilterDate('')
}

// Update your filter logic:
const filtered = reservations.filter(r => {
  if (search && !r.name?.toLowerCase().includes(search.toLowerCase()) &&
      !r.phone?.includes(search) && !r.email?.toLowerCase().includes(search.toLowerCase())) return false
  if (filterStatuses.length > 0 && !filterStatuses.includes(r.status)) return false
  if (filterServices.length > 0 && !filterServices.includes(r.service)) return false
  if (filterDate && r.date !== filterDate) return false
  return true
})

// Pass to component:
<ReservationsFilters
  search={search}               setSearch={setSearch}
  filterStatuses={filterStatuses} setFilterStatuses={setFilterStatuses}
  filterServices={filterServices} setFilterServices={setFilterServices}
  filterDate={filterDate}       setFilterDate={setFilterDate}
  clearFilters={clearFilters}
/>