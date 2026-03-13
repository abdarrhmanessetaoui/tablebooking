import { useState } from 'react'
import { FileDown, Trash2 } from 'lucide-react'
import useBlockedDates from '../hooks/BlockedDates/useBlockedDates'
import BlockedDateForm from '../components/BlockedDates/BlockedDateForm'
import BlockedDateList from '../components/BlockedDates/BlockedDateList'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { confirm } from '../components/ui/ConfirmDialog'
import { toast }   from '../components/ui/Toast'
import { getToken } from '../utils/auth'

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
        padding: '10px 16px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 40,
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

function BulkBar({ count, onUnblock, onClear }) {
  const [hovDel, setHovDel] = useState(false)
  return (
    <div style={{
      position: 'sticky', top: 8, zIndex: 30,
      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      padding: '10px 12px', background: DARK,
      boxShadow: '0 4px 24px rgba(43,33,24,0.28)',
      marginBottom: 12, animation: 'slideDown 0.18s ease',
    }}>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 480px) { .bulk-label { display: none !important; } }
      `}</style>

      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 26, height: 26, background: GOLD, color: DARK,
        fontSize: 12, fontWeight: 900, padding: '0 7px', flexShrink: 0,
      }}>{count}</span>
      <span className="bulk-label" style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginRight: 2 }}>
        sélectionné{count > 1 ? 's' : ''}
      </span>

      <div style={{ width: 1, height: 20, background: DARK, margin: '0 4px', flexShrink: 0 }} />

      <button onClick={onUnblock}
        onMouseEnter={() => setHovDel(true)} onMouseLeave={() => setHovDel(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
          background: hovDel ? '#ef4444' : 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: hovDel ? '#fff' : '#f87171',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s', flexShrink: 0, minHeight: 34,
        }}>
        <Trash2 size={13} strokeWidth={2.5} />
        <span className="bulk-label">Débloquer</span>
      </button>

      <button onClick={onClear}
        style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 10px', background: 'none', border: `1px solid ${DARK}`,
          color: '#fff', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0, minHeight: 34,
        }}
        onMouseEnter={e => e.currentTarget.style.color = GOLD}
        onMouseLeave={e => e.currentTarget.style.color = '#fff'}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>✕</span>
        <span className="bulk-label">Désélectionner</span>
      </button>
    </div>
  )
}

export default function BlockedDates() {
  const {
    blockedDates, loading, error,
    form, setForm, submitting,
    handleBlock, handleUnblock,
    getDatesToBlock, setBlockedDates,
  } = useBlockedDates()

  const [exporting,     setExporting]     = useState(false)
  const [selectedDates, setSelectedDates] = useState([])

  async function handleBulkUnblock() {
    const ok = await confirm({
      title:        'Débloquer la sélection',
      message:      `Voulez-vous débloquer ${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} ?`,
      confirmLabel: 'Débloquer', type: 'danger',
    })
    if (!ok) return
    const h = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    try {
      await Promise.all(selectedDates.map(date =>
        fetch(`http://localhost:8000/api/blocked-dates/${date}`, { method: 'DELETE', headers: h })
      ))
      setBlockedDates(prev => prev.filter(d => !selectedDates.includes(d.date)))
      toast(`${selectedDates.length} date${selectedDates.length > 1 ? 's débloquées' : ' débloquée'}`, 'warning')
      setSelectedDates([])
    } catch { toast('Erreur lors du déblocage', 'error') }
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
      doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126)
      doc.text('TableBooking.ma',20,14)
      doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Dates bloquées',20,22)
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
      doc.setTextColor(43,33,24); doc.setFontSize(20); doc.setFont('helvetica','bold')
      doc.text('Dates bloquées',20,48)
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
        @media (max-width: 480px) {
          .btn-label { display: none !important; }
          .page-subtitle { display: none !important; }
        }
        .bd-layout { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 960px) {
          .bd-layout { grid-template-columns: 380px 1fr; gap: 48px; align-items: start; }
          .bd-form-sticky { position: sticky; top: 24px; }
          .bd-mobile-divider { display: none !important; }
        }
        @media (max-width: 600px) { button { min-height: 40px; } }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#faf8f5',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing: 'border-box', width: '100%', overflowX: 'hidden',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
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

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 28px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={15}>
            <div style={{ marginBottom: 20, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              {error}
            </div>
          </FadeUp>
        )}

        {selectedDates.length > 0 && (
          <BulkBar count={selectedDates.length} onUnblock={handleBulkUnblock} onClear={() => setSelectedDates([])} />
        )}

        <FadeUp delay={20}>
          <div className="bd-layout">

            <div>
              <div className="bd-mobile-divider" style={{ height: 2, background: DARK, margin: '32px 0 28px' }} />
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                  Dates bloquées
                </h2>
                <span style={{ padding: '4px 10px', background: DARK, fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.05em', flexShrink: 0 }}>
                  {blockedDates.length}
                </span>
              </div>
              <BlockedDateList blockedDates={blockedDates} handleUnblock={handleUnblock} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
            </div>
          </div>
        </FadeUp>
      </div>
    </>
  )
}