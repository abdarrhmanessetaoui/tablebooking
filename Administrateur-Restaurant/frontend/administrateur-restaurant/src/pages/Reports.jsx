import { useState, useEffect, useCallback } from 'react'
import { FileDown, BarChart2, Users, CheckCircle, Clock, XCircle, TrendingUp, Calendar, Filter } from 'lucide-react'
import useReports  from '../hooks/Reports/useReports'
import FadeUp      from '../components/Dashboard/FadeUp'
import Spinner     from '../components/Dashboard/Spinner'
import useCountUp  from '../hooks/Dashboard/useCountUp'

/* ─── Design tokens — same as all other pages ─── */
const DARK     = '#2b2118'
const GOLD     = '#c8a97e'
const GOLD_DK  = '#a8834e'
const CREAM    = '#faf8f5'
const WHITE    = '#ffffff'
const GREEN    = '#1a6e42'
const GREEN_BG = '#edfaf4'
const RED      = '#b94040'
const RED_BG   = '#fdf0f0'
const AMBER    = '#a8670a'
const AMBER_BG = '#fff8ec'
const BORDER   = '#e8e0d6'
const MUTED    = 'rgba(43,33,24,0.38)'

/* ─── PDF Export ─── */
async function doPDF(data, filter) {
  if (!window.jspdf) await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload = res; s.onerror = rej; document.head.appendChild(s)
  })
  const { jsPDF } = window.jspdf
  const doc     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.setFillColor(43, 33, 24); doc.rect(0, 0, 210, 32, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(200, 169, 126)
  doc.text('TableBooking.ma', 20, 14)
  doc.setFontSize(9); doc.setTextColor(255, 255, 255); doc.text('Rapport & Analytiques', 20, 22)
  doc.setTextColor(200, 169, 126); doc.setFontSize(8); doc.text(dateStr, 190, 22, { align: 'right' })
  doc.setTextColor(43, 33, 24); doc.setFontSize(20); doc.text('Rapport des réservations', 20, 48)
  doc.setFontSize(10); doc.setTextColor(200, 169, 126); doc.text(`Période : ${filter}`, 20, 56)
  doc.setDrawColor(43, 33, 24); doc.setLineWidth(0.5); doc.line(20, 61, 190, 61)
  const s = data.summary || {}
  let y = 70
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(43, 33, 24)
  doc.text('Résumé', 20, y); y += 8
  const rows = [
    ['Total réservations', s.total ?? 0],
    ['Confirmées', s.confirmed ?? 0],
    ['En attente', s.pending ?? 0],
    ['Annulées', s.cancelled ?? 0],
    ['Moy. personnes', s.avg_guests ? Number(s.avg_guests).toFixed(1) : '—'],
  ]
  rows.forEach(([l, v], i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 245)
    doc.rect(20, y, 170, 8, 'F')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(43, 33, 24)
    doc.text(l, 24, y + 5.5)
    doc.setFont('helvetica', 'bold'); doc.text(String(v), 185, y + 5.5, { align: 'right' })
    y += 8
  })
  const pH = doc.internal.pageSize.height
  doc.setFillColor(200, 169, 126); doc.rect(0, pH - 10, 210, 10, 'F')
  doc.setTextColor(43, 33, 24); doc.setFontSize(7); doc.setFont('helvetica', 'bold')
  doc.text('TableBooking.ma — Rapport généré automatiquement', 20, pH - 4)
  doc.text(dateStr, 190, pH - 4, { align: 'right' })
  doc.save(`rapport_${new Date().toISOString().slice(0, 10)}.pdf`)
}

