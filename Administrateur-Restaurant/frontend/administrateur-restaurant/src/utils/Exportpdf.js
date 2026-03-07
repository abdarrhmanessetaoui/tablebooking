const DARK = '#2b2118'
const GOLD = '#c8a97e'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return [r,g,b]
}

export function exportPDF(stats) {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W     = 210
  const PAD   = 20
  const COL   = W - PAD * 2   // 170mm usable
  const colW3 = COL / 3
  const colW2 = COL / 2

  const today    = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const now      = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
  const filename = `dashboard_${new Date().toISOString().slice(0,10)}.pdf`

  const setDark  = () => doc.setTextColor(...hexToRgb(DARK))
  const setGold  = () => doc.setTextColor(...hexToRgb(GOLD))
  const setWhite = () => doc.setTextColor(255,255,255)
  const fillDark = () => doc.setFillColor(...hexToRgb(DARK))

  function hline(yPos) {
    doc.setDrawColor(...hexToRgb(DARK))
    doc.setLineWidth(0.7)
    doc.line(PAD, yPos, W - PAD, yPos)
  }

  // Big dark title + gold subtitle — returns y after block
  function sectionTitle(title, sub, yPos) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(24)
    setDark()
    doc.text(title, PAD, yPos)
    doc.setFont('helvetica','bold')
    doc.setFontSize(10)
    setGold()
    doc.text(sub, PAD, yPos + 7)
    return yPos + 16
  }

  // Stat number + label at given x
  function statCell(value, label, x, yPos, gold) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(32)
    gold ? setGold() : setDark()
    doc.text(String(value), x, yPos)
    doc.setFont('helvetica','bold')
    doc.setFontSize(10)
    setDark()
    doc.text(label, x, yPos + 7)
  }

  /* ────────── HEADER ────────── */
  fillDark()
  doc.rect(0, 0, W, 34, 'F')
  doc.setFont('helvetica','bold')
  doc.setFontSize(18)
  setGold()
  doc.text('TableBooking', PAD, 21)
  const tbW = doc.getTextWidth('TableBooking')
  setWhite()
  doc.text('.ma', PAD + tbW, 21)
  doc.setFont('helvetica','bold')
  doc.setFontSize(7.5)
  setGold()
  doc.text('TABLEAU DE BORD', W - PAD, 14, { align:'right' })
  doc.setFont('helvetica','normal')
  doc.setFontSize(8)
  setWhite()
  doc.text(`${today}  ·  ${now}`, W - PAD, 23, { align:'right' })

  /* ────────── SECTION 1 — AUJOURD'HUI ────────── */
  let y = 46
  y = sectionTitle("Aujourd'hui", "Total des réservations du jour", y)
  // hero
  doc.setFont('helvetica','bold')
  doc.setFontSize(60)
  setDark()
  doc.text(String(stats.today), PAD, y + 22)
  doc.setFont('helvetica','bold')
  doc.setFontSize(10)
  setGold()
  doc.text("réservations aujourd'hui", PAD, y + 31)
  y += 38

  hline(y); y += 14

  /* ────────── SECTION 2 — DÉTAIL DU JOUR ────────── */
  y = sectionTitle('Détail du jour', 'Confirmées · En attente · Annulées', y)
  ;[
    { v: stats.today_confirmed, l: 'Confirmées', g: false },
    { v: stats.today_pending,   l: 'En attente', g: true  },
    { v: stats.today_cancelled, l: 'Annulées',   g: false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD + i*colW3, y+14, s.g))
  y += 28

  hline(y); y += 14

  /* ────────── SECTION 3 — À VENIR ────────── */
  y = sectionTitle('À venir', 'Demain et total du mois', y)
  ;[
    { v: stats.tomorrow, l: 'Réservations demain', g: true  },
    { v: stats.total,    l: 'Total ce mois',       g: false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD + i*colW2, y+14, s.g))
  y += 28

  hline(y); y += 14

  /* ────────── SECTION 4 — CE MOIS ────────── */
  y = sectionTitle('Ce mois', 'Bilan mensuel des réservations', y)
  ;[
    { v: stats.confirmed, l: 'Confirmées', g: false },
    { v: stats.pending,   l: 'En attente', g: true  },
    { v: stats.cancelled, l: 'Annulées',   g: false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD + i*colW3, y+14, s.g))
  y += 30

  /* ────────── SUMMARY BAR ────────── */
  const rate = stats.total > 0 ? Math.round(stats.confirmed / stats.total * 100) : 0
  fillDark()
  doc.rect(PAD, y, COL, 14, 'F')
  doc.setFont('helvetica','bold')
  doc.setFontSize(9)
  // left
  setGold()
  doc.text('Total du mois :', PAD + 6, y + 9)
  setWhite()
  doc.text(` ${stats.total} réservations`, PAD + 6 + doc.getTextWidth('Total du mois :'), y + 9)
  // right
  const rateStr  = `Taux de confirmation :  ${rate}%`
  const rateLbl  = 'Taux de confirmation :'
  const rateVal  = `  ${rate}%`
  const totalRW  = doc.getTextWidth(rateStr)
  setGold()
  doc.text(rateLbl, W - PAD - 6 - totalRW, y + 9)
  setWhite()
  doc.text(rateVal, W - PAD - 6 - doc.getTextWidth(rateVal), y + 9)

  /* ────────── FOOTER ────────── */
  const pageH = 297
  doc.setDrawColor(...hexToRgb(GOLD))
  doc.setLineWidth(0.5)
  doc.line(PAD, pageH - 14, W - PAD, pageH - 14)
  doc.setFont('helvetica','bold')
  doc.setFontSize(8)
  setGold()
  doc.text('TableBooking.ma — Rapport automatique', PAD, pageH - 8)
  setDark()
  doc.text(`Généré le ${today} à ${now}`, W - PAD, pageH - 8, { align:'right' })

  doc.save(filename)
}