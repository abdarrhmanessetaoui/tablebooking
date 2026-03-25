
import FadeUp                from '../components/Dashboard/FadeUp'
import Spinner               from '../components/Dashboard/Spinner'
import TableForm             from '../components/Tables/TableForm'
import TableList             from '../components/Tables/TableList'
import TableTimeline         from '../components/Tables/TableTimeline'
import TableLocationsManager from '../components/Tables/TableLocationsManager'
import useTables             from '../hooks/Tables/useTables'
import useTableLocations     from '../hooks/Tables/useTableLocations'
import { confirm }           from '../components/ui/ConfirmDialog'
import { toast }             from '../components/ui/Toast'
import { getToken }          from '../utils/auth'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const CREAM   = '#faf8f5'

const API  = 'http://localhost:8000/api/tables'
const hdrs = () => ({
  'Content-Type': 'application/json', 'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

function Btn({ children, onClick, primary, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 16px', background: DARK, border: 'none', color: GOLD,
        fontSize: 13, fontWeight: 900,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 40,
      }}>
      <span className="btn-label">{children}</span>
    </button>
  )
}

function BulkBar({ count, onDelete, onActivate, onDeactivate, onClear }) {
  return (
    <div style={{
      position: 'sticky', top: 8, zIndex: 30,
      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      padding: '10px 12px', background: DARK,
      marginBottom: 12, border: `2px solid ${GOLD}`,
    }}>
      <style>{`
        @media (max-width: 480px) { .bulk-label { display: none !important; } }
      `}</style>

      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 26, height: 26, background: GOLD, color: DARK,
        fontSize: 12, fontWeight: 900, padding: '0 7px', flexShrink: 0,
      }}>{count}</span>
      <span className="bulk-label" style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginRight: 2 }}>
        sélectionnée{count > 1 ? 's' : ''}
      </span>

      <div style={{ width: 1, height: 20, background: '#3d2d1e', margin: '0 4px', flexShrink: 0 }} />

      <button onClick={onActivate} style={{
        padding: '7px 12px',
        background: '#00A651', border: 'none',
        color: '#fff', fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
        flexShrink: 0, minHeight: 34, textTransform: 'uppercase'
      }}
      >
        ACTIVER
      </button>

      <button onClick={onDeactivate} style={{
        padding: '7px 12px',
        background: GOLD, border: 'none',
        color: DARK, fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
        flexShrink: 0, minHeight: 34, textTransform: 'uppercase'
      }}
      >
        DÉSACTIVER
      </button>

      <button onClick={onDelete}
        style={{
          padding: '7px 12px',
          background: '#FF0000',
          border: 'none',
          color: '#fff',
          fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0, minHeight: 34, textTransform: 'uppercase'
        }}>
        SUPPRIMER
      </button>

      <button onClick={onClear} style={{
        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
        padding: '7px 10px', background: 'none', border: '1px solid #3d2d1e',
        color: GOLD, fontSize: 12, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, minHeight: 34,
      }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>✕</span>
        <span className="bulk-label">Désélectionner</span>
      </button>
    </div>
  )
}

