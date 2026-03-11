import { useState, useEffect, useMemo, useRef } from 'react'
import { FileDown, BarChart2, Users, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'
import useReports from '../hooks/Reports/useReports'
import FadeUp     from '../components/Dashboard/FadeUp'
import Spinner    from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'

/* ─── Design tokens — identical to all other pages ─── */
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

/* ════════════════════════════════════════
   FILTER HELPERS
════════════════════════════════════════ */
function getWeekNum(d) {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7))
  const y0 = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  return Math.ceil((((tmp - y0) / 86400000) + 1) / 7)
}
const FR_MONTHS = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc']
const DAY_LABELS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

function filterByPeriod(obj = {}, period) {
  if (period === 'all' || !Object.keys(obj).length) return obj
  const now = new Date()
  const yr  = now.getFullYear(), mo = now.getMonth(), wNum = getWeekNum(now)
  const weekKey  = `${yr}-W${String(wNum).padStart(2,'0')}`
  const moKeyFr  = `${FR_MONTHS[mo]} ${yr}`
  const moKeyNum = `${yr}-${String(mo+1).padStart(2,'0')}`
  const yrKey    = String(yr)

  return Object.fromEntries(Object.entries(obj).filter(([k]) => {
    const isDay  = DAY_LABELS.some(d => k.startsWith(d))
    const isHour = /^\d{1,2}:\d{2}/.test(k)

    if (period === 'week') {
      if (isDay || isHour) return true      // keep all time-of-day labels
      return k === weekKey                  // only current week key
    }
    if (period === 'month') {
      if (isDay || isHour) return true
      if (k === moKeyFr || k === moKeyNum) return true
      if (k.startsWith(yrKey+'-W')) {
        const w = parseInt(k.split('-W')[1],10)
        return w >= getWeekNum(new Date(yr,mo,1)) && w <= getWeekNum(new Date(yr,mo+1,0))
      }
      return false
    }
    if (period === 'today') {
      if (isHour) return true
      if (isDay) {
        const idx = now.getDay() === 0 ? 6 : now.getDay()-1
        return k.startsWith(DAY_LABELS[idx])
      }
      return k === weekKey || k === moKeyFr || k === moKeyNum || k === yrKey
    }
    return true
  }))
}

function scaledSummary(base, period, rawData) {
  if (period === 'all') return base
  const bm = rawData?.by_month || {}, bw = rawData?.by_week || {}
  const now = new Date(), yr = now.getFullYear(), mo = now.getMonth()
  const moKeyFr  = `${FR_MONTHS[mo]} ${yr}`
  const moKeyNum = `${yr}-${String(mo+1).padStart(2,'0')}`
  const wKey     = `${yr}-W${String(getWeekNum(now)).padStart(2,'0')}`
  const allTotal = Object.values(bm).reduce((a,v)=>a+v,0) || base.total || 1
  const moVal    = bm[moKeyFr] ?? bm[moKeyNum] ?? 0
  const wVal     = bw[wKey] ?? 0
  let ratio = 1
  if (period==='month') ratio = moVal/allTotal
  if (period==='week')  ratio = wVal/allTotal
  if (period==='today') ratio = (moVal/allTotal)/30
  const sc = v => Math.max(0, Math.round((v||0)*ratio))
  return { total:sc(base.total), confirmed:sc(base.confirmed), pending:sc(base.pending), cancelled:sc(base.cancelled), avg_guests:base.avg_guests }
}

