import { useState, useMemo } from 'react'
import { FileDown, BarChart2, Users, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'
import useReports from '../hooks/Reports/useReports'
import FadeUp     from '../components/Dashboard/FadeUp'
import Spinner    from '../components/Dashboard/Spinner'
import useCountUp from '../hooks/Dashboard/useCountUp'

/* ─── Tokens — identical to BlockedDates ─── */
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

/* ════════════════════════════════
   FILTER HELPERS
════════════════════════════════ */
function getWeekNum(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil((((t - y0) / 86400000) + 1) / 7)
}
const FR_M = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc']
const DAYS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

function applyPeriod(obj = {}, period) {
  if (period === 'all' || !Object.keys(obj).length) return obj
  const now = new Date()
  const yr = now.getFullYear(), mo = now.getMonth(), w = getWeekNum(now)
  const wKey = `${yr}-W${String(w).padStart(2,'0')}`
  const mFr  = `${FR_M[mo]} ${yr}`
  const mNum = `${yr}-${String(mo+1).padStart(2,'0')}`

  return Object.fromEntries(Object.entries(obj).filter(([k]) => {
    const isDay  = DAYS.some(d => k.startsWith(d))
    const isHour = /^\d{1,2}:\d{2}/.test(k)
    if (period === 'week')  return isDay || isHour || k === wKey
    if (period === 'month') {
      if (isDay || isHour) return true
      if (k === mFr || k === mNum) return true
      if (k.includes('-W')) {
        const wn = parseInt(k.split('-W')[1], 10)
        return wn >= getWeekNum(new Date(yr,mo,1)) && wn <= getWeekNum(new Date(yr,mo+1,0))
      }
      return false
    }
    if (period === 'today') {
      if (isHour) return true
      if (isDay)  return k.startsWith(DAYS[now.getDay()===0?6:now.getDay()-1])
      return k===wKey||k===mFr||k===mNum||k===String(yr)
    }
    return true
  }))
}

function scaleSummary(base, period, raw) {
  if (period === 'all') return base
  const bm = raw?.by_month || {}, bw = raw?.by_week || {}
  const now = new Date(), yr = now.getFullYear(), mo = now.getMonth()
  const mFr  = `${FR_M[mo]} ${yr}`, mNum = `${yr}-${String(mo+1).padStart(2,'0')}`
  const wKey = `${yr}-W${String(getWeekNum(now)).padStart(2,'0')}`
  const tot  = Object.values(bm).reduce((a,v)=>a+v,0) || base.total || 1
  const mV   = bm[mFr] ?? bm[mNum] ?? 0
  const wV   = bw[wKey] ?? 0
  const ratio = period==='month' ? mV/tot : period==='week' ? wV/tot : (mV/tot)/30
  const sc = v => Math.max(0, Math.round((v||0)*ratio))
  return { ...base, total:sc(base.total), confirmed:sc(base.confirmed), pending:sc(base.pending), cancelled:sc(base.cancelled) }
}

/* ════════════════════════════════
   PDF
════════════════════════════════ */
async function doPDF(summary, pLabel, sLabel) {
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
  doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Rapport des réservations',20,48)
  doc.setFontSize(10); doc.setTextColor(200,169,126); doc.text(`Période : ${pLabel}  ·  Statut : ${sLabel}`,20,56)
  doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)
  let y=70
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(43,33,24); doc.text('Résumé',20,y); y+=8
  ;[['Total',summary.total??0],['Confirmées',summary.confirmed??0],['En attente',summary.pending??0],['Annulées',summary.cancelled??0]]
    .forEach(([l,v],i)=>{
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

/* ════════════════════════════════
   SHARED UI — same as BlockedDates
════════════════════════════════ */

/* Button — copy of BlockedDates Btn */
function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov,setHov]=useState(false)
  const bg    = primary ? (hov?DARK:GOLD) : (hov?GOLD:DARK)
  const color = primary ? (hov?GOLD:DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        padding:'10px 16px',background:bg,border:'none',color,
        fontSize:13,fontWeight:800,cursor:disabled?'not-allowed':'pointer',
        opacity:disabled?0.5:1,transition:'background 0.15s,color 0.15s',
        fontFamily:'inherit',whiteSpace:'nowrap',minHeight:40,
      }}>
      {Icon&&<Icon size={15} strokeWidth={2.2}/>}
      <span className="btn-label">{children}</span>
    </button>
  )
}

