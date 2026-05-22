import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Plus, FileDown, Trash2, CheckCircle,
  Clock, XCircle, X
} from 'lucide-react'
import useReservations from '../hooks/Reservations/useReservations'
import useServices     from '../hooks/Reservations/useServices'
import ReservationsFilters from '../components/Reservations/ReservationsFilters/index'
import ReservationsTable   from '../components/Reservations/ReservationsTable/index'
import ReservationModal    from '../components/Reservations/ReservationModal/index'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import Btn      from '../components/Dashboard/Btn'
import { getToken } from '../utils/auth'
import { exportPDF } from '../utils/export'
import { toast }   from '../components/ui/Toast'
import { confirm } from '../components/ui/ConfirmDialog'
import { apiPath } from '../utils/api'
import {
  page, header, headerLeft, h1, subtitle, divider, errorBanner
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, DARK_LIGHT, LIGHT_BROWN, BROWN_LT, WHITE, BORDER, RADIUS
} from '../styles/dashboard/tokens'

function BulkBar({ count, onDelete, onStatus, onClear }) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      padding: '12px 16px',
      background: LIGHT_BROWN,
      marginBottom: 16,
      borderRadius: RADIUS.sm,
      color: WHITE,
      direction: isAr ? 'rtl' : 'ltr'
    }}>

      {[
        { status: 'Confirmed', label: t('status_confirmed'), bg: WHITE, color: LIGHT_BROWN },
        { status: 'Pending',   label: t('status_pending'),   bg: WHITE, color: LIGHT_BROWN },
        { status: 'Cancelled', label: t('status_cancelled'), bg: WHITE, color: LIGHT_BROWN },
      ].map(({ status, label, bg, color }) => (
        <button key={status} onClick={() => onStatus(status)}
          style={{
            padding: '6px 12px', background: bg, border: 'none',
            color: color, fontSize: 11, fontWeight: 900,
            cursor: 'pointer', borderRadius: RADIUS.sm, fontFamily: 'inherit',
            transition: 'opacity 0.2s', textTransform: 'uppercase'
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          {label}
        </button>
      ))}

      <button onClick={onDelete}
        style={{
          padding: '6px 12px', background: '#EF4444', border: '1px solid #EF4444',
          color: WHITE, fontSize: 11, fontWeight: 900,
          cursor: 'pointer', borderRadius: RADIUS.sm, fontFamily: 'inherit',
          textTransform: 'uppercase', transition: 'all 0.2s'
        }}
      >
        {t('delete_btn')}
      </button>

      <button onClick={onClear}
        className="tbl-list__banner-action"
        style={{
          marginLeft: isAr ? '0' : 'auto', 
          marginRight: isAr ? 'auto' : '0',
          padding: '4px 12px',
          background: WHITE, color: LIGHT_BROWN, border: 'none',
          fontSize: 11, fontWeight: 900, borderRadius: RADIUS.sm,
          cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'inherit'
        }}
      >
        {t('deselect_all')}
      </button>
    </div>
  )
}

export default function Reservations() {
  const { t } = useTranslation()
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
    filterTable,   setFilterTable,
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

  useEffect(() => {
    if (!loading) {
      window.dispatchEvent(new CustomEvent('app-ready'))
    }
  }, [loading])

  async function handleExportPDF() {
    setExporting(true)
    try {
      await exportPDF(null, filteredLocal, t('reservations_list_title'))
      toast(t('status_updated_toast'), 'success')
    } catch(e) {
      console.error('PDF error:', e)
      toast(t('error_deleting_toast'), 'error')
    } finally {
      setExporting(false)
    }
  }

  async function handleBulkDelete() {
    const ok = await confirm({
      title: t('confirm_delete_bulk_title'),
      message: t('confirm_delete_bulk_msg', { count: selectedIds.length, plural: selectedIds.length > 1 ? 's' : '' }),
      sub: t('action_irreversible'),
      confirmLabel: t('delete_all_btn'),
      type: 'danger',
    })
    if (!ok) return
    const h = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    try {
      const response = await fetch(apiPath('restaurant/reservations/bulk-delete'), {
        method: 'POST',
        headers: h,
        body: JSON.stringify({ ids: selectedIds }),
      })
      if (!response.ok) throw new Error()
      
      setReservations(prev => prev.filter(r => !selectedIds.includes(r.id)))
      toast(t('reservations_deleted_toast', { count: selectedIds.length, plural: selectedIds.length > 1 ? 's' : '' }), 'warning')
      setSelectedIds([])
    } catch {
      toast(t('error_deleting_toast'), 'error')
    }
  }

  async function handleBulkStatus(status) {
    const labels = {
      Confirmed: t('confirmed_toast'),
      Pending: t('pending_toast'),
      Cancelled: t('cancelled_toast')
    }
    const h = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    try {
      const response = await fetch(apiPath('restaurant/reservations/bulk-status'), {
        method: 'POST',
        headers: h,
        body: JSON.stringify({ ids: selectedIds, status }),
      })
      if (!response.ok) throw new Error()

      setReservations(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status } : r))
      toast(`${selectedIds.length} ${t(selectedIds.length > 1 ? 'reservation_plural' : 'reservation')} ${labels[status]}`, 'success')
      setSelectedIds([])
    } catch {
      toast(t('error_updating_toast'), 'error')
    }
  }

  function handleTableAssigned(updatedReservation) {
    setReservations(prev =>
      prev.map(r => r.id === updatedReservation.id ? updatedReservation : r)
    )
  }

  if (loading) return <Spinner fullPage />

    return (
    <>

      <div style={page}>
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1}>{t('reservations_list_title')}</h1>

            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Btn icon={FileDown} onClick={handleExportPDF} disabled={exporting}>
                {exporting ? t('exporting') : t('export_pdf')}
              </Btn>
              <Btn icon={Plus} primary onClick={openCreate}>
                {t('new_reservation')}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <div style={divider} />

        {error && (
          <FadeUp delay={0}>
            <div style={errorBanner}>
              {error}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={20}>
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

        {selectedIds.length > 0 && (
          <FadeUp delay={0}>
            <BulkBar
              count={selectedIds.length}
              onDelete={handleBulkDelete}
              onStatus={handleBulkStatus}
              onClear={() => setSelectedIds([])}
            />
          </FadeUp>
        )}

        <FadeUp delay={40}>
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
