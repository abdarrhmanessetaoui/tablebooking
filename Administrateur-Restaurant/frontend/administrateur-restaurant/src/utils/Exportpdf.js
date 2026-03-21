import { DARK, GOLD, GREEN, RED, AMBER } from '../styles/dashboard/tokens'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return [r,g,b]
}

function statusMeta(status) {
  if (status === 'Confirmed') return { label: 'Confirmée',  rgb: hexToRgb(GREEN) }
  if (status === 'Cancelled') return { label: 'Annulée',    rgb: hexToRgb(RED)   }
  return                             { label: 'En attente', rgb: hexToRgb(AMBER) }
}

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
  const fillGold = () => doc.setFillColor(...hexToRgb(GOLD))

  // ── Footer ────────────────────────────────────────────────────────
  function footer() {
    fillGold()
    doc.rect(0, FOOTER_Y, W, FOOTER_H, 'F')
    doc.setFont('helvetica','bold')
    doc.setFontSize(7)
    setDark()
    doc.text('TableBooking.ma', PAD, FOOTER_Y + 5.5)
    doc.setFont('helvetica','normal')
    doc.text(`Généré le ${today} à ${now}`, W - PAD, FOOTER_Y + 5.5, { align: 'right' })

    // Second line
    doc.setFontSize(6.5)
    doc.setTextColor(...hexToRgb(DARK), 0.6)
    doc.text('Rapport automatique · Confidentiel', PAD, FOOTER_Y + 10)
  }

  // ── Page header ───────────────────────────────────────────────────
  function pageHeader(subtitle = 'TABLEAU DE BORD') {
    fillDark()
    doc.rect(0, 0, W, 30, 'F')

    // Gold accent bar
    fillGold()
    doc.rect(0, 30, W, 2, 'F')

    // Logo
    doc.setFont('helvetica','bold')
    doc.setFontSize(16)
    setGold()
    doc.text('TableBooking', PAD, 19)
    const tbW = doc.getTextWidth('TableBooking')
    setWhite()
    doc.text('.ma', PAD + tbW, 19)

    // Right: subtitle + date
    doc.setFont('helvetica','bold')
    doc.setFontSize(7)
    setGold()
    doc.text(subtitle, W - PAD, 12, { align: 'right' })
    doc.setFont('helvetica','normal')
    doc.setFontSize(7.5)
    setWhite()
    doc.text(`${today}  ·  ${now}`, W - PAD, 22, { align: 'right' })
  }

  // ── Section title ─────────────────────────────────────────────────
  function sectionTitle(title, sub, y) {
    doc.setFont('helvetica','bold')
    doc.setFontSize(13)
    setDark()
    doc.text(title, PAD, y)

    doc.setFont('helvetica','normal')
    doc.setFontSize(8)
    setGold()
    doc.text(sub, PAD, y + 5.5)
    return y + 14
  }

  // ── KPI card ──────────────────────────────────────────────────────
  function kpiCard(value, label, accent, x, y, w, h = 22) {
    // White background
    doc.setFillColor(255, 255, 255)
    doc.rect(x, y, w, h, 'F')

    // Colored left border
    doc.setFillColor(...hexToRgb(accent))
    doc.rect(x, y, 3, h, 'F')

    // Outer border
    doc.setDrawColor(232, 213, 183)
    doc.setLineWidth(0.3)
    doc.rect(x, y, w, h, 'S')

    // Value
    doc.setFont('helvetica','bold')
    doc.setFontSize(20)
    setDark()
    doc.text(String(value), x + 7, y + 13)

    // Label
    doc.setFont('helvetica','normal')
    doc.setFontSize(7)
    doc.setTextColor(...hexToRgb(accent))
    doc.text(label.toUpperCase(), x + 7, y + 19)
  }

  // ── Divider ───────────────────────────────────────────────────────
  function hline(y) {
    doc.setDrawColor(232, 213, 183)
    doc.setLineWidth(0.3)
    doc.line(PAD, y, W - PAD, y)
  }

  // ═════════════════════════════════════════════════════════════════
  // PAGE 1 — STATS DASHBOARD
  // ═════════════════════════════════════════════════════════════════
  pageHeader('TABLEAU DE BORD')

  let y = 42

  // ── Hero number ───────────────────────────────────────────────────
  y = sectionTitle("Réservations aujourd'hui", 'Vue d\'ensemble du jour', y)

  // Big number box
  doc.setFillColor(253, 246, 236)
  doc.rect(PAD, y, COL, 28, 'F')
  doc.setFillColor(...hexToRgb(GOLD))
  doc.rect(PAD, y, 4, 28, 'F')

  doc.setFont('helvetica','bold')
  doc.setFontSize(38)
  setDark()
  doc.text(String(stats.today), PAD + 10, y + 20)

  doc.setFont('helvetica','normal')
  doc.setFontSize(9)
  setGold()
  doc.text("réservations aujourd'hui", PAD + 32, y + 20)

  y += 34
  hline(y)
  y += 10

  // ── KPI row 1: today detail ───────────────────────────────────────
  y = sectionTitle('Détail du jour', 'Confirmées · En attente · Annulées', y)

  const kpiW  = (COL - 4) / 3
  const kpiH  = 24
  ;[
    { v: stats.today_confirmed, l: 'Confirmées', accent: GREEN },
    { v: stats.today_pending,   l: 'En attente', accent: AMBER },
    { v: stats.today_cancelled, l: 'Annulées',   accent: RED   },
  ].forEach((s, i) => {
    kpiCard(s.v, s.l, s.accent, PAD + i * (kpiW + 2), y, kpiW, kpiH)
  })

  y += kpiH + 10
  hline(y)
  y += 10

  // ── KPI row 2: tomorrow + total ───────────────────────────────────
  y = sectionTitle('À venir', 'Demain et total du mois', y)

  const kpiW2 = (COL - 2) / 2
  ;[
    { v: stats.tomorrow, l: 'Demain',        accent: GOLD },
    { v: stats.total,    l: 'Total ce mois', accent: DARK },
  ].forEach((s, i) => {
    kpiCard(s.v, s.l, s.accent, PAD + i * (kpiW2 + 2), y, kpiW2, kpiH)
  })

  y += kpiH + 10
  hline(y)
  y += 10

  // ── KPI row 3: monthly detail ─────────────────────────────────────
  y = sectionTitle('Ce mois', 'Bilan mensuel des réservations', y)

  ;[
    { v: stats.confirmed, l: 'Confirmées', accent: GREEN },
    { v: stats.pending,   l: 'En attente', accent: AMBER },
    { v: stats.cancelled, l: 'Annulées',   accent: RED   },
  ].forEach((s, i) => {
    kpiCard(s.v, s.l, s.accent, PAD + i * (kpiW + 2), y, kpiW, kpiH)
  })

  y += kpiH + 12

  // ── Summary bar ───────────────────────────────────────────────────
  const rate = stats.total > 0 ? Math.round(stats.confirmed / stats.total * 100) : 0
  const barY = Math.max(y, FOOTER_Y - 24)

  fillDark()
  doc.rect(PAD, barY, COL, 14, 'F')
  fillGold()
  doc.rect(PAD, barY, 3, 14, 'F')

  doc.setFont('helvetica','bold')
  doc.setFontSize(8)
  setGold()
  doc.text('Taux de confirmation :', PAD + 7, barY + 6)
  const rateW = doc.getTextWidth('Taux de confirmation :')
  setWhite()
  doc.text(` ${rate}%`, PAD + 7 + rateW, barY + 6)

  doc.setFont('helvetica','normal')
  doc.setFontSize(7.5)
  setWhite()
  doc.text(`${stats.total} réservations ce mois`, W - PAD - 5, barY + 6, { align: 'right' })

  // Progress bar
  const barTrackW = COL - 14
  doc.setFillColor(255,255,255,0.15)
  doc.rect(PAD + 7, barY + 8, barTrackW, 3, 'F')
  fillGold()
  doc.rect(PAD + 7, barY + 8, barTrackW * (rate / 100), 3, 'F')

  footer()

  // ═════════════════════════════════════════════════════════════════
  // PAGE 2 — RESERVATIONS TABLE
  // ═════════════════════════════════════════════════════════════════
  if (reservations && reservations.length > 0) {
    doc.addPage()
    pageHeader(`RÉSERVATIONS — ${tabLabel.toUpperCase()}`)

    let ty = 42

    ty = sectionTitle(
      `Réservations — ${tabLabel}`,
      `${reservations.length} réservation(s)`,
      ty
    )

    const ROW_H = 11
    const cols = {
      name:    { x: PAD,     w: 46, label: 'NOM'      },
      time:    { x: PAD+46,  w: 20, label: 'HEURE'    },
      guests:  { x: PAD+66,  w: 18, label: 'COUVERTS' },
      service: { x: PAD+84,  w: 50, label: 'SERVICE'  },
      status:  { x: PAD+134, w: 48, label: 'STATUT'   },
    }

    // Table header
    fillDark()
    doc.rect(PAD, ty, COL, ROW_H, 'F')
    fillGold()
    doc.rect(PAD, ty, 3, ROW_H, 'F')
    doc.setFont('helvetica','bold')
    doc.setFontSize(7)
    setGold()
    Object.values(cols).forEach(c => doc.text(c.label, c.x + 5, ty + 7))
    ty += ROW_H

    reservations.forEach((r, idx) => {
      // New page check
      if (ty + ROW_H > FOOTER_Y - 6) {
        footer()
        doc.addPage()
        pageHeader(`RÉSERVATIONS — ${tabLabel.toUpperCase()}`)
        ty = 42
        fillDark()
        doc.rect(PAD, ty, COL, ROW_H, 'F')
        fillGold()
        doc.rect(PAD, ty, 3, ROW_H, 'F')
        doc.setFont('helvetica','bold')
        doc.setFontSize(7)
        setGold()
        Object.values(cols).forEach(c => doc.text(c.label, c.x + 5, ty + 7))
        ty += ROW_H
      }

      const sm     = statusMeta(r.status)
      const isEven = idx % 2 === 0

      // Row background
      doc.setFillColor(isEven ? 255 : 253, isEven ? 255 : 246, isEven ? 255 : 236)
      doc.rect(PAD, ty, COL, ROW_H, 'F')

      // Status left bar
      doc.setFillColor(...sm.rgb)
      doc.rect(PAD, ty, 3, ROW_H, 'F')

      // Bottom border
      doc.setDrawColor(232, 213, 183)
      doc.setLineWidth(0.2)
      doc.line(PAD, ty + ROW_H, PAD + COL, ty + ROW_H)

      // Name
      doc.setFont('helvetica','bold')
      doc.setFontSize(8.5)
      setDark()
      doc.text(trunc(doc, r.name, cols.name.w - 8), cols.name.x + 5, ty + 6)
      if (r.phone) {
        doc.setFont('helvetica','normal')
        doc.setFontSize(6.5)
        doc.setTextColor(160, 130, 100)
        doc.text(trunc(doc, r.phone, cols.name.w - 8), cols.name.x + 5, ty + 9.5)
      }

      // Time
      doc.setFont('helvetica','bold')
      doc.setFontSize(8.5)
      setGold()
      doc.text(r.start_time || '—', cols.time.x + 5, ty + 7)

      // Guests
      setDark()
      doc.text(String(r.guests || '—'), cols.guests.x + 5, ty + 7)

      // Service
      doc.setFont('helvetica','normal')
      doc.setFontSize(8)
      setDark()
      doc.text(trunc(doc, r.service || '—', cols.service.w - 4), cols.service.x + 5, ty + 7)

      // Status pill
      doc.setFillColor(...sm.rgb)
      doc.roundedRect(cols.status.x + 5, ty + 2.5, 28, 6, 1, 1, 'F')
      doc.setFont('helvetica','bold')
      doc.setFontSize(6.5)
      setWhite()
      doc.text(sm.label, cols.status.x + 19, ty + 6.5, { align: 'center' })

      ty += ROW_H
    })

    // ── Totals row ────────────────────────────────────────────────
    fillDark()
    doc.rect(PAD, ty, COL, 11, 'F')
    fillGold()
    doc.rect(PAD, ty, 3, 11, 'F')

    doc.setFont('helvetica','bold')
    doc.setFontSize(8)
    setGold()
    doc.text(`Total : ${reservations.length} réservation(s)`, PAD + 7, ty + 7)

    const confirmed = reservations.filter(r => r.status === 'Confirmed').length
    const pending   = reservations.filter(r => r.status === 'Pending').length
    const cancelled = reservations.filter(r => r.status === 'Cancelled').length

    setWhite()
    doc.setFont('helvetica','normal')
    doc.text(
      `${confirmed} conf. · ${pending} att. · ${cancelled} ann.`,
      W - PAD - 5, ty + 7, { align: 'right' }
    )

    footer()
  }

  doc.save(filename)
}