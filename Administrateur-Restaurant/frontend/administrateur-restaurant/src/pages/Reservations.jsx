import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'

import useReservations from '../hooks/Reservations/useReservations'
import useServices     from '../hooks/Reservations/useServices'
import ReservationsFilters from '../components/Reservations/ReservationsFilters/index'
import ReservationsTable   from '../components/Reservations/ReservationsTable/index'
import ReservationModal    from '../components/Reservations/ReservationModal/index'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import { getToken } from '../utils/auth'
import { toast }   from '../components/ui/Toast'
import { confirm } from '../components/ui/ConfirmDialog'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

function Btn({ children, onClick, primary, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 20px',
        background: DARK, border: 'none', color: GOLD,
        fontSize: 13, fontWeight: 900,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit', whiteSpace: 'nowrap',
        textTransform: 'uppercase'
      }}
    >
      <span className="btn-label">{children}</span>
    </button>
  )
}

function BulkBar({ count, onDelete, onStatus, onClear }) {
  return (
    <div style={{
      position: 'sticky', top: 8, zIndex: 30,
      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      padding: '10px 16px',
      background: DARK,
      border: `2px solid ${GOLD}`,
      marginBottom: 12,
    }}>
      <style>{`
        @media (max-width: 600px) {
          .btn-label  { display: none !important; }
          .bulk-label { display: none !important; }
        }
      `}</style>

      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 26, height: 26,
        background: GOLD, color: DARK,
        fontSize: 12, fontWeight: 900, padding: '0 7px', flexShrink: 0,
      }}>{count}</span>
      <span className="bulk-label" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginRight: 2 }}>
        sélectionné{count > 1 ? 's' : ''}
      </span>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', margin: '0 2px', flexShrink: 0 }} />

      {[
        { status: 'Confirmed', label: 'Confirmer',  color: '#00A651' },
        { status: 'Pending',   label: 'En attente', color: GOLD      },
        { status: 'Cancelled', label: 'Annuler',    color: '#FF0000' },
      ].map(({ status, label, color }) => (
        <button key={status} onClick={() => onStatus(status)}
          style={{
            padding: '7px 12px',
            background: color,
            border: 'none',
            color: color === GOLD ? DARK : '#fff',
            fontSize: 11, fontWeight: 900,
            cursor: 'pointer', fontFamily: 'inherit',
            flexShrink: 0, textTransform: 'uppercase'
          }}
        >
          {label}
        </button>
      ))}

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', margin: '0 2px', flexShrink: 0 }} />

      <button onClick={onDelete}
        style={{
          padding: '7px 12px',
          background: '#FF0000',
          border: 'none',
          color: '#fff',
          fontSize: 11, fontWeight: 900,
          cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0, textTransform: 'uppercase'
        }}
      >
        Supprimer
      </button>

      <button onClick={onClear}
        style={{
          marginLeft: 'auto',
          padding: '7px 12px',
          background: GOLD, border: 'none',
          color: DARK,
          fontSize: 11, fontWeight: 900,
          cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0, textTransform: 'uppercase'
        }}
      >
        Désélectionner
      </button>
    </div>
  )
}

