import { useState } from 'react'
import { FileDown } from 'lucide-react'
import useCalendar   from '../hooks/Calendar/useCalendar'
import CalendarNav   from '../components/Calendar/CalendarNav'
import CalendarWeek  from '../components/Calendar/CalendarWeek'
import FadeUp        from '../components/Dashboard/FadeUp'
import Spinner       from '../components/Dashboard/Spinner'
import TableTimeline from '../components/Tables/TableTimeline'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const RED_BG  = '#fdf0f0'
const RED     = '#b94040'

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 20px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

export default function Calendar() {
  const {
    view, setView, currentDate, setCurrentDate,
    weekDays, monthDays, loading, error,
    navigate, goToday, getByDate, getByMonth,
    navLabel, reservations,
  } = useCalendar()

  const [exporting, setExporting] = useState(false)

  // ── NEW: track which day is selected inside week view
  const [weekSelectedDay, setWeekSelectedDay] = useState(null)

  // Reset selected day when view or week changes
  // so it always defaults to today or Monday
  function handleNavigate(dir) {
    setWeekSelectedDay(null)
    navigate(dir)
  }
  function handleGoToday() {
    setWeekSelectedDay(null)
    goToday()
  }
  function handleSetView(v) {
    setWeekSelectedDay(null)
    setView(v)
  }

  // ── Compute the correct ISO date for the timeline ──────────────
  function getTimelineDate() {
    if (view === 'day') {
      return currentDate.toISOString().slice(0, 10)
    }
    if (view === 'week') {
      // Use the day the user clicked in week view
      // Fall back to today if in current week, else Monday
      if (weekSelectedDay) return weekSelectedDay.toISOString().slice(0, 10)
      const today     = new Date()
      const todayInWeek = weekDays.find(d => d.toDateString() === today.toDateString())
      if (todayInWeek) return todayInWeek.toISOString().slice(0, 10)
      return weekDays[0]?.toISOString().slice(0, 10)
    }
    if (view === 'month') {
      // Use today if in this month, else first day of month
      const today = new Date()
      const sameMonth = today.getMonth() === currentDate.getMonth() &&
                        today.getFullYear() === currentDate.getFullYear()
      if (sameMonth) return today.toISOString().slice(0, 10)
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        .toISOString().slice(0, 10)
    }
    if (view === 'year') {
      // Use today if in this year, else Jan 1
      const today = new Date()
      if (today.getFullYear() === currentDate.getFullYear()) {
        return today.toISOString().slice(0, 10)
      }
      return `${currentDate.getFullYear()}-01-01`
    }
    return currentDate.toISOString().slice(0, 10)
  }

  const timelineDate = getTimelineDate()

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = res; s.onerror = rej; document.head.appendChild(s)
      })
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

      doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126); doc.text('TableBooking.ma',20,14)
      doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Planning — '+navLabel(),20,22)
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
      doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Planning des réservations',20,48)
      doc.setFontSize(10); doc.setTextColor(200,169,126); doc.text(navLabel(),20,56)
      doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)

      let y = 70
      doc.setFillColor(43,33,24); doc.rect(20,y,170,9,'F')
      doc.setTextColor(200,169,126); doc.setFontSize(8)
      doc.text('NOM',24,y+6); doc.text('DATE',80,y+6); doc.text('HEURE',120,y+6); doc.text('STATUT',155,y+6)
      y += 9

      const allRes = view==='day' ? getByDate(currentDate)
        : view==='week' ? weekDays.flatMap(d => getByDate(d))
        : reservations || []

      allRes.forEach((r,i) => {
        if (y>270) { doc.addPage(); y=20 }
        doc.setFillColor(i%2===0?255:250, i%2===0?255:248, i%2===0?255:245)
        doc.rect(20,y,170,9,'F')
        doc.setDrawColor(236,230,222); doc.line(20,y+9,190,y+9)
        doc.setTextColor(43,33,24); doc.setFontSize(9); doc.setFont('helvetica','normal')
        doc.text(r.name||'—',24,y+6)
        doc.text(r.date?new Date(r.date).toLocaleDateString('fr-FR'):'—',80,y+6)
        doc.text(r.start_time||'—',120,y+6)
        const sc = {Confirmed:[43,33,24],Pending:[168,131,78],Cancelled:[43,33,24]}[r.status]||[43,33,24]
        doc.setTextColor(...sc); doc.setFont('helvetica','bold')
        doc.text(r.status==='Confirmed'?'Confirmée':r.status==='Pending'?'En attente':'Annulée',155,y+6)
        y += 9
      })

      const pH = doc.internal.pageSize.height
      doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
      doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
      doc.text('TableBooking.ma',20,pH-4); doc.text(dateStr,190,pH-4,{align:'right'})
      doc.save(`planning_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#faf8f5',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`* { box-sizing: border-box; }`}</style>

        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Planning
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 24px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={15}>
            <div style={{ marginBottom: 16, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              {error}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={20}>
          <CalendarNav
            view={view}
            setView={handleSetView}
            navLabel={navLabel}
            navigate={handleNavigate}
            goToday={handleGoToday}
            currentDate={currentDate}
          />
        </FadeUp>

        <FadeUp delay={40}>
          {loading ? <Spinner /> : (
            <CalendarWeek
              view={view}
              setView={handleSetView}
              weekDays={weekDays}
              monthDays={monthDays}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              getByDate={getByDate}
              getByMonth={getByMonth}
              onDayChange={setWeekSelectedDay}
            />
          )}
        </FadeUp>

        {/* ── Timeline — always shown, synced to correct date ── */}
        <FadeUp delay={50}>
          <div style={{ margin: '40px 0 0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ height: 2, background: DARK, flex: 1 }} />
            <span style={{
              fontSize: 9, fontWeight: 900, color: DARK,
              letterSpacing: '0.2em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              Occupation des tables
            </span>
            <div style={{ height: 2, background: DARK, flex: 1 }} />
          </div>
          <TableTimeline controlledDate={timelineDate} />
        </FadeUp>

      </div>
    </>
  )
}