/* ════════════════════════════════════════
   PDF EXPORT
════════════════════════════════════════ */
async function doPDF(summary, pLabel, sLabel) {
  if (!window.jspdf) await new Promise((res,rej)=>{
    const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload=res; s.onerror=rej; document.head.appendChild(s)
  })
  const {jsPDF}=window.jspdf
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
  const dateStr=new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})
  doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126)
  doc.text('TableBooking.ma',20,14)
  doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Rapport & Analytiques',20,22)
  doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
  doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Rapport des réservations',20,48)
  doc.setFontSize(10); doc.setTextColor(200,169,126); doc.text(`Période : ${pLabel}  ·  Statut : ${sLabel}`,20,56)
  doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)
  let y=70
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(43,33,24); doc.text('Résumé',20,y); y+=8
  ;[['Total',summary.total??0],['Confirmées',summary.confirmed??0],['En attente',summary.pending??0],['Annulées',summary.cancelled??0],['Moy. pers.',summary.avg_guests?Number(summary.avg_guests).toFixed(1):'—']]
    .forEach(([l,v],i)=>{
      doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245); doc.rect(20,y,170,8,'F')
      doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(43,33,24); doc.text(l,24,y+5.5)
      doc.setFont('helvetica','bold'); doc.text(String(v),185,y+5.5,{align:'right'}); y+=8
    })
  const pH=doc.internal.pageSize.height
  doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
  doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
  doc.text('TableBooking.ma — Rapport généré automatiquement',20,pH-4); doc.text(dateStr,190,pH-4,{align:'right'})
  doc.save(`rapport_${new Date().toISOString().slice(0,10)}.pdf`)
}

/* ════════════════════════════════════════
   SMALL COMPONENTS
════════════════════════════════════════ */

/* ── Button — exact same style as BlockedDates ── */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [h,setH]=useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex',alignItems:'center',justifyContent:'center',gap:7,
        padding:'10px 18px',
        background:primary?(h?'#3d2d1e':DARK):(h?'#f0e8d8':WHITE),
        border:primary?'none':`2px solid ${DARK}`,
        color:primary?GOLD:DARK,
        fontSize:11,fontWeight:900,cursor:disabled?'not-allowed':'pointer',
        opacity:disabled?0.5:1,transition:'background 0.15s',
        fontFamily:'inherit',whiteSpace:'nowrap',letterSpacing:'0.08em',textTransform:'uppercase',
      }}>
      {Icon&&<Icon size={14} strokeWidth={2.5}/>}
      {children&&<span className="btn-label">{children}</span>}
    </button>
  )
}

/* ── Summary card — same as Dashboard ── */
function SumCard({ icon: Icon, value, label, accent, bg, delay=0 }) {
  const n=useCountUp(typeof value==='number'?value:0, 700, delay)
  return (
    <div style={{background:bg,borderTop:`3px solid ${accent}`,padding:'18px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
        <Icon size={11} strokeWidth={2.5} color={accent}/>
        <span style={{fontSize:8,fontWeight:900,color:accent,textTransform:'uppercase',letterSpacing:'0.18em'}}>{label}</span>
      </div>
      <p style={{margin:0,fontSize:'clamp(24px,3.5vw,40px)',fontWeight:900,color:DARK,letterSpacing:'-2px',fontVariantNumeric:'tabular-nums',lineHeight:1}}>
        {typeof value==='string'?value:n}
      </p>
    </div>
  )
}

/* ── Dark section header — identical to BlockedDates ── */
function SectionBar({ title, sub }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',background:DARK}}>
      <span style={{fontSize:9,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.2em'}}>{title}</span>
      {sub&&<span style={{fontSize:9,fontWeight:700,color:'rgba(200,169,126,0.45)'}}>{sub}</span>}
    </div>
  )
}

/* ── Filter chip — same compact style ── */
function Chip({ label, active, onClick }) {
  const [h,setH]=useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'5px 13px',
        border:`2px solid ${active?DARK:(h?DARK:BORDER)}`,
        background:active?DARK:(h?'#f5ede0':WHITE),
        color:active?GOLD:(h?DARK:MUTED),
        fontSize:9,fontWeight:900,textTransform:'uppercase',
        letterSpacing:'0.12em',cursor:'pointer',
        fontFamily:'inherit',transition:'all 0.12s',whiteSpace:'nowrap',
      }}>
      {label}
    </button>
  )
}

