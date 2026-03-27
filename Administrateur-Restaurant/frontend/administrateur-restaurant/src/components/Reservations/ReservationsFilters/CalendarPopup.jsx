import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { DARK, GOLD, GOLD_DARK } from '../../../styles/reservations/tokens'
import { calNavBtnStyle } from '../../../styles/reservations/filters.styles'

export default function CalendarPopup({ filterDate, setFilterDate, onClose, anchorRef }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const lang = isRtl ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  
  const today    = new Date()
  const initDate = filterDate
    ? (filterDate.length === 7 ? new Date(filterDate+'-01') : new Date(filterDate))
    : today
  const [viewYear,  setViewYear]  = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())
  const [mode,      setMode]      = useState('day')
  const [pos,       setPos]       = useState({ top:-9999, left:-9999 })
  const popupRef = useRef(null)

  const MONTHS = Array.from({ length: 12 }, (_, i) => 
    new Intl.DateTimeFormat(lang, { month: 'long' }).format(new Date(2024, i, 1))
  )
  const DAYS = Array.from({ length: 7 }, (_, i) => 
    new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(new Date(2024, 0, i + 1))
  )

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
      zIndex:99999, background:'#fff', border:`4px solid ${DARK}`,
      boxShadow:'0 8px 32px rgba(66,52,40,0.22)',
      fontFamily:"'Inter',system-ui,-apple-system,sans-serif",
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', background:DARK, padding:'8px 6px', gap:2 }}>
        <button onClick={() => setViewYear(y=>y-1)} style={calNavBtnStyle}>{isRtl ? <ChevronsRight size={13} strokeWidth={2.5} /> : <ChevronsLeft  size={13} strokeWidth={2.5} />}</button>
        <button onClick={() => navMonth(-1)}         style={calNavBtnStyle}>{isRtl ? <ChevronRight  size={13} strokeWidth={2.5} /> : <ChevronLeft   size={13} strokeWidth={2.5} />}</button>
        <span style={{ flex:1, textAlign:'center', fontSize:13, fontWeight:800, color:GOLD, textTransform:'capitalize' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={() => navMonth(1)}          style={calNavBtnStyle}>{isRtl ? <ChevronLeft   size={13} strokeWidth={2.5} /> : <ChevronRight  size={13} strokeWidth={2.5} />}</button>
        <button onClick={() => setViewYear(y=>y+1)}  style={calNavBtnStyle}>{isRtl ? <ChevronsLeft  size={13} strokeWidth={2.5} /> : <ChevronsRight size={13} strokeWidth={2.5} />}</button>
      </div>

      {/* Mode tabs */}
      <div style={{ display:'flex', borderBottom:`4px solid rgba(66,52,40,0.12)` }}>
        {['day','month'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex:1, padding:'7px', fontSize:11, fontWeight:800,
            textTransform:'uppercase', letterSpacing:'0.08em',
            background:'none', border:'none', cursor:'pointer',
            fontFamily:'inherit', color:DARK,
            borderBottom: mode===m ? `4px solid ${DARK}` : 'none',
            marginBottom: mode===m ? -2 : 0,
          }}>
            {m==='day' ? t('day') : t('month')}
          </button>
        ))}
      </div>

      {/* Day grid */}
      {mode === 'day' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'6px 8px 10px' }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:800, color:GOLD_DARK, padding:'4px 0', letterSpacing:'0.06em' }}>{d}</div>
          ))}
          {cells.map((c,i) => (
            <div key={i} onClick={c.onClick}
              onMouseEnter={e => { if(!c.isOther && !c.isSelected) e.currentTarget.style.background='#f5f0eb' }}
              onMouseLeave={e => { if(!c.isSelected) e.currentTarget.style.background='transparent' }}
              style={{
                textAlign:'center', fontSize:12, borderRadius:2,
                fontWeight: c.isSelected?800 : c.isToday?900 : 600,
                color: c.isSelected?GOLD : c.isToday?GOLD_DARK : c.isOther?'rgba(66,52,40,0.2)' : DARK,
                background: c.isSelected?DARK : 'transparent',
                padding:'5px 2px',
                cursor: c.isOther?'default':'pointer',
                transition:'background 0.1s',
              }}
            >{c.content}</div>
          ))}
        </div>
      )}

      {/* Month grid */}
      {mode === 'month' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, padding:8 }}>
          {MONTHS.map((m,i) => {
            const isCurrent  = i===today.getMonth() && viewYear===today.getFullYear()
            const isSelected = selMonth && selMon===i && selYear===viewYear
            return (
              <div key={m} onClick={() => pickMonth(i)}
                onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background='#f5f0eb' }}
                onMouseLeave={e => { e.currentTarget.style.background = isSelected?DARK:'transparent' }}
                style={{ padding:'8px 4px', textAlign:'center', fontSize:12, cursor:'pointer', fontWeight:isSelected?800:isCurrent?900:700, color:isSelected?GOLD:isCurrent?GOLD_DARK:DARK, background:isSelected?DARK:'transparent', transition:'background 0.1s' }}
              >{m.slice(0,4)}</div>
            )
          })}
        </div>
      )}

      {selFull && (
        <div style={{ padding:'6px 10px', borderTop:`1px solid rgba(66,52,40,0.1)`, fontSize:11, fontWeight:700, color:DARK, background:'#ffffff', textAlign:'center' }}>
          {new Intl.DateTimeFormat(lang, { day:'2-digit', month:'long', year:'numeric' }).format(new Date(filterDate))}
        </div>
      )}
    </div>,
    document.body
  )
}