/* Summary card */
function SumCard({ icon:Icon, value, label, accent, bg, delay=0 }) {
  const n=useCountUp(typeof value==='number'?value:0, 700, delay)
  return (
    <div style={{background:bg, borderTop:`3px solid ${accent}`, padding:'18px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
        <Icon size={12} strokeWidth={2.5} color={accent}/>
        <span style={{fontSize:9,fontWeight:900,color:accent,textTransform:'uppercase',letterSpacing:'0.16em'}}>{label}</span>
      </div>
      <p style={{margin:0,fontSize:'clamp(26px,4vw,42px)',fontWeight:900,color:DARK,letterSpacing:'-2px',fontVariantNumeric:'tabular-nums',lineHeight:1}}>
        {typeof value==='string'?value:n}
      </p>
    </div>
  )
}

/* Section subheading — like BlockedDates "Bloquer une date" h2 */
function SectionTitle({ title, sub, count }) {
  return (
    <div style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
      <div>
        <h2 style={{margin:'0 0 4px',fontSize:'clamp(15px,2.5vw,22px)',fontWeight:900,color:DARK,letterSpacing:'-0.8px'}}>
          {title}
        </h2>
        {sub&&<p style={{margin:0,fontSize:12,fontWeight:700,color:GOLD_DK}}>{sub}</p>}
      </div>
      {count!==undefined&&(
        <span style={{padding:'4px 10px',background:DARK,fontSize:11,fontWeight:900,color:GOLD,letterSpacing:'0.05em',flexShrink:0}}>
          {count}
        </span>
      )}
    </div>
  )
}

/* Filter chip — compact */
function Chip({ label, active, onClick }) {
  const [h,setH]=useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'4px 10px',
        border:`1px solid ${active?DARK:(h?DARK:BORDER)}`,
        background:active?DARK:(h?'#f5ede0':WHITE),
        color:active?GOLD:(h?DARK:MUTED),
        fontSize:9,fontWeight:900,textTransform:'uppercase',
        letterSpacing:'0.1em',cursor:'pointer',
        fontFamily:'inherit',transition:'all 0.12s',whiteSpace:'nowrap',
        minHeight:28,
      }}>
      {label}
    </button>
  )
}

/* ════════════════════════════════
   CHART COMPONENTS
════════════════════════════════ */

