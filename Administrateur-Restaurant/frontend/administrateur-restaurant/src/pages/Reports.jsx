import { useState } from 'react'
import { FileDown, BarChart2, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import useReports from '../hooks/Reports/useReports'
import useServices from '../hooks/Reservations/useServices'
import FadeUp from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'
import ReportsFilters from '../components/Reports/ReportsFilters'
import BarChart from '../components/Reports/BarChart'
import { useTranslation } from 'react-i18next'


const DARK = '#423428'
const GOLD = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM = '#ffffff'
const WHITE = '#ffffff'
const GREEN = '#16A34A'
const GREEN_BG = '#ffffff'
const RED = '#DC2626'
const RED_BG = '#ffffff'
const AMBER = '#C8A97E'
const AMBER_BG = '#ffffff'
const BORDER = '#423428'
const MUTED = '#423428'

/* ════ PDF ════ */
async function doPDF(summary, pLabel, sLabel, t, lang) {
  if (!window.jspdf) await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload = res; s.onerror = rej; document.head.appendChild(s)
  })
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const ds = new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : (lang === 'fr' ? 'fr-FR' : 'en-US'), { day: 'numeric', month: 'long', year: 'numeric' })
  doc.setFillColor(66, 52, 40); doc.rect(0, 0, 210, 32, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(200, 169, 126)
  doc.text('TableBooking.ma', 20, 14)
  doc.setFontSize(9); doc.setTextColor(255, 255, 255); doc.text(t('reports_module.pdf_report_subtitle'), 20, 22)
  doc.setTextColor(200, 169, 126); doc.setFontSize(8); doc.text(ds, 190, 22, { align: 'right' })
  doc.setTextColor(66, 52, 40); doc.setFontSize(20); doc.text(t('reports_module.pdf_report_title'), 20, 48)
  doc.setFontSize(10); doc.setTextColor(200, 169, 126); doc.text(`${t('reports_module.period')} : ${pLabel}  ·  ${t('reports_module.status_label')} : ${sLabel}`, 20, 56)
  doc.setDrawColor(66, 52, 40); doc.setLineWidth(0.5); doc.line(20, 61, 190, 61)
  let y = 70
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(66, 52, 40); doc.text(t('reports_module.pdf_summary'), 20, y); y += 8
    ;[[t('reports_module.total'), summary.total ?? 0], [t('reports_module.confirmed'), summary.confirmed ?? 0], [t('reports_module.pending'), summary.pending ?? 0], [t('reports_module.cancelled'), summary.cancelled ?? 0]]
      .forEach(([l, v], i) => {
        doc.setFillColor(i % 2 ? 250 : 255, i % 2 ? 248 : 255, i % 2 ? 245 : 255); doc.rect(20, y, 170, 8, 'F')
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(66, 52, 40)
        doc.text(l, 24, y + 5.5); doc.setFont('helvetica', 'bold'); doc.text(String(v), 185, y + 5.5, { align: 'right' }); y += 8
      })
  const pH = doc.internal.pageSize.height
  doc.setFillColor(200, 169, 126); doc.rect(0, pH - 10, 210, 10, 'F')
  doc.setTextColor(66, 52, 40); doc.setFontSize(7); doc.setFont('helvetica', 'bold')
  doc.text(t('reports_module.pdf_footer'), 20, pH - 4); doc.text(ds, 190, pH - 4, { align: 'right' })
  doc.save(`rapport_${new Date().toISOString().slice(0, 10)}.pdf`)
}

/* ════ BUTTON ════ */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 20px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'background 0.15s,color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

/* ════ SUMMARY CARD ════ */
function SumCard({ icon: Icon, value, label, accent, bg, delay = 0 }) {
  const n = useCountUp(typeof value === 'number' ? value : 0, 700, delay)
  return (
    <div style={{ background: bg, borderTop: `3px solid ${accent}`, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Icon size={12} strokeWidth={2.5} color={accent} />
        <span style={{ fontSize: 9, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: DARK, letterSpacing: '-2px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {typeof value === 'string' ? value : n}
      </p>
    </div>
  )
}

/* ════ SECTION TITLE ════ */
function SectionTitle({ title, sub, count }) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>{title}</h2>
        {sub && <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: GOLD_DK }}>{sub}</p>}
      </div>
      {count !== undefined && (
        <span style={{ padding: '4px 10px', background: DARK, fontSize: 11, fontWeight: 900, color: GOLD, flexShrink: 0 }}>{count}</span>
      )}
    </div>
  )
}

