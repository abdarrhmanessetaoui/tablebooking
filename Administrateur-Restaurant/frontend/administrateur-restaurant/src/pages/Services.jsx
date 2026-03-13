import { useState } from 'react'
import { FileDown }  from 'lucide-react'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import ServiceForm from '../components/Services/ServiceForm'
import ServiceList from '../components/Services/ServiceList'
import useServices  from '../hooks/Services/useServices'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const CREAM   = '#faf8f5'

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 16px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 40,
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

export default function Services() {
  const {
    services, loading, error,
    editingSvc, setEditingSvc,
    saving, handleSave, handleDelete,
  } = useServices()

  const [exporting, setExporting] = useState(false)

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
      doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Services',20,22)
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
      doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Services',20,48)
      doc.setFontSize(10); doc.setTextColor(200,169,126)
      doc.text(`${services.length} service${services.length!==1?'s':''}`,20,56)
      doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)
      let y = 70
      doc.setFillColor(43,33,24); doc.rect(20,y,170,9,'F')
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text('NOM',24,y+6); doc.text('PRIX',90,y+6); doc.text('CAPACITÉ',130,y+6); doc.text('DURÉE',165,y+6)
      y += 9
      services.forEach((svc,i) => {
        if (y>270) { doc.addPage(); y=20 }
        doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245); doc.rect(20,y,170,9,'F')
        doc.setTextColor(43,33,24); doc.setFontSize(9); doc.setFont('helvetica','normal')
        doc.text(svc.name||'—',24,y+6)
        doc.text(Number(svc.price)>0?`${svc.price} dh`:'Gratuit',90,y+6)
        doc.text(`${svc.capacity} pers.`,130,y+6)
        doc.text(`${svc.duration} min`,165,y+6)
        y+=9
      })
      const pH = doc.internal.pageSize.height
      doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
      doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
      doc.text('TableBooking.ma',20,pH-4); doc.text(dateStr,190,pH-4,{align:'right'})
      doc.save(`services_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
        .svc-layout { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 960px) {
          .svc-layout      { grid-template-columns: 380px 1fr; gap: 48px; align-items: start; }
          .svc-form-sticky { position: sticky; top: 24px; }
          .svc-mob-divider { display: none !important; }
        }
      `}</style>

      <div style={{
        background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing: 'border-box', width: '100%', overflowX: 'hidden',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Services
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                Gérez les formules proposées aux clients lors de la réservation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
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

        <FadeUp delay={20}>
          <div className="svc-layout">

            {/* LEFT — form */}
            <div className="svc-form-sticky" style={{ minWidth: 0 }}>
              <h2 style={{ margin: '0 0 5px', fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                {editingSvc ? 'Modifier le service' : 'Ajouter un service'}
              </h2>
              <p className="page-subtitle" style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
            
              </p>

              <ServiceForm
                key={editingSvc?.idx ?? 'new'}
                initial={editingSvc
                  ? { name: editingSvc.name, price: editingSvc.price, capacity: editingSvc.capacity, duration: editingSvc.duration }
                  : undefined
                }
                onSave={handleSave}
                saving={saving}
                editingName={editingSvc?.name ?? null}
                onCancel={() => setEditingSvc(null)}
              />
            </div>

            {/* RIGHT — list */}
            <div>
              <div className="svc-mob-divider" style={{ height: 2, background: DARK, margin: '32px 0 28px' }} />

              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                  Services configurés
                </h2>
                <span style={{ padding: '4px 10px', background: DARK, fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.05em', flexShrink: 0 }}>
                  {services.length}
                </span>
              </div>

              <ServiceList
                services={services}
                editingSvc={editingSvc}
                onEdit={svc => setEditingSvc(svc)}
                onDelete={handleDelete}
              />
            </div>

          </div>
        </FadeUp>
      </div>
    </>
  )
}