/* Animated bar chart */
function BarChart({ data={}, title, subtitle, highlight=false, barColor=GOLD, animKey=0 }) {
  const [ready,setReady]=useState(false)
  /* re-animate every time animKey changes */
  useState(()=>{ setReady(false) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  if (typeof window!=='undefined') {
    // Use a simple pattern: reset on animKey via key prop at call site
  }
  // Simple mount animation
  const [mounted,setMounted]=useState(false)
  // Reset when animKey changes using a ref trick
  const prevKey = useState(animKey)
  if (prevKey[0] !== animKey) { prevKey[1](animKey); setMounted(false) }
  if (!mounted) setTimeout(()=>setMounted(true), 60)

  const entries=Object.entries(data||{})
  const max=Math.max(...entries.map(([,v])=>v),1)
  const total=entries.reduce((s,[,v])=>s+v,0)
  const topKey=entries.find(([,v])=>v===max)?.[0]??'—'
  const gap=entries.length>20?2:entries.length>12?3:5
  const lblSize=entries.length>20?6:entries.length>12?7:9

  const headerBg = highlight ? DARK : WHITE
  const headerColor = highlight ? 'rgba(255,255,255,0.8)' : DARK

  if (!entries.length) return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE}}>
      <div style={{padding:'14px 18px 12px',borderBottom:`2px solid ${DARK}`,background:headerBg}}>
        <div style={{fontSize:9,fontWeight:900,color:GOLD,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:4}}>{title}</div>
        {subtitle&&<div style={{fontSize:13,fontWeight:800,color:headerColor}}>{subtitle}</div>}
      </div>
      <div style={{height:160,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'rgba(43,33,24,0.13)'}}>
        Aucune donnée
      </div>
    </div>
  )

  return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,display:'flex',flexDirection:'column',minWidth:0}}>
      {/* Header — dark bar top like BlockedDateList */}
      <div style={{padding:'14px 18px 12px',borderBottom:`2px solid ${DARK}`,background:headerBg,display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.18em',textTransform:'uppercase',color:GOLD,marginBottom:4}}>{title}</div>
          {subtitle&&<div style={{fontSize:13,fontWeight:800,color:headerColor}}>{subtitle}</div>}
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontSize:26,fontWeight:900,color:highlight?WHITE:DARK,letterSpacing:'-1.5px',lineHeight:1}}>{max}</div>
          <div style={{fontSize:8,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:3}}>max · {topKey}</div>
        </div>
      </div>
      {/* Bars */}
      <div style={{padding:'18px 16px 0',flex:1,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'flex-end',gap,height:150}}>
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
                  height:mounted?`${Math.max(pct,3)}%`:'3%',
                  background:isTop?DARK:barColor,
                  opacity:isTop?1:0.5+(value/max)*0.5,
                  transition:'height 0.65s cubic-bezier(0.22,1,0.36,1)',
                }}/>
              </div>
            )
          })}
        </div>
        <div style={{display:'flex',gap,marginTop:5,paddingBottom:14}}>
          {entries.map(([label])=>(
            <div key={label} style={{flex:1,textAlign:'center',fontSize:lblSize,fontWeight:800,color:MUTED,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0}}>
              {label}
            </div>
          ))}
        </div>
      </div>
      {/* Footer — same CREAM footer as summary cards */}
      <div style={{borderTop:`1px solid ${BORDER}`,padding:'10px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:CREAM}}>
        <span style={{fontSize:9,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.1em'}}>Total</span>
        <span style={{fontSize:20,fontWeight:900,color:DARK,letterSpacing:'-1px'}}>{total}</span>
      </div>
    </div>
  )
}

/* Service distribution chart */
function ServiceChart({ data={}, animKey=0 }) {
  const entries=Object.entries(data).sort(([,a],[,b])=>b-a)
  const total=entries.reduce((s,[,v])=>s+v,0)||1
  const COLORS=[DARK,GOLD,GREEN,AMBER,RED,'#6b4f3a','#3d6b5a']

  const [mounted,setMounted]=useState(false)
  const prevKey=useState(animKey)
  if (prevKey[0]!==animKey) { prevKey[1](animKey); setMounted(false) }
  if (!mounted) setTimeout(()=>setMounted(true), 60)

  if (!entries.length) return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,minHeight:200,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'14px 18px 12px',borderBottom:`2px solid ${DARK}`,background:WHITE}}>
        <div style={{fontSize:9,fontWeight:900,color:GOLD,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:4}}>Par service</div>
        <div style={{fontSize:13,fontWeight:800,color:DARK}}>Répartition des formules</div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'rgba(43,33,24,0.13)'}}>
        Aucune donnée
      </div>
    </div>
  )

  return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'14px 18px 12px',borderBottom:`2px solid ${DARK}`,background:WHITE,display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.18em',textTransform:'uppercase',color:GOLD,marginBottom:4}}>Par service</div>
          <div style={{fontSize:13,fontWeight:800,color:DARK}}>Répartition des formules</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:26,fontWeight:900,color:DARK,letterSpacing:'-1.5px',lineHeight:1}}>{entries.length}</div>
          <div style={{fontSize:8,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:3}}>services</div>
        </div>
      </div>
      {/* Stacked bar */}
      <div style={{padding:'16px 18px 10px'}}>
        <div style={{height:12,display:'flex',gap:2,overflow:'hidden'}}>
          {entries.map(([name,val],i)=>(
            <div key={name} title={`${name}: ${val}`}
              style={{flex:mounted?val:0,background:COLORS[i%COLORS.length],minWidth:mounted?2:0,transition:'flex 0.75s ease'}}/>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div style={{padding:'0 18px 16px',display:'flex',flexDirection:'column',gap:10}}>
        {entries.map(([name,val],i)=>{
          const pct=Math.round((val/total)*100)
          return (
            <div key={name}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <div style={{width:10,height:10,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                <span style={{flex:1,fontSize:12,fontWeight:800,color:DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</span>
                <span style={{fontSize:11,fontWeight:900,color:MUTED,minWidth:32,textAlign:'right'}}>{pct}%</span>
                <span style={{fontSize:13,fontWeight:900,color:DARK,minWidth:24,textAlign:'right'}}>{val}</span>
              </div>
              <div style={{height:3,background:BORDER,overflow:'hidden'}}>
                <div style={{height:'100%',width:mounted?`${pct}%`:'0%',background:COLORS[i%COLORS.length],transition:'width 0.75s ease'}}/>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{borderTop:`1px solid ${BORDER}`,padding:'10px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:CREAM,marginTop:'auto'}}>
        <span style={{fontSize:9,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.1em'}}>Total</span>
        <span style={{fontSize:20,fontWeight:900,color:DARK,letterSpacing:'-1px'}}>{total}</span>
      </div>
    </div>
  )
}

/* ════════════════════════════════
   FILTER OPTIONS
════════════════════════════════ */
const PERIOD_OPTS=[
  {key:'all',  label:'Tout'},
  {key:'month',label:'Ce mois'},
  {key:'week', label:'Cette semaine'},
  {key:'today',label:"Aujourd'hui"},
]
const STATUS_OPTS=[
  {key:'all',      label:'Tous statuts'},
  {key:'confirmed',label:'Confirmées'},
  {key:'pending',  label:'En attente'},
  {key:'cancelled',label:'Annulées'},
]

/* ════════════════════════════════
   PAGE
════════════════════════════════ */
export default function Reports() {
  const {data,loading,error}=useReports()
  const [exporting,setExporting]=useState(false)
  const [period,setPeriod]=useState('all')
  const [status,setStatus]=useState('all')
  const [animKey,setAnimKey]=useState(0)

  function pick(type, key) {
    if (type==='period') setPeriod(key)
    else                 setStatus(key)
    setAnimKey(k=>k+1)
  }
  function reset() { setPeriod('all'); setStatus('all'); setAnimKey(k=>k+1) }

  const filtered=useMemo(()=>{
    if (!data) return null
    const ap=obj=>applyPeriod(obj,period)
    let base={...(data.summary||{})}
    if (status==='confirmed') base={...base,total:base.confirmed??0,pending:0,cancelled:0}
    if (status==='pending')   base={...base,total:base.pending??0,confirmed:0,cancelled:0}
    if (status==='cancelled') base={...base,total:base.cancelled??0,confirmed:0,pending:0}
    return {
      summary:    scaleSummary(base,period,data),
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
    try {
      const pL=PERIOD_OPTS.find(p=>p.key===period)?.label??'Tout'
      const sL=STATUS_OPTS.find(s=>s.key===status)?.label??'Tous'
      await doPDF(filtered?.summary||{},pL,sL)
    } catch(e){console.error(e)} finally{setExporting(false)}
  }

  if (loading) return <Spinner/>

  const s=filtered?.summary||{}
  const pLabel=PERIOD_OPTS.find(p=>p.key===period)?.label??'Tout'
  const sLabel=STATUS_OPTS.find(p=>p.key===status)?.label??'Tous'
  const hasFilter=period!=='all'||status!=='all'

  return (
    <>
      <style>{`
        @media(max-width:480px){
          .btn-label    { display:none!important; }
          .page-subtitle{ display:none!important; }
        }
        /* Summary 5→3→2 */
        .rp-sum{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;background:${DARK};border:2px solid ${DARK};}
        @media(max-width:900px){.rp-sum{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:520px){.rp-sum{grid-template-columns:repeat(2,1fr);}}
        /* 2-col charts */
        .rp-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        @media(max-width:720px){.rp-2{grid-template-columns:1fr;}}
        /* 3-col charts */
        .rp-3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        @media(max-width:900px){.rp-3{grid-template-columns:1fr 1fr;}}
        @media(max-width:560px){.rp-3{grid-template-columns:1fr;}}
        /* chips */
        .rp-chips{display:flex;gap:5px;flex-wrap:wrap;}
        @media(max-width:520px){.rp-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;}}
        .rp-chips::-webkit-scrollbar{display:none;}
      `}</style>

      <div style={{
        minHeight:'100vh',background:CREAM,
        fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding:'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing:'border-box',width:'100%',overflowX:'hidden',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet"/>

        {/* ── HEADER — exact copy of BlockedDates header ── */}
        <FadeUp delay={0}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:8,flexWrap:'wrap'}}>
            <div style={{minWidth:0,flex:1}}>
              <h1 style={{margin:0,fontSize:'clamp(20px,5vw,36px)',fontWeight:900,color:DARK,letterSpacing:'-1.5px',lineHeight:1}}>
                Rapports
              </h1>
              <p className="page-subtitle" style={{margin:'6px 0 0',fontSize:12,fontWeight:700,color:GOLD_DK}}>
                Analytiques complètes de vos réservations
              </p>
            </div>
            <div style={{display:'flex',gap:3,flexShrink:0}}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting?'Génération…':'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── DIVIDER — exact copy of BlockedDates ── */}
        <FadeUp delay={10}>
          <div style={{height:2,background:DARK,margin:'16px 0 28px'}}/>
        </FadeUp>

        {error&&(
          <FadeUp delay={5}>
            <div style={{marginBottom:20,padding:'11px 16px',background:RED_BG,borderLeft:`3px solid ${RED}`,fontSize:12,fontWeight:700,color:RED}}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* ── FILTER BAR — compact single line ── */}
        <FadeUp delay={15}>
          <div style={{
            display:'flex',alignItems:'center',gap:0,
            border:`2px solid ${DARK}`,background:WHITE,
            marginBottom:28,overflow:'hidden',flexWrap:'wrap',
          }}>
            {/* Icon label */}
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:DARK,flexShrink:0}}>
              <Filter size={11} strokeWidth={2.5} color={GOLD}/>
              <span style={{fontSize:8,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.2em'}}>Filtres</span>
            </div>

            {/* Période label */}
            <span style={{fontSize:8,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.14em',padding:'0 10px 0 14px',flexShrink:0,borderLeft:`1px solid ${BORDER}`}}>
              Période
            </span>
            {/* Period chips */}
            <div style={{display:'flex',gap:4,padding:'6px 10px 6px 0',flexShrink:0,flexWrap:'nowrap',overflowX:'auto'}}>
              {PERIOD_OPTS.map(o=><Chip key={o.key} label={o.label} active={period===o.key} onClick={()=>pick('period',o.key)}/>)}
            </div>

            {/* Separator */}
            <div style={{width:1,alignSelf:'stretch',background:BORDER,flexShrink:0,margin:'6px 0'}}/>

            {/* Statut label */}
            <span style={{fontSize:8,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.14em',padding:'0 10px 0 14px',flexShrink:0}}>
              Statut
            </span>
            {/* Status chips */}
            <div style={{display:'flex',gap:4,padding:'6px 10px 6px 0',flex:1,flexWrap:'nowrap',overflowX:'auto'}}>
              {STATUS_OPTS.map(o=><Chip key={o.key} label={o.label} active={status===o.key} onClick={()=>pick('status',o.key)}/>)}
            </div>

            {/* Reset — only when active */}
            {hasFilter&&(
              <button onClick={reset} style={{
                padding:'6px 14px',borderLeft:`2px solid ${DARK}`,background:'none',
                color:MUTED,fontSize:9,fontWeight:900,textTransform:'uppercase',
                letterSpacing:'0.1em',cursor:'pointer',fontFamily:'inherit',
                flexShrink:0,alignSelf:'stretch',transition:'all 0.12s',whiteSpace:'nowrap',
                border:'none',borderLeft:`2px solid ${DARK}`,
              }}
                onMouseEnter={e=>{e.currentTarget.style.background=DARK;e.currentTarget.style.color=GOLD}}
                onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=MUTED}}
              >
                ×
              </button>
            )}
          </div>
        </FadeUp>

        {/* ── RÉSUMÉ GÉNÉRAL ── */}
        <FadeUp delay={20}>
          <SectionTitle title="Résumé général" sub={`Vue d'ensemble · ${pLabel} · ${sLabel}`} count={s.total??0}/>
          <div className="rp-sum" style={{marginBottom:32}}>
            <SumCard icon={BarChart2}   value={s.total??0}     label="Total"       accent={DARK}    bg={WHITE}    delay={40} />
            <SumCard icon={CheckCircle} value={s.confirmed??0} label="Confirmées"  accent={GREEN}   bg={GREEN_BG} delay={70} />
            <SumCard icon={Clock}       value={s.pending??0}   label="En attente"  accent={AMBER}   bg={AMBER_BG} delay={100}/>
            <SumCard icon={XCircle}     value={s.cancelled??0} label="Annulées"    accent={RED}     bg={RED_BG}   delay={130}/>
            <SumCard icon={Users}       value={s.avg_guests?`${Number(s.avg_guests).toFixed(1)}`:'0'} label="Moy. pers." accent={GOLD_DK} bg={CREAM} delay={160}/>
          </div>
        </FadeUp>

        {/* ── DIVIDER ── */}
        <div style={{height:2,background:DARK,margin:'0 0 32px'}}/>

        {/* ── DISTRIBUTION TEMPORELLE ── */}
        <FadeUp delay={0}>
          <SectionTitle title="Distribution temporelle" sub="Par heure · Par jour de la semaine"/>
          <div className="rp-2" style={{marginBottom:0}}>
            <BarChart key={`h-${animKey}`} animKey={animKey} data={filtered?.by_hour} title="Par heure"  subtitle="Créneaux les plus demandés" barColor={GOLD}/>
            <BarChart key={`d-${animKey}`} animKey={animKey} data={filtered?.by_day}  title="Par jour"   subtitle="Jours les plus chargés"     barColor={GOLD}/>
          </div>
        </FadeUp>

        <div style={{height:2,background:DARK,margin:'32px 0'}}/>

        {/* ── SERVICES & COUVERTS ── */}
        <FadeUp delay={0}>
          <SectionTitle title="Services & Couverts" sub="Répartition des formules · Taille des groupes"/>
          <div className="rp-2" style={{marginBottom:0}}>
            <ServiceChart key={`svc-${animKey}`} animKey={animKey} data={filtered?.by_service??{}}/>
            <BarChart     key={`g-${animKey}`}   animKey={animKey} data={filtered?.by_guests}  title="Par couverts" subtitle="Taille des groupes" barColor={AMBER}/>
          </div>
        </FadeUp>

        <div style={{height:2,background:DARK,margin:'32px 0'}}/>

        {/* ── TENDANCES PÉRIODIQUES ── */}
        <FadeUp delay={0}>
          <SectionTitle title="Tendances périodiques" sub="Activité semaine · mois · année"/>
          <div className="rp-3" style={{marginBottom:0}}>
            <BarChart key={`w-${animKey}`} animKey={animKey} data={filtered?.by_week}  title="Par semaine" subtitle="Activité hebdomadaire" barColor={GOLD}/>
            <BarChart key={`m-${animKey}`} animKey={animKey} data={filtered?.by_month} title="Par mois"    subtitle="Activité mensuelle"    barColor={GOLD}/>
            <BarChart key={`y-${animKey}`} animKey={animKey} data={filtered?.by_year}  title="Par année"   subtitle="Historique annuel"     barColor={DARK} highlight/>
          </div>
        </FadeUp>

        <div style={{height:48}}/>
      </div>
    </>
  )
}