import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Plus, RefreshCw, FileDown } from 'lucide-react'
import useReservations from '../hooks/Reservations/useReservations'
import ReservationsFilters from '../components/Reservations/ReservationsFilters'
import ReservationsTable   from '../components/Reservations/ReservationsTable'
import ReservationModal    from '../components/Reservations/ReservationModal'
import FadeUp from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '13px 24px',
        background: bg, border: 'none', color,
        fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', letterSpacing: '-0.2px', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      {children}
    </button>
  )
}

function exportReservationsPDF(reservations) {
  const { jsPDF } = window.jspdf
  const doc       = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, PAD = 20
  let y = 0

  doc.setFillColor(43, 33, 24)
  doc.rect(0, 0, W, 26, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(200, 169, 126)
  doc.text('TableBooking', PAD, 17)
  doc.setTextColor(255, 255, 255)
  doc.text('.ma', PAD + 39, 17)
  const now = new Date().toLocaleString('fr-FR')
  doc.setFontSize(8)
  doc.setTextColor(200, 169, 126)
  doc.text(now, W - PAD, 17, { align: 'right' })
  y = 38

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(43, 33, 24)
  doc.text('Réservations', PAD, y)
  y += 6
  doc.setFillColor(43, 33, 24)
  doc.rect(PAD, y, W - PAD * 2, 0.5, 'F')
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 100, 80)
  doc.text(`${reservations.length} réservation${reservations.length !== 1 ? 's' : ''}`, PAD, y)
  y += 10

  const cols = [['Nom', 42], ['Téléphone', 32], ['Date', 26], ['Heure', 22], ['Couverts', 22], ['Statut', 26]]
  doc.setFillColor(43, 33, 24)
  doc.rect(PAD, y, W - PAD * 2, 8, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(200, 169, 126)
  let x = PAD + 3
  cols.forEach(([label]) => {
    doc.text(label.toUpperCase(), x, y + 5.5)
    x += cols.find(c => c[0] === label)[1]
  })
  y += 8

  const STATUS_COLORS = {
    Confirmed: [45, 106, 45],
    Pending:   [168, 131, 78],
    Cancelled: [185, 64, 64],
  }

  reservations.forEach((r, i) => {
    if (y > 270) { doc.addPage(); y = 20 }
    const rowBg = i % 2 === 0 ? [255, 255, 255] : [250, 248, 245]
    doc.setFillColor(...rowBg)
    doc.rect(PAD, y, W - PAD * 2, 8, 'F')
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(43, 33, 24)
    let rx = PAD + 3
    const vals   = [r.name||'—', r.phone||'—', r.date||'—', r.start_time||'—', r.guests||'—']
    const widths = [42, 32, 26, 22, 22]
    vals.forEach((v, vi) => { doc.text(String(v).substring(0, 18), rx, y + 5.5); rx += widths[vi] })
    const sc = STATUS_COLORS[r.status] || [120, 120, 120]
    doc.setTextColor(...sc)
    doc.setFont('helvetica', 'bold')
    doc.text(r.status === 'Confirmed' ? 'Confirmée' : r.status === 'Pending' ? 'En attente' : 'Annulée', rx, y + 5.5)
    y += 8
  })

  doc.setDrawColor(200, 169, 126)
  doc.setLineWidth(0.5)
  doc.line(PAD, 287, W - PAD, 287)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 169, 126)
  doc.text('TableBooking.ma', PAD, 292)
  doc.text(`Exporté le ${now}`, W - PAD, 292, { align: 'right' })

  doc.save(`reservations-${new Date().toISOString().slice(0,10)}.pdf`)
}

export default function Reservations() {
  const location = useLocation()
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  const {
    filtered, loading, error,
    modalMode, setModalMode,
    form, setForm,
    editing,
    search,        setSearch,
    filterStatus,  setFilterStatus,
    filterService, setFilterService,
    filterDate,    setFilterDate,
    clearFilters,
    openView,
    openEdit,
    openCreate,
    handleSubmit,
    handleCreate,
    handleDelete,
    fetchReservations,
  } = useReservations(location.state)

  async function handleRefresh() {
    setRefreshing(true)
    try { await fetchReservations() } finally { setRefreshing(false) }
  }

  async function handleExportPDF() {
    setExporting(true)
    try {
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = resolve; s.onerror = reject
          document.head.appendChild(s)
        })
      }
      exportReservationsPDF(filtered)
    } catch(e) {
      console.error('PDF error:', e)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh', background: '#faf8f5',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,40px)',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <FadeUp delay={0}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
              Réservations
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: GOLD }}>
              Gérez et modifiez les réservations
            </p>
          </div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Actualisation…' : 'Actualiser'}
            </Btn>
            <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>
              {exporting ? 'Génération…' : 'Exporter PDF'}
            </Btn>
            <Btn icon={Plus} onClick={openCreate}>
              Nouvelle réservation
            </Btn>
          </div>
        </div>
      </FadeUp>

      {/* Divider */}
      <FadeUp delay={20}>
        <div style={{ height: 2, background: DARK, marginBottom: 36 }} />
      </FadeUp>

      {/* Error */}
      {error && (
        <FadeUp delay={30}>
          <div style={{ marginBottom: 20, padding: '12px 18px', background: '#fdf0f0', borderLeft: '3px solid #b94040', fontSize: 13, fontWeight: 700, color: '#b94040' }}>
            ⚠️ {error}
          </div>
        </FadeUp>
      )}

      {/* Filters */}
      <FadeUp delay={40}>
        <ReservationsFilters
          search={search}               setSearch={setSearch}
          filterStatus={filterStatus}   setFilterStatus={setFilterStatus}
          filterService={filterService} setFilterService={setFilterService}
          filterDate={filterDate}       setFilterDate={setFilterDate}
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