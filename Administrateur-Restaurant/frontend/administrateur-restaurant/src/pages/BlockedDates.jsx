import { useState } from 'react'
import { RefreshCw, FileDown } from 'lucide-react'
import useBlockedDates from '../hooks/useBlockedDates'
import BlockedDateForm from '../components/BlockedDates/BlockedDateForm'
import BlockedDateList from '../components/BlockedDates/BlockedDateList'
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

export default function BlockedDates() {
  const {
    blockedDates, loading, error,
    form, setForm,
    submitting,
    handleBlock, handleUnblock,
    refetch,
  } = useBlockedDates()

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
      const DARK_R = 43/255, DARK_G = 33/255, DARK_B = 24/255
      const GOLD_R = 200/255, GOLD_G = 169/255, GOLD_B = 126/255

      // Header bar
      doc.setFillColor(43, 33, 24)
      doc.rect(0, 0, 210, 32, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(200, 169, 126)
      doc.text('TableBooking.ma', 20, 14)
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.text('Dates bloquées', 20, 22)
      const dateStr = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })
      doc.setTextColor(200, 169, 126)
      doc.setFontSize(8)
      doc.text(dateStr, 190, 22, { align: 'right' })

      // Title
      doc.setTextColor(43, 33, 24)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Dates bloquées', 20, 48)
      doc.setFontSize(10)
      doc.setTextColor(200, 169, 126)
      doc.text(`${blockedDates.length} date${blockedDates.length !== 1 ? 's' : ''} bloquée${blockedDates.length !== 1 ? 's' : ''}`, 20, 56)

      // Divider
      doc.setDrawColor(43, 33, 24)
      doc.setLineWidth(0.5)
      doc.line(20, 61, 190, 61)

      // Table header
      let y = 70
      doc.setFillColor(43, 33, 24)
      doc.rect(20, y, 170, 9, 'F')
      doc.setTextColor(200, 169, 126)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('DATE BLOQUÉE', 24, y + 6)
      y += 9

      // Rows
      blockedDates.forEach((d, i) => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 245)
        doc.rect(20, y, 170, 9, 'F')
        doc.setDrawColor(236, 230, 222)
        doc.line(20, y + 9, 190, y + 9)
        const label = d.date ? new Date(d.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) : '—'
        doc.setTextColor(43, 33, 24)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(label.charAt(0).toUpperCase() + label.slice(1), 24, y + 6)
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

      doc.save(`dates_bloquees_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh', background: '#fff',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .bd-wrap { max-width: 1020px; margin: 0 auto; padding: clamp(28px,4vw,56px) clamp(20px,3.5vw,48px); }
        @media(max-width:500px){ .bd-topbtns { flex-direction:column; width:100%; } .bd-topbtns button { justify-content:center; } }
      `}</style>

      <div className="bd-wrap">

        {/* PAGE TITLE */}
        <FadeUp delay={0}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:20 }}>
            <div>
              <h1 style={{ margin:'0 0 7px', fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>
                Dates bloquées
              </h1>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:GOLD }}>
                Les dates bloquées ne peuvent pas être réservées par les clients.
              </p>
            </div>
            <div className="bd-topbtns" style={{ display:'flex', gap:3 }}>
              <Btn icon={RefreshCw} onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Actualisation…' : 'Actualiser'}
              </Btn>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
          <div style={{ height:2, background:DARK, margin:'20px 0 52px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={10}>
            <div style={{ marginBottom:32, padding:'13px 18px', borderLeft:`3px solid #b94040`, background:'#fdf0f0', fontSize:13, fontWeight:700, color:'#b94040' }}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* FORM SECTION */}
        <FadeUp delay={30}>
          <h2 style={{ margin:'0 0 6px', fontSize:'clamp(20px,2.5vw,30px)', fontWeight:900, color:DARK, letterSpacing:'-1px' }}>
            Bloquer une date
          </h2>
          <p style={{ margin:'0 0 32px', fontSize:12, fontWeight:700, color:GOLD }}>
            Sélectionnez une date à bloquer pour les clients
          </p>
          <BlockedDateForm form={form} setForm={setForm} handleBlock={handleBlock} submitting={submitting} />
        </FadeUp>

        {/* DIVIDER */}
        <FadeUp delay={50}>
          <div style={{ height:2, background:DARK, margin:'56px 0' }} />
        </FadeUp>

        {/* LIST SECTION */}
        <FadeUp delay={70}>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ margin:'0 0 6px', fontSize:'clamp(20px,2.5vw,30px)', fontWeight:900, color:DARK, letterSpacing:'-1px' }}>
              Dates bloquées
            </h2>
            <p style={{ margin:0, fontSize:12, fontWeight:700, color:GOLD }}>
              {blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} bloquée{blockedDates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <BlockedDateList blockedDates={blockedDates} handleUnblock={handleUnblock} />
        </FadeUp>

      </div>
    </div>
  )
}