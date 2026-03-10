import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, FileDown, CheckCircle, Clock, XCircle,
  ArrowRight, TrendingUp, Star, CalendarDays
} from 'lucide-react'
import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─── TOKENS ─── */
const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const GOLD_BG = '#fdf6ec'
const CREAM   = '#faf8f5'
const WHITE   = '#ffffff'
const GREEN   = '#1a6e42'
const GREEN_BG= '#edfaf4'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const AMBER   = '#a8670a'
const AMBER_BG= '#fff8ec'
const BORDER  = 'rgba(43,33,24,0.1)'

const TODAY_DATE    = new Date().toISOString().slice(0,10)
const TOMORROW_DATE = new Date(Date.now()+86400000).toISOString().slice(0,10)

/* ─── Live clock ─── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(()=>{ const id=setInterval(()=>setT(new Date()),1000); return()=>clearInterval(id) },[])
  return <span style={{fontVariantNumeric:'tabular-nums'}}>{t.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
}

/* ─── Ring chart ─── */
function Ring({ c, p, a, size=100 }) {
  const total = c+p+a||1
  const pct   = Math.round((c/total)*100)
  const r=30, circ=2*Math.PI*r
  const segs=[{v:c,color:GREEN},{v:p,color:GOLD},{v:a,color:RED}]
  let off=0
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 72 72" style={{transform:'rotate(-90deg)'}}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e8e0d6" strokeWidth="7"/>
        {segs.map((s,i)=>{
          if(!s.v){off+=(s.v/total)*circ;return null}
          const arc=(s.v/total)*circ
          const el=<circle key={i} cx="36" cy="36" r={r} fill="none" stroke={s.color} strokeWidth="7"
            strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-off}
            style={{transition:`stroke-dasharray 0.9s ease ${i*.12}s`}}/>
          off+=arc; return el
        })}
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontSize:18,fontWeight:900,color:DARK,lineHeight:1}}>{pct}%</span>
        <span style={{fontSize:7,fontWeight:900,color:GOLD_DK,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:2}}>confirmés</span>
      </div>
    </div>
  )
}

/* ─── Animated bar ─── */
function Bar({ pct, color }) {
  const [w,setW] = useState(0)
  useEffect(()=>{ const id=setTimeout(()=>setW(pct),400); return()=>clearTimeout(id) },[pct])
  return (
    <div style={{height:6,background:'#e8e0d6',overflow:'hidden',marginTop:8,borderRadius:0}}>
      <div style={{height:'100%',width:`${w}%`,background:color,transition:'width 0.9s ease'}}/>
    </div>
  )
}