export default function Tables() {
  const {
    tables, loading, error,
    editingTbl, setEditingTbl,
    saving, handleSave, handleDelete, handleToggle,
    setTables,
  } = useTables()

  // ── Locations — fetched once, shared between TableForm & TableLocationsManager
  const { locations, loading: locLoading, saving: locSaving, handleAdd, handleUpdate, handleDelete: handleDeleteLoc } = useTableLocations()

  const [selectedTables, setSelectedTables] = useState([])
  const [exporting,      setExporting]      = useState(false)

  async function handleBulkDelete() {
    const ok = await confirm({
      title: 'Supprimer la sélection',
      message: `Voulez-vous supprimer ${selectedTables.length} table${selectedTables.length > 1 ? 's' : ''} ?`,
      confirmLabel: 'Supprimer', type: 'danger',
    })
    if (!ok) return
    try {
      await Promise.all(selectedTables.map(idx =>
        fetch(`${API}/${idx}`, { method: 'DELETE', headers: hdrs() })
      ))
      setTables(prev => prev.filter(t => !selectedTables.includes(t.idx)))
      toast(`${selectedTables.length} table${selectedTables.length > 1 ? 's supprimées' : ' supprimée'}`, 'warning')
      setSelectedTables([])
    } catch {
      toast('Erreur lors de la suppression', 'error')
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
      toast(`${selectedTables.length} table${selectedTables.length > 1 ? 's activées' : ' activée'}`, 'success')
      setSelectedTables([])
    } catch {
      toast("Erreur lors de l'activation", 'error')
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
      toast(`${selectedTables.length} table${selectedTables.length > 1 ? 's désactivées' : ' désactivée'}`, 'warning')
      setSelectedTables([])
    } catch {
      toast('Erreur lors de la désactivation', 'error')
      setSelectedTables([])
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = res; s.onerror = rej; document.head.appendChild(s)
      })
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126)
      doc.text('TableBooking.ma',20,14)
      doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Tables',20,22)
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
      doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Tables',20,48)
      doc.setFontSize(10); doc.setTextColor(200,169,126)
      doc.text(`${tables.length} table${tables.length!==1?'s':''}`,20,56)
      doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)
      let y = 70
      doc.setFillColor(43,33,24); doc.rect(20,y,170,9,'F')
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text('TABLE',24,y+6); doc.text('CAPACITÉ',80,y+6); doc.text('EMPLACEMENT',120,y+6); doc.text('STATUT',170,y+6)
      y += 9
      tables.forEach((t,i) => {
        if (y>270) { doc.addPage(); y=20 }
        doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245); doc.rect(20,y,170,9,'F')
        doc.setTextColor(43,33,24); doc.setFontSize(9); doc.setFont('helvetica','normal')
        doc.text(`Table ${t.number}`,24,y+6)
        doc.text(`${t.capacity} Personnes`,80,y+6)
        doc.text(t.location||'—',120,y+6)
        doc.text(t.active?'Active':'Inactive',170,y+6)
        y+=9
      })
      const pH = doc.internal.pageSize.height
      doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
      doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
      doc.text('TableBooking.ma',20,pH-4); doc.text(dateStr,190,pH-4,{align:'right'})
      doc.save(`tables_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .btn-label { display: none !important; }
          .page-subtitle { display: none !important; }
        }
        .tbl-layout { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 960px) {
          .tbl-layout      { grid-template-columns: 380px 1fr; gap: 48px; align-items: start; }
          .tbl-form-sticky { position: sticky; top: 24px; }
          .tbl-mob-divider { display: none !important; }
        }
        @media (max-width: 600px) { button { min-height: 40px; } }
      `}</style>

      <div style={{
        background: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing: 'border-box', width: '100%', overflowX: 'hidden',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Tables
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 28px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={15}>
            <div style={{ marginBottom: 20, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              {error}
            </div>
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

            {/* ── Left column: form + locations manager ── */}
            <div className="tbl-form-sticky" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Table form */}
              <div>
                <h2 style={{ margin: '0 0 5px', fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                  {editingTbl ? 'Modifier la table' : 'Ajouter une table'}
                </h2>
                <p className="page-subtitle" style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                  
                </p>
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

              {/* Locations manager */}
              <TableLocationsManager
                locations={locations}
                loading={locLoading}
                saving={locSaving}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onDelete={handleDeleteLoc}
              />

            </div>

            {/* ── Right column: table list ── */}
            <div>
              <div className="tbl-mob-divider" style={{ height: 2, background: DARK, margin: '32px 0 28px' }} />
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                  Tables configurées
                </h2>
                <span style={{ padding: '4px 10px', background: DARK, fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.05em', flexShrink: 0 }}>
                  {tables.length}
                </span>
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

        {/* ── Timeline ── */}
        <FadeUp delay={50}>
          <div style={{ margin: '40px 0 0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ height: 2, background: DARK, flex: 1 }} />
            <span style={{ fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.2em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Occupation des tables
            </span>
            <div style={{ height: 2, background: DARK, flex: 1 }} />
          </div>
          <TableTimeline />
        </FadeUp>

      </div>
    </>
  )
}