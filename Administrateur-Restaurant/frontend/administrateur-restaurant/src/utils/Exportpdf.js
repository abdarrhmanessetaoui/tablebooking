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

  const W      = 210
  const PAD    = 20
  const COL    = W - PAD * 2   // 170mm usable
  const colW3  = COL / 3
  const colW2  = COL / 2
  const PAGE_H = 297
  const FOOTER_Y = PAGE_H - 16  // footer line position

  const today    = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const now      = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
  const filename = `dashboard_${new Date().toISOString().slice(0,10)}.pdf`

  const setDark  = () => doc.setTextColor(...hexToRgb(DARK))
  const setGold  = () => doc.setTextColor(...hexToRgb(GOLD))
  const setWhite = () => doc.setTextColor(255,255,255)
  const fillDark = () => doc.setFillColor(...hexToRgb(DARK))

  // Horizontal rule
  function hline(yPos) {
    doc.setDrawColor(220, 210, 200)
    doc.setLineWidth(0.4)
    doc.line(PAD, yPos, W - PAD, yPos)
  }

  // Section title — returns y after the block
  function sectionTitle(title, sub, yPos) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(16)
    setDark()
    doc.text(title, PAD, yPos)
    doc.setFont('helvetica','normal')
    doc.setFontSize(8.5)
    setGold()
    doc.text(sub, PAD, yPos + 6)
    return yPos + 14   // tighter than before (was 16)
  }

  // Single stat: big number + label
  function statCell(value, label, x, yNum, gold) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(28)
    gold ? setGold() : setDark()
    doc.text(String(value), x, yNum)
    doc.setFont('helvetica','normal')
    doc.setFontSize(8.5)
    setDark()
    doc.text(label, x, yNum + 6.5)
  }

  /* ── HEADER ────────────────────────────────────────────── */
  fillDark()
  doc.rect(0, 0, W, 30, 'F')
  doc.setFont('helvetica','bold')
  doc.setFontSize(16)
  setGold()
  doc.text('TableBooking', PAD, 19)
  const tbW = doc.getTextWidth('TableBooking')
  setWhite()
  doc.text('.ma', PAD + tbW, 19)
  doc.setFont('helvetica','bold')
  doc.setFontSize(7)
  setGold()
  doc.text('TABLEAU DE BORD', W - PAD, 12, { align:'right' })
  doc.setFont('helvetica','normal')
  doc.setFontSize(7.5)
  setWhite()
  doc.text(`${today}  ·  ${now}`, W - PAD, 21, { align:'right' })

  /* ── SECTION 1 — AUJOURD'HUI ───────────────────────────── */
  let y = 40
  y = sectionTitle("Aujourd'hui", "Total des réservations du jour", y)

  doc.setFont('helvetica','bold')
  doc.setFontSize(48)           // was 60 — slightly smaller to save space
  setDark()
  doc.text(String(stats.today), PAD, y + 17)
  doc.setFont('helvetica','bold')
  doc.setFontSize(9)
  setGold()
  doc.text("réservations aujourd'hui", PAD, y + 25)
  y += 30                       // was 38

  hline(y); y += 12             // was 14

  /* ── SECTION 2 — DÉTAIL DU JOUR ────────────────────────── */
  y = sectionTitle('Détail du jour', 'Confirmées · En attente · Annulées', y)
  ;[
    { v: stats.today_confirmed, l: 'Confirmées', g: false },
    { v: stats.today_pending,   l: 'En attente', g: true  },
    { v: stats.today_cancelled, l: 'Annulées',   g: false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD + i * colW3, y + 12, s.g))
  y += 24                       // was 28

  hline(y); y += 12

  /* ── SECTION 3 — À VENIR ───────────────────────────────── */
  y = sectionTitle('À venir', 'Demain et total du mois', y)
  ;[
    { v: stats.tomorrow, l: 'Réservations demain', g: true  },
    { v: stats.total,    l: 'Total ce mois',       g: false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD + i * colW2, y + 12, s.g))
  y += 24

  hline(y); y += 12

  /* ── SECTION 4 — CE MOIS ───────────────────────────────── */
  y = sectionTitle('Ce mois', 'Bilan mensuel des réservations', y)
  ;[
    { v: stats.confirmed, l: 'Confirmées', g: false },
    { v: stats.pending,   l: 'En attente', g: true  },
    { v: stats.cancelled, l: 'Annulées',   g: false },
  ].forEach((s,i) => statCell(s.v, s.l, PAD + i * colW3, y + 12, s.g))
  y += 24

  /* ── SUMMARY BAR ────────────────────────────────────────── */
  // Always pin summary bar 28mm above footer so it never overlaps
  const summaryY = Math.max(y + 8, FOOTER_Y - 28)
  const rate = stats.total > 0 ? Math.round(stats.confirmed / stats.total * 100) : 0

  fillDark()
  doc.rect(PAD, summaryY, COL, 13, 'F')

  doc.setFont('helvetica','bold')
  doc.setFontSize(8.5)
  setGold()
  doc.text('Total du mois :', PAD + 5, summaryY + 8.5)
  setWhite()
  const lblW = doc.getTextWidth('Total du mois :')
  doc.text(` ${stats.total} réservations`, PAD + 5 + lblW, summaryY + 8.5)

  const rateLabel = 'Taux de confirmation :'
  const rateValue = `  ${rate}%`
  const rateValW  = doc.getTextWidth(rateValue)
  const rateLblW  = doc.getTextWidth(rateLabel)
  setGold()
  doc.text(rateLabel, W - PAD - 5 - rateValW - rateLblW, summaryY + 8.5)
  setWhite()
  doc.text(rateValue, W - PAD - 5 - rateValW, summaryY + 8.5)

  /* ── FOOTER ─────────────────────────────────────────────── */
  doc.setDrawColor(...hexToRgb(GOLD))
  doc.setLineWidth(0.4)
  doc.line(PAD, FOOTER_Y, W - PAD, FOOTER_Y)
  doc.setFont('helvetica','bold')
  doc.setFontSize(7.5)
  setGold()
  doc.text('TableBooking.ma — Rapport automatique', PAD, FOOTER_Y + 6)
  doc.setFont('helvetica','normal')
  setDark()
  doc.text(`Généré le ${today} à ${now}`, W - PAD, FOOTER_Y + 6, { align:'right' })

  doc.save(filename)
}