function exportReservationsPDF(reservations) {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
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

  const cols = [['Nom', 42], ['Téléphone', 32], ['Date', 26], ['Heure', 22], ['Personnes', 22], ['Statut', 26]]
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

  const STATUS_COLORS = { Confirmed: [45,106,45], Pending: [168,131,78], Cancelled: [185,64,64] }
  reservations.forEach((r, i) => {
    if (y > 270) { doc.addPage(); y = 20 }
    const rowBg = i % 2 === 0 ? [255,255,255] : [250,248,245]
    doc.setFillColor(...rowBg)
    doc.rect(PAD, y, W - PAD * 2, 8, 'F')
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(43, 33, 24)
    let rx = PAD + 3
    const vals   = [r.name||'—', r.phone||'—', r.date||'—', r.start_time||'—', r.guests||'—']
    const widths = [42, 32, 26, 22, 22]
    vals.forEach((v, vi) => { doc.text(String(v).substring(0,18), rx, y+5.5); rx += widths[vi] })
    const sc = STATUS_COLORS[r.status] || [120,120,120]
    doc.setTextColor(...sc)
    doc.setFont('helvetica', 'bold')
    doc.text(r.status === 'Confirmed' ? 'Confirmée' : r.status === 'Pending' ? 'En attente' : 'Annulée', rx, y+5.5)
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
  const navigate  = useNavigate()
  const [exporting,   setExporting]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  const { services } = useServices()

  const {
    filtered: filteredFromHook, loading, error,
    modalMode, setModalMode,
    form, setForm,
    editing,
    search,        setSearch,
    filterStatus,  setFilterStatus,
    filterService, setFilterService,
    filterDate,    setFilterDate,
    filterTable,   setFilterTable,   // ← added
    clearFilters: _clearFilters,
    openView, openEdit, openCreate,
    handleSubmit, handleCreate, handleDelete,
    setReservations,
  } = useReservations(location.state)

  function clearFilters() {
    _clearFilters()
    navigate('/reservations', { replace: true, state: null })
  }

  useEffect(() => {
    const fromDashboard = !!(location.state?.filterDate || location.state?.openId)
    if (fromDashboard) {
      setFilterStatus('all')
    } else {
      if (!location.state?.filterStatus) setFilterStatus('Pending')
      if (!location.state?.filterDate)   setFilterDate(new Date().toISOString().slice(0, 7))
    }
  }, []) // eslint-disable-line

  const filteredLocal = useMemo(() => {
    const base = Array.isArray(filteredFromHook) ? filteredFromHook : []
    const openId = location.state?.openId
    if (openId) {
      const match = base.find(r => r.id === openId)
      return match ? [match] : []
    }
    if (!filterDate) return base
    if (/^\d{4}-\d{2}$/.test(filterDate)) {
      return base.filter(r => (r.date || '').startsWith(filterDate))
    }
    return base.filter(r => r.date === filterDate)
  }, [filteredFromHook, filterDate, location.state?.openId])

  useEffect(() => {
    const openId = location.state?.openId
    if (!openId || loading || !filteredLocal.length) return
    const target = filteredLocal.find(r => r.id === openId)
    if (target) openView(target)
  }, [location.state?.openId, loading, filteredLocal.length]) // eslint-disable-line

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
      exportReservationsPDF(filteredLocal)
      toast('PDF exporté avec succès', 'success')
    } catch(e) {
      console.error('PDF error:', e)
      toast('Impossible d\'exporter le PDF', 'error')
    } finally {
      setExporting(false)
    }
  }

  async function handleBulkDelete() {
    const ok = await confirm({
      title: 'Supprimer la sélection',
      message: `Voulez-vous supprimer ${selectedIds.length} réservation${selectedIds.length > 1 ? 's' : ''} ?`,
      sub: 'Cette action est irréversible.',
      confirmLabel: 'Tout supprimer',
      type: 'danger',
    })
    if (!ok) return
    const h = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    try {
      await Promise.all(selectedIds.map(id =>
        fetch(`http://localhost:8000/api/restaurant/reservations/${id}`, { method: 'DELETE', headers: h })
      ))
      setReservations(prev => prev.filter(r => !selectedIds.includes(r.id)))
      toast(`${selectedIds.length} réservation${selectedIds.length > 1 ? 's supprimées' : ' supprimée'}`, 'warning')
      setSelectedIds([])
    } catch {
      toast('Erreur lors de la suppression', 'error')
    }
  }

  async function handleBulkStatus(status) {
    const labels = { Confirmed: 'confirmées', Pending: 'mises en attente', Cancelled: 'annulées' }
    const h = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    try {
      await Promise.all(selectedIds.map(id =>
        fetch(`http://localhost:8000/api/restaurant/reservations/${id}/status`, {
          method: 'PATCH', headers: h,
          body: JSON.stringify({ status }),
        })
      ))
      setReservations(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status } : r))
      toast(`${selectedIds.length} réservation${selectedIds.length > 1 ? 's' : ''} ${labels[status]}`, 'success')
      setSelectedIds([])
    } catch {
      toast('Erreur lors de la mise à jour', 'error')
    }
  }

  function handleTableAssigned(updatedReservation) {
    setReservations(prev =>
      prev.map(r => r.id === updatedReservation.id ? updatedReservation : r)
    )
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Réservations
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD }}>
                {filteredLocal.length} réservation{filteredLocal.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn primary onClick={handleExportPDF} disabled={exporting}>
                {exporting ? 'Export…' : 'Exporter PDF'}
              </Btn>
               <Btn onClick={openCreate}>
                Nouvelle réservation
              </Btn>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, marginBottom: 24 }} />
        </FadeUp>

        {error && (
          <FadeUp delay={20}>
            <div style={{ marginBottom: 16, padding: '11px 16px', background: '#FF0000', fontSize: 12, fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8 }}>
              {error}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={30}>
          <ReservationsFilters
            search={search}               setSearch={setSearch}
            filterStatus={filterStatus}   setFilterStatus={setFilterStatus}
            filterService={filterService} setFilterService={setFilterService}
            filterDate={filterDate}       setFilterDate={setFilterDate}
            filterTable={filterTable}     setFilterTable={setFilterTable}
            clearFilters={clearFilters}
            services={services}
          />
        </FadeUp>

        <FadeUp delay={50}>
          <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 800, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {filteredLocal.length} résultat{filteredLocal.length !== 1 ? 's' : ''}
          </p>
        </FadeUp>

        {selectedIds.length > 0 && (
          <BulkBar
            count={selectedIds.length}
            onDelete={handleBulkDelete}
            onStatus={handleBulkStatus}
            onClear={() => setSelectedIds([])}
          />
        )}

        <FadeUp delay={70}>
          <ReservationsTable
            reservations={filteredLocal}
            openView={openView}
            openEdit={openEdit}
            handleDelete={handleDelete}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            highlightId={location.state?.openId ?? null}
            onTableAssigned={handleTableAssigned}
          />
        </FadeUp>

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
            services={services}
          />
        )}
      </div>
    </>
  )
}