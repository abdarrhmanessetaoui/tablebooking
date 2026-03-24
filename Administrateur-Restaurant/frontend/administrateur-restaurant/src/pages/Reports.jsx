// src/pages/Reports.jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileDown, BarChart2, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import useReports    from '../hooks/Reports/useReports'
import useServices   from '../hooks/Reservations/useServices'
import FadeUp        from '../components/Dashboard/FadeUp'
import Spinner       from '../components/Dashboard/Spinner'
import useCountUp    from '../hooks/Dashboard/useCountUp'
import ReportsFilters from '../components/Reports/ReportsFilters'

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

// PDF function
async function doPDF(summary, pLabel, sLabel, t) {
  if (!window.jspdf) await new Promise((res,rej)=>{
    const s=document.createElement('script')
    s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload=res; s.onerror=rej; document.head.appendChild(s)
  })
  const {jsPDF}=window.jspdf
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
  const ds=new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})
  
  doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126)
  doc.text('TableBooking.ma',20,14)
  doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Rapport & Analytiques',20,22)
  doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(ds,190,22,{align:'right'})
  doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text(t('reports_title'),20,48)
  doc.setFontSize(10); doc.setTextColor(200,169,126); doc.text(`${t('summary_total')} : ${pLabel}  ·  ${t('status')} : ${sLabel}`,20,56)
  doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)
  
  let y=70
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(43,33,24); doc.text(t('summary_title'),20,y); y+=8
  
  ;[
    [t('summary_total'), summary.total ?? 0],
    [t('summary_confirmed'), summary.confirmed ?? 0],
    [t('summary_pending'), summary.pending ?? 0],
    [t('summary_cancelled'), summary.cancelled ?? 0]
  ].forEach(([l,v],i)=>{
    doc.setFillColor(i%2?250:255,i%2?248:255,i%2?245:255); doc.rect(20,y,170,8,'F')
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(43,33,24)
    doc.text(l,24,y+5.5); doc.setFont('helvetica','bold'); doc.text(String(v),185,y+5.5,{align:'right'}); y+=8
  })
  
  const pH=doc.internal.pageSize.height
  doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
  doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
  doc.text('TableBooking.ma — Rapport généré automatiquement',20,pH-4); doc.text(ds,190,pH-4,{align:'right'})
  doc.save(`rapport_${new Date().toISOString().slice(0,10)}.pdf`)
}

// Button component
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov,setHov]=useState(false)
  const bg    = primary ? (hov?DARK:GOLD) : (hov?GOLD:DARK)
  const color = primary ? (hov?GOLD:DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        padding:'11px 20px',background:bg,border:'none',color,
        fontSize:13,fontWeight:800,cursor:disabled?'not-allowed':'pointer',
        opacity:disabled?0.5:1,transition:'background 0.15s,color 0.15s',
        fontFamily:'inherit',whiteSpace:'nowrap',
      }}>
      {Icon&&<Icon size={15} strokeWidth={2.2}/>}
      <span className="btn-label">{children}</span>
    </button>
  )
}

// Summary card
function SumCard({ icon:Icon, value, label, accent, bg, delay=0 }) {
  const n = useCountUp(typeof value==='number' ? value : 0, 700, delay)
  return (
    <div style={{background:bg, borderTop:`3px solid ${accent}`, padding:'18px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
        <Icon size={12} strokeWidth={2.5} color={accent}/>
        <span style={{fontSize:9,fontWeight:900,color:accent,textTransform:'uppercase',letterSpacing:'0.16em'}}>{label}</span>
      </div>
      <p style={{margin:0,fontSize:'clamp(26px,4vw,42px)',fontWeight:900,color:DARK,letterSpacing:'-2px',fontVariantNumeric:'tabular-nums',lineHeight:1}}>
        {typeof value==='string' ? value : n}
      </p>
    </div>
  )
}

// Section title
function SectionTitle({ title, sub, count }) {
  return (
    <div style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
      <div>
        <h2 style={{margin:'0 0 4px',fontSize:'clamp(15px,2.5vw,22px)',fontWeight:900,color:DARK,letterSpacing:'-0.8px'}}>{title}</h2>
        {sub&&<p style={{margin:0,fontSize:12,fontWeight:700,color:GOLD_DK}}>{sub}</p>}
      </div>
      {count!==undefined&&(
        <span style={{padding:'4px 10px',background:DARK,fontSize:11,fontWeight:900,color:GOLD,flexShrink:0}}>{count}</span>
      )}
    </div>
  )
}

// Reports Page
export default function Reports() {
  const { t } = useTranslation()
  const {data, loading, error,period, setPeriod,status, setStatus,filterService, setFilterService,filterDate, setFilterDate,clearFilters,services: hookServices,}=useReports()
  const { services: extraServices } = useServices()
  const services = hookServices?.length ? hookServices : (extraServices || [])
  const [exporting,setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const PERIOD_OPTS=[
        {key:'all',label:t('all')},
        {key:'month',label:t('this_month')},
        {key:'week',label:t('week')},
        {key:'today',label:t('today')}
      ]
      const STATUS_OPTS=[
        {key:'all',label:t('all')},
        {key:'confirmed',label:t('summary_confirmed')},
        {key:'pending',label:t('summary_pending')},
        {key:'cancelled',label:t('summary_cancelled')}
      ]
      const pL = PERIOD_OPTS.find(p=>p.key===period)?.label ?? t('all')
      const sL = STATUS_OPTS.find(s=>s.key===status)?.label ?? t('all')
      await doPDF(data?.summary||{}, pL, sL, t)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if(loading) return <Spinner/>

  return (
    <div style={{minHeight:'100vh', background:CREAM, fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", padding:'clamp(16px,3vw,40px) clamp(12px,3vw,36px)', boxSizing:'border-box'}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;}`}</style>

      {/* HEADER */}
      <FadeUp delay={0}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:8,flexWrap:'wrap'}}>
          <div>
            <h1>{t('reports_title')}</h1>
            <p className="page-subtitle">{t('reports_subtitle')}</p>
          </div>
          <div style={{display:'flex',gap:3,flexShrink:0}}>
            <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
              {exporting ? t('btn_generating') : t('btn_export_pdf')}
            </Btn>
          </div>
        </div>
      </FadeUp>

      {/* Ici tu peux ajouter tes Summary cards et Charts en utilisant t('key') pour tout texte */}
    </div>
  )
}