/* ─── Stat card ─── */
function StatCard({ icon:Icon, value, label, variant='dark', delay=0, total=0 }) {
  const n   = useCountUp(value,700,delay)
  const pct = total>0 ? Math.round((value/total)*100) : 0
  const V   = {
    green: { bg:GREEN_BG, border:GREEN, text:GREEN,   bar:GREEN  },
    gold:  { bg:AMBER_BG, border:GOLD,  text:AMBER,   bar:GOLD   },
    red:   { bg:RED_BG,   border:RED,   text:RED,     bar:RED    },
    dark:  { bg:CREAM,    border:DARK,  text:DARK,    bar:DARK   },
  }
  const s = V[variant]
  return (
    <div style={{background:s.bg, borderTop:`3px solid ${s.border}`, padding:'20px 18px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <span style={{fontSize:10,fontWeight:900,color:s.text,textTransform:'uppercase',letterSpacing:'0.14em'}}>{label}</span>
        <Icon size={15} strokeWidth={2.5} color={s.border}/>
      </div>
      <p style={{margin:0,fontSize:'clamp(30px,4vw,48px)',fontWeight:900,color:s.text,letterSpacing:'-2px',fontVariantNumeric:'tabular-nums',lineHeight:1}}>{n}</p>
      {total>0 && (
        <>
          <Bar pct={pct} color={s.bar}/>
          <span style={{fontSize:10,fontWeight:900,color:s.text,marginTop:5,display:'block',opacity:0.7}}>{pct}% du total</span>
        </>
      )}
    </div>
  )
}

/* ─── Badge ─── */
function Badge({ status }) {
  const M = {
    Confirmed: { label:'Confirmée',  bg:GREEN_BG, color:GREEN },
    Pending:   { label:'En attente', bg:AMBER_BG, color:AMBER },
    Cancelled: { label:'Annulée',    bg:RED_BG,   color:RED   },
  }
  const s = M[status]||M.Pending
  return (
    <span style={{display:'inline-block',padding:'4px 10px',background:s.bg,fontSize:9,fontWeight:900,color:s.color,textTransform:'uppercase',letterSpacing:'0.12em',whiteSpace:'nowrap'}}>
      {s.label}
    </span>
  )
}

/* ─── Upcoming table ─── */
function UpcomingTable({ reservations, onViewAll }) {
  if (!reservations?.length) return (
    <div style={{padding:'40px 0',textAlign:'center'}}>
      <CalendarDays size={32} color="rgba(43,33,24,0.12)" style={{display:'block',margin:'0 auto 10px'}}/>
      <p style={{margin:0,fontSize:14,fontWeight:900,color:'rgba(43,33,24,0.2)'}}>Aucune réservation</p>
    </div>
  )
  return (
    <div>
      {/* header */}
      <div className="res-grid" style={{padding:'11px 20px',background:DARK,gap:16}}>
        {['Heure','Client','Couverts','Table','Statut'].map(h=>(
          <span key={h} style={{fontSize:9,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.15em'}}>{h}</span>
        ))}
      </div>
      {/* rows */}
      {reservations.slice(0,6).map((r,i)=>(
        <div key={r.id??i} className="res-grid"
          style={{padding:'13px 20px',background:i%2===0?WHITE:CREAM,borderBottom:`1px solid ${BORDER}`,gap:16,alignItems:'center'}}>
          <span style={{fontSize:14,fontWeight:900,color:DARK,fontVariantNumeric:'tabular-nums'}}>{r.start_time}</span>
          <div>
            <div style={{fontSize:13,fontWeight:900,color:DARK,letterSpacing:'-0.3px'}}>{r.name}</div>
            {r.phone&&<div style={{fontSize:11,fontWeight:700,color:'rgba(43,33,24,0.4)',marginTop:1}}>{r.phone}</div>}
          </div>
          <span style={{fontSize:13,fontWeight:900,color:DARK}}>{r.guests} pers.</span>
          <span style={{fontSize:12,fontWeight:700,color:'rgba(43,33,24,0.5)'}}>{r.service||'—'}</span>
          <Badge status={r.status}/>
        </div>
      ))}
      {/* footer */}
      <button onClick={onViewAll}
        style={{width:'100%',padding:'14px 20px',background:DARK,border:'none',color:WHITE,fontSize:12,fontWeight:900,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'inherit',letterSpacing:'0.06em'}}>
        <span>Voir toutes les réservations</span>
        <ArrowRight size={14} strokeWidth={2.5}/>
      </button>
    </div>
  )
}

/* ─── Insight card ─── */
function InsightCard({ icon:Icon, eyebrow, title, sub, accent=GOLD, action, onAction }) {
  const [h,setH] = useState(false)
  return (
    <div style={{background:CREAM,border:`2px solid ${BORDER}`,padding:'24px 22px',flex:1}}>
      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:12}}>
        <Icon size={13} strokeWidth={2.5} color={accent}/>
        <span style={{fontSize:9,fontWeight:900,color:accent,textTransform:'uppercase',letterSpacing:'0.18em'}}>{eyebrow}</span>
      </div>
      <p style={{margin:'0 0 6px',fontSize:'clamp(14px,1.8vw,18px)',fontWeight:900,color:DARK,letterSpacing:'-0.5px',lineHeight:1.2}}>{title}</p>
      <p style={{margin:'0 0 20px',fontSize:12,fontWeight:700,color:'rgba(43,33,24,0.5)'}}>{sub}</p>
      {action&&(
        <button onClick={onAction} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
          style={{padding:'10px 18px',background:h?DARK:'transparent',border:`2px solid ${DARK}`,color:h?WHITE:DARK,fontSize:11,fontWeight:900,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.06em',transition:'all 0.14s'}}>
          {action}
        </button>
      )}
    </div>
  )
}

/* ─── Tab content ─── */
function TabView({ tab, stats, reservations, onViewAll }) {
  const c = tab==='today' ? stats.today_confirmed    : tab==='tomorrow' ? (stats.tomorrow_confirmed??0) : stats.confirmed
  const p = tab==='today' ? stats.today_pending      : tab==='tomorrow' ? (stats.tomorrow_pending??0)   : stats.pending
  const a = tab==='today' ? stats.today_cancelled    : tab==='tomorrow' ? (stats.tomorrow_cancelled??0) : stats.cancelled
  const total = c+p+a

  return (
    <div>
      {/* ── Hero block ── */}
      <div style={{background:WHITE,border:`2px solid ${DARK}`,padding:'clamp(20px,3vw,36px)',marginBottom:8}}>
        <div className="hero-flex">
          {/* Big number + ring */}
          <div style={{flexShrink:0}}>
            <p style={{margin:'0 0 8px',fontSize:10,fontWeight:900,color:'rgba(43,33,24,0.4)',textTransform:'uppercase',letterSpacing:'0.18em'}}>Total réservations</p>
            <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
              <p style={{margin:0,fontSize:'clamp(72px,10vw,120px)',fontWeight:900,color:DARK,lineHeight:0.85,letterSpacing:'-6px',fontVariantNumeric:'tabular-nums'}}>{total}</p>
              <Ring c={c} p={p} a={a} size={100}/>
            </div>
          </div>

          {/* divider */}
          <div className="hero-divider"/>

          {/* 3 stat cards */}
          <div className="db-cards" style={{flex:1,minWidth:0}}>
            <StatCard icon={CheckCircle} value={c} label="Confirmées" variant="green" delay={50}  total={total}/>
            <StatCard icon={Clock}       value={p} label="En attente" variant="gold"  delay={80}  total={total}/>
            <StatCard icon={XCircle}     value={a} label="Annulées"   variant="red"   delay={110} total={total}/>
          </div>
        </div>
      </div>

      {/* ── Prochaines arrivées ── */}
      <div style={{background:WHITE,border:`2px solid ${DARK}`,marginBottom:8}}>
        <div style={{padding:'18px 20px',borderBottom:`2px solid ${DARK}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
          <h3 style={{margin:0,fontSize:'clamp(14px,2vw,18px)',fontWeight:900,color:DARK,letterSpacing:'-0.5px',textTransform:'uppercase'}}>Prochaines arrivées</h3>
          <button onClick={onViewAll} style={{background:'none',border:'none',color:GOLD_DK,fontSize:11,fontWeight:900,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.06em',display:'flex',alignItems:'center',gap:5}}>
            Voir tout le planning <ArrowRight size={12} strokeWidth={2.5}/>
          </button>
        </div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          <div style={{minWidth:480}}>
            <UpcomingTable reservations={reservations} onViewAll={onViewAll}/>
          </div>
        </div>
      </div>

      {/* ── Insights ── */}
      <div className="db-insights">
        <InsightCard
          icon={TrendingUp}
          eyebrow="Tendance du jour"
          title={c>p ? 'Bonne journée en vue' : p>0 ? 'Réservations en attente' : 'Journée calme'}
          sub={`${c} confirmées · ${p} en attente · ${a} annulées`}
          accent={GOLD_DK}
          action="Voir les réservations"
          onAction={onViewAll}
        />
        <InsightCard
          icon={Star}
          eyebrow="Taux de confirmation"
          title={`${total>0?Math.round(c/total*100):0}% de taux confirmé`}
          sub={`${total} réservation${total!==1?'s':''} au total sur cette période`}
          accent={GREEN}
        />
      </div>
    </div>
  )
}

/* ─── Button ─── */
function Btn({ children, onClick, primary, disabled, icon:Icon }) {
  const [h,setH] = useState(false)
  const bg    = primary ? (h?DARK:GOLD) : (h?GOLD:DARK)
  const color = primary ? (h?GOLD:DARK) : WHITE
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:'flex',alignItems:'center',gap:8,padding:'12px 20px',background:bg,border:'none',color,fontSize:13,fontWeight:900,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,transition:'all 0.15s',fontFamily:'inherit',whiteSpace:'nowrap'}}>
      {Icon&&<Icon size={14} strokeWidth={2.5}/>}
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info }                           = useRestaurantInfo()
  const navigate = useNavigate()

  const [tab,        setTab]        = useState('today')
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)
  const [todayRes,   setTodayRes]   = useState([])
  const [tomRes,     setTomRes]     = useState([])

  useEffect(()=>{
    const h = { Authorization:`Bearer ${getToken()}` }
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    {headers:h}).then(r=>r.json()).then(d=>setTodayRes(Array.isArray(d)?d:[])).catch(()=>{})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, {headers:h}).then(r=>r.json()).then(d=>setTomRes(Array.isArray(d)?d:[])).catch(()=>{})
  },[])

  const today = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})

  async function handleRefresh() { setRefreshing(true); try{await refetch()}finally{setRefreshing(false)} }
  async function handleExport()  {
    setExporting(true)
    try {
      if(!window.jspdf) await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})
      exportPDF(stats)
    } catch(e){console.error(e)} finally{setExporting(false)}
  }

  const TABS = [
    { key:'today',    label:"Aujourd'hui", res:todayRes, date:TODAY_DATE    },
    { key:'tomorrow', label:'Demain',      res:tomRes,   date:TOMORROW_DATE },
    { key:'month',    label:'Ce mois',     res:[],       date:null          },
  ]
  const active = TABS.find(t=>t.key===tab)

  if (loading) return <Spinner/>

  return (
    <div style={{minHeight:'100vh',background:WHITE,fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; }
        .db-wrap    { max-width: 1100px; margin: 0 auto; padding: clamp(24px,4vw,52px) clamp(16px,3vw,44px); }
        .db-topbar  { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 14px; margin-bottom: 28px; }
        .db-btns    { display: flex; gap: 3px; }
        .db-tabs    { display: flex; border-bottom: 2px solid ${DARK}; margin-bottom: 20px; overflow-x: auto; }
        .db-cards   { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .db-insights{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 0; }
        .hero-flex  { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .hero-divider{ width:2px; background:${DARK}; align-self:stretch; flex-shrink:0; }
        .res-grid   { display: grid; grid-template-columns: 80px 1fr 80px 1fr 110px; align-items: center; }

        @media(max-width:900px){
          .db-cards    { grid-template-columns: 1fr 1fr; }
          .hero-divider{ display:none; }
          .hero-flex   { gap:20px; }
        }
        @media(max-width:640px){
          .db-cards    { grid-template-columns: 1fr; }
          .db-insights { grid-template-columns: 1fr; }
        }
        @media(max-width:480px){
          .db-btns { flex-direction:column; width:100%; }
          .db-btns button { justify-content:center; width:100%; }
        }
      `}</style>

      <div className="db-wrap">

        {/* ── TOP BAR ── */}
        <FadeUp delay={0}>
          <div className="db-topbar">
            <div>
              <h1 style={{margin:'0 0 7px',fontSize:'clamp(26px,4vw,40px)',fontWeight:900,color:DARK,letterSpacing:'-2px',lineHeight:1}}>
                Tableau de bord
              </h1>
              <p style={{margin:0,fontSize:13,fontWeight:700,color:GOLD_DK,textTransform:'capitalize'}}>
                {today}&nbsp;·&nbsp;<LiveClock/>
              </p>
            </div>
            <div className="db-btns">
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>{refreshing?'Actualisation…':'Actualiser'}</Btn>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>{exporting?'Génération…':'Exporter PDF'}</Btn>
            </div>
          </div>
          <div style={{height:2,background:DARK,margin:'0 0 32px'}}/>
        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={15}>
          <div className="db-tabs">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)}
                style={{padding:'13px 28px',background:'none',border:'none',borderBottom:tab===t.key?`3px solid ${DARK}`:'3px solid transparent',color:tab===t.key?DARK:'rgba(43,33,24,0.4)',fontSize:12,fontWeight:900,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.1em',textTransform:'uppercase',transition:'all 0.14s',marginBottom:-2,whiteSpace:'nowrap',flexShrink:0}}>
                {t.label}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* ── CONTENT ── */}
        <FadeUp delay={30} key={tab}>
          <TabView
            tab={tab}
            stats={stats}
            reservations={active?.res??[]}
            onViewAll={()=>navigate('/reservations',{state:active?.date?{filterDate:active.date}:{}})}
          />
        </FadeUp>

        {error&&<p style={{marginTop:24,fontSize:13,fontWeight:800,color:RED}}>Erreur — {error}</p>}
      </div>
    </div>
  )
}