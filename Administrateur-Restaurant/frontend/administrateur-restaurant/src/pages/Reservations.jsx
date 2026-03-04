import useReservations from '../hooks/useReservations'
import ReservationsFilters from '../components/ReservationsFilters'
import ReservationsTable from '../components/ReservationsTable'
import ReservationModal from '../components/ReservationModal'

export default function Reservations() {
  const {
    filtered, loading, error,
    showModal, setShowModal,
    form, setForm,
    editing,
    search, setSearch,
    filterStatus, setFilterStatus,
    filterDate, setFilterDate,
    clearFilters,
    openCreate, openEdit,
    handleSubmit, handleDelete,
  } = useReservations()

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading...</div>

  return (
    <div className="p-4 sm:p-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Reservations</h1>
        <button
          onClick={openCreate}
          className="text-white text-sm font-medium px-3 sm:px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#c8a97e' }}
        >
          + New
        </button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      <ReservationsFilters
        search={search} setSearch={setSearch}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterDate={filterDate} setFilterDate={setFilterDate}
        clearFilters={clearFilters}
      />

      <p className="text-xs text-gray-400 mb-3">{filtered.length} reservation{filtered.length !== 1 ? 's' : ''} found</p>

      <ReservationsTable
        reservations={filtered}
        openEdit={openEdit}
        handleDelete={handleDelete}
      />

      {showModal && (
        <ReservationModal
          editing={editing}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          setShowModal={setShowModal}
        />
      )}

    </div>
  )
}