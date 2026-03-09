import { useState } from 'react'
import { RefreshCw, FileDown, BarChart2, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import useReports  from '../hooks/Reports/useReports'
import BarChart    from '../components/Reports/BarChart'
import FadeUp      from '../components/Dashboard/FadeUp'
import Spinner     from '../components/Dashboard/Spinner'
import useCountUp  from '../hooks/Dashboard/useCountUp'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const GOLD_BG = '#fdf6ec'
const CREAM   = '#faf8f5'

/* ── Button ── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [h, setH] = useState(false)
  const bg    = primary ? (h ? DARK : GOLD) : (h ? GOLD : DARK)
  const color = primary ? (h ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', background:bg, border:'none', color, fontSize:13, fontWeight:800, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'background 0.15s,color 0.15s', fontFamily:'inherit', whiteSpace:'nowrap' }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

/* ── Summary card ── */
function SumCard({ icon: Icon, value, label, gold, delay = 0 }) {
  const n   = useCountUp(typeof value === 'number' ? value : 0, 700, delay)
  const col = gold ? GOLD_DK : DARK
  return (
    <div style={{ background: gold ? GOLD_BG : CREAM, borderTop: `3px solid ${gold ? GOLD : DARK}`, padding: '20px 18px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
        <Icon size={14} strokeWidth={2.5} color={col} />
        <span style={{ fontSize:10, fontWeight:900, color: gold ? GOLD_DK : DARK, textTransform:'uppercase', letterSpacing:'0.12em' }}>{label}</span>
      </div>
      <p style={{ margin:0, fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:col, letterSpacing:'-2px', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>
        {typeof value === 'string' ? value : n}
      </p>
    </div>
  )
}

/* ── Section heading ── */
function SHead({ title, sub, n }) {
  return (
    <div style={{ marginBottom: 20, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
      <div>
        <h2 style={{ margin:'0 0 4px', fontSize:'clamp(18px,2.5vw,26px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>{title}</h2>
        <p style={{ margin:0, fontSize:12, fontWeight:700, color:GOLD }}>{sub}</p>
      </div>
      {n !== undefined && (
        <span style={{ fontSize:13, fontWeight:900, color:GOLD }}>{n} entrées</span>
      )}
    </div>
  )
}

/* ── PDF Export ── */
async function doPDF(data) {
  if (!window.jspdf) await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload = res; s.onerror = rej; document.head.appendChild(s)
  })
  const { jsPDF } = window.jspdf
  const doc     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const dateStr = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })

  // Header
  doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126)
  doc.text('TableBooking.ma',20,14)
  doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Rapport & Analytiques',20,22)
  doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})

  // Title
  doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Rapport des réservations',20,48)
  doc.setFontSize(10); doc.setTextColor(200,169,126); doc.text('Analytiques complètes',20,56)
  doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)

  // Summary
  const s = data.summary || {}
  let y = 70
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(43,33,24)
  doc.text('Résumé',20,y); y += 8
  const rows = [
    ['Total réservations', s.total ?? 0],
    ['Confirmées',         s.confirmed ?? 0],
    ['En attente',         s.pending ?? 0],
    ['Annulées',           s.cancelled ?? 0],
    ['Moy. personnes',     s.avg_guests ? Number(s.avg_guests).toFixed(1) : '—'],
  ]
  rows.forEach(([l, v], i) => {
    doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245)
    doc.rect(20,y,170,8,'F')
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(43,33,24)
    doc.text(l,24,y+5.5)
    doc.setFont('helvetica','bold'); doc.text(String(v),185,y+5.5,{align:'right'})
    y += 8
  })

  // Sections
  const secs = [
    { title: 'Par heure',              d: data.by_hour   },
    { title: 'Par jour de la semaine', d: data.by_day    },
    { title: 'Par semaine',            d: data.by_week   },
    { title: 'Par mois',               d: data.by_month  },
    { title: 'Par nombre de personnes',d: data.by_guests },
  ]
  secs.forEach(({ title, d }) => {
    if (!d || !Object.keys(d).length) return
    y += 8; if (y > 250) { doc.addPage(); y = 20 }
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(43,33,24)
    doc.text(title,20,y); y += 6
    const entries = Object.entries(d)
    const max     = Math.max(...entries.map(([,v])=>v),1)
    entries.forEach(([lbl, val], i) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245)
      doc.rect(20,y,170,7,'F')
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(43,33,24)
      doc.text(String(lbl),24,y+5)
      doc.setFillColor(val===max?43:200,val===max?33:169,val===max?24:126)
      doc.rect(80,y+1.5,(val/max)*110,4,'F')
      doc.setFont('helvetica','bold'); doc.text(String(val),185,y+5,{align:'right'})
      y += 7
    })
  })

  const pH = doc.internal.pageSize.height
  doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
  doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
  doc.text('TableBooking.ma — Rapport généré automatiquement',20,pH-4)
  doc.text(dateStr,190,pH-4,{align:'right'})
  doc.save(`rapport_${new Date().toISOString().slice(0,10)}.pdf`)
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default function Reports() {
  const { data, loading, error, refetch } = useReports()
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  async function handleRefresh() { setRefreshing(true); try { await refetch() } finally { setRefreshing(false) } }
  async function handleExport()  { setExporting(true);  try { await doPDF(data) } catch(e){console.error(e)} finally { setExporting(false) } }

  if (loading) return <Spinner />

  const s = data.summary || {}

  // Count entries per section for display
  const cnt = obj => Object.keys(obj || {}).length

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .rp  { max-width:1100px; margin:0 auto; padding:clamp(24px,4vw,52px) clamp(16px,3vw,44px); }
        .rp-top { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:14px; margin-bottom:20px; }
        .rp-btns { display:flex; gap:3px; }

        /* Summary — 5 cols → 3 → 2 → 1 */
        .rp-sum { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
        @media(max-width:900px){ .rp-sum { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:560px){ .rp-sum { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:360px){ .rp-sum { grid-template-columns:1fr; } }

        /* Charts 2 cols → 1 */
        .rp-2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        @media(max-width:640px){ .rp-2 { grid-template-columns:1fr; } }

        /* Charts 3 cols → 2 → 1 */
        .rp-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        @media(max-width:860px){ .rp-3 { grid-template-columns:1fr 1fr; } }
        @media(max-width:560px){ .rp-3 { grid-template-columns:1fr; } }

        /* Full width */
        .rp-1 { display:grid; grid-template-columns:1fr; gap:8px; }

        /* Buttons stack on mobile */
        @media(max-width:480px){
          .rp-btns { flex-direction:column; width:100%; }
          .rp-btns button { justify-content:center; width:100%; }
        }

        .rp-hr { height:2px; background:#2b2118; margin:40px 0; }
      `}</style>

      <div className="rp">

        {/* ── PAGE HEADER ── */}
        <FadeUp delay={0}>
          <div className="rp-top">
            <div>
              <h1 style={{ margin:'0 0 7px', fontSize:'clamp(24px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>Rapports</h1>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:GOLD }}>Analytiques complètes de vos réservations</p>
            </div>
            <div className="rp-btns">
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>{refreshing?'Actualisation…':'Actualiser'}</Btn>
              <Btn icon={FileDown}  onClick={handleExport}  disabled={exporting}  primary>{exporting?'Génération…':'Exporter PDF'}</Btn>
            </div>
          </div>
          <div style={{ height:2, background:DARK, margin:'20px 0 40px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={5}>
            <div style={{ marginBottom:28, padding:'13px 18px', borderLeft:'3px solid #b94040', background:'#fdf0f0', fontSize:13, fontWeight:800, color:'#b94040' }}>{error}</div>
          </FadeUp>
        )}

        {/* ── RÉSUMÉ ── */}
        <FadeUp delay={20}>
          <SHead title="Résumé général" sub="Vue d'ensemble de toutes vos réservations" />
          <div className="rp-sum">
            <SumCard icon={BarChart2}   value={s.total     ?? 0} label="Total"      delay={40}  />
            <SumCard icon={CheckCircle} value={s.confirmed ?? 0} label="Confirmées" delay={70}  />
            <SumCard icon={Clock}       value={s.pending   ?? 0} label="En attente" delay={100} gold />
            <SumCard icon={XCircle}     value={s.cancelled ?? 0} label="Annulées"   delay={130} />
            <SumCard icon={Users}       value={s.avg_guests ? `${Number(s.avg_guests).toFixed(1)}` : '0'} label="Moy. pers." delay={160} gold />
          </div>
        </FadeUp>

        <div className="rp-hr" />

        {/* ── HEURE + JOUR ── */}
        <FadeUp delay={60}>
          <SHead title="Distribution temporelle" sub="Par heure et par jour de la semaine" n={cnt(data.by_hour) + cnt(data.by_day)} />
          <div className="rp-2">
            <BarChart data={data.by_hour} title="Par heure"        subtitle="Créneaux les plus demandés" />
            <BarChart data={data.by_day}  title="Par jour"         subtitle="Jours les plus chargés"     />
          </div>
        </FadeUp>

        <div className="rp-hr" />

        {/* ── SEMAINE + MOIS + AN ── */}
        <FadeUp delay={100}>
          <SHead title="Tendances périodiques" sub="Évolution par semaine, mois et année" />
          <div className="rp-3">
            <BarChart data={data.by_week}  title="Par semaine" subtitle="Activité hebdomadaire" />
            <BarChart data={data.by_month} title="Par mois"    subtitle="Activité mensuelle"    />
            <BarChart data={data.by_year}  title="Par année"   subtitle="Historique annuel"     highlight />
          </div>
        </FadeUp>

        <div className="rp-hr" />

        {/* ── PERSONNES ── */}
        <FadeUp delay={140}>
          <SHead title="Taille des groupes" sub="Nombre de personnes par réservation" />
          <div className="rp-1">
            <BarChart data={data.by_guests} title="Par nombre de personnes" subtitle="Répartition des couverts" />
          </div>
        </FadeUp>

      </div>
    </div>
  )
}