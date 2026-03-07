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

  const W   = 210
  const PAD = 18
  const COL = W - PAD * 2
  let   y   = PAD

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const now      = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const filename = `dashboard_${new Date().toISOString().slice(0,10)}.pdf`

  /* ── color helpers ── */
  const setDark  = () => doc.setTextColor(...hexToRgb(DARK))
  const setGold  = () => doc.setTextColor(...hexToRgb(GOLD))
  const setWhite = () => doc.setTextColor(255, 255, 255)
  const fillDark = () => doc.setFillColor(...hexToRgb(DARK))
  const fillGold = () => doc.setFillColor(...hexToRgb(GOLD))
  const fillWhite= () => doc.setFillColor(255, 255, 255)

  function hline(yPos, thickness = 0.6, color = DARK) {
    doc.setDrawColor(...hexToRgb(color))
    doc.setLineWidth(thickness)
    doc.line(PAD, yPos, W - PAD, yPos)
  }

  /* ── HEADER ── */
  fillDark()
  doc.rect(0, 0, W, 32, 'F')

  // brand
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  setGold()
  doc.text('TableBooking', PAD, 20)
  const tbW = doc.getTextWidth('TableBooking')
  setWhite()
  doc.text('.ma', PAD + tbW, 20)

  // right meta
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  setGold()
  doc.text('TABLEAU DE BORD', W - PAD, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setWhite()
  doc.text(`${today}  ·  ${now}`, W - PAD, 21, { align: 'right' })

  y = 46

  /* ══════════════════════════════════════
     SECTION 1 — AUJOURD'HUI TOTAL
  ══════════════════════════════════════ */
  // big title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setDark()
  doc.text("Aujourd'hui", PAD, y)
  // gold subtitle
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setGold()
  doc.text("Total des réservations du jour", PAD, y + 8)
  y += 14

  // hero number
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(64)
  setDark()
  doc.text(String(stats.today), PAD, y + 26)

  // sub text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setGold()
  doc.text("réservations aujourd'hui", PAD, y + 34)
  y += 42

  hline(y, 0.8)
  y += 10

  /* ══════════════════════════════════════
     SECTION 2 — DÉTAIL DU JOUR
  ══════════════════════════════════════ */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setDark()
  doc.text('Détail du jour', PAD, y)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setGold()
  doc.text('Confirmées · En attente · Annulées', PAD, y + 8)
  y += 14

  const colW3 = COL / 3
  const day3 = [
    { v: stats.today_confirmed, l: 'Confirmées',  gold: false },
    { v: stats.today_pending,   l: 'En attente',  gold: true  },
    { v: stats.today_cancelled, l: 'Annulées',    gold: false },
  ]

  day3.forEach((s, i) => {
    const x = PAD + i * colW3
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(34)
    s.gold ? setGold() : setDark()
    doc.text(String(s.v), x, y + 16)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    setDark()
    doc.text(s.l, x, y + 23)
  })
  y += 32

  hline(y, 0.8)
  y += 10

  /* ══════════════════════════════════════
     SECTION 3 — À VENIR
  ══════════════════════════════════════ */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setDark()
  doc.text('À venir', PAD, y)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setGold()
  doc.text('Demain et total du mois', PAD, y + 8)
  y += 14

  const colW2 = COL / 2
  const ahead2 = [
    { v: stats.tomorrow, l: 'Réservations demain', gold: true  },
    { v: stats.total,    l: 'Total ce mois',       gold: false },
  ]

  ahead2.forEach((s, i) => {
    const x = PAD + i * colW2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(34)
    s.gold ? setGold() : setDark()
    doc.text(String(s.v), x, y + 16)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    setDark()
    doc.text(s.l, x, y + 23)
  })
  y += 32

  hline(y, 0.8)
  y += 10

  /* ══════════════════════════════════════
     SECTION 4 — CE MOIS DÉTAIL
  ══════════════════════════════════════ */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setDark()
  doc.text('Ce mois', PAD, y)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setGold()
  doc.text('Bilan mensuel des réservations', PAD, y + 8)
  y += 14

  const month3 = [
    { v: stats.confirmed, l: 'Confirmées',  gold: false },
    { v: stats.pending,   l: 'En attente',  gold: true  },
    { v: stats.cancelled, l: 'Annulées',    gold: false },
  ]

  month3.forEach((s, i) => {
    const x = PAD + i * colW3
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(34)
    s.gold ? setGold() : setDark()
    doc.text(String(s.v), x, y + 16)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    setDark()
    doc.text(s.l, x, y + 23)
  })
  y += 38

  /* ══════════════════════════════════════
     SUMMARY BAR — dark bg
  ══════════════════════════════════════ */
  const rate = stats.total > 0 ? Math.round(stats.confirmed / stats.total * 100) : 0
  fillDark()
  doc.rect(PAD, y, COL, 20, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setGold()
  doc.text('Total du mois :', PAD + 8, y + 13)
  const lw = doc.getTextWidth('Total du mois :')
  setWhite()
  doc.text(` ${stats.total} réservations`, PAD + 8 + lw, y + 13)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setGold()
  doc.text('Taux de confirmation :', W - PAD - 8 - doc.getTextWidth(`${rate}%`) - doc.getTextWidth('Taux de confirmation :  '), y + 13)
  const rw = doc.getTextWidth('Taux de confirmation :')
  setWhite()
  doc.text(` ${rate}%`, W - PAD - 8 - doc.getTextWidth(`${rate}%`), y + 13)

  y += 28

  /* ══════════════════════════════════════
     FOOTER
  ══════════════════════════════════════ */
  const pageH = 297
  hline(pageH - 16, 0.5, GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setGold()
  doc.text('TableBooking.ma — Rapport automatique', PAD, pageH - 9)
  setDark()
  doc.text(`Généré le ${today} à ${now}`, W - PAD, pageH - 9, { align: 'right' })

  doc.save(filename)
}