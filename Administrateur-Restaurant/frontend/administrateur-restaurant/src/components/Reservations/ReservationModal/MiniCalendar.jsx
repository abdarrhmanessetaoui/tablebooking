import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DARK } from '../../../styles/reservations/tokens'

export default function MiniCalendar({ value, onChange, blockedDates = [], disabledDays = [] }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US'
  const isRtl = i18n.language === 'ar'

  const today    = new Date(); today.setHours(0,0,0,0)
  const todayISO = today.toISOString().slice(0,10)
  const init     = value ? new Date(value+'T00:00:00') : today
  const [cur, setCur] = useState({ y:init.getFullYear(), m:init.getMonth() })

  const dim   = (y,m) => new Date(y,m+1,0).getDate()
  const first = (y,m) => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1 } // Monday-based
  const toISO = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

  const cells = []
  for (let i=0; i<first(cur.y,cur.m); i++) cells.push(null)
  for (let d=1; d<=dim(cur.y,cur.m); d++) cells.push(d)

  function pick(day) {
    const iso = toISO(cur.y,cur.m,day)
    const dt  = new Date(iso+'T00:00:00')
    if (dt < today || blockedDates.includes(iso) || disabledDays.includes(dt.getDay())) return
    onChange(iso)
  }

  const monthLabel = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(new Date(cur.y, cur.m, 1))
  const dayNames = Array.from({ length: 7 }, (_, i) => {
    // 2024-01-01 was a Monday
    const d = new Date(2024, 0, i + 1)
    return new Intl.DateTimeFormat(lang, { weekday: 'narrow' }).format(d)
  })

  return (
    <div style={{ border:'4px solid #e8e0d8', background:'#fff', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ background:DARK, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px' }}>
        <button onClick={() => setCur(c=>c.m===0?{y:c.y-1,m:11}:{y:c.y,m:c.m-1})} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          {isRtl ? <ChevronRight size={16} color={LIGHT_BROWN} /> : <ChevronLeft size={16} color={LIGHT_BROWN} />}
        </button>
        <span style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{monthLabel}</span>
        <button onClick={() => setCur(c=>c.m===11?{y:c.y+1,m:0}:{y:c.y,m:c.m+1})} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          {isRtl ? <ChevronLeft size={16} color={LIGHT_BROWN} /> : <ChevronRight size={16} color={LIGHT_BROWN} />}
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#ffffff', borderBottom:'1px solid #e8e0d8' }}>
        {dayNames.map((d,i) => <div key={i} style={{ padding:'6px 0', textAlign:'center', fontSize:10, fontWeight:900, color:LIGHT_BROWN_DARK }}>{d}</div>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'6px 4px' }}>
        {cells.map((day,i) => {
          if (!day) return <div key={`e${i}`} />
          const iso = toISO(cur.y,cur.m,day), dt = new Date(iso+'T00:00:00')
          const jsDay = dt.getDay()
          const isPast=dt<today, isBlk=blockedDates.includes(iso), isOff=disabledDays.includes(jsDay)
          const isSel=iso===value, isTdy=iso===todayISO, disabled=isPast||isBlk||isOff
          return (
            <button key={day} onClick={()=>pick(day)} disabled={disabled} style={{
              padding:'7px 0', border:'none', borderRadius:2,
              background:isSel?DARK:(isBlk||isOff)?'#ffffff':'transparent',
              color:isSel?LIGHT_BROWN:(isBlk||isOff)?'#e0a0a0':isPast?'#ccc':isTdy?LIGHT_BROWN_DARK:DARK,
              fontSize:13, fontWeight:(isSel||isTdy)?900:600,
              cursor:disabled?'not-allowed':'pointer',
              textDecoration:(isBlk||isOff)?'line-through':'none', opacity:isOff?0.4:1,
            }}>{day}</button>
          )
        })}
      </div>
      <div style={{ padding:'6px 12px 10px', borderTop:'1px solid #f0ebe4', display:'flex', gap:12 }}>
        {[{c:'#DC2626',l:t('blocked_closed')},{c:LIGHT_BROWN_DARK,l:t('today')}].map(({c,l}) => (
          <span key={l} style={{ fontSize:10, fontWeight:700, color:c, display:'flex', alignItems:'center', gap:4 }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