/* ── Animated bar chart — key prop forces full remount on filter change ── */
function BarChart({ data={}, title, subtitle, highlight=false, barColor=GOLD, animKey=0 }) {
  const [w,setW]=useState(false)
  useEffect(()=>{ setW(false); const id=setTimeout(()=>setW(true),60); return ()=>clearTimeout(id) },[animKey])

  const entries=Object.entries(data||{})
  const max=Math.max(...entries.map(([,v])=>v),1)
  const total=entries.reduce((s,[,v])=>s+v,0)
  const topKey=entries.find(([,v])=>v===max)?.[0]??'—'
  const gap=entries.length>20?2:entries.length>12?3:5
  const lblSize=entries.length>20?6:entries.length>12?7:9

  if (!entries.length) return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,minHeight:200,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'12px 16px 10px',borderBottom:`1px solid ${BORDER}`,background:highlight?DARK:WHITE}}>
        <div style={{fontSize:9,fontWeight:900,color:GOLD,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:3}}>{title}</div>
        {subtitle&&<div style={{fontSize:12,fontWeight:800,color:highlight?'rgba(255,255,255,0.6)':DARK}}>{subtitle}</div>}
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'rgba(43,33,24,0.12)'}}>
        Aucune donnée
      </div>
    </div>
  )

  return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,display:'flex',flexDirection:'column',minWidth:0}}>
      {/* Header */}
      <div style={{padding:'12px 16px 10px',borderBottom:`1px solid ${BORDER}`,background:highlight?DARK:WHITE,display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.18em',textTransform:'uppercase',color:GOLD,marginBottom:3}}>{title}</div>
          {subtitle&&<div style={{fontSize:13,fontWeight:800,color:highlight?'rgba(255,255,255,0.8)':DARK}}>{subtitle}</div>}
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontSize:24,fontWeight:900,color:highlight?WHITE:DARK,letterSpacing:'-1px',lineHeight:1}}>{max}</div>
          <div style={{fontSize:8,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:2}}>max · {topKey}</div>
        </div>
      </div>
      {/* Bars */}
      <div style={{padding:'16px 14px 0',flex:1,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'flex-end',gap,height:140}}>
          {entries.map(([label,value])=>{
            const pct=value/max*100; const isTop=value===max
            return (
              <div key={label} title={`${label}: ${value}`}
                style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',height:'100%',minWidth:0}}>
                <span style={{fontSize:8,fontWeight:900,color:isTop?DARK:'transparent',height:13,lineHeight:'13px',marginBottom:2,fontVariantNumeric:'tabular-nums'}}>
                  {isTop?value:''}
                </span>
                <div style={{
                  width:'100%',
                  height:w?`${Math.max(pct,3)}%`:'3%',
                  background:isTop?DARK:barColor,
                  opacity:isTop?1:0.45+(value/max)*0.55,
                  transition:'height 0.65s cubic-bezier(0.22,1,0.36,1)',
                }}/>
              </div>
            )
          })}
        </div>
        {/* X labels */}
        <div style={{display:'flex',gap,marginTop:5,paddingBottom:12}}>
          {entries.map(([label])=>(
            <div key={label} style={{flex:1,textAlign:'center',fontSize:lblSize,fontWeight:800,color:MUTED,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0}}>
              {label}
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div style={{borderTop:`1px solid ${BORDER}`,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:CREAM}}>
        <span style={{fontSize:8,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.12em'}}>Total</span>
        <span style={{fontSize:18,fontWeight:900,color:DARK,letterSpacing:'-1px'}}>{total}</span>
      </div>
    </div>
  )
}

/* ── Service / formula chart ── */
function ServiceChart({ data={}, animKey=0 }) {
  const entries=Object.entries(data).sort(([,a],[,b])=>b-a)
  const total=entries.reduce((s,[,v])=>s+v,0)||1
  const COLORS=[DARK,GOLD,GREEN,AMBER,RED,'#6b4f3a','#3d6b5a']
  const [w,setW]=useState(false)
  useEffect(()=>{ setW(false); const id=setTimeout(()=>setW(true),60); return ()=>clearTimeout(id) },[animKey])

  if (!entries.length) return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,minHeight:200,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'12px 16px 10px',borderBottom:`1px solid ${BORDER}`}}>
        <div style={{fontSize:9,fontWeight:900,color:GOLD,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:3}}>Par service</div>
        <div style={{fontSize:13,fontWeight:800,color:DARK}}>Répartition des formules</div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'rgba(43,33,24,0.12)'}}>Aucune donnée</div>
    </div>
  )

  return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'12px 16px 10px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.18em',textTransform:'uppercase',color:GOLD,marginBottom:3}}>Par service</div>
          <div style={{fontSize:13,fontWeight:800,color:DARK}}>Répartition des formules</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:24,fontWeight:900,color:DARK,letterSpacing:'-1px',lineHeight:1}}>{entries.length}</div>
          <div style={{fontSize:8,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:2}}>services</div>
        </div>
      </div>
      {/* Stacked bar */}
      <div style={{padding:'14px 16px 8px'}}>
        <div style={{height:10,display:'flex',gap:2,overflow:'hidden'}}>
          {entries.map(([name,val],i)=>(
            <div key={name} title={`${name}: ${val}`}
              style={{flex:w?val:0,background:COLORS[i%COLORS.length],minWidth:w?2:0,transition:'flex 0.75s ease'}}/>
          ))}
        </div>
      </div>
      {/* Rows */}
      <div style={{padding:'0 16px 14px',display:'flex',flexDirection:'column',gap:9}}>
        {entries.map(([name,val],i)=>{
          const pct=Math.round((val/total)*100)
          return (
            <div key={name}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <div style={{width:8,height:8,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                <span style={{flex:1,fontSize:12,fontWeight:800,color:DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</span>
                <span style={{fontSize:10,fontWeight:900,color:MUTED,minWidth:30,textAlign:'right'}}>{pct}%</span>
                <span style={{fontSize:13,fontWeight:900,color:DARK,minWidth:22,textAlign:'right'}}>{val}</span>
              </div>
              <div style={{height:3,background:BORDER,overflow:'hidden'}}>
                <div style={{height:'100%',width:w?`${pct}%`:'0%',background:COLORS[i%COLORS.length],transition:'width 0.75s ease'}}/>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{borderTop:`1px solid ${BORDER}`,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:CREAM,marginTop:'auto'}}>
        <span style={{fontSize:8,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.12em'}}>Total</span>
        <span style={{fontSize:18,fontWeight:900,color:DARK,letterSpacing:'-1px'}}>{total}</span>
      </div>
    </div>
  )
}

/* ── Filter options ── */
const PERIOD_OPTS=[
  {key:'all',  label:'Tout'},
  {key:'month',label:'Ce mois'},
  {key:'week', label:'Cette semaine'},
  {key:'today',label:"Aujourd'hui"},
]
const STATUS_OPTS=[
  {key:'all',      label:'Tous'},
  {key:'confirmed',label:'Confirmées'},
  {key:'pending',  label:'En attente'},
  {key:'cancelled',label:'Annulées'},
]

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function Reports() {
  const {data,loading,error}=useReports()
  const [exporting,setExporting]=useState(false)
  const [period,setPeriod]=useState('all')
  const [status,setStatus]=useState('all')
  /* animKey increments every time filters change — forces bar re-animation */
  const [animKey,setAnimKey]=useState(0)

  function handlePeriod(k){ setPeriod(k); setAnimKey(n=>n+1) }
  function handleStatus(k){ setStatus(k); setAnimKey(n=>n+1) }
  function handleReset(){ setPeriod('all'); setStatus('all'); setAnimKey(n=>n+1) }

  const filtered=useMemo(()=>{
    if(!data) return null
    const ap=obj=>filterByPeriod(obj,period)
    let base={...(data.summary||{})}
    if(status==='confirmed') base={...base,total:base.confirmed??0,pending:0,cancelled:0}
    if(status==='pending')   base={...base,total:base.pending??0,confirmed:0,cancelled:0}
    if(status==='cancelled') base={...base,total:base.cancelled??0,confirmed:0,pending:0}
    return {
      summary:    scaledSummary(base,period,data),
      by_hour:    ap(data.by_hour   ||{}),
      by_day:     ap(data.by_day    ||{}),
      by_week:    ap(data.by_week   ||{}),
      by_month:   ap(data.by_month  ||{}),
      by_year:    ap(data.by_year   ||{}),
      by_guests:  ap(data.by_guests ||{}),
      by_service: ap(data.by_service||{}),
    }
  },[data,period,status])

  async function handleExport(){
    setExporting(true)
    try{
      const pL=PERIOD_OPTS.find(p=>p.key===period)?.label??'Tout'
      const sL=STATUS_OPTS.find(s=>s.key===status)?.label??'Tous'
      await doPDF(filtered?.summary||{},pL,sL)
    }catch(e){console.error(e)}finally{setExporting(false)}
  }

  if(loading) return <Spinner/>

  const s=filtered?.summary||{}
  const pLabel=PERIOD_OPTS.find(p=>p.key===period)?.label??'Tout'
  const sLabel=STATUS_OPTS.find(p=>p.key===status)?.label??'Tous'
  const hasFilter=period!=='all'||status!=='all'

  return (
    <div style={{
      minHeight:'100vh',background:CREAM,
      fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      padding:'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
      width:'100%',overflowX:'hidden',boxSizing:'border-box',
    }}>
      <style>{`
        *{box-sizing:border-box;}
        body{-webkit-font-smoothing:antialiased;}
        @media(max-width:480px){
          .btn-label{display:none!important;}
          .rp-sub{display:none!important;}
        }
        /* 5→3→2 summary */
        .rp-sum{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;background:${DARK};border:2px solid ${DARK};}
        @media(max-width:860px){.rp-sum{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:480px){.rp-sum{grid-template-columns:repeat(2,1fr);}}
        /* 2-col charts */
        .rp-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        @media(max-width:700px){.rp-2{grid-template-columns:1fr;}}
        /* 3-col charts */
        .rp-3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        @media(max-width:860px){.rp-3{grid-template-columns:1fr 1fr;}}
        @media(max-width:560px){.rp-3{grid-template-columns:1fr;}}
        /* chips */
        .rp-chips{display:flex;gap:4px;flex-wrap:wrap;}
        @media(max-width:560px){
          .rp-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}
          .rp-chips::-webkit-scrollbar{display:none;}
        }
        .rp-filter-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .rp-hr{height:2px;background:${DARK};margin:32px 0;}
      `}</style>

      {/* ════ HEADER ════ */}
      <FadeUp delay={0}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:8,flexWrap:'wrap'}}>
          <div style={{minWidth:0,flex:1}}>
            {/* BIG TITLE — same weight/size as BlockedDates "Dates bloquées" */}
            <h1 style={{
              margin:0,
              fontSize:'clamp(28px,5vw,44px)',
              fontWeight:900,color:DARK,
              letterSpacing:'-2px',lineHeight:1,
            }}>
              Rapports
            </h1>
            <p className="rp-sub" style={{margin:'8px 0 0',fontSize:13,fontWeight:700,color:GOLD_DK}}>
              Analytiques complètes de vos réservations
            </p>
          </div>
          <div style={{flexShrink:0,paddingTop:4}}>
            <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
              {exporting?'Export…':'Exporter PDF'}
            </Btn>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={8}>
        <div style={{height:2,background:DARK,margin:'14px 0 24px'}}/>
      </FadeUp>

      {error&&(
        <div style={{marginBottom:20,padding:'12px 16px',borderLeft:`3px solid ${RED}`,background:RED_BG,fontSize:13,fontWeight:800,color:RED}}>
          {error}
        </div>
      )}

      {/* ════ FILTER PANEL ════ */}
      <FadeUp delay={12}>
        <div style={{border:`2px solid ${DARK}`,background:WHITE,marginBottom:28}}>
          {/* dark header bar */}
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'9px 18px',background:DARK}}>
            <Filter size={11} strokeWidth={2.5} color={GOLD}/>
            <span style={{fontSize:9,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.2em'}}>Filtres</span>
            {hasFilter&&<>
              <span style={{marginLeft:'auto',fontSize:9,fontWeight:700,color:'rgba(200,169,126,0.55)',letterSpacing:'0.06em'}}>
                {pLabel} · {sLabel}
              </span>
              <button onClick={handleReset}
                style={{background:'none',border:`1px solid rgba(200,169,126,0.3)`,color:'rgba(200,169,126,0.7)',fontSize:9,fontWeight:900,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.08em',textTransform:'uppercase',padding:'3px 9px'}}>
                Réinitialiser ×
              </button>
            </>}
          </div>
          {/* chips body */}
          <div style={{padding:'14px 18px',display:'flex',gap:20,flexWrap:'wrap',alignItems:'flex-start'}}>
            <div className="rp-filter-row">
              <span style={{fontSize:9,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.14em',flexShrink:0}}>Période</span>
              <div className="rp-chips">
                {PERIOD_OPTS.map(o=><Chip key={o.key} label={o.label} active={period===o.key} onClick={()=>handlePeriod(o.key)}/>)}
              </div>
            </div>
            <div style={{width:1,background:BORDER,alignSelf:'stretch'}}/>
            <div className="rp-filter-row">
              <span style={{fontSize:9,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.14em',flexShrink:0}}>Statut</span>
              <div className="rp-chips">
                {STATUS_OPTS.map(o=><Chip key={o.key} label={o.label} active={status===o.key} onClick={()=>handleStatus(o.key)}/>)}
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ════ RÉSUMÉ GÉNÉRAL ════ */}
      <FadeUp delay={20}>
        <SectionBar title="Résumé général" sub={`${pLabel} · ${sLabel}`}/>
        <div className="rp-sum" style={{marginBottom:32}}>
          <SumCard icon={BarChart2}   value={s.total??0}     label="Total"       accent={DARK}    bg={WHITE}    delay={40} />
          <SumCard icon={CheckCircle} value={s.confirmed??0} label="Confirmées"  accent={GREEN}   bg={GREEN_BG} delay={70} />
          <SumCard icon={Clock}       value={s.pending??0}   label="En attente"  accent={AMBER}   bg={AMBER_BG} delay={100}/>
          <SumCard icon={XCircle}     value={s.cancelled??0} label="Annulées"    accent={RED}     bg={RED_BG}   delay={130}/>
          <SumCard icon={Users}       value={s.avg_guests?`${Number(s.avg_guests).toFixed(1)}`:'0'} label="Moy. pers." accent={GOLD_DK} bg={CREAM} delay={160}/>
        </div>
      </FadeUp>

      <div className="rp-hr"/>

      {/* ════ DISTRIBUTION TEMPORELLE ════ */}
      <FadeUp delay={0}>
        <SectionBar title="Distribution temporelle" sub="Par heure · Par jour de la semaine"/>
        <div className="rp-2" style={{marginTop:8}}>
          <BarChart animKey={animKey} data={filtered?.by_hour} title="Par heure"  subtitle="Créneaux les plus demandés" barColor={GOLD}/>
          <BarChart animKey={animKey} data={filtered?.by_day}  title="Par jour"   subtitle="Jours les plus chargés"     barColor={GOLD}/>
        </div>
      </FadeUp>

      <div className="rp-hr"/>

      {/* ════ SERVICES & COUVERTS ════ */}
      <FadeUp delay={0}>
        <SectionBar title="Services & Couverts" sub="Formules · Taille des groupes"/>
        <div className="rp-2" style={{marginTop:8}}>
          <ServiceChart animKey={animKey} data={filtered?.by_service??{}}/>
          <BarChart     animKey={animKey} data={filtered?.by_guests} title="Par couverts" subtitle="Taille des groupes" barColor={AMBER}/>
        </div>
      </FadeUp>

      <div className="rp-hr"/>

      {/* ════ TENDANCES PÉRIODIQUES ════ */}
      <FadeUp delay={0}>
        <SectionBar title="Tendances périodiques" sub="Semaine · Mois · Année"/>
        <div className="rp-3" style={{marginTop:8}}>
          <BarChart animKey={animKey} data={filtered?.by_week}  title="Par semaine" subtitle="Activité hebdomadaire" barColor={GOLD}/>
          <BarChart animKey={animKey} data={filtered?.by_month} title="Par mois"    subtitle="Activité mensuelle"    barColor={GOLD}/>
          <BarChart animKey={animKey} data={filtered?.by_year}  title="Par année"   subtitle="Historique annuel"     barColor={DARK} highlight/>
        </div>
      </FadeUp>

      <div style={{height:48}}/>
    </div>
  )
}