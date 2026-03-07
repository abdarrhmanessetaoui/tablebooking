import { useState } from 'react'
import useReservations from '../hooks/Reservations/useReservations'
import ReservationsFilters from '../components/Reservations/ReservationsFilters'
import ReservationsTable   from '../components/Reservations/ReservationsTable'
import ReservationModal    from '../components/Reservations/ReservationModal'
import FadeUp from '../components/Dashboard/FadeUp'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

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
    openEdit,
    handleSubmit,
  } = useReservations()

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
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900,
            color: DARK, letterSpacing: '-1.5px', lineHeight: 1,
          }}>
            Réservations
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: GOLD }}>
            Gérez et modifiez les réservations
          </p>
        </div>
      </FadeUp>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 20, padding: '12px 18px',
          background: '#fdf0f0', borderLeft: `3px solid #b94040`,
          fontSize: 13, fontWeight: 700, color: '#b94040',
        }}>
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
        <ReservationsTable reservations={filtered} openEdit={openEdit} />
      </FadeUp>

      {/* Modal */}
      {showModal && editing && (
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