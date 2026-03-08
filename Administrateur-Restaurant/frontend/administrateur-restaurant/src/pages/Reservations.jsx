import { useLocation } from 'react-router-dom'
import useReservations from '../hooks/Reservations/useReservations'
import ReservationsFilters from '../components/Reservations/ReservationsFilters'
import ReservationsTable   from '../components/Reservations/ReservationsTable'
import ReservationModal    from '../components/Reservations/ReservationModal'
import FadeUp from '../components/Dashboard/FadeUp'
import { Plus } from 'lucide-react'
import { useState } from 'react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function AddBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '13px 24px',
        background: hov ? DARK : GOLD,
        border: 'none', cursor: 'pointer',
        fontSize: 14, fontWeight: 900,
        color: hov ? GOLD : DARK,
        fontFamily: 'inherit', letterSpacing: '-0.2px',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      <Plus size={16} strokeWidth={2.5} />
      Nouvelle réservation
    </button>
  )
}

export default function Reservations() {
  const location = useLocation()
  const {
    filtered, loading, error,
    modalMode, setModalMode,
    form, setForm,
    editing,
    search, setSearch,
    filterStatus, setFilterStatus,
    filterDate, setFilterDate,
    clearFilters,
    openView,
    openEdit,
    openCreate,
    handleSubmit,
    handleCreate,
    handleDelete,
  } = useReservations(location.state)

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '40vh', fontSize: 14, fontWeight: 700, color: '#bbb',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    }}>
      Chargement…
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#faf8f5',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,40px)',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <FadeUp delay={0}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
              Réservations
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: GOLD }}>
              Gérez et modifiez les réservations
            </p>
          </div>
          <AddBtn onClick={openCreate} />
        </div>
      </FadeUp>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 20, padding: '12px 18px', background: '#fdf0f0', borderLeft: `3px solid #b94040`, fontSize: 13, fontWeight: 700, color: '#b94040' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <FadeUp delay={40}>
        <ReservationsFilters
          search={search} setSearch={setSearch}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterDate={filterDate} setFilterDate={setFilterDate}
          clearFilters={clearFilters}
        />
      </FadeUp>

      {/* Count */}
      <FadeUp delay={70}>
        <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {filtered.length} réservation{filtered.length !== 1 ? 's' : ''}
        </p>
      </FadeUp>

      {/* Table */}
      <FadeUp delay={100}>
        <ReservationsTable
          reservations={filtered}
          openView={openView}
          openEdit={openEdit}
          handleDelete={handleDelete}
        />
      </FadeUp>

      {/* Modal */}
      {modalMode && (
        <ReservationModal
          modalMode={modalMode}
          editing={editing}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          handleCreate={handleCreate}
          handleDelete={handleDelete}
          setModalMode={setModalMode}
        />
      )}
    </div>
  )
}