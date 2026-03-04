import useReports from '../hooks/useReports'
import BarChart from '../components/BarChart'

export default function Reports() {
  const { data, loading, error } = useReports()

  return (
    <div style={{ padding: '32px', minHeight: '100vh', background: '#15151c' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '22px', fontWeight: 800,
          color: '#fff', fontFamily: 'Georgia, serif', margin: 0,
        }}>
          Reports
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
          Booking analytics
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', fontSize: '12px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <BarChart
            title="Most Booked Hours"
            data={data.by_hour}
            color="#c8a97e"
          />
          <BarChart
            title="Reservations by Day"
            data={data.by_day}
            color="#4ade80"
          />
        </div>
      )}

    </div>
  )
}