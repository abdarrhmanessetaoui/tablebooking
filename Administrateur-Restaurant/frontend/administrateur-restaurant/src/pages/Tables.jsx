import { useState, useEffect }               from 'react'
import { FileDown }               from 'lucide-react'
import { useTranslation }         from 'react-i18next'
import FadeUp                     from '../components/Dashboard/FadeUp'
import Spinner                    from '../components/Dashboard/Spinner'
import TableForm                  from '../components/Tables/TableForm'
import TableList                  from '../components/Tables/TableList'
import TableTimeline              from '../components/Tables/TableTimeline'
import TableLocationsManager      from '../components/Tables/TableLocationsManager'
import Btn                        from '../components/Dashboard/Btn'
import '../styles/tables/Tables.css'
import useTables                  from '../hooks/Tables/useTables'
import useTableLocations          from '../hooks/Tables/useTableLocations'
import { confirm }                from '../components/ui/ConfirmDialog'
import { toast }                  from '../components/ui/Toast'
import { exportPDF }              from '../utils/export'
import { apiPath, getHeaders } from '../utils/api'
import {
  page, header, headerLeft, h1, subtitle, divider, errorBanner
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, WHITE, RADIUS
} from '../styles/dashboard/tokens'

const API = apiPath('tables')

function BulkBar({ count, onDelete, onClear }) {
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
      <button onClick={onDelete}
        style={{
          padding: '4px 12px', background: '#EF4444', border: '1px solid #EF4444',
          color: WHITE, fontSize: 11, fontWeight: 900,
          cursor: 'pointer', borderRadius: RADIUS.sm, fontFamily: 'inherit',
          textTransform: 'uppercase', transition: 'all 0.2s'
        }}
      >
        {t('tables_module.delete')}
      </button>

      <button onClick={onClear}
        className="tbl-list__banner-action"
        style={{
          marginLeft: isAr ? '0' : 'auto', 
          marginRight: isAr ? 'auto' : '0',
          padding: '4px 12px',
          fontSize: 11, fontWeight: 900,
          fontFamily: 'inherit'
        }}
      >
        {t('tables_module.deselect_all')}
      </button>
    </div>
  )
}

export default function Tables() {
  const { t } = useTranslation()
  const {
    tables, loading, error,
    editingTbl, setEditingTbl,
    saving, handleSave, handleDelete, handleToggle,
    setTables,
  } = useTables()

  const {
    locations, loading: locLoading, saving: locSaving,
    handleAdd, handleUpdate, handleDelete: handleDeleteLoc,
  } = useTableLocations()

  const [selectedTables, setSelectedTables] = useState([])
  const [exporting,      setExporting]      = useState(false)

  // ── Bulk handlers ──────────────────────────────────────────────
  async function handleBulkDelete() {
    const ok = await confirm({
      title:        t('tables_module.delete_selection_title'),
      message:      t('tables_module.delete_selection_msg', {
        count: selectedTables.length,
        plural: selectedTables.length > 1 ? 's' : '',
      }),
      confirmLabel: t('tables_module.delete'),
      type:         'danger',
    })
    if (!ok) return
    try {
      await Promise.all(
        selectedTables.map(idx => fetch(`${API}/${idx}`, { method: 'DELETE', headers: getHeaders() }))
      )
      setTables(prev => prev.filter(t => !selectedTables.includes(t.idx)))
      toast(t('tables_module.tables_deleted', { count: selectedTables.length, plural: selectedTables.length > 1 ? 's' : '' }), 'warning')
      setSelectedTables([])
    } catch {
      toast(t('tables_module.error_deleting'), 'error')
      setSelectedTables([])
    }
  }

  async function handleBulkActivate() {
    try {
      await Promise.all(
        selectedTables
          .filter(idx => !tables.find(t => t.idx === idx)?.active)
          .map(idx => fetch(`${API}/${idx}/toggle`, { method: 'PATCH', headers: getHeaders() }))
      )
      setTables(prev => prev.map(t => selectedTables.includes(t.idx) ? { ...t, active: true } : t))
      toast(t('tables_module.tables_activated', { count: selectedTables.length, plural: selectedTables.length > 1 ? 's' : '' }), 'success')
      setSelectedTables([])
    } catch {
      toast(t('tables_module.error_status_change'), 'error')
      setSelectedTables([])
    }
  }

  async function handleBulkDeactivate() {
    try {
      await Promise.all(
        selectedTables
          .filter(idx => tables.find(t => t.idx === idx)?.active)
          .map(idx => fetch(`${API}/${idx}/toggle`, { method: 'PATCH', headers: getHeaders() }))
      )
      setTables(prev => prev.map(t => selectedTables.includes(t.idx) ? { ...t, active: false } : t))
      toast(t('tables_module.tables_deactivated', { count: selectedTables.length, plural: selectedTables.length > 1 ? 's' : '' }), 'warning')
      setSelectedTables([])
    } catch {
      toast(t('tables_module.error_status_change'), 'error')
      setSelectedTables([])
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      await exportPDF(null, tables, t('tables_module.title'))
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => { if (!loading) window.dispatchEvent(new CustomEvent("app-ready")) }, [loading]); if (loading) return <Spinner fullPage />

  return (
    <>
      <div style={page}>
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1}>{t('tables_module.title')}</h1>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Btn icon={FileDown} onClick={handleExport} disabled={exporting}>
                {exporting ? t('tables_module.export_generating') : t('tables_module.export_pdf')}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <div style={divider} />

        {error && (
          <FadeUp delay={10}>
            <div style={errorBanner}>{error}</div>
          </FadeUp>
        )}



        {selectedTables.length > 0 && (
          <FadeUp delay={0}>
            <BulkBar
              count={selectedTables.length}
              onDelete={handleBulkDelete}
              onActivate={handleBulkActivate}
              onDeactivate={handleBulkDeactivate}
              onClear={() => setSelectedTables([])}
            />
          </FadeUp>
        )}
        <FadeUp delay={20}>
          <div className="tbl-layout">
            <div className="tbl-left tbl-form-sticky">
              <div>

                <TableForm
                  key={editingTbl?.idx ?? 'new'}
                  initial={editingTbl
                    ? { number: editingTbl.number, capacity: editingTbl.capacity, location: editingTbl.location }
                    : undefined
                  }
                  onSave={handleSave}
                  saving={saving}
                  editingNumber={editingTbl?.number ?? null}
                  onCancel={() => setEditingTbl(null)}
                  locations={locations}
                />
              </div>
              <TableLocationsManager
                locations={locations}
                loading={locLoading}
                saving={locSaving}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onDelete={handleDeleteLoc}
              />
            </div>

            <div className="tbl-right">

              <TableList
                tables={tables}
                editingTbl={editingTbl}
                onEdit={tbl => setEditingTbl(tbl)}
                onDelete={handleDelete}
                onToggle={handleToggle}
                selectedTables={selectedTables}
                setSelectedTables={setSelectedTables}
              />
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={50}>
          <div className="tbl-timeline-separator" style={{ margin: '40px 0 20px' }}>
            <div className="tbl-timeline-separator-line" style={{ display: 'block', height: '1px', background: '#E5E0DA', width: '100%' }} />
          </div>
          <TableTimeline />
        </FadeUp>
      </div>
    </>
  )
}
