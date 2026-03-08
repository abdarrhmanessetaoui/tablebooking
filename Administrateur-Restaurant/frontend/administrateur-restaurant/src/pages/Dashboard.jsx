import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, FileDown, CheckCircle, Clock, XCircle, ClipboardList, ArrowRight, MapPin, Mail } from 'lucide-react'

import useDashboardStats  from '../hooks/Dashboard/useDashboardStats'
import useRestaurantInfo  from '../hooks/useRestaurantInfo'
import FadeUp             from '../components/Dashboard/FadeUp'
import Spinner            from '../components/Dashboard/Spinner'
import useCountUp         from '../hooks/Dashboard/useCountUp'
import { exportPDF }      from '../utils/exportPDF'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const GOLD_BG   = '#fdf6ec'
const CREAM     = '#faf8f5'

const TODAY_DATE    = new Date().toISOString().slice(0, 10)
const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

/* ── Live clock ── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return <span style={{ fontVariantNumeric:'tabular-nums' }}>{t.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
}

/* ── Donut ── */
function Donut({ c, p, a, size = 120 }) {
  const total = c + p + a
  const r = 13, circ = 2 * Math.PI * r
  const [on, setOn] = useState(false)
  useEffect(() => { const id = setTimeout(() => setOn(true), 300); return () => clearTimeout(id) }, [total])

  const segs = [ { v:c, color:DARK }, { v:p, color:GOLD }, { v:a, color:'#c8b49a' } ]
  let off = 0

  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e8e0d6" strokeWidth="4.5" />
        {total > 0 && segs.map((s, i) => {
          if (!s.v) { off += (s.v/total)*circ; return null }
          const arc  = (s.v / total) * circ
          const dash = on ? arc : 0
          const el = <circle key={i} cx="18" cy="18" r={r} fill="none"
            stroke={s.color} strokeWidth="4.5"
            strokeDasharray={`${(s.v/total)*circ} ${circ}`}
            strokeDashoffset={-off}
            style={{ transition:`stroke-dasharray 0.9s ease ${i*0.1}s` }}
          />
          off += arc; return el
        })}
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 }}>
        <span style={{ fontSize:12, fontWeight:900, color:DARK, lineHeight:1 }}>{total}</span>
        <span style={{ fontSize:7, fontWeight:800, color:GOLD_DARK, textTransform:'uppercase', letterSpacing:'0.06em' }}>total</span>
      </div>
    </div>
  )
}

/* ── Animated bar ── */
function AnimBar({ pct, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { const id = setTimeout(() => setW(pct), 500); return () => clearTimeout(id) }, [pct])
  return (
    <div style={{ height:12, background:'#e8e0d6', borderRadius:3, overflow:'hidden', marginTop:10 }}>
      <div style={{ height:'100%', width:`${w}%`, background:color, transition:'width 1s ease' }} />
    </div>
  )
}

