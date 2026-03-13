import { useState } from 'react'
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
const BORDER   = '#e8e0d6'
const MUTED    = 'rgba(43,33,24,0.38)'

/* ════ PDF ════ */
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

/* ════ BUTTON ════ */
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

/* ════ SUMMARY CARD ════ */
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

/* ════ SECTION TITLE ════ */
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

/* ════ BAR CHART ════ */
function BarChart({ data={}, title, subtitle, highlight=false, barColor=GOLD }) {
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id) })

  const entries = Object.entries(data || {})
  const max     = Math.max(...entries.map(([,v]) => v), 1)
  const total   = entries.reduce((s,[,v]) => s+v, 0)
  const topKey  = entries.find(([,v]) => v===max)?.[0] ?? '—'
  const gap     = entries.length > 20 ? 2 : entries.length > 12 ? 3 : 5
  const lblSize = entries.length > 20 ? 6 : entries.length > 12 ? 7 : 9

  const headerBg    = highlight ? DARK : WHITE
  const headerColor = highlight ? 'rgba(255,255,255,0.85)' : DARK

  if (!entries.length) return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,display:'flex',flexDirection:'column'}}>
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
      <div style={{padding:'18px 16px 0',flex:1}}>
        <div style={{display:'flex',alignItems:'flex-end',gap,height:150}}>
          {entries.map(([label,value]) => {
            const pct   = (value/max)*100
            const isTop = value===max
            return (
              <div key={label} title={`${label}: ${value}`}
                style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',height:'100%',minWidth:0}}>
                <span style={{fontSize:8,fontWeight:900,color:isTop?DARK:'transparent',height:13,lineHeight:'13px',marginBottom:2}}>
                  {isTop?value:''}
                </span>
                <div style={{
                  width:'100%',
                  height:`${Math.max(pct,3)}%`,
                  background: isTop ? DARK : barColor,
                  opacity: isTop ? 1 : 0.5+(value/max)*0.5,
                  transition:'height 0.65s cubic-bezier(0.22,1,0.36,1)',
                }}/>
              </div>
            )
          })}
        </div>
        <div style={{display:'flex',gap,marginTop:5,paddingBottom:14}}>
          {entries.map(([label]) => (
            <div key={label} style={{flex:1,textAlign:'center',fontSize:lblSize,fontWeight:800,color:MUTED,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0}}>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div style={{borderTop:`1px solid ${BORDER}`,padding:'10px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:CREAM}}>
        <span style={{fontSize:9,fontWeight:900,color:MUTED,textTransform:'uppercase',letterSpacing:'0.1em'}}>Total</span>
        <span style={{fontSize:20,fontWeight:900,color:DARK,letterSpacing:'-1px'}}>{total}</span>
      </div>
    </div>
  )
}

/* ════ SERVICE CHART ════ */
function ServiceChart({ data={} }) {
  const entries = Object.entries(data).sort(([,a],[,b]) => b-a)
  const total   = entries.reduce((s,[,v]) => s+v, 0) || 1
  const COLORS  = [DARK,GOLD,GREEN,AMBER,RED,'#6b4f3a','#3d6b5a']

  const [mounted, setMounted] = useState(false)
  useState(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id) })

  if (!entries.length) return (
    <div style={{border:`2px solid ${DARK}`,background:WHITE,display:'flex',flexDirection:'column',minHeight:200}}>
      <div style={{padding:'14px 18px 12px',borderBottom:`2px solid ${DARK}`}}>
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
      <div style={{padding:'14px 18px 12px',borderBottom:`2px solid ${DARK}`,display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.18em',textTransform:'uppercase',color:GOLD,marginBottom:4}}>Par service</div>
          <div style={{fontSize:13,fontWeight:800,color:DARK}}>Répartition des formules</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:26,fontWeight:900,color:DARK,letterSpacing:'-1.5px',lineHeight:1}}>{entries.length}</div>
          <div style={{fontSize:8,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:3}}>services</div>
        </div>
      </div>
      <div style={{padding:'16px 18px 10px'}}>
        <div style={{height:10,display:'flex',gap:2,overflow:'hidden'}}>
          {entries.map(([name,val],i) => (
            <div key={name} title={`${name}: ${val}`}
              style={{
                flex: mounted ? val : 0,
                background: COLORS[i%COLORS.length],
                minWidth: mounted ? 2 : 0,
                transition:'flex 0.75s cubic-bezier(0.22,1,0.36,1)',
              }}/>
          ))}
        </div>
      </div>
      <div style={{padding:'0 18px 16px',display:'flex',flexDirection:'column',gap:10}}>
        {entries.map(([name,val],i) => {
          const pct = Math.round((val/total)*100)
          return (
            <div key={name}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                <div style={{width:10,height:10,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                <span style={{flex:1,fontSize:12,fontWeight:800,color:DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</span>
                <span style={{fontSize:11,fontWeight:900,color:MUTED,minWidth:28,textAlign:'right'}}>{pct}%</span>
                <span style={{fontSize:13,fontWeight:900,color:DARK,minWidth:22,textAlign:'right'}}>{val}</span>
              </div>
              <div style={{height:3,background:BORDER,overflow:'hidden'}}>
                <div style={{
                  height:'100%',
                  width: mounted ? `${pct}%` : '0%',
                  background: COLORS[i%COLORS.length],
                  transition:`width 0.75s cubic-bezier(0.22,1,0.36,1) ${i*60}ms`,
                }}/>
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

/* ════ PAGE ════ */
export default function Reports() {
  const {
    data, loading, error,
    period, setPeriod,
    status, setStatus,
    search, setSearch,
    filterService, setFilterService,
    filterDate,    setFilterDate,
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
      const PERIOD_OPTS=[{key:'all',label:'Tout'},{key:'month',label:'Ce mois'},{key:'week',label:'Cette semaine'},{key:'today',label:"Aujourd'hui"}]
      const STATUS_OPTS=[{key:'all',label:'Tous'},{key:'confirmed',label:'Confirmées'},{key:'pending',label:'En attente'},{key:'cancelled',label:'Annulées'}]
      const pL = PERIOD_OPTS.find(p=>p.key===period)?.label ?? 'Tout'
      const sL = STATUS_OPTS.find(s=>s.key===status)?.label ?? 'Tous'
      await doPDF(data?.summary||{}, pL, sL)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner/>

  const s = data?.summary || {}

  return (
    <>
      <style>{`
        @media(max-width:600px){
          .btn-label     { display:none!important; }
          .page-subtitle { display:none!important; }
        }
        .rp-sum{ display:grid; grid-template-columns:repeat(5,1fr); gap:2px; background:${DARK}; border:2px solid ${DARK}; }
        @media(max-width:860px){ .rp-sum{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:520px){ .rp-sum{ grid-template-columns:repeat(2,1fr); } }
        .rp-2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        @media(max-width:720px){ .rp-2{ grid-template-columns:1fr; } }
        .rp-3{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        @media(max-width:860px){ .rp-3{ grid-template-columns:1fr 1fr; } }
        @media(max-width:520px){ .rp-3{ grid-template-columns:1fr; } }
      `}</style>

      <div style={{
        minHeight:'100vh', background:CREAM,
        fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding:'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
        boxSizing:'border-box',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{`*{box-sizing:border-box;}`}</style>

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:8,flexWrap:'wrap'}}>
            <div>
              <h1 style={{margin:0,fontSize:'clamp(22px,4vw,36px)',fontWeight:900,color:DARK,letterSpacing:'-1.5px',lineHeight:1}}>
                Rapports
              </h1>
              <p className="page-subtitle" style={{margin:'6px 0 0',fontSize:12,fontWeight:700,color:GOLD_DK}}>
                Analytiques complètes de vos réservations
              </p>
            </div>
            <div style={{display:'flex',gap:3,flexShrink:0}}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{height:2,background:DARK,margin:'16px 0 28px'}}/>
        </FadeUp>

        {/* ERROR */}
        {error && (
          <FadeUp delay={5}>
            <div style={{marginBottom:20,padding:'11px 16px',background:RED_BG,borderLeft:`3px solid ${RED}`,fontSize:12,fontWeight:700,color:RED}}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* FILTERS */}
        <FadeUp delay={15}>
          <ReportsFilters
            search={search}               setSearch={setSearch}
            filterStatus={status}         setFilterStatus={setStatus}
            filterService={filterService} setFilterService={setFilterService}
            filterDate={filterDate}       setFilterDate={setFilterDate}
            clearFilters={clearFilters}
            services={services}
          />
        </FadeUp>

        {/* SUMMARY */}
        <FadeUp delay={20}>
          <SectionTitle title="Résumé général" sub="Données filtrées" count={s.total??0}/>
          <div className="rp-sum" style={{marginBottom:32}}>
            <SumCard icon={BarChart2}   value={s.total??0}     label="Total"       accent={DARK}    bg={WHITE}    delay={40} />
            <SumCard icon={CheckCircle} value={s.confirmed??0} label="Confirmées"  accent={GREEN}   bg={GREEN_BG} delay={70} />
            <SumCard icon={Clock}       value={s.pending??0}   label="En attente"  accent={AMBER}   bg={AMBER_BG} delay={100}/>
            <SumCard icon={XCircle}     value={s.cancelled??0} label="Annulées"    accent={RED}     bg={RED_BG}   delay={130}/>
            <SumCard icon={Users}       value={s.avg_guests ? `${Number(s.avg_guests).toFixed(1)}` : '0'} label="Moy. pers." accent={GOLD_DK} bg={CREAM} delay={160}/>
          </div>
        </FadeUp>

        <div style={{height:2,background:DARK,margin:'0 0 32px'}}/>

        {/* HEURE + JOUR */}
        <FadeUp delay={0}>
          <SectionTitle title="Distribution temporelle" sub="Par heure · Par jour de la semaine"/>
          <div className="rp-2" style={{marginBottom:32}}>
            <BarChart data={data?.by_hour} title="Par heure"  subtitle="Créneaux les plus demandés" barColor={GOLD}/>
            <BarChart data={data?.by_day}  title="Par jour"   subtitle="Jours les plus chargés"     barColor={GOLD}/>
          </div>
        </FadeUp>

        <div style={{height:2,background:DARK,margin:'0 0 32px'}}/>

        {/* SERVICES + COUVERTS */}
        <FadeUp delay={0}>
          <SectionTitle title="Services & Couverts" sub="Répartition des formules · Taille des groupes"/>
          <div className="rp-2" style={{marginBottom:32}}>
            <ServiceChart data={data?.by_service??{}}/>
            <BarChart data={data?.by_guests} title="Par couverts" subtitle="Taille des groupes" barColor={AMBER}/>
          </div>
        </FadeUp>

        <div style={{height:2,background:DARK,margin:'0 0 32px'}}/>

        {/* SEMAINE + MOIS + ANNÉE */}
        <FadeUp delay={0}>
          <SectionTitle title="Tendances périodiques" sub="Activité semaine · mois · année"/>
          <div className="rp-3" style={{marginBottom:0}}>
            <BarChart data={data?.by_week}  title="Par semaine" subtitle="Activité hebdomadaire" barColor={GOLD}/>
            <BarChart data={data?.by_month} title="Par mois"    subtitle="Activité mensuelle"    barColor={GOLD}/>
            <BarChart data={data?.by_year}  title="Par année"   subtitle="Historique annuel"     barColor={DARK} highlight/>
          </div>
        </FadeUp>

        <div style={{height:48}}/>
      </div>
    </>
  )
}