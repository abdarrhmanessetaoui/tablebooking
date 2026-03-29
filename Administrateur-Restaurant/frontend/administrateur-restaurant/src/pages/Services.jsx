import { useState } from 'react'
import { FileDown }  from 'lucide-react'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import ServiceForm from '../components/Services/ServiceForm'
import ServiceList from '../components/Services/ServiceList'
import useServices  from '../hooks/Services/useServices'
import { useTranslation } from 'react-i18next'
import { exportPDF } from '../utils/export'

const DARK    = '#423428'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const RED     = '#DC2626'
const RED_BG  = '#ffffff'
const CREAM   = '#ffffff'

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
  const { t, i18n } = useTranslation()
  const {
    services, loading, error,
    editingSvc, setEditingSvc,
    saving, handleSave, handleDelete,
  } = useServices()

  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = res; s.onerror = rej; document.head.appendChild(s)
        })
      }
      exportPDF(null, services, t('services_module.title'), t)
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
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing: 'border-box', width: '100%', overflowX: 'hidden',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                {t('services_module.title')}
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? t('services_module.export_generating') : t('services_module.export_pdf')}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 4, background: DARK, margin: '16px 0 28px' }} />
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
                {editingSvc ? t('services_module.edit_service_title') : t('services_module.add_service_title')}
              </h2>
              <p className="page-subtitle" style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
            
              </p>

              <ServiceForm
  key={editingSvc?.idx ?? 'new'}
  initial={editingSvc
    ? {
        name:           editingSvc.name,
        price:          editingSvc.price,
        capacity:       editingSvc.capacity,
        duration:       editingSvc.duration,
        available_days: editingSvc.available_days ?? [0,1,2,3,4,5,6],  // ← ADD THIS
      }
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
              <div className="svc-mob-divider" style={{ height: 4, background: DARK, margin: '32px 0 28px' }} />

              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                  {t('services_module.configured_services')}
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
