import { useState } from 'react'
import { RefreshCw, FileDown } from 'lucide-react'
import useCalendar  from '../hooks/r'
import CalendarNav  from '../components/Calendar/CalendarNav'
import CalendarWeek from '../components/Calendar/CalendarWeek'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '13px 24px',
        background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap',
      }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

export default function Calendar() {
  const {
    view, setView,
    currentDate, setCurrentDate,
    weekDays, monthDays,
    loading, error,
    navigate, goToday,
    getByDate, getByMonth,
    navLabel,
    reservations,
    refetch,
  } = useCalendar()

  const [refreshing, setRefreshing] = useState(false)
  const [exporting,  setExporting]  = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    try { await refetch() } finally { setRefreshing(false) }
  }

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

      // Header
      doc.setFillColor(43, 33, 24)
      doc.rect(0, 0, 210, 32, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(200, 169, 126)
      doc.text('TableBooking.ma', 20, 14)
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.text('Planning — ' + navLabel(), 20, 22)
      doc.setTextColor(200, 169, 126)
      doc.setFontSize(8)
      doc.text(dateStr, 190, 22, { align: 'right' })

      // Title
      doc.setTextColor(43, 33, 24)
      doc.setFontSize(20)
      doc.text('Planning des réservations', 20, 48)
      doc.setFontSize(10)
      doc.setTextColor(200, 169, 126)
      doc.text(navLabel(), 20, 56)
      doc.setDrawColor(43, 33, 24)
      doc.setLineWidth(0.5)
      doc.line(20, 61, 190, 61)

      // Table header
      let y = 70
      doc.setFillColor(43, 33, 24)
      doc.rect(20, y, 170, 9, 'F')
      doc.setTextColor(200, 169, 126)
      doc.setFontSize(8)
      doc.text('NOM', 24, y + 6)
      doc.text('DATE', 80, y + 6)
      doc.text('HEURE', 120, y + 6)
      doc.text('STATUT', 155, y + 6)
      y += 9

      // Get reservations for current view period
      const allRes = view === 'day'
        ? getByDate(currentDate)
        : view === 'week'
          ? weekDays.flatMap(d => getByDate(d))
          : reservations || []

      allRes.forEach((r, i) => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 245)
        doc.rect(20, y, 170, 9, 'F')
        doc.setDrawColor(236, 230, 222)
        doc.line(20, y + 9, 190, y + 9)
        doc.setTextColor(43, 33, 24)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(r.name || '—', 24, y + 6)
        doc.text(r.date ? new Date(r.date).toLocaleDateString('fr-FR') : '—', 80, y + 6)
        doc.text(r.start_time || '—', 120, y + 6)
        const statusColors = { Confirmed: [43,33,24], Pending: [168,131,78], Cancelled: [150,128,112] }
        const sc = statusColors[r.status] || [43,33,24]
        doc.setTextColor(...sc)
        doc.setFont('helvetica', 'bold')
        doc.text(r.status === 'Confirmed' ? 'Confirmée' : r.status === 'Pending' ? 'En attente' : 'Annulée', 155, y + 6)
        doc.setFont('helvetica', 'normal')
        y += 9
      })

      // Footer
      const pageH = doc.internal.pageSize.height
      doc.setFillColor(200, 169, 126)
      doc.rect(0, pageH - 10, 210, 10, 'F')
      doc.setTextColor(43, 33, 24)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('TableBooking.ma — Rapport généré automatiquement', 20, pageH - 4)
      doc.text(dateStr, 190, pageH - 4, { align: 'right' })

      doc.save(`planning_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fff',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .cal-wrap { max-width: 1200px; margin: 0 auto; padding: clamp(28px,4vw,56px) clamp(20px,3.5vw,48px); }
        @media(max-width:500px){ .cal-topbtns { flex-direction: column; width: 100%; } .cal-topbtns button { justify-content: center; } }
      `}</style>

      <div className="cal-wrap">

        {/* ── PAGE TITLE ── */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ margin: '0 0 7px', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: DARK, letterSpacing: '-2px', lineHeight: 1 }}>
                Planning
              </h1>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: GOLD }}>
                Gérez vos réservations par jour, semaine, mois ou année
              </p>
            </div>
            <div className="cal-topbtns" style={{ display: 'flex', gap: 3 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
          <div style={{ height: 2, background: DARK, margin: '20px 0 40px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={10}>
            <div style={{ marginBottom: 32, padding: '13px 18px', borderLeft: '3px solid #b94040', background: '#fdf0f0', fontSize: 13, fontWeight: 700, color: '#b94040' }}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* ── NAV ── */}
        <FadeUp delay={20}>
          <CalendarNav
            view={view} setView={setView}
            navLabel={navLabel}
            navigate={navigate} goToday={goToday}
            currentDate={currentDate}
          />
        </FadeUp>

        {/* ── CONTENT ── */}
        <FadeUp delay={40}>
          {loading ? <Spinner /> : (
            <CalendarWeek
              view={view} setView={setView}
              weekDays={weekDays} monthDays={monthDays}
              currentDate={currentDate} setCurrentDate={setCurrentDate}
              getByDate={getByDate} getByMonth={getByMonth}
            />
          )}
        </FadeUp>

      </div>
    </div>
  )
}