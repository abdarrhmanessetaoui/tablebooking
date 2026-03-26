import { useState, useEffect, useRef } from 'react'
import { useTranslation } from "react-i18next"
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens'
import { calNavBtnStyle } from '../../../styles/reservations/filters.styles'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

export default function CalendarPopup({ filterDate, setFilterDate, onClose, anchorRef }) {
  const { t } = useTranslation()

  const today    = new Date()
  const initDate = filterDate
    ? (filterDate.length === 7 ? new Date(filterDate+'-01') : new Date(filterDate))
    : today

  const [viewYear,  setViewYear]  = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())
  const [mode,      setMode]      = useState('day')
  const [pos,       setPos]       = useState({ top:-9999, left:-9999 })
  const popupRef = useRef(null)

  useEffect(() => {
    function calc() {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      const pw = 280, vw = window.innerWidth, vh = window.innerHeight
      const ph = popupRef.current?.offsetHeight ?? 340
      let left = rect.right - pw
      if (left < 8) left = 8
      if (left + pw > vw - 8) left = vw - pw - 8
      const top = (vh - rect.bottom > ph + 8) ? rect.bottom + 4 : rect.top - ph - 4
      setPos({ top, left, width: Math.min(pw, vw-16) })
    }
    calc()
    window.addEventListener('resize', calc)
    window.addEventListener('scroll', calc, true)
    return () => { window.removeEventListener('resize', calc); window.removeEventListener('scroll', calc, true) }
  }, [anchorRef])

  useEffect(() => {
    function handler(e) {
      if (popupRef.current && !popupRef.current.contains(e.target) && anchorRef.current && !anchorRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, anchorRef])

  function navMonth(d) {
    let m = viewMonth + d, y = viewYear
    if (m > 11) { m=0; y++ } else if (m < 0) { m=11; y-- }
    setViewMonth(m); setViewYear(y)
  }

  const selFull  = filterDate?.length === 10
  const selMonth = filterDate?.length === 7
  const selYear  = (selFull||selMonth) ? parseInt(filterDate.slice(0,4)) : null
  const selMon   = (selFull||selMonth) ? parseInt(filterDate.slice(5,7))-1 : null
  const selDay   = selFull ? parseInt(filterDate.slice(8,10)) : null

  function pickDay(d) {
    setFilterDate(`${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`)
    onClose()
  }

  function pickMonth(m) {
    setFilterDate(`${viewYear}-${String(m+1).padStart(2,'0')}`)
    onClose()
  }

  const offset    = new Date(viewYear, viewMonth, 1).getDay()
  const firstDow  = offset === 0 ? 6 : offset - 1
  const daysInMon = new Date(viewYear, viewMonth+1, 0).getDate()
  const daysInPrev= new Date(viewYear, viewMonth, 0).getDate()

  const cells = []
  for (let i=0; i<firstDow; i++) cells.push({ content:daysInPrev-firstDow+1+i, isOther:true })
  for (let d=1; d<=daysInMon; d++) {
    const isToday    = d===today.getDate() && viewMonth===today.getMonth() && viewYear===today.getFullYear()
    const isSelected = selFull && selDay===d && selMon===viewMonth && selYear===viewYear
    cells.push({ content:d, onClick:()=>pickDay(d), isToday, isSelected })
  }
  const remaining = 42 - cells.length
  for (let d=1; d<=remaining; d++) cells.push({ content:d, isOther:true })

  return createPortal(
    <div ref={popupRef} style={{
      position:'fixed', top:pos.top, left:pos.left, width:pos.width??280,
      zIndex:99999, background:'#fff', border:`2px solid ${DARK}`,
      boxShadow:'0 8px 32px rgba(43,33,24,0.22)',
      fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', background:DARK, padding:'8px 6px', gap:2 }}>
        <button onClick={() => setViewYear(y=>y-1)} style={calNavBtnStyle}><ChevronsLeft size={13} strokeWidth={2.5} /></button>
        <button onClick={() => navMonth(-1)} style={calNavBtnStyle}><ChevronLeft size={13} strokeWidth={2.5} /></button>

        <span style={{ flex:1, textAlign:'center', fontSize:13, fontWeight:800, color:GOLD, textTransform:'capitalize' }}>
          {t(`months.${viewMonth}`)} {viewYear}
        </span>

        <button onClick={() => navMonth(1)} style={calNavBtnStyle}><ChevronRight size={13} strokeWidth={2.5} /></button>
        <button onClick={() => setViewYear(y=>y+1)} style={calNavBtnStyle}><ChevronsRight size={13} strokeWidth={2.5} /></button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:`2px solid rgba(43,33,24,0.12)` }}>
{['day','month'].map(m => (
  <button key={m} onClick={() => setMode(m)} style={{
    flex:1, padding:'7px', fontSize:11, fontWeight:800,
    textTransform:'uppercase', letterSpacing:'0.08em',
    background:'none', border:'none', cursor:'pointer',
    fontFamily:'inherit', color:DARK,
    borderBottom: mode===m ? `2px solid ${DARK}` : 'none',
    marginBottom: mode===m ? -2 : 0,
  }}>
    {m==='day' ? t('day') : t('Month')}
  </button>
))}
      </div>

      {/* Days */}
      {mode === 'day' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'6px 8px 10px' }}>
          {DAYS_FR.map((d,i) => (
            <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:800, color:GOLD_DARK, padding:'4px 0' }}>
              {t(`days_short.${i}`)}
            </div>
          ))}
          {cells.map((c,i) => (
            <div key={i} onClick={c.onClick} style={{
              textAlign:'center', fontSize:12, borderRadius:2,
              fontWeight: c.isSelected?800 : c.isToday?900 : 600,
              color: c.isSelected?GOLD : c.isToday?GOLD_DARK : c.isOther?'rgba(43,33,24,0.2)' : DARK,
              background: c.isSelected?DARK : 'transparent',
              padding:'5px 2px',
              cursor: c.isOther?'default':'pointer',
            }}>{c.content}</div>
          ))}
        </div>
      )}

      {/* Months */}
      {mode === 'month' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, padding:8 }}>
          {MONTHS_FR.map((m,i) => {
            const isSelected = selMonth && selMon===i && selYear===viewYear
            return (
              <div key={m} onClick={() => pickMonth(i)}
                style={{ padding:'8px 4px', textAlign:'center', fontSize:12, cursor:'pointer',
                  fontWeight:isSelected?800:700,
                  color:isSelected?GOLD:DARK,
                  background:isSelected?DARK:'transparent' }}>
                {t(`months.${i}`).slice(0,4)}
              </div>
            )
          })}
        </div>
      )}

      {selFull && (
        <div style={{ padding:'6px 10px', borderTop:`1px solid rgba(43,33,24,0.1)`, fontSize:11, fontWeight:700, color:DARK, background:'#faf8f5', textAlign:'center' }}>
          {String(selDay).padStart(2,'0')} {t(`months.${selMon}`)} {selYear}
        </div>
      )}
    </div>,
    document.body
  )
}