/* ─── Button — same as other pages ─── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [h, setH] = useState(false)
  const bg    = primary ? (h ? '#3d2d1e' : DARK) : (h ? GOLD : WHITE)
  const color = primary ? GOLD : (h ? DARK : DARK)
  const border = primary ? 'none' : `2px solid ${DARK}`
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '10px 18px', background: bg, border, color,
        fontSize: 11, fontWeight: 900, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap', letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children && <span className="btn-label">{children}</span>}
    </button>
  )
}

/* ─── Stat summary card ─── */
function SumCard({ icon: Icon, value, label, accent, bg, delay = 0 }) {
  const n = useCountUp(typeof value === 'number' ? value : 0, 700, delay)
  return (
    <div style={{ background: bg, borderTop: `3px solid ${accent}`, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Icon size={11} strokeWidth={2.5} color={accent} />
        <span style={{ fontSize: 8, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</span>
      </div>
      <p style={{
        margin: 0, fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 900, color: DARK,
        letterSpacing: '-2px', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>
        {typeof value === 'string' ? value : n}
      </p>
    </div>
  )
}

/* ─── Section header (same dark bar as BlockedDates/Dashboard) ─── */
function SectionBar({ title, sub, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: DARK, marginBottom: 0 }}>
      <div>
        <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          {title}
        </span>
        {sub && <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(200,169,126,0.5)', marginLeft: 10 }}>{sub}</span>}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      )}
    </div>
  )
}

/* ─── Animated bar chart ─── */
function BarChart({ data = {}, title, subtitle, highlight = false, color = GOLD }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMounted(true), 100); return () => clearTimeout(id) }, [])

  const entries = Object.entries(data)
  const max     = Math.max(...entries.map(([, v]) => v), 1)
  const total   = entries.reduce((s, [, v]) => s + v, 0)
  const topKey  = entries.find(([, v]) => v === max)?.[0] ?? '—'
  const gap     = entries.length > 20 ? 2 : entries.length > 12 ? 3 : 6
  const lblSize = entries.length > 20 ? 7 : entries.length > 12 ? 8 : 10

  if (!entries.length) return (
    <div style={{ border: `2px solid ${DARK}`, background: WHITE }}>
      <SectionBar title={title} sub={subtitle} />
      <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: 'rgba(43,33,24,0.15)' }}>
        Aucune donnée
      </div>
    </div>
  )

  return (
    <div style={{ border: `2px solid ${DARK}`, background: WHITE, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${BORDER}`, background: highlight ? DARK : WHITE, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, fontWeight: 800, color: highlight ? 'rgba(255,255,255,0.75)' : DARK }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: highlight ? WHITE : DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>{max}</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>max · {topKey}</div>
        </div>
      </div>

      {/* Bars */}
      <div style={{ padding: '16px 16px 0', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap, height: 140 }}>
          {entries.map(([label, value]) => {
            const pct   = (value / max) * 100
            const isTop = value === max
            return (
              <div key={label} title={`${label}: ${value}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', minWidth: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: isTop ? DARK : 'transparent', height: 14, lineHeight: '14px', marginBottom: 2, fontVariantNumeric: 'tabular-nums' }}>
                  {isTop ? value : ''}
                </span>
                <div style={{
                  width: '100%',
                  height: mounted ? `${Math.max(pct, 3)}%` : '3%',
                  background: isTop ? DARK : color,
                  opacity: isTop ? 1 : 0.45 + (value / max) * 0.55,
                  transition: 'height 0.7s cubic-bezier(0.22,1,0.36,1)',
                }} />
              </div>
            )
          })}
        </div>
        {/* X labels */}
        <div style={{ display: 'flex', gap, marginTop: 5, paddingBottom: 12 }}>
          {entries.map(([label]) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', fontSize: lblSize, fontWeight: 800, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: CREAM }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: DARK, letterSpacing: '-1px' }}>{total}</span>
      </div>
    </div>
  )
}

