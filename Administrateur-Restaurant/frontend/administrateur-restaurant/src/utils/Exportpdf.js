import { DARK, GOLD, GREEN, RED, AMBER } from '../styles/dashboard/tokens'
import i18n from '../i18n'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return [r,g,b]
}

function statusMeta(status, t) {
  if (status === 'Confirmed') return { label: t('status_confirmed'),  rgb: hexToRgb(GREEN) }
  if (status === 'Cancelled') return { label: t('status_cancelled'),    rgb: hexToRgb(RED)   }
  return                             { label: t('status_pending'), rgb: hexToRgb(AMBER) }
}

function trunc(doc, text, maxW) {
  if (!text) return ''
  let t = String(text)
  while (doc.getTextWidth(t) > maxW && t.length > 1) t = t.slice(0,-1)
  return t.length < String(text).length ? t.slice(0,-1) + '…' : t
}

export function exportPDF(stats, reservations = [], tabLabel = i18n.t('dashboard_today'), t = i18n.t) {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const PW     = 210
  const PAD    = 14
  const COL    = PW - PAD * 2
  const PAGE_H = 297
  const FOOT_Y = PAGE_H - 12

  const lang     = i18n.language || 'en'
  const today    = new Date().toLocaleDateString(lang, { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const now      = new Date().toLocaleTimeString(lang, { hour:'2-digit', minute:'2-digit' })
  const filename = `${t('dashboard_pdf_filename_prefix')}_${new Date().toISOString().slice(0,10)}.pdf`

  const setD = () => doc.setTextColor(...hexToRgb(DARK))
  const setG = () => doc.setTextColor(...hexToRgb(GOLD))
  const setW = () => doc.setTextColor(255, 255, 255)

  // ── Footer ────────────────────────────────────────────────────────
  function footer() {
    doc.setDrawColor(...hexToRgb(GOLD))
    doc.setLineWidth(0.4)
    doc.line(PAD, FOOT_Y - 2, PW - PAD, FOOT_Y - 2)
    doc.setFont('helvetica','bold'); doc.setFontSize(7); setG()
    doc.text(`${t('brand_name')}.ma`, PAD, FOOT_Y + 3)
    doc.setFont('helvetica','normal'); setD()
    doc.text(`${today} · ${now}`, PW - PAD, FOOT_Y + 3, { align:'right' })
  }

  // ── Page header ───────────────────────────────────────────────────
  function pageHeader(subtitle = '') {
    doc.setFillColor(...hexToRgb(DARK))
    doc.rect(0, 0, PW, 26, 'F')

    doc.setFont('helvetica','bold'); doc.setFontSize(14); setG()
    doc.text(t('brand_name'), PAD, 16)
    const lw = doc.getTextWidth(t('brand_name'))
    setW(); doc.text('.ma', PAD + lw, 16)

    doc.setFontSize(7); setG()
    doc.text(subtitle, PW - PAD, 11, { align:'right' })
    doc.setFont('helvetica','normal'); doc.setFontSize(7); setW()
    doc.text(`${today} · ${now}`, PW - PAD, 19, { align:'right' })

    // Gold underline
    doc.setFillColor(...hexToRgb(GOLD))
    doc.rect(0, 26, PW, 1.5, 'F')
  }

  // ── Reprint table header ──────────────────────────────────────────
  function tableHeader(cols, y) {
    doc.setFillColor(...hexToRgb(DARK))
    doc.rect(PAD, y, COL, 10, 'F')
    doc.setFillColor(...hexToRgb(GOLD))
    doc.rect(PAD, y, 3, 10, 'F')
    doc.setFont('helvetica','bold'); doc.setFontSize(7); setG()
    Object.values(cols).forEach(c => doc.text(c.label, c.x + 5, y + 6.5))
    return y + 10
  }

  // ─────────────────────────────────────────────────────────────────
  // PAGE 1
  // ─────────────────────────────────────────────────────────────────
  pageHeader(tabLabel.toUpperCase())

  let y = 36

  // ── 6 stat cards in one row ───────────────────────────────────────
  const statItems = [
    { v: stats.today,           l: t('dashboard_today'),      accent: DARK  },
    { v: stats.today_confirmed, l: t('dashboard_confirmed'),  accent: GREEN },
    { v: stats.today_pending,   l: t('dashboard_pending'),    accent: AMBER },
    { v: stats.today_cancelled, l: t('dashboard_cancelled'),  accent: RED   },
    { v: stats.tomorrow,        l: t('dashboard_tomorrow'),   accent: GOLD  },
    { v: stats.total,           l: t('dashboard_this_month'), accent: DARK  },
  ]

  const sw = COL / statItems.length

  statItems.forEach((s, i) => {
    const x = PAD + i * sw

    // Card background
    doc.setFillColor(i % 2 === 0 ? 255 : 253, i % 2 === 0 ? 255 : 246, i % 2 === 0 ? 255 : 236)
    doc.rect(x, y, sw, 22, 'F')

    // Top accent bar
    doc.setFillColor(...hexToRgb(s.accent))
    doc.rect(x, y, sw, 2.5, 'F')

    // Value
    doc.setFont('helvetica','bold'); doc.setFontSize(18)
    doc.setTextColor(...hexToRgb(s.accent))
    doc.text(String(s.v), x + sw / 2, y + 13, { align:'center' })

    // Label
    doc.setFont('helvetica','normal'); doc.setFontSize(6)
    setD()
    doc.text(s.l, x + sw / 2, y + 19.5, { align:'center' })
  })

  // Border around stat row
  doc.setDrawColor(...hexToRgb(DARK))
  doc.setLineWidth(0.3)
  doc.rect(PAD, y, COL, 22, 'S')

  y += 28

  // ── Section label ─────────────────────────────────────────────────
  doc.setFont('helvetica','bold'); doc.setFontSize(9); setD()
  doc.text(`${t('reservations')} · ${tabLabel}`, PAD, y)
  doc.setFont('helvetica','normal'); doc.setFontSize(7); setG()
  doc.text(t('reservations_count', { count: reservations.length, plural: reservations.length !== 1 ? 's' : '' }), PW - PAD, y, { align:'right' })

  y += 6

  // ── No reservations ───────────────────────────────────────────────
  if (!reservations.length) {
    doc.setFont('helvetica','normal'); doc.setFontSize(10); setD()
    doc.text(t('no_reservations_period'), PAD, y + 10)
    footer()
    doc.save(filename)
    return
  }

  // ── Table columns ─────────────────────────────────────────────────
  const ROW_H = 10
  const cols = {
    name:    { x: PAD,      w: 50, label: t('table_name')    },
    time:    { x: PAD+50,   w: 20, label: t('table_time')    },
    guests:  { x: PAD+70,   w: 18, label: t('table_guests')  },
    service: { x: PAD+88,   w: 46, label: t('table_service') },
    status:  { x: PAD+134,  w: 48, label: t('table_status')  },
  }

  y = tableHeader(cols, y)

  // ── Rows ──────────────────────────────────────────────────────────
  reservations.forEach((r, idx) => {
    // New page if needed
    if (y + ROW_H > FOOT_Y - 8) {
      footer()
      doc.addPage()
      pageHeader(tabLabel.toUpperCase())
      y = tableHeader(cols, 36)
    }

    const sm     = statusMeta(r.status, t)
    const isEven = idx % 2 === 0

    // Row background
    doc.setFillColor(isEven ? 255 : 253, isEven ? 255 : 246, isEven ? 255 : 236)
    doc.rect(PAD, y, COL, ROW_H, 'F')

    // Status left bar
    doc.setFillColor(...sm.rgb)
    doc.rect(PAD, y, 3, ROW_H, 'F')

    // Row bottom border
    doc.setDrawColor(232, 213, 183); doc.setLineWidth(0.2)
    doc.line(PAD, y + ROW_H, PAD + COL, y + ROW_H)

    // Name
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); setD()
    doc.text(trunc(doc, r.name, cols.name.w - 8), cols.name.x + 5, y + 5.5)
    if (r.phone) {
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5)
      doc.setTextColor(160, 130, 100)
      doc.text(trunc(doc, r.phone, cols.name.w - 8), cols.name.x + 5, y + 9)
    }

    // Time
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); setG()
    doc.text(r.start_time || '—', cols.time.x + 5, y + 7)

    // Guests
    setD()
    doc.text(String(r.guests || '—'), cols.guests.x + 5, y + 7)

    // Service
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); setD()
    doc.text(trunc(doc, r.service || '—', cols.service.w - 4), cols.service.x + 5, y + 7)

    // Status pill
    doc.setFillColor(...sm.rgb)
    doc.rect(cols.status.x + 5, y + 2.5, 28, 5.5, 'F')
    doc.setFont('helvetica','bold'); doc.setFontSize(6.5); setW()
    doc.text(sm.label, cols.status.x + 19, y + 6.3, { align:'center' })

    y += ROW_H
  })

  // ── Totals row ────────────────────────────────────────────────────
  doc.setFillColor(...hexToRgb(DARK))
  doc.rect(PAD, y, COL, 10, 'F')
  doc.setFillColor(...hexToRgb(GOLD))
  doc.rect(PAD, y, 3, 10, 'F')

  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); setG()
  doc.text(t('reservations_count', { count: reservations.length, plural: reservations.length !== 1 ? 's' : '' }), PAD + 7, y + 6.5)

  const conf = reservations.filter(r => r.status === 'Confirmed').length
  const pend = reservations.filter(r => r.status === 'Pending').length
  const canc = reservations.filter(r => r.status === 'Cancelled').length

  setW(); doc.setFont('helvetica','normal')
  doc.text(
    `${conf} ${t('totals_confirmed_short')} · ${pend} ${t('totals_pending_short')} · ${canc} ${t('totals_cancelled_short')}`,
    PW - PAD - 5, y + 6.5, { align:'right' }
  )

  footer()
  doc.save(filename)
}
