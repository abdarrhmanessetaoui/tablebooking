import useBlockedDates from '../hooks/useBlockedDates'
import BlockedDateForm from '../components/BlockedDateForm'
import BlockedDateList from '../components/BlockedDateList'

export default function BlockedDates() {
  const {
    blockedDates, loading, error,
    form, setForm,
    submitting,
    handleBlock, handleUnblock,
  } = useBlockedDates()

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading...</div>

  return (
    <div className="p-4 sm:p-8">

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Blocked Dates</h1>
        <p className="text-sm text-gray-400 mt-1">Dates blocked here cannot be booked by clients.</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">{error}</div>
      )}

      <BlockedDateForm
        form={form}
        setForm={setForm}
        handleBlock={handleBlock}
        submitting={submitting}
      />

      <BlockedDateList
        blockedDates={blockedDates}
        handleUnblock={handleUnblock}
      />

    </div>
  )
}