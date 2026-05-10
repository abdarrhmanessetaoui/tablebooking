import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileDown, Trash2, X } from 'lucide-react'
import useBlockedDates from '../hooks/BlockedDates/useBlockedDates'
import BlockedDateForm from '../components/BlockedDates/BlockedDateForm'
import BlockedDateList from '../components/BlockedDates/BlockedDateList'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { confirm } from '../components/ui/ConfirmDialog'
import { toast }   from '../components/ui/Toast'
import { apiPath, getHeaders } from '../utils/api'
import { exportPDF } from '../utils/export'
import Btn from '../components/Dashboard/Btn'
import {
  page, header, headerLeft, h1, divider, errorBanner
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, DARK_LIGHT, WHITE, BORDER, RADIUS, BROWN_BG
} from '../styles/dashboard/tokens'

function BulkBar({ count, onUnblock, onClear }) {
  const { t } = useTranslation()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      padding: '12px 16px', background: LIGHT_BROWN,
      borderRadius: RADIUS.sm,
      color: WHITE,
      marginBottom: 20,
    }}>
      <button onClick={onUnblock}
        style={{
          padding: '4px 12px', background: '#EF4444', border: '1px solid #EF4444',
          color: WHITE, fontSize: 11, fontWeight: 900,
          cursor: 'pointer', borderRadius: RADIUS.sm, fontFamily: 'inherit',
          textTransform: 'uppercase', transition: 'all 0.2s'
        }}>
        {t('calendar.unblock_date')}
      </button>

      <button onClick={onClear}
        style={{
          marginLeft: 'auto', background: '#ffffff', border: 'none',
          color: LIGHT_BROWN, fontSize: 11, fontWeight: 900,
          cursor: 'pointer', borderRadius: RADIUS.sm, fontFamily: 'inherit',
          padding: '4px 12px', textTransform: 'uppercase',
        }}
      >
        {t('deselect')}
      </button>
    </div>
  )
}

export default function BlockedDates() {
  const { t } = useTranslation()
  const {
    blockedDates, loading, error,
    form, setForm, submitting,
    handleBlock, handleUnblock,
    getDatesToBlock, setBlockedDates,
  } = useBlockedDates()

  const [exporting,     setExporting]     = useState(false)
  const [selectedDates, setSelectedDates] = useState([])

  async function handleBulkUnblock() {
    const ok = await confirm({
      title:        t('calendar.block_selection'),
      message:      t('calendar.unblock_selection_msg', { count: selectedDates.length, plural: selectedDates.length > 1 ? 's' : '' }),
      confirmLabel: t('calendar.unblock_date'), type: 'danger',
    })
    if (!ok) return
    try {
      await Promise.all(selectedDates.map(date =>
        fetch(apiPath(`blocked-dates/${date}`), { method: 'DELETE', headers: getHeaders() })
      ))
      setBlockedDates(prev => prev.filter(d => !selectedDates.includes(d.date)))
      toast(t('calendar.dates_success_unblocked', { count: selectedDates.length }), 'warning')
      setSelectedDates([])
    } catch { toast(t('calendar.error_unblocking'), 'error') }
  }

  async function handleExport() {
    setExporting(true)
    try {
      await exportPDF(null, blockedDates, t('calendar.blocked_dates_list'))
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  useEffect(() => { if (!loading) window.dispatchEvent(new CustomEvent("app-ready")) }, [loading]); if (loading) return <Spinner fullPage />

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .btn-label { display: none !important; }
        }
        .bd-layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) {
          .bd-layout { grid-template-columns: 360px 1fr; gap: 40px; align-items: start; }
          .bd-form-sticky { position: sticky; top: 24px; }
          .bd-mobile-divider { display: none !important; }
        }
      `}</style>

      <div style={page}>
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1}>{t('calendar.blocked_dates_list')}</h1>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Btn icon={FileDown} onClick={handleExport} disabled={exporting}>
                {exporting ? t('exporting') : t('export_pdf')}
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

        {selectedDates.length > 0 && (
          <FadeUp delay={0}>
            <BulkBar count={selectedDates.length} onUnblock={handleBulkUnblock} onClear={() => setSelectedDates([])} />
          </FadeUp>
        )}

        <FadeUp delay={20}>
          <div className="bd-layout">
            <div className="bd-form-sticky" style={{ minWidth: 0 }}>
              <BlockedDateForm form={form} setForm={setForm} handleBlock={handleBlock} submitting={submitting} getDatesToBlock={getDatesToBlock} />
            </div>
            <div>
              <div className="bd-mobile-divider" style={{ display: 'none' }} />
              <BlockedDateList blockedDates={blockedDates} handleUnblock={handleUnblock} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
            </div>
          </div>
        </FadeUp>
      </div>
    </>
  )
}
