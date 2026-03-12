const DARK = '#2b2118'
const GOLD = '#c8a97e'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return [r,g,b]
}

// status → label + color
function statusMeta(status) {
  if (status === 'Confirmed') return { label: 'Confirmée',  rgb: [26,110,66]  }
  if (status === 'Cancelled') return { label: 'Annulée',    rgb: [185,64,64]  }
  return                             { label: 'En attente', rgb: [168,103,10] }
}

// truncate text to fit column
function trunc(doc, text, maxW) {
  if (!text) return ''
  let t = String(text)
  while (doc.getTextWidth(t) > maxW && t.length > 1) t = t.slice(0,-1)
  return t.length < String(text).length ? t.slice(0,-1) + '…' : t
}

export function exportPDF(stats, reservations = [], tabLabel = "Aujourd'hui") {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W        = 210
  const PAD      = 14
  const COL      = W - PAD * 2
  const PAGE_H   = 297
  const FOOTER_H = 14
  const FOOTER_Y = PAGE_H - FOOTER_H

  const today    = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const now      = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
  const filename = `dashboard_${new Date().toISOString().slice(0,10)}.pdf`

  const setDark  = () => doc.setTextColor(...hexToRgb(DARK))
  const setGold  = () => doc.setTextColor(...hexToRgb(GOLD))
  const setWhite = () => doc.setTextColor(255,255,255)
  const fillDark = () => doc.setFillColor(...hexToRgb(DARK))

  function footer() {
    doc.setDrawColor(...hexToRgb(GOLD))
    doc.setLineWidth(0.3)
    doc.line(PAD, FOOTER_Y, W-PAD, FOOTER_Y)
    doc.setFont('helvetica','bold'); doc.setFontSize(7); setGold()
    doc.text('TableBooking.ma — Rapport automatique', PAD, FOOTER_Y+5)
    doc.setFont('helvetica','normal'); setDark()
    doc.text(`Généré le ${today} à ${now}`, W-PAD, FOOTER_Y+5, { align:'right' })
  }

  function hline(y) {
    doc.setDrawColor(220,210,200); doc.setLineWidth(0.3)
    doc.line(PAD, y, W-PAD, y)
  }

  function sectionTitle(title, sub, y) {
    doc.setFont('helvetica','bold'); doc.setFontSize(14); setDark()
    doc.text(title, PAD, y)
    doc.setFont('helvetica','normal'); doc.setFontSize(8); setGold()
    doc.text(sub, PAD, y+5.5)
    return y + 13
  }

  function statCell(value, label, x, y, gold) {
    doc.setFont('helvetica','bold'); doc.setFontSize(26)
    gold ? setGold() : setDark()
    doc.text(String(value), x, y)
    doc.setFont('helvetica','normal'); doc.setFontSize(8); setDark()
    doc.text(label, x, y+6)
  }

  /* ══ PAGE 1 — STATS ══════════════════════════════════ */
  const colW3 = COL/3
  const colW2 = COL/2

  // Header
  fillDark(); doc.rect(0,0,W,28,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(15); setGold()
  doc.text('TableBooking', PAD, 18)
  const tbW = doc.getTextWidth('TableBooking')
  setWhite(); doc.text('.ma', PAD+tbW, 18)
  doc.setFont('helvetica','bold'); doc.setFontSize(7); setGold()
  doc.text('TABLEAU DE BORD', W-PAD, 11, { align:'right' })
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); setWhite()
  doc.text(`${today}  ·  ${now}`, W-PAD, 20, { align:'right' })

  let y = 37

  // Aujourd'hui big number
  y = sectionTitle("Aujourd'hui", "Total des réservations du jour", y)
  doc.setFont('helvetica','bold'); doc.setFontSize(44); setDark()
  doc.text(String(stats.today), PAD, y+15)
  doc.setFont('helvetica','bold'); doc.setFontSize(9); setGold()
  doc.text("réservations aujourd'hui", PAD, y+22)
  y += 28; hline(y); y += 11

  // Détail du jour
  y = sectionTitle('Détail du jour', 'Confirmées · En attente · Annulées', y)
  ;[
    { v:stats.today_confirmed, l:'Confirmées', g:false },
    { v:stats.today_pending,   l:'En attente', g:true  },
    { v:stats.today_cancelled, l:'Annulées',   g:false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD+i*colW3, y+11, s.g))
  y += 22; hline(y); y += 11

  // À venir
  y = sectionTitle('À venir', 'Demain et total du mois', y)
  ;[
    { v:stats.tomorrow, l:'Réservations demain', g:true  },
    { v:stats.total,    l:'Total ce mois',       g:false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD+i*colW2, y+11, s.g))
  y += 22; hline(y); y += 11

  // Ce mois
  y = sectionTitle('Ce mois', 'Bilan mensuel des réservations', y)
  ;[
    { v:stats.confirmed, l:'Confirmées', g:false },
    { v:stats.pending,   l:'En attente', g:true  },
    { v:stats.cancelled, l:'Annulées',   g:false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD+i*colW3, y+11, s.g))
  y += 22

  // Summary bar
  const rate = stats.total > 0 ? Math.round(stats.confirmed/stats.total*100) : 0
  const barY  = Math.max(y+8, FOOTER_Y-22)
  fillDark(); doc.rect(PAD, barY, COL, 12, 'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(8); setGold()
  doc.text('Total du mois :', PAD+5, barY+7.5)
  const lw = doc.getTextWidth('Total du mois :')
  setWhite(); doc.text(` ${stats.total} réservations`, PAD+5+lw, barY+7.5)
  const rl = 'Taux de confirmation :'
  const rv = `  ${rate}%`
  const rvW = doc.getTextWidth(rv), rlW = doc.getTextWidth(rl)
  setGold(); doc.text(rl, W-PAD-5-rvW-rlW, barY+7.5)
  setWhite(); doc.text(rv, W-PAD-5-rvW, barY+7.5)

  footer()

  /* ══ PAGE 2 — TABLE DES RÉSERVATIONS ════════════════ */
  if (reservations && reservations.length > 0) {
    doc.addPage()

    // Header same style
    fillDark(); doc.rect(0,0,W,28,'F')
    doc.setFont('helvetica','bold'); doc.setFontSize(15); setGold()
    doc.text('TableBooking', PAD, 18)
    const tbW2 = doc.getTextWidth('TableBooking')
    setWhite(); doc.text('.ma', PAD+tbW2, 18)
    doc.setFont('helvetica','bold'); doc.setFontSize(7); setGold()
    doc.text(`RÉSERVATIONS — ${tabLabel.toUpperCase()}`, W-PAD, 11, { align:'right' })
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); setWhite()
    doc.text(`${today}  ·  ${now}`, W-PAD, 20, { align:'right' })

    let ty = 36

    // Section title
    ty = sectionTitle(
      `Réservations — ${tabLabel}`,
      `${reservations.length} réservation(s) · ${tabLabel}`,
      ty
    )

    // Table header
    const ROW_H  = 10
    const cols = {
      name:    { x: PAD,      w: 44, label: 'NOM' },
      time:    { x: PAD+44,   w: 18, label: 'HEURE' },
      guests:  { x: PAD+62,   w: 20, label: 'COUVERTS' },
      service: { x: PAD+82,   w: 52, label: 'SERVICE' },
      status:  { x: PAD+134,  w: 32, label: 'STATUT' },
    }

    fillDark()
    doc.rect(PAD, ty, COL, ROW_H, 'F')
    doc.setFont('helvetica','bold'); doc.setFontSize(7); setGold()
    Object.values(cols).forEach(c => doc.text(c.label, c.x+2, ty+6.5))
    ty += ROW_H

    // Rows
    reservations.forEach((r, idx) => {
      // New page if needed
      if (ty + ROW_H > FOOTER_Y - 6) {
        footer()
        doc.addPage()
        fillDark(); doc.rect(0,0,W,28,'F')
        doc.setFont('helvetica','bold'); doc.setFontSize(15); setGold()
        doc.text('TableBooking', PAD, 18)
        const tbW3 = doc.getTextWidth('TableBooking')
        setWhite(); doc.text('.ma', PAD+tbW3, 18)
        ty = 36
        // Reprint table header
        fillDark(); doc.rect(PAD, ty, COL, ROW_H, 'F')
        doc.setFont('helvetica','bold'); doc.setFontSize(7); setGold()
        Object.values(cols).forEach(c => doc.text(c.label, c.x+2, ty+6.5))
        ty += ROW_H
      }

      // Row background (alternating)
      const isEven = idx % 2 === 0
      doc.setFillColor(isEven ? 255:250, isEven ? 255:248, isEven ? 255:245)
      doc.rect(PAD, ty, COL, ROW_H, 'F')

      // Left accent bar by status
      const sm = statusMeta(r.status)
      doc.setFillColor(...sm.rgb)
      doc.rect(PAD, ty, 2, ROW_H, 'F')

      doc.setFont('helvetica','normal'); doc.setFontSize(8.5); setDark()

      // Name (bold) + phone
      doc.setFont('helvetica','bold')
      doc.text(trunc(doc, r.name, cols.name.w-4), cols.name.x+4, ty+5)
      if (r.phone) {
        doc.setFont('helvetica','normal'); doc.setFontSize(6.5)
        doc.setTextColor(140,120,100)
        doc.text(trunc(doc, r.phone, cols.name.w-4), cols.name.x+4, ty+8.5)
      }

      // Time
      doc.setFont('helvetica','bold'); doc.setFontSize(9); setDark()
      doc.text(r.start_time || r.time || '—', cols.time.x+2, ty+6)

      // Guests
      doc.setFont('helvetica','bold'); doc.setFontSize(9)
      doc.text(String(r.guests || '—'), cols.guests.x+2, ty+6)

      // Service
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5); setDark()
      doc.text(trunc(doc, r.service || '—', cols.service.w-4), cols.service.x+2, ty+6)

      // Status pill
      doc.setFillColor(...sm.rgb)
      doc.roundedRect(cols.status.x+2, ty+2.5, 26, 5.5, 1, 1, 'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(6.5)
      doc.setTextColor(255,255,255)
      doc.text(sm.label, cols.status.x+15, ty+6.2, { align:'center' })

      // Bottom border
      doc.setDrawColor(230,222,212); doc.setLineWidth(0.2)
      doc.line(PAD, ty+ROW_H, PAD+COL, ty+ROW_H)

      ty += ROW_H
    })

    // Total row
    fillDark(); doc.rect(PAD, ty, COL, 9, 'F')
    doc.setFont('helvetica','bold'); doc.setFontSize(8); setGold()
    doc.text(`Total : ${reservations.length} réservation(s)`, PAD+5, ty+6)
    const confirmed = reservations.filter(r=>r.status==='Confirmed').length
    const pending   = reservations.filter(r=>r.status==='Pending').length
    const cancelled = reservations.filter(r=>r.status==='Cancelled').length
    setWhite()
    doc.text(`${confirmed} conf. · ${pending} att. · ${cancelled} ann.`, W-PAD-5, ty+6, { align:'right' })

    footer()
  }

  doc.save(filename)
}