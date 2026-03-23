import ReservationsFilters from '../components/Reservations/ReservationsFilters/index'
import ReservationsTable from '../components/Reservations/ReservationsTable/index'
import ReservationModal from '../components/Reservations/ReservationModal/index'

const Reservations = () => {
  return (
    <div>
      <ReservationsFilters />
      <ReservationsTable />
      <ReservationModal />
    </div>
  )
}

export default Reservations