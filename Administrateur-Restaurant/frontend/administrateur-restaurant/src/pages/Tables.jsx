import { useState }               from 'react'
import { FileDown }               from 'lucide-react'
import { useTranslation }         from 'react-i18next'
import FadeUp                     from '../components/Dashboard/FadeUp'
import Spinner                    from '../components/Dashboard/Spinner'
import TableForm                  from '../components/Tables/TableForm'
import TableList                  from '../components/Tables/TableList'
import TableTimeline              from '../components/Tables/TableTimeline'
import TableLocationsManager      from '../components/Tables/TableLocationsManager'
import { Btn, BulkBar }           from '../components/Tables/shared/Shared'
import useTables                  from '../hooks/Tables/useTables'
import useTableLocations          from '../hooks/Tables/useTableLocations'
import { confirm }                from '../components/ui/ConfirmDialog'
import { toast }                  from '../components/ui/Toast'
import { exportPDF }              from '../utils/Exportpdf'
import { getToken }               from '../utils/auth'
import '../styles/tables/Tables.css'
import '../styles/tables/Shared.css'

const API  = 'http://localhost:8000/api/tables'
const hdrs = () => ({
  'Content-Type': 'application/json',
  'Accept':       'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

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
        selectedTables.map(idx => fetch(`${API}/${idx}`, { method: 'DELETE', headers: hdrs() }))
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
          .map(idx => fetch(`${API}/${idx}/toggle`, { method: 'PATCH', headers: hdrs() }))
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
          .map(idx => fetch(`${API}/${idx}/toggle`, { method: 'PATCH', headers: hdrs() }))
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
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = res; s.onerror = rej
          document.head.appendChild(s)
        })
      }
      exportPDF(null, tables, t('tables_module.title'), t)
    } catch (e) {
      console.error(e)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="tables-page">
      <FadeUp delay={0}>
        <div className="tables-header">
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 className="tables-title">{t('tables_module.title')}</h1>
          </div>
          <div className="tables-header-actions">
            <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
              {exporting ? t('tables_module.export_generating') : t('tables_module.export_pdf')}
            </Btn>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={10}>
        <div className="tables-divider" />
      </FadeUp>

      {error && (
        <FadeUp delay={15}>
          <div className="tables-error">{error}</div>
        </FadeUp>
      )}

      {selectedTables.length > 0 && (
        <BulkBar
          count={selectedTables.length}
          onDelete={handleBulkDelete}
          onActivate={handleBulkActivate}
          onDeactivate={handleBulkDeactivate}
          onClear={() => setSelectedTables([])}
        />
      )}

      <FadeUp delay={20}>
        <div className="tbl-layout">
          {/* ── Left column ── */}
          <div className="tbl-left tbl-form-sticky">
            <div>
              <h2 className="tbl-section-title">
                {editingTbl ? t('tables_module.edit_table_title') : t('tables_module.add_table_title')}
              </h2>
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

          {/* ── Right column ── */}
          <div>
            <div className="tbl-mob-divider tables-divider" style={{ margin: '32px 0 28px' }} />
            <div className="tbl-right-header">
              <h2 className="tbl-section-title">{t('tables_module.configured_tables')}</h2>
              <span className="tbl-count-badge">{tables.length}</span>
            </div>
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
        <div className="tbl-timeline-separator">
          <div className="tbl-timeline-separator-line" />
          <span className="tbl-timeline-separator-label">
            {t('tables_module.timeline_title')}
          </span>
          <div className="tbl-timeline-separator-line" />
        </div>
        <TableTimeline />
      </FadeUp>
    </div>
  )
}