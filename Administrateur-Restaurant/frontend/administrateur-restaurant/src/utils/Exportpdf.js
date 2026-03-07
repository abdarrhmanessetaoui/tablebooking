// Uses jsPDF from CDN — no install needed
// Add this to your index.html: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

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

  const W    = 210
  const PAD  = 20
  const COL  = W - PAD * 2
  let   y    = PAD

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const filename = `dashboard_${new Date().toISOString().slice(0,10)}.pdf`

  /* ── helpers ── */
  function setDark()  { doc.setTextColor(...hexToRgb(DARK)) }
  function setGold()  { doc.setTextColor(...hexToRgb(GOLD)) }
  function setWhite() { doc.setTextColor(255,255,255) }
  function fillDark() { doc.setFillColor(...hexToRgb(DARK)) }
  function fillGold() { doc.setFillColor(...hexToRgb(GOLD)) }

  function hline(yPos, color = DARK) {
    doc.setDrawColor(...hexToRgb(color))
    doc.setLineWidth(0.5)
    doc.line(PAD, yPos, W - PAD, yPos)
  }

  function label(text, yPos) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(8)
    setGold()
    doc.text(text.toUpperCase(), PAD, yPos)
    return yPos + 6
  }

  function bigNum(value, x, yPos, isGold = false) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(42)
    isGold ? setGold() : setDark()
    doc.text(String(value), x, yPos)
  }

  function smallNum(value, x, yPos, isGold = false) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(28)
    isGold ? setGold() : setDark()
    doc.text(String(value), x, yPos)
  }

  function sub(text, x, yPos) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(9)
    setDark()
    doc.text(text, x, yPos)
  }

  /* ── HEADER BAR ── */
  fillDark()
  doc.rect(0, 0, W, 28, 'F')

  doc.setFont('helvetica','bold')
  doc.setFontSize(16)
  setGold()
  doc.text('TableBooking', PAD, 17)
  const tbW = doc.getTextWidth('TableBooking')
  doc.setFontSize(16)
  setWhite()
  doc.text('.ma', PAD + tbW, 17)

  doc.setFont('helvetica','bold')
  doc.setFontSize(8)
  setGold()
  doc.text('TABLEAU DE BORD', W - PAD, 12, { align: 'right' })
  doc.setFont('helvetica','normal')
  doc.setFontSize(8)
  setWhite()
  doc.text(`${today}  ·  ${now}`, W - PAD, 18, { align: 'right' })

  y = 40

  /* ── SECTION: Aujourd'hui ── */
  y = label("Aujourd'hui — Total", y)
  bigNum(stats.today, PAD, y + 22)
  doc.setFont('helvetica','bold')
  doc.setFontSize(10)
  setGold()
  doc.text("réservations aujourd'hui", PAD, y + 30)
  y += 38

  hline(y)
  y += 10

  /* ── SECTION: Détail du jour ── */
  y = label('Détail du jour', y)

  const colW3 = COL / 3
  const stats3a = [
    { v: stats.today_confirmed, l: 'Confirmées',  gold: false },
    { v: stats.today_pending,   l: 'En attente',  gold: true  },
    { v: stats.today_cancelled, l: 'Annulées',    gold: false },
  ]
  stats3a.forEach((s, i) => {
    const x = PAD + i * colW3
    smallNum(s.v, x, y + 14, s.gold)
    sub(s.l, x, y + 21)
  })
  y += 30

  hline(y)
  y += 10

  /* ── SECTION: À venir ── */
  y = label('À venir', y)

  const colW2 = COL / 2
  smallNum(stats.tomorrow, PAD,           y + 14, true)
  sub('Réservations demain',              PAD,           y + 21)
  smallNum(stats.total,    PAD + colW2,   y + 14, false)
  sub('Total ce mois',                    PAD + colW2,   y + 21)
  y += 30

  hline(y)
  y += 10

  /* ── SECTION: Ce mois ── */
  y = label('Ce mois — Détail', y)

  const stats3b = [
    { v: stats.confirmed, l: 'Confirmées',  gold: false },
    { v: stats.pending,   l: 'En attente',  gold: true  },
    { v: stats.cancelled, l: 'Annulées',    gold: false },
  ]
  stats3b.forEach((s, i) => {
    const x = PAD + i * colW3
    smallNum(s.v, x, y + 14, s.gold)
    sub(s.l, x, y + 21)
  })
  y += 34

  /* ── SUMMARY BOX ── */
  fillGold()
  doc.roundedRect(PAD, y, COL, 22, 2, 2, 'F')
  doc.setFont('helvetica','bold')
  doc.setFontSize(10)
  setDark()
  doc.text(
    `Total du mois : ${stats.total} réservations  ·  Taux confirmation : ${stats.total > 0 ? Math.round(stats.confirmed / stats.total * 100) : 0}%`,
    W / 2, y + 13,
    { align: 'center' }
  )
  y += 30

  /* ── FOOTER ── */
  const pageH = 297
  hline(pageH - 14, GOLD)
  doc.setFont('helvetica','bold')
  doc.setFontSize(8)
  setGold()
  doc.text('TableBooking.ma — Rapport automatique', PAD, pageH - 8)
  doc.text(`Généré le ${today}`, W - PAD, pageH - 8, { align: 'right' })

  doc.save(filename)
}