/* ─── Service distribution ─── */
function ServiceChart({ data = {} }) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a)
  const total   = entries.reduce((s, [, v]) => s + v, 0) || 1
  const colors  = [DARK, GOLD, GREEN, AMBER, RED, '#6b4f3a', '#3d6b5a']

  if (!entries.length) return (
    <div style={{ border: `2px solid ${DARK}`, background: WHITE }}>
      <SectionBar title="Par service" sub="Répartition des formules" />
      <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: 'rgba(43,33,24,0.15)' }}>Aucune donnée</div>
    </div>
  )

  return (
    <div style={{ border: `2px solid ${DARK}`, background: WHITE }}>
      <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>Par service</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: DARK }}>Répartition des formules</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: DARK, letterSpacing: '-1px', lineHeight: 1 }}>{entries.length}</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>services</div>
        </div>
      </div>
      {/* Stacked bar */}
      <div style={{ padding: '16px 18px 12px' }}>
        <div style={{ height: 12, display: 'flex', overflow: 'hidden', gap: 2 }}>
          {entries.map(([name, val], i) => (
            <div key={name} title={`${name}: ${val}`} style={{ flex: val, background: colors[i % colors.length], minWidth: 2, transition: 'flex 0.7s ease' }} />
          ))}
        </div>
      </div>
      {/* Legend rows */}
      <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map(([name, val], i) => {
          const pct = Math.round((val / total) * 100)
          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, background: colors[i % colors.length], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 11, fontWeight: 800, color: DARK, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: MUTED, minWidth: 32, textAlign: 'right' }}>{pct}%</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: DARK, minWidth: 24, textAlign: 'right' }}>{val}</span>
            </div>
          )
        })}
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 18px', display: 'flex', justifyContent: 'space-between', background: CREAM }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: DARK, letterSpacing: '-1px' }}>{total}</span>
      </div>
    </div>
  )
}

/* ─── Filter bar ─── */
const PERIOD_OPTS = [
  { key: 'all',     label: 'Tout' },
  { key: 'month',   label: 'Ce mois' },
  { key: 'week',    label: 'Cette semaine' },
  { key: 'today',   label: "Aujourd'hui" },
]

const STATUS_OPTS = [
  { key: 'all',       label: 'Tous statuts' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'pending',   label: 'En attente' },
  { key: 'cancelled', label: 'Annulées' },
]