/* ── Stat card ── */
function StatCard({ icon:Icon, value, label, gold=false, delay=0, total=0 }) {
  const n   = useCountUp(value, 700, delay)
  const pct = total > 0 ? Math.round((value/total)*100) : 0
  const col = gold ? GOLD_DARK : DARK
  return (
    <div style={{ background: gold ? GOLD_BG : CREAM, padding:'20px 22px', borderTop:`3px solid ${gold ? GOLD : DARK}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <Icon size={13} strokeWidth={2.5} color={col} />
        <span style={{ fontSize:10, fontWeight:800, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.12em' }}>{label}</span>
      </div>
      <p style={{ margin:0, fontSize:'clamp(28px,3vw,42px)', fontWeight:900, color:col, letterSpacing:'-1.5px', fontVariantNumeric:'tabular-nums', lineHeight:1, fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
      {total > 0 && (
        <>
          <AnimBar pct={pct} color={gold ? GOLD : DARK} />
          <span style={{ fontSize:9, fontWeight:700, color:'#bbb', marginTop:3, display:'block' }}>{pct}%</span>
        </>
      )}
    </div>
  )
}

/* ── Hero counter ── */
function Hero({ value, delay=0 }) {
  const n = useCountUp(value, 800, delay)
  return (
    <p style={{ margin:0, fontSize:'clamp(80px,10vw,136px)', fontWeight:900, color:DARK, lineHeight:0.85, letterSpacing:'-5px', fontVariantNumeric:'tabular-nums', fontFamily:"'Plus Jakarta Sans',system-ui" }}>{n}</p>
  )
}

/* ── Button ── */
function Btn({ children, onClick, primary, disabled, icon:Icon, small }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov?DARK:GOLD) : (hov?GOLD:DARK)
  const color = primary ? (hov?GOLD:DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:8, padding: small ? '10px 18px' : '13px 24px', background:bg, border:'none', color, fontSize: small ? 12 : 13, fontWeight:800, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'background 0.15s,color 0.15s', fontFamily:'inherit', whiteSpace:'nowrap' }}>
      {Icon && <Icon size={small?13:14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

export default function Dashboard() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { info }                           = useRestaurantInfo()
  const navigate                           = useNavigate()
  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  const today = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})
  const go    = f => navigate('/reservations',{state:f})

  async function handleRefresh() { setRefreshing(true); try{await refetch()}finally{setRefreshing(false)} }
  async function handleExportPDF() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})
      exportPDF(stats)
    } catch(e){console.error(e)} finally{setExporting(false)}
  }

  if (loading) return <Spinner />

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .db-wrap { max-width:1020px; margin:0 auto; padding:clamp(28px,4vw,56px) clamp(20px,3.5vw,48px); }
        .db-hr   { height:2px; background:${DARK}; margin:52px 0; }
        .db-section { display:grid; grid-template-columns:280px 1fr; gap:48px; align-items:start; }
        .db-cards   { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        @media(max-width:780px){ .db-section { grid-template-columns:1fr; gap:28px; } }
        @media(max-width:560px){ .db-cards { grid-template-columns:1fr; } }
        @media(max-width:400px){ .db-topbtns { flex-direction:column; width:100%; } .db-topbtns button { justify-content:center; } }
      `}</style>

      <div className="db-wrap">

        {/* ── Topbar ── */}
        <FadeUp delay={0}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom: info ? 20 : 52 }}>
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>Tableau de bord</h1>
              <p style={{ margin:'7px 0 0', fontSize:13, fontWeight:700, color:GOLD, textTransform:'capitalize' }}>{today}&nbsp;·&nbsp;<LiveClock /></p>
            </div>
            <div className="db-topbtns" style={{ display:'flex', gap:3 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>{refreshing?'Actualisation…':'Actualiser'}</Btn>
              <Btn icon={FileDown} primary onClick={handleExportPDF} disabled={exporting}>{exporting?'Génération…':'Exporter PDF'}</Btn>
            </div>
          </div>
        </FadeUp>

        {/* ── Restaurant banner ── */}
        {info && (
          <FadeUp delay={15}>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12, padding:'14px 20px', background:DARK, marginBottom:52 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:38, height:38, background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:16, fontWeight:900, color:DARK }}>{info.name?.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ margin:0, fontSize:15, fontWeight:900, color:'#fff', letterSpacing:'-0.3px' }}>{info.name}</p>
                  {info.location && <p style={{ margin:'2px 0 0', fontSize:11, fontWeight:700, color:GOLD, display:'flex', alignItems:'center', gap:4 }}><MapPin size={10} color={GOLD} />{info.location}</p>}
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {info.email && (
                  <span style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', background:'rgba(200,169,126,0.18)', fontSize:11, fontWeight:700, color:GOLD }}>
                    <Mail size={10} color={GOLD} />{info.email}
                  </span>
                )}
                {info.default_status && (
                  <span style={{ padding:'5px 11px', background:'rgba(255,255,255,0.08)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>
                    Défaut : <span style={{ color:'#fff' }}>{info.default_status}</span>
                  </span>
                )}
              </div>
            </div>
          </FadeUp>
        )}

        {/* ── AUJOURD'HUI ── */}
        <FadeUp delay={50}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>Aujourd'hui</h2>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>Réservations du jour</p>
          </div>
          <div className="db-section">
            {/* Left */}
            <div>
              <Hero value={stats.today} delay={70} />
              <p style={{ margin:'10px 0 24px', fontSize:13, fontWeight:800, color:'#888' }}>réservations aujourd'hui</p>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
                <Donut c={stats.today_confirmed} p={stats.today_pending} a={stats.today_cancelled} size={110} />
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[{label:'Confirmées',color:DARK},{label:'En attente',color:GOLD},{label:'Annulées',color:'#c8b49a'}].map(x=>(
                    <div key={x.label} style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:x.color, flexShrink:0 }} />
                      <span style={{ fontSize:11, fontWeight:700, color:DARK }}>{x.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Btn icon={ArrowRight} primary onClick={() => go({filterDate:TODAY_DATE})}>Voir aujourd'hui</Btn>
            </div>
            {/* Right */}
            <div className="db-cards">
              <StatCard icon={CheckCircle} value={stats.today_confirmed} label="Confirmées" delay={100} total={stats.today} />
              <StatCard icon={Clock}       value={stats.today_pending}   label="En attente" gold delay={130} total={stats.today} />
              <StatCard icon={XCircle}     value={stats.today_cancelled} label="Annulées"   delay={160} total={stats.today} />
            </div>
          </div>
        </FadeUp>

        <div className="db-hr" />

        {/* ── DEMAIN ── */}
        <FadeUp delay={200}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>Demain</h2>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>Planning du lendemain</p>
          </div>
          <div className="db-section">
            <div>
              <Hero value={stats.tomorrow} delay={220} />
              <p style={{ margin:'10px 0 24px', fontSize:13, fontWeight:800, color:'#888' }}>réservations demain</p>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
                <Donut c={stats.tomorrow_confirmed??0} p={stats.tomorrow_pending??0} a={stats.tomorrow_cancelled??0} size={110} />
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[{label:'Confirmées',color:DARK},{label:'En attente',color:GOLD},{label:'Annulées',color:'#c8b49a'}].map(x=>(
                    <div key={x.label} style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:x.color, flexShrink:0 }} />
                      <span style={{ fontSize:11, fontWeight:700, color:DARK }}>{x.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Btn icon={ArrowRight} primary onClick={() => go({filterDate:TOMORROW_DATE})}>Voir demain</Btn>
            </div>
            <div className="db-cards">
              <StatCard icon={CheckCircle} value={stats.tomorrow_confirmed??0} label="Confirmées" delay={240} total={stats.tomorrow} />
              <StatCard icon={Clock}       value={stats.tomorrow_pending??0}   label="En attente" gold delay={270} total={stats.tomorrow} />
              <StatCard icon={XCircle}     value={stats.tomorrow_cancelled??0} label="Annulées"   delay={300} total={stats.tomorrow} />
            </div>
          </div>
        </FadeUp>

        <div className="db-hr" />

        {/* ── CE MOIS ── */}
        <FadeUp delay={360}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>Ce mois</h2>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>Bilan mensuel des réservations</p>
          </div>
          <div className="db-section">
            <div>
              <Hero value={stats.total} delay={380} />
              <p style={{ margin:'10px 0 24px', fontSize:13, fontWeight:800, color:'#888' }}>réservations ce mois</p>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
                <Donut c={stats.confirmed} p={stats.pending} a={stats.cancelled} size={110} />
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[{label:'Confirmées',color:DARK},{label:'En attente',color:GOLD},{label:'Annulées',color:'#c8b49a'}].map(x=>(
                    <div key={x.label} style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:x.color, flexShrink:0 }} />
                      <span style={{ fontSize:11, fontWeight:700, color:DARK }}>{x.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="db-cards">
              <StatCard icon={CheckCircle}  value={stats.confirmed} label="Confirmées"      delay={400} total={stats.total} />
              <StatCard icon={Clock}        value={stats.pending}   label="En attente" gold delay={430} total={stats.total} />
              <StatCard icon={XCircle}      value={stats.cancelled} label="Annulées"         delay={460} total={stats.total} />
            </div>
          </div>
        </FadeUp>

        {error && <p style={{ marginTop:32, fontSize:13, fontWeight:700, color:GOLD }}>Erreur — {error}</p>}
      </div>
    </div>
  )
}