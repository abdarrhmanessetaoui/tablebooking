import { useState } from 'react'
import { FileDown } from 'lucide-react'
import useBlockedDates from '../hooks/BlockedDates/useBlockedDates'
import BlockedDateForm from '../components/BlockedDates/BlockedDateForm'
import BlockedDateList from '../components/BlockedDates/BlockedDateList'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'

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

export default function BlockedDates() {
  const {
    blockedDates, loading, error,
    form, setForm,
    submitting,
    handleBlock, handleUnblock,
    refetch,
  } = useBlockedDates()

  const [exporting, setExporting] = useState(false)

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
      doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Dates bloquées',20,22)
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
      doc.setTextColor(43,33,24); doc.setFontSize(20); doc.setFont('helvetica','bold'); doc.text('Dates bloquées',20,48)
      doc.setFontSize(10); doc.setTextColor(200,169,126)
      doc.text(`${blockedDates.length} date${blockedDates.length!==1?'s':''} bloquée${blockedDates.length!==1?'s':''}`,20,56)
      doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)

      let y = 70
      doc.setFillColor(43,33,24); doc.rect(20,y,170,9,'F')
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text('DATE BLOQUÉE',24,y+6); y += 9

      blockedDates.forEach((d,i) => {
        if (y>270) { doc.addPage(); y=20 }
        doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245); doc.rect(20,y,170,9,'F')
        doc.setDrawColor(236,230,222); doc.line(20,y+9,190,y+9)
        const label = d.date ? new Date(d.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'
        doc.setTextColor(43,33,24); doc.setFontSize(9); doc.setFont('helvetica','normal')
        doc.text(label.charAt(0).toUpperCase()+label.slice(1),24,y+6); y+=9
      })

      const pH = doc.internal.pageSize.height
      doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
      doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
      doc.text('TableBooking.ma — Rapport généré automatiquement',20,pH-4)
      doc.text(dateStr,190,pH-4,{align:'right'})
      doc.save(`dates_bloquees_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

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

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 12,
            marginBottom: 8, flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{
                margin: 0, fontSize: 'clamp(22px,4vw,36px)',
                fontWeight: 900, color: DARK,
                letterSpacing: '-1.5px', lineHeight: 1,
              }}>
                Dates bloquées
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                Les dates bloquées ne peuvent pas être réservées par les clients.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 32px' }} />
        </FadeUp>

        {/* ERROR */}
        {error && (
          <FadeUp delay={15}>
            <div style={{
              marginBottom: 16, padding: '11px 16px',
              background: RED_BG, borderLeft: `3px solid ${RED}`,
              fontSize: 12, fontWeight: 700, color: RED,
            }}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* FORM SECTION */}
        <FadeUp delay={20}>
          <h2 style={{ margin: '0 0 5px', fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
            Bloquer une date
          </h2>
          <p className="page-subtitle" style={{ margin: '0 0 20px', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
            Sélectionnez une date à bloquer pour les clients
          </p>
          <BlockedDateForm form={form} setForm={setForm} handleBlock={handleBlock} submitting={submitting} />
        </FadeUp>

        {/* SECTION DIVIDER */}
        <FadeUp delay={40}>
          <div style={{ height: 2, background: DARK, margin: '36px 0' }} />
        </FadeUp>

        {/* LIST SECTION */}
        <FadeUp delay={60}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 5px', fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
              Dates bloquées
            </h2>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              {blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} bloquée{blockedDates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <BlockedDateList blockedDates={blockedDates} handleUnblock={handleUnblock} />
        </FadeUp>

      </div>
    </>
  )
}