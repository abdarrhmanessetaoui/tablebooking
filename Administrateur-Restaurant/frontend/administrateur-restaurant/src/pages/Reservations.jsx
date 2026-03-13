import { useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import {
  Plus, FileDown, Trash2, CheckCircle,
  Clock, XCircle, X
} from 'lucide-react'
import useReservations from '../hooks/Reservations/useReservations'
import useServices     from '../hooks/Reservations/useServices'
import ReservationsFilters from '../components/Reservations/ReservationsFilters'
import ReservationsTable   from '../components/Reservations/ReservationsTable'
import ReservationModal    from '../components/Reservations/ReservationModal'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import { getToken } from '../utils/auth'
import { toast }   from '../components/ui/Toast'
import { confirm } from '../components/ui/ConfirmDialog'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 20px',
        background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

function BulkBar({ count, onDelete, onStatus, onClear }) {
  const [hovDel, setHovDel] = useState(false)
  return (
    <div style={{
      position: 'sticky', top: 8, zIndex: 30,
      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      padding: '10px 16px',
      background: DARK,
      boxShadow: '0 4px 24px rgba(43,33,24,0.28)',
      marginBottom: 12,
      animation: 'slideDown 0.18s ease',
    }}>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
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
        { status: 'Confirmed', label: 'Confirmer',  Icon: CheckCircle, color: '#4ade80' },
        { status: 'Pending',   label: 'En attente', Icon: Clock,       color: GOLD      },
        { status: 'Cancelled', label: 'Annuler',    Icon: XCircle,     color: '#f87171' },
      ].map(({ status, label, Icon, color }) => (
        <button key={status} onClick={() => onStatus(status)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        >
          <Icon size={13} strokeWidth={2.5} />
          <span className="btn-label">{label}</span>
        </button>
      ))}

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)', margin: '0 2px', flexShrink: 0 }} />

      <button onClick={onDelete}
        onMouseEnter={() => setHovDel(true)} onMouseLeave={() => setHovDel(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 12px',
          background: hovDel ? '#ef4444' : 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: hovDel ? '#fff' : '#f87171',
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s', flexShrink: 0,
        }}
      >
        <Trash2 size={13} strokeWidth={2.5} />
        <span className="btn-label">Supprimer</span>
      </button>

      <button onClick={onClear}
        style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 10px',
          background: 'none', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
      >
        <X size={13} strokeWidth={2.5} />
        <span className="btn-label">Désélectionner</span>
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
  const [exporting,   setExporting]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  // Track if we arrived from Dashboard — cleared once modal opens so filters work normally
  const [comingFromDashboard, setComingFromDashboard] = useState(!!location.state?.openId)

  const { services } = useServices()

  const {
    filtered, loading, error,
    modalMode, setModalMode,
    form, setForm, editing,
    search,           setSearch:        _setSearch,
    filterStatus,     setFilterStatus:  _setFilterStatus,
    filterService,    setFilterService: _setFilterService,
    filterDate,       setFilterDate:    _setFilterDate,
    clearFilters:     _clearFilters,
    openView, openEdit, openCreate,
    handleSubmit, handleCreate, handleDelete,
    setReservations,
  } = useReservations(location.state)

  // Wrap every filter setter — as soon as user touches a filter, exit dashboard mode
  function setSearch(v)        { setComingFromDashboard(false); _setSearch(v) }
  function setFilterStatus(v)  { setComingFromDashboard(false); _setFilterStatus(v) }
  function setFilterService(v) { setComingFromDashboard(false); _setFilterService(v) }
  function setFilterDate(v)    { setComingFromDashboard(false); _setFilterDate(v) }
  function clearFilters()      { setComingFromDashboard(false); _clearFilters() }

  // ── Default filters on mount ──────────────────────────────────────────────
  // When coming from Dashboard with openId:
  //   • keep filterDate as-is (already set to the day from Dashboard)
  //   • set filterStatus to 'all' so the target reservation is always visible
  // Otherwise apply normal defaults (current month, Pending)
  useEffect(() => {
    if (comingFromDashboard) {
      // Dashboard passes filterDate (YYYY-MM-DD) — keep it, just show all statuses
      setFilterStatus('all')
      // If no filterDate came through, default to today
      if (!location.state?.filterDate) {
        setFilterDate(new Date().toISOString().slice(0, 10))
      }
    } else {
      // Normal entry: default to current month + Pending
      if (!location.state?.filterDate) {
        setFilterDate(new Date().toISOString().slice(0, 7)) // YYYY-MM (month only)
      }
      if (!location.state?.filterStatus) {
        setFilterStatus('Pending')
      }
    }
  }, []) // eslint-disable-line

  // ── Local date filtering ──────────────────────────────────────────────────
  // filterDate can be:
  //   YYYY-MM-DD  → exact day match
  //   YYYY-MM     → whole month match
  const filteredLocal = useMemo(() => {
    const base = Array.isArray(filtered) ? filtered : []

    // Dashboard navigation: show ONLY the selected reservation in the table
    if (comingFromDashboard && location.state?.openId) {
      return base.filter(r => r.id === location.state.openId)
    }

    if (!filterDate) return base
    if (filterDate.length === 10) {
      return base.filter(r => r.date === filterDate)
    }
    const month = filterDate.slice(0, 7)
    return base.filter(r => (r.date || '').startsWith(month))
  }, [filtered, filterDate, comingFromDashboard, location.state?.openId])

  // ── Open reservation modal when navigated from Dashboard ─────────────────
  // We search ALL reservations (not just filteredLocal) so status filter
  // never blocks finding the target reservation.
  useEffect(() => {
    const openId = location.state?.openId
    if (!openId || loading) return

    const allRes = Array.isArray(filtered) ? filtered : []

    // Try filteredLocal first; fall back to all reservations
    const target =
      filteredLocal.find(r => r.id === openId) ||
      allRes.find(r => r.id === openId)

    if (target) {
      openView(target)
    }
  }, [location.state?.openId, loading, filtered]) // eslint-disable-line

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
      title:        'Supprimer la sélection',
      message:      `Voulez-vous supprimer ${selectedIds.length} réservation${selectedIds.length > 1 ? 's' : ''} ?`,
      sub:          'Cette action est irréversible.',
      confirmLabel: 'Tout supprimer',
      type:         'danger',
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
        minHeight: '100vh', background: '#faf8f5',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
            marginBottom: 28, flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{
                margin: 0, fontSize: 'clamp(22px,4vw,36px)',
                fontWeight: 900, color: DARK,
                letterSpacing: '-1.5px', lineHeight: 1,
              }}>
                Réservations
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD }}>
                {filteredLocal.length} réservation{filteredLocal.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>
                {exporting ? 'Export…' : 'Exporter PDF'}
              </Btn>
              <Btn icon={Plus} onClick={openCreate}>
                Nouvelle réservation
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, marginBottom: 24 }} />
        </FadeUp>

        {/* ERROR */}
        {error && (
          <FadeUp delay={20}>
            <div style={{
              marginBottom: 16, padding: '11px 16px',
              background: '#fdf0f0', borderLeft: '3px solid #b94040',
              fontSize: 12, fontWeight: 700, color: '#b94040',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <XCircle size={14} strokeWidth={2.5} />
              {error}
            </div>
          </FadeUp>
        )}

        {/* FILTERS */}
        <FadeUp delay={30}>
          <ReservationsFilters
            search={search}               setSearch={setSearch}
            filterStatus={filterStatus}   setFilterStatus={setFilterStatus}
            filterService={filterService} setFilterService={setFilterService}
            filterDate={filterDate}       setFilterDate={setFilterDate}
            clearFilters={clearFilters}
            services={services}
          />
        </FadeUp>

        {/* COUNT */}
        <FadeUp delay={50}>
          <p style={{
            margin: '0 0 10px',
            fontSize: 11, fontWeight: 800, color: '#bbb',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {filteredLocal.length} résultat{filteredLocal.length !== 1 ? 's' : ''}
          </p>
        </FadeUp>

        {/* BULK BAR */}
        {selectedIds.length > 0 && (
          <BulkBar
            count={selectedIds.length}
            onDelete={handleBulkDelete}
            onStatus={handleBulkStatus}
            onClear={() => setSelectedIds([])}
          />
        )}

        {/* TABLE */}
        <FadeUp delay={70}>
          <ReservationsTable
            reservations={filteredLocal}
            openView={openView}
            openEdit={openEdit}
            handleDelete={handleDelete}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            highlightId={location.state?.openId ?? null}
          />
        </FadeUp>

        {/* MODAL */}
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