import useReports from  '../hooks/useReports'
import BarChart from '../components/Reports/BarChart'

export default function Reports() {
  const { data, loading, error } = useReports()

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Reports</h1>
        <p className="text-sm text-gray-400 mt-1">Booking analytics</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          <BarChart title="Most Booked Hours"    data={data.by_hour} color="#c8a97e" />
          <BarChart title="Reservations by Day"  data={data.by_day}  color="#c8a97e" />
        </div>
      )}

    </div>
  )
}