function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', border: `2px solid ${active ? DARK : BORDER}`,
      background: active ? DARK : WHITE, color: active ? GOLD : MUTED,
      fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em',
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = DARK; e.currentTarget.style.color = DARK } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED } }}
    >
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default function Reports() {
  const { data, loading, error, refetch } = useReports()
  const [exporting,  setExporting]  = useState(false)
  const [period,     setPeriod]     = useState('all')
  const [status,     setStatus]     = useState('all')

  async function handleExport() {
    setExporting(true)
    try { await doPDF(data, PERIOD_OPTS.find(p => p.key === period)?.label ?? 'Tout') }
    catch (e) { console.error(e) }
    finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  const s = data.summary || {}

  const activePeriodLabel = PERIOD_OPTS.find(p => p.key === period)?.label ?? 'Tout'

  return (
    <div style={{
      minHeight: '100vh', background: CREAM,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
      width: '100%', overflowX: 'hidden', boxSizing: 'border-box',
    }}>
      <style>{`
        * { box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }

        @media (max-width: 480px) {
          .btn-label     { display: none !important; }
          .rp-subtitle   { display: none !important; }
        }

        /* Summary — 5 cols → 3 → 2 */
        .rp-sum { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; background: ${DARK}; border: 2px solid ${DARK}; }
        @media (max-width: 900px) { .rp-sum { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 560px) { .rp-sum { grid-template-columns: repeat(2, 1fr); } }

        /* Charts 2-col */
        .rp-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (max-width: 680px) { .rp-2 { grid-template-columns: 1fr; } }

        /* Charts 3-col */
        .rp-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (max-width: 900px) { .rp-3 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .rp-3 { grid-template-columns: 1fr; } }

        /* Filters scroll on mobile */
        .rp-filters { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        @media (max-width: 560px) {
          .rp-filters { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
          .rp-filters::-webkit-scrollbar { display: none; }
        }

        .rp-hr { height: 2px; background: ${DARK}; margin: 36px 0; }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <FadeUp delay={0}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
              Rapports
            </h1>
            <p className="rp-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              Analytiques complètes de vos réservations
            </p>
          </div>
          <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
            <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
              {exporting ? 'Export…' : 'Exporter PDF'}
            </Btn>
          </div>
        </div>
      </FadeUp>

      {/* DIVIDER */}
      <FadeUp delay={10}>
        <div style={{ height: 2, background: DARK, margin: '16px 0 24px' }} />
      </FadeUp>

      {error && (
        <FadeUp delay={5}>
          <div style={{ marginBottom: 24, padding: '13px 18px', borderLeft: `3px solid ${RED}`, background: RED_BG, fontSize: 13, fontWeight: 800, color: RED }}>
            {error}
          </div>
        </FadeUp>
      )}

      {/* ── FILTER BAR ── */}
      <FadeUp delay={15}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
              <Filter size={12} strokeWidth={2.5} color={MUTED} />
              <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Période</span>
            </div>
            <div className="rp-filters">
              {PERIOD_OPTS.map(o => (
                <FilterChip key={o.key} label={o.label} active={period === o.key} onClick={() => setPeriod(o.key)} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Statut</span>
            </div>
            <div className="rp-filters">
              {STATUS_OPTS.map(o => (
                <FilterChip key={o.key} label={o.label} active={status === o.key} onClick={() => setStatus(o.key)} />
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── SUMMARY CARDS ── */}
      <FadeUp delay={20}>
        <div style={{ marginBottom: 8 }}>
          <SectionBar title="Résumé général" sub={`Vue d'ensemble — ${activePeriodLabel}`} />
        </div>
        <div className="rp-sum" style={{ marginBottom: 32 }}>
          <SumCard icon={BarChart2}   value={s.total     ?? 0} label="Total"        accent={DARK}    bg={WHITE}     delay={40}  />
          <SumCard icon={CheckCircle} value={s.confirmed ?? 0} label="Confirmées"   accent={GREEN}   bg={GREEN_BG}  delay={70}  />
          <SumCard icon={Clock}       value={s.pending   ?? 0} label="En attente"   accent={AMBER}   bg={AMBER_BG}  delay={100} />
          <SumCard icon={XCircle}     value={s.cancelled ?? 0} label="Annulées"     accent={RED}     bg={RED_BG}    delay={130} />
          <SumCard icon={Users}       value={s.avg_guests ? `${Number(s.avg_guests).toFixed(1)}` : '0'} label="Moy. pers." accent={GOLD_DK} bg={CREAM} delay={160} />
        </div>
      </FadeUp>

      <div className="rp-hr" />

      {/* ── HEURE + JOUR ── */}
      <FadeUp delay={40}>
        <div style={{ marginBottom: 10 }}>
          <SectionBar title="Distribution temporelle" sub="Par heure · Par jour de la semaine" />
        </div>
        <div className="rp-2" style={{ marginBottom: 0 }}>
          <BarChart data={data.by_hour} title="Par heure"  subtitle="Créneaux les plus demandés" color={GOLD} />
          <BarChart data={data.by_day}  title="Par jour"   subtitle="Jours les plus chargés"     color={GOLD} />
        </div>
      </FadeUp>

      <div className="rp-hr" />

      {/* ── SERVICE ── */}
      <FadeUp delay={60}>
        <div style={{ marginBottom: 10 }}>
          <SectionBar title="Par service" sub="Répartition des formules & services" />
        </div>
        <div className="rp-2">
          <ServiceChart data={data.by_service ?? {}} />
          <BarChart data={data.by_guests} title="Par couverts" subtitle="Taille des groupes" color={AMBER} />
        </div>
      </FadeUp>

      <div className="rp-hr" />

      {/* ── TENDANCES ── */}
      <FadeUp delay={80}>
        <div style={{ marginBottom: 10 }}>
          <SectionBar title="Tendances périodiques" sub="Évolution semaine · mois · année" />
        </div>
        <div className="rp-3">
          <BarChart data={data.by_week}  title="Par semaine" subtitle="Activité hebdomadaire" color={GOLD} />
          <BarChart data={data.by_month} title="Par mois"    subtitle="Activité mensuelle"    color={GOLD} />
          <BarChart data={data.by_year}  title="Par année"   subtitle="Historique annuel"     color={DARK} highlight />
        </div>
      </FadeUp>

      {/* bottom padding */}
      <div style={{ height: 40 }} />
    </div>
  )
}