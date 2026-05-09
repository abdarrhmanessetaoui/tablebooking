import { useState, useEffect } from 'react'
import { FileDown }  from 'lucide-react'
import FadeUp   from '../components/Dashboard/FadeUp'
import Spinner  from '../components/Dashboard/Spinner'
import ServiceForm from '../components/Services/ServiceForm'
import ServiceList from '../components/Services/ServiceList'
import useServices  from '../hooks/Services/useServices'
import { useTranslation } from 'react-i18next'
import { exportPDF } from '../utils/export'
import Btn from '../components/Dashboard/Btn'
import {
  page, header, headerLeft, h1, divider, errorBanner
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, DARK_LIGHT, WHITE, BORDER, RADIUS, FONT_URL, BROWN_BG
} from '../styles/dashboard/tokens'

export default function Services() {
  const { t } = useTranslation()
  const {
    services, loading, error,
    editingSvc, setEditingSvc,
    saving, handleSave, handleDelete,
  } = useServices()

  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      await exportPDF(null, services, t('services_module.title'))
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  useEffect(() => { if (!loading) window.dispatchEvent(new CustomEvent("app-ready")) }, [loading]); if (loading) return <Spinner fullPage />

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <style>{`
        @media (max-width: 480px) {
          .btn-label     { display: none !important; }
        }
        .svc-layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) {
          .svc-layout      { grid-template-columns: 360px 1fr; gap: 40px; align-items: start; }
          .svc-form-sticky { position: sticky; top: 24px; }
          .svc-mob-divider { display: none !important; }
        }
      `}</style>

      <div style={page}>
        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1}>{t('services_module.title')}</h1>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Btn icon={FileDown} onClick={handleExport} disabled={exporting}>
                {exporting ? t('services_module.export_generating') : t('services_module.export_pdf')}
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

        <FadeUp delay={20}>
          <div className="svc-layout">

            {/* LEFT   form */}
            <div className="svc-form-sticky" style={{ minWidth: 0 }}>
              <ServiceForm
                key={editingSvc?.idx ?? 'new'}
                initial={editingSvc
                  ? {
                      name:           editingSvc.name,
                      price:          editingSvc.price,
                      capacity:       editingSvc.capacity,
                      duration:       editingSvc.duration,
                      available_days: editingSvc.available_days ?? [0,1,2,3,4,5,6],
                    }
                  : undefined
                }
                onSave={handleSave}
                saving={saving}
                editingName={editingSvc?.name ?? null}
                onCancel={() => setEditingSvc(null)}
              />
            </div>

            {/* RIGHT   list */}
            <div>
              <div className="svc-mob-divider" style={{ display: 'none' }} />

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