/* ════ SERVICE CHART ════ */
function ServiceChart({ data = {} }) {
  // FIX: also destructure i18n so language-aware alignment works
  const { t, i18n } = useTranslation()
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a)
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1
  const COLORS = [DARK, GOLD, GREEN, AMBER, RED, '#6b4f3a', '#3d6b5a']

  const [mounted, setMounted] = useState(false)
  useState(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id) })

  if (!entries.length) return (
    <div style={{ border: `4px solid ${DARK}`, background: WHITE, display: 'flex', flexDirection: 'column', minHeight: 200 }}>
      <div style={{ padding: '14px 18px 12px', borderBottom: `4px solid ${DARK}` }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{t('reports_module.by_service')}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: DARK }}>{t('reports_module.by_service_sub')}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#423428' }}>
        {t('reports_module.no_data')}
      </div>
    </div>
  )

  return (
    <div style={{ border: `4px solid ${DARK}`, background: WHITE, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px 12px', borderBottom: `4px solid ${DARK}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>{t('reports_module.by_service')}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: DARK }}>{t('reports_module.by_service_sub')}</div>
        </div>
        <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>{entries.length}</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{t('reports_module.services')}</div>
        </div>
      </div>
      <div style={{ padding: '16px 18px 10px' }}>
        <div style={{ height: 10, display: 'flex', gap: 2, overflow: 'hidden' }}>
          {entries.map(([name, val], i) => (
            <div key={name} title={`${name}: ${val}`}
              style={{
                flex: mounted ? val : 0,
                background: COLORS[i % COLORS.length],
                minWidth: mounted ? 2 : 0,
                transition: 'flex 0.75s cubic-bezier(0.22,1,0.36,1)',
              }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(([name, val], i) => {
          const pct = Math.round((val / total) * 100)
          return (
            <div key={name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ width: 10, height: 10, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 800, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: MUTED, minWidth: 28, textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>{pct}%</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: DARK, minWidth: 22, textAlign: i18n.language === 'ar' ? 'left' : 'right' }}>{val}</span>
              </div>
              <div style={{ height: 3, background: BORDER, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: mounted ? `${pct}%` : '0%',
                  background: COLORS[i % COLORS.length],
                  transition: `width 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`,
                }} />
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: CREAM, marginTop: 'auto' }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('reports_module.total')}</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: DARK, letterSpacing: '-1px' }}>{total}</span>
      </div>
    </div>
  )
}

/* ════ PAGE ════ */
export default function Reports() {
  const { t, i18n } = useTranslation()
  const {
    data, loading, error,
    period, setPeriod,
    status, setStatus,
    search, setSearch,
    filterService, setFilterService,
    filterDate, setFilterDate,
    clearFilters,
    services: hookServices,
  } = useReports()

  // Also load services from the dedicated hook so the dropdown always has options
  const { services: extraServices } = useServices()
  const services = hookServices?.length ? hookServices : (extraServices || [])

  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const PERIOD_OPTS = [
        { key: 'all', label: t('reports_module.all') },
        { key: 'month', label: t('reports_module.this_month') },
        { key: 'week', label: t('reports_module.this_week') },
        { key: 'today', label: t('reports_module.today') }
      ]
      const STATUS_OPTS = [
        { key: 'all', label: t('reports_module.all') },
        { key: 'confirmed', label: t('reports_module.confirmed') },
        { key: 'pending', label: t('reports_module.pending') },
        { key: 'cancelled', label: t('reports_module.cancelled') }
      ]
      const pL = PERIOD_OPTS.find(p => p.key === period)?.label ?? t('reports_module.all')
      const sL = STATUS_OPTS.find(s => s.key === status)?.label ?? t('reports_module.all')
      await doPDF(data?.summary || {}, pL, sL, t, i18n.language)
    } catch (e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  const s = data?.summary || {}

  return (
    <>
      <style>{`
        @media(max-width:600px){
          .btn-label     { display:none!important; }
          .page-subtitle { display:none!important; }
        }
        .rp-sum{ display:grid; grid-template-columns:repeat(5,1fr); gap:2px; background:${DARK}; border:4px solid ${DARK}; }
        @media(max-width:860px){ .rp-sum{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:520px){ .rp-sum{ grid-template-columns:repeat(2,1fr); } }
        .rp-2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        @media(max-width:720px){ .rp-2{ grid-template-columns:1fr; } }
        .rp-3{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        @media(max-width:860px){ .rp-3{ grid-template-columns:1fr 1fr; } }
        @media(max-width:520px){ .rp-3{ grid-template-columns:1fr; } }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#ffffff',
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
        boxSizing: 'border-box',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box;}`}</style>

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                {t('reports_module.title')}
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? t('reports_module.export_generating') : t('reports_module.export_pdf')}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{ height: 4, background: DARK, margin: '16px 0 28px' }} />
        </FadeUp>

        {/* ERROR */}
        {error && (
          <FadeUp delay={5}>
            <div style={{ marginBottom: 20, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* FILTERS */}
        <FadeUp delay={15}>
          <ReportsFilters
            filterStatus={status} setFilterStatus={setStatus}
            filterService={filterService} setFilterService={setFilterService}
            filterDate={filterDate} setFilterDate={setFilterDate}
            clearFilters={clearFilters}
            services={services}
          />
        </FadeUp>

        {/* SUMMARY */}
        <FadeUp delay={20}>
          <SectionTitle title={t('reports_module.summary_title')} sub="" count={s.total ?? 0} />
          <div className="rp-sum" style={{ marginBottom: 32 }}>
            <SumCard icon={BarChart2} value={s.total ?? 0} label={t('reports_module.total')} accent={DARK} bg={WHITE} delay={40} />
            <SumCard icon={CheckCircle} value={s.confirmed ?? 0} label={t('reports_module.confirmed')} accent={GREEN} bg={GREEN_BG} delay={70} />
            <SumCard icon={Clock} value={s.pending ?? 0} label={t('reports_module.pending')} accent={AMBER} bg={AMBER_BG} delay={100} />
            <SumCard icon={XCircle} value={s.cancelled ?? 0} label={t('reports_module.cancelled')} accent={RED} bg={RED_BG} delay={130} />
            <SumCard icon={Users} value={s.avg_guests ? `${Number(s.avg_guests).toFixed(1)}` : '0'} label={t('reports_module.avg_guests')} accent={GOLD_DK} bg={CREAM} delay={160} />
          </div>
        </FadeUp>

        <div style={{ height: 4, background: DARK, margin: '0 0 32px' }} />

        {/* HEURE + JOUR */}
        <FadeUp delay={0}>
          <SectionTitle title={t('reports_module.temporal_title')} sub="" />
          <div className="rp-2" style={{ marginBottom: 32 }}>
            <BarChart data={data?.by_hour} title={t('reports_module.by_hour')} subtitle={t('reports_module.by_hour_sub')} barColor={GOLD} />
            <BarChart data={data?.by_day} title={t('reports_module.by_day')} subtitle={t('reports_module.by_day_sub')} barColor={GOLD} />
          </div>
        </FadeUp>

        <div style={{ height: 4, background: DARK, margin: '0 0 32px' }} />

        {/* SERVICES + COUVERTS */}
        <FadeUp delay={0}>
          <SectionTitle title={t('reports_module.services_and_guests')} sub="" />
          <div className="rp-2" style={{ marginBottom: 32 }}>
            <ServiceChart data={data?.by_service ?? {}} />
            <BarChart data={data?.by_guests} title={t('reports_module.by_guests')} subtitle={t('reports_module.by_guests_sub')} barColor={AMBER} />
          </div>
        </FadeUp>

        <div style={{ height: 4, background: DARK, margin: '0 0 32px' }} />

        {/* SEMAINE + MOIS + ANNÉE */}
        <FadeUp delay={0}>
          <SectionTitle title={t('reports_module.trends_title')} sub="" />
          <div className="rp-3" style={{ marginBottom: 0 }}>
            <BarChart data={data?.by_week} title={t('reports_module.by_week')} subtitle={t('reports_module.by_week_sub')} barColor={GOLD} />
            <BarChart data={data?.by_month} title={t('reports_module.by_month')} subtitle={t('reports_module.by_month_sub')} barColor={GOLD} />
            <BarChart data={data?.by_year} title={t('reports_module.by_year')} subtitle={t('reports_module.by_year_sub')} barColor={DARK} highlight />
          </div>
        </FadeUp>

        <div style={{ height: 48 }} />
      </div>
    </>
  )
}