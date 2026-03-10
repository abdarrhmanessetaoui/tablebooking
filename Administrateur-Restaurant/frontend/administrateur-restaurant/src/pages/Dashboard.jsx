import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, CheckCircle, Clock, XCircle, CalendarDays, ArrowRight, TrendingUp, Star } from 'lucide-react'

import useDashboardStats from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import FadeUp            from '../components/Dashboard/FadeUp'
import Spinner           from '../components/Dashboard/Spinner'
import useCountUp        from '../hooks/Dashboard/useCountUp'
import { exportPDF }     from '../utils/exportPDF'
import { getToken }      from '../utils/auth'

/* ─── reuse your existing reservations table ─── */
import ReservationsTable from '../components/Reservations/ReservationsTable'
/* If that import path doesn't exist yet, see note at bottom */

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
  useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id)},[])
  return <span style={{fontVariantNumeric:'tabular-nums'}}>{t.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
}

/* ─── Icon-only button (top bar) ─── */
function IconBtn({ icon:Icon, onClick, disabled, title, primary }) {
  const [h,setH] = useState(false)
  const bg    = primary ? (h?DARK:GOLD) : (h?GOLD:DARK)
  const color = primary ? (h?GOLD:DARK) : WHITE
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{display:'flex',alignItems:'center',justifyContent:'center',width:40,height:40,background:bg,border:'none',color,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,transition:'all 0.15s',flexShrink:0}}>
      <Icon size={16} strokeWidth={2.5}/>
    </button>
  )
}

/* ─── Ring ─── */
function Ring({ c, p, a, size=90 }) {
  const total=c+p+a||1, pct=Math.round((c/total)*100)
  const r=30,circ=2*Math.PI*r
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
          off+=arc;return el
        })}
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontSize:16,fontWeight:900,color:DARK,lineHeight:1}}>{pct}%</span>
        <span style={{fontSize:6,fontWeight:900,color:GOLD_DK,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:2}}>conf.</span>
      </div>
    </div>
  )
}

/* ─── Animated bar ─── */
function Bar({ pct, color }) {
  const [w,setW] = useState(0)
  useEffect(()=>{const id=setTimeout(()=>setW(pct),400);return()=>clearTimeout(id)},[pct])
  return (
    <div style={{height:5,background:'#e8e0d6',overflow:'hidden',marginTop:7}}>
      <div style={{height:'100%',width:`${w}%`,background:color,transition:'width 0.9s ease'}}/>
    </div>
  )
}

/* ─── Stat card ─── */
function StatCard({ icon:Icon, value, label, variant='dark', delay=0, total=0 }) {
  const n=useCountUp(value,700,delay)
  const pct=total>0?Math.round((value/total)*100):0
  const V={
    green:{bg:GREEN_BG,border:GREEN,text:GREEN,bar:GREEN},
    gold: {bg:AMBER_BG,border:GOLD, text:AMBER, bar:GOLD},
    red:  {bg:RED_BG,  border:RED,  text:RED,   bar:RED},
    dark: {bg:CREAM,   border:DARK, text:DARK,  bar:DARK},
  }
  const s=V[variant]
  return (
    <div style={{background:s.bg,borderTop:`3px solid ${s.border}`,padding:'18px 16px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <span style={{fontSize:9,fontWeight:900,color:s.text,textTransform:'uppercase',letterSpacing:'0.14em'}}>{label}</span>
        <Icon size={14} strokeWidth={2.5} color={s.border}/>
      </div>
      <p style={{margin:0,fontSize:'clamp(26px,4vw,44px)',fontWeight:900,color:s.text,letterSpacing:'-2px',fontVariantNumeric:'tabular-nums',lineHeight:1}}>{n}</p>
      {total>0&&<><Bar pct={pct} color={s.bar}/><span style={{fontSize:9,fontWeight:900,color:s.text,marginTop:4,display:'block',opacity:0.65}}>{pct}%</span></>}
    </div>
  )
}

/* ─── Section label ─── */
function SLabel({ text }) {
  return <p style={{margin:'0 0 14px',fontSize:9,fontWeight:900,color:'rgba(43,33,24,0.35)',textTransform:'uppercase',letterSpacing:'0.2em'}}>{text}</p>
}

/* ─── Tab content ─── */
function TabView({ tab, stats, reservations, onViewAll }) {
  const c=tab==='today'?stats.today_confirmed   :tab==='tomorrow'?(stats.tomorrow_confirmed??0):stats.confirmed
  const p=tab==='today'?stats.today_pending     :tab==='tomorrow'?(stats.tomorrow_pending??0)  :stats.pending
  const a=tab==='today'?stats.today_cancelled   :tab==='tomorrow'?(stats.tomorrow_cancelled??0):stats.cancelled
  const total=c+p+a

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>

      {/* ── HERO BLOCK ── */}
      <div style={{background:WHITE,border:`2px solid ${DARK}`,padding:'clamp(18px,3vw,32px)'}}>
        <SLabel text="Vue d'ensemble"/>
        <div className="hero-grid">

          {/* Big number */}
          <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <p style={{margin:0,fontSize:'clamp(64px,10vw,112px)',fontWeight:900,color:DARK,lineHeight:0.88,letterSpacing:'-5px',fontVariantNumeric:'tabular-nums'}}>{total}</p>
            <Ring c={c} p={p} a={a} size={88}/>
          </div>

          {/* Stat cards */}
          <div className="db-cards">
            <StatCard icon={CheckCircle} value={c} label="Confirmées" variant="green" delay={50}  total={total}/>
            <StatCard icon={Clock}       value={p} label="En attente" variant="gold"  delay={80}  total={total}/>
            <StatCard icon={XCircle}     value={a} label="Annulées"   variant="red"   delay={110} total={total}/>
          </div>

        </div>
      </div>

      {/* ── RESERVATIONS TABLE ── */}
      <div style={{background:WHITE,border:`2px solid ${DARK}`}}>
        <div style={{padding:'16px 20px',borderBottom:`2px solid ${DARK}`,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}>
          <h3 style={{margin:0,fontSize:'clamp(13px,2vw,16px)',fontWeight:900,color:DARK,letterSpacing:'-0.3px',textTransform:'uppercase'}}>Prochaines réservations</h3>
          <button onClick={onViewAll}
            style={{background:'none',border:'none',color:GOLD_DK,fontSize:11,fontWeight:900,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.06em',display:'flex',alignItems:'center',gap:5,padding:0,whiteSpace:'nowrap'}}>
            Voir tout <ArrowRight size={12} strokeWidth={2.5}/>
          </button>
        </div>

        {/* Reuse your reservations table */}
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          {reservations.length>0
            ? <MiniReservations reservations={reservations} onViewAll={onViewAll}/>
            : <EmptyState/>
          }
        </div>
      </div>

    </div>
  )
}

/* ─── Empty state ─── */
function EmptyState() {
  return (
    <div style={{padding:'48px 0',textAlign:'center'}}>
      <CalendarDays size={36} color="rgba(43,33,24,0.1)" style={{display:'block',margin:'0 auto 12px'}}/>
      <p style={{margin:0,fontSize:14,fontWeight:900,color:'rgba(43,33,24,0.18)'}}>Aucune réservation</p>
    </div>
  )
}

/* ─── Mini reservations table (matches your Reservations page style) ─── */
function MiniReservations({ reservations, onViewAll }) {
  const STATUS={
    Confirmed:{label:'Confirmée', bg:GREEN_BG,color:GREEN},
    Pending:  {label:'En attente',bg:AMBER_BG,color:AMBER},
    Cancelled:{label:'Annulée',   bg:RED_BG,  color:RED},
  }
  return (
    <div style={{minWidth:560}}>
      {/* header */}
      <div className="res-row" style={{background:DARK,padding:'10px 20px'}}>
        {['Nom','Téléphone','Date','Heure','Couverts','Service','Statut'].map(h=>(
          <span key={h} style={{fontSize:9,fontWeight:900,color:GOLD,textTransform:'uppercase',letterSpacing:'0.14em'}}>{h}</span>
        ))}
      </div>
      {/* rows */}
      {reservations.slice(0,6).map((r,i)=>{
        const s=STATUS[r.status]||STATUS.Pending
        return (
          <div key={r.id??i} className="res-row"
            style={{padding:'12px 20px',background:i%2===0?WHITE:CREAM,borderBottom:`1px solid ${BORDER}`,alignItems:'center'}}>
            <span style={{fontSize:13,fontWeight:900,color:DARK,letterSpacing:'-0.2px'}}>{r.name}</span>
            <span style={{fontSize:12,fontWeight:700,color:'rgba(43,33,24,0.45)'}}>{r.phone||'—'}</span>
            <span style={{fontSize:12,fontWeight:800,color:DARK}}>{r.date}</span>
            <span style={{fontSize:13,fontWeight:900,color:DARK,fontVariantNumeric:'tabular-nums'}}>{r.start_time}</span>
            <span style={{fontSize:13,fontWeight:900,color:DARK}}>{r.guests}</span>
            <span style={{fontSize:12,fontWeight:700,color:'rgba(43,33,24,0.45)'}}>{r.service||'—'}</span>
            <span style={{display:'inline-block',padding:'4px 10px',background:s.bg,fontSize:9,fontWeight:900,color:s.color,letterSpacing:'0.1em',whiteSpace:'nowrap'}}>{s.label}</span>
          </div>
        )
      })}
      {/* footer */}
      <button onClick={onViewAll}
        style={{width:'100%',padding:'14px 20px',background:DARK,border:'none',color:WHITE,fontSize:12,fontWeight:900,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'inherit',letterSpacing:'0.06em'}}>
        <span>Voir toutes les réservations</span>
        <ArrowRight size={14} strokeWidth={2.5}/>
      </button>
    </div>
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
    const h={Authorization:`Bearer ${getToken()}`}
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TODAY_DATE}`,    {headers:h}).then(r=>r.json()).then(d=>setTodayRes(Array.isArray(d)?d:[])).catch(()=>{})
    fetch(`http://localhost:8000/api/restaurant/reservations?date=${TOMORROW_DATE}`, {headers:h}).then(r=>r.json()).then(d=>setTomRes(Array.isArray(d)?d:[])).catch(()=>{})
  },[])

  const today=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})

  async function handleRefresh(){setRefreshing(true);try{await refetch()}finally{setRefreshing(false)}}
  async function handleExport(){
    setExporting(true)
    try{
      if(!window.jspdf)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})
      exportPDF(stats)
    }catch(e){console.error(e)}finally{setExporting(false)}
  }

  const TABS=[
    {key:'today',    label:"Aujourd'hui", res:todayRes, date:TODAY_DATE   },
    {key:'tomorrow', label:'Demain',      res:tomRes,   date:TOMORROW_DATE},
    {key:'month',    label:'Ce mois',     res:[],       date:null         },
  ]
  const active=TABS.find(t=>t.key===tab)

  if(loading)return <Spinner/>

  return (
    <div style={{minHeight:'100vh',background:WHITE,fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;}
        .db-wrap{max-width:1100px;margin:0 auto;padding:clamp(20px,3.5vw,48px) clamp(14px,3vw,44px);}

        /* hero: number left, cards right */
        .hero-grid{display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:center;margin-top:8px;}

        /* 3 stat cards */
        .db-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}

        /* reservations row */
        .res-row{display:grid;grid-template-columns:1.4fr 1.1fr .9fr .6fr .5fr .9fr .9fr;gap:12px;}

        /* tabs */
        .db-tabs{display:flex;border-bottom:2px solid ${DARK};margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .db-tab{padding:12px clamp(14px,2.5vw,28px);background:none;border:none;border-bottom:3px solid transparent;color:rgba(43,33,24,0.38);font-size:11px;font-weight:900;cursor:pointer;font-family:inherit;letter-spacing:.1em;text-transform:uppercase;transition:all .14s;margin-bottom:-2px;white-space:nowrap;flex-shrink:0;}
        .db-tab.active{border-bottom-color:${DARK};color:${DARK};}

        /* Responsive */
        @media(max-width:860px){
          .hero-grid{grid-template-columns:1fr;gap:20px;}
        }
        @media(max-width:700px){
          .db-cards{grid-template-columns:1fr 1fr;}
          .res-row{grid-template-columns:1fr .6fr .6fr .7fr;}
        }
        @media(max-width:500px){
          .db-cards{grid-template-columns:1fr;}
        }
      `}</style>

      <div className="db-wrap">
        <FadeUp delay={0}>

          {/* ── TOP BAR ── */}
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:24}}>
            <div>
              <h1 style={{margin:'0 0 6px',fontSize:'clamp(24px,4vw,38px)',fontWeight:900,color:DARK,letterSpacing:'-2px',lineHeight:1}}>
                Tableau de bord
              </h1>
              <p style={{margin:0,fontSize:12,fontWeight:700,color:GOLD_DK,textTransform:'capitalize'}}>
                {today}&nbsp;·&nbsp;<LiveClock/>
              </p>
            </div>

            {/* icon-only buttons */}
            <div style={{display:'flex',gap:4,flexShrink:0}}>
              <IconBtn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing} title="Actualiser"/>
              <IconBtn icon={FileDown}  onClick={handleExport}  disabled={exporting}  title="Exporter PDF" primary/>
            </div>
          </div>

          {/* divider */}
          <div style={{height:2,background:DARK,margin:'0 0 24px'}}/>

        </FadeUp>

        {/* ── TABS ── */}
        <FadeUp delay={15}>
          <div className="db-tabs">
            {TABS.map(t=>(
              <button key={t.key} className={`db-tab${tab===t.key?' active':''}`} onClick={()=>setTab(t.key)}>
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

        {error&&<p style={{marginTop:20,fontSize:13,fontWeight:800,color:RED}}>Erreur — {error}</p>}
      </div>
    </div>
  )
}