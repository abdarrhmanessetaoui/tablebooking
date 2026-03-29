import { DARK, GOLD, GREEN, RED, AMBER } from '../styles/dashboard/tokens'
import i18n from '../i18n'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
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

export function exportPDF(stats, items = [], tabLabel = i18n.t('dashboard_today'), t = i18n.t) {
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
  
  // Detect mode based on tabLabel or data structure
  const isTables   = tabLabel === t('tables_module.title')
  const isServices = tabLabel === t('services_module.title')
  const isBlocked  = tabLabel === t('calendar.blocked_dates_list')
  const isPlanning = tabLabel?.startsWith(t('planning'))
  const isResList  = tabLabel === t('reservations_list_title')
  const isDashboard = !isTables && !isServices && !isBlocked && !isPlanning && !isResList

  const filenamePrefix = isTables ? 'tables' : isServices ? 'services' : isBlocked ? 'dates_bloquees' : isPlanning ? 'planning' : isResList ? 'reservations' : t('dashboard_pdf_filename_prefix')
  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0,10)}.pdf`

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
    const headerTitle = isPlanning || isBlocked || isServices || isTables || isResList ? subtitle : subtitle
    doc.text(headerTitle, PW - PAD, 11, { align:'right' })
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
    Object.values(cols).forEach(c => doc.text(c.label.toUpperCase(), c.x + 5, y + 6.5))
    return y + 10
  }

  // ─────────────────────────────────────────────────────────────────
  // PAGE 1
  // ─────────────────────────────────────────────────────────────────
  pageHeader(tabLabel.toUpperCase())

  let y = 36

  if (isDashboard && stats) {
    // ── 6 stat cards ──
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
      doc.setFillColor(i % 2 === 0 ? 255 : 253, i % 2 === 0 ? 255 : 246, i % 2 === 0 ? 255 : 236)
      doc.rect(x, y, sw, 22, 'F')
      doc.setFillColor(...hexToRgb(s.accent)); doc.rect(x, y, sw, 2.5, 'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(...hexToRgb(s.accent))
      doc.text(String(s.v), x + sw / 2, y + 13, { align:'center' })
      doc.setFont('helvetica','normal'); doc.setFontSize(6); setD()
      doc.text(s.l, x + sw / 2, y + 19.5, { align:'center' })
    })
    doc.setDrawColor(...hexToRgb(DARK)); doc.setLineWidth(0.3); doc.rect(PAD, y, COL, 22, 'S')
    y += 28
  } else if (!isDashboard) {
    // Top accent for other pages
    doc.setFont('helvetica','bold'); doc.setFontSize(20); setD()
    doc.text(tabLabel, PAD, y + 12)
    y += 20
  }

  // ── Section label ─────────────────────────────────────────────────
  const sectionTitle = isTables ? t('tables_module.title') : isServices ? t('services_module.title') : isBlocked ? t('calendar.blocked_dates_list') : t('reservations')
  doc.setFont('helvetica','bold'); doc.setFontSize(9); setD()
  doc.text(`${sectionTitle} · ${tabLabel}`, PAD, y)
  doc.setFont('helvetica','normal'); doc.setFontSize(7); setG()
  const countLabel = isTables ? t('tables_module.table_count', { count: items.length, plural: items.length !== 1 ? 's' : '' }) 
                   : isServices ? t('services_module.service_count', { count: items.length }) 
                   : isBlocked ? t('calendar.dates_success_blocked', { count: items.length })
                   : t('reservations_count', { count: items.length, plural: items.length !== 1 ? 's' : '' })
  doc.text(countLabel, PW - PAD, y, { align:'right' })

  y += 6

  // ── No items ───────────────────────────────────────────────
  if (!items.length) {
    doc.setFont('helvetica','normal'); doc.setFontSize(10); setD()
    doc.text(t('no_reservations_period'), PAD, y + 10)
    footer(); doc.save(filename); return
  }

  // ── Table columns ─────────────────────────────────────────────────
  const ROW_H = 10
  let cols = {}
  if (isTables) {
    cols = {
      name:     { x: PAD,      w: 60, label: t('tables_module.header_table') },
      capacity: { x: PAD+60,   w: 30, label: t('tables_module.header_capacity') },
      location: { x: PAD+90,   w: 40, label: t('tables_module.header_location') },
      status:   { x: PAD+130,  w: 40, label: t('tables_module.header_status') },
    }
  } else if (isServices) {
    cols = {
      name:     { x: PAD,      w: 60, label: t('services_module.name_header') },
      price:    { x: PAD+60,   w: 30, label: t('services_module.price_header') },
      capacity: { x: PAD+90,   w: 30, label: t('services_module.capacity_header') },
      duration: { x: PAD+120,  w: 50, label: t('services_module.duration_header') },
    }
  } else if (isBlocked) {
    cols = { date: { x: PAD, w: COL, label: t('calendar.blocked_date') } }
  } else {
    // Default: Reservations
    cols = {
      name:    { x: PAD,      w: 50, label: t('table_name')    },
      time:    { x: PAD+50,   w: 20, label: t('table_time')    },
      guests:  { x: PAD+70,   w: 18, label: t('table_guests')  },
      service: { x: PAD+88,   w: 46, label: t('table_service') },
      status:  { x: PAD+134,  w: 48, label: t('table_status')  },
    }
    // If it's the Reservations page specifically, add phone
    if (isResList || isPlanning) {
      cols = {
        name:   { x: PAD,     w: 40, label: t('name') },
        phone:  { x: PAD+40,  w: 30, label: t('phone_label') },
        date:   { x: PAD+70,  w: 25, label: t('date') },
        time:   { x: PAD+95,  w: 20, label: t('time') },
        guests: { x: PAD+115, w: 20, label: t('guests') },
        status: { x: PAD+135, w: 35, label: t('status') },
      }
    }
  }

  y = tableHeader(cols, y)

  // ── Rows ──────────────────────────────────────────────────────────
  items.forEach((item, idx) => {
    if (y + ROW_H > FOOT_Y - 8) {
      footer(); doc.addPage(); pageHeader(tabLabel.toUpperCase())
      y = tableHeader(cols, 36)
    }
    const isEven = idx % 2 === 0
    doc.setFillColor(isEven ? 255 : 253, isEven ? 255 : 246, isEven ? 255 : 236)
    doc.rect(PAD, y, COL, ROW_H, 'F')
    doc.setDrawColor(232, 213, 183); doc.setLineWidth(0.2); doc.line(PAD, y + ROW_H, PAD + COL, y + ROW_H)

    doc.setFontSize(8.5); doc.setFont('helvetica','normal'); setD()
    if (isTables) {
      doc.text(`${t('tables_module.header_table')} ${item.number}`, cols.name.x + 5, y + 6.5)
      doc.text(`${item.capacity} ${t('tables_module.persons')}`, cols.capacity.x + 5, y + 6.5)
      doc.text(item.location || '—', cols.location.x + 5, y + 6.5)
      doc.text(item.active ? t('tables_module.active') : t('tables_module.inactive'), cols.status.x + 5, y + 6.5)
    } else if (isServices) {
      doc.text(item.name || '—', cols.name.x + 5, y + 6.5)
      doc.text(Number(item.price)>0 ? `${item.price} dh` : t('services_module.free'), cols.price.x + 5, y + 6.5)
      doc.text(`${item.capacity} ${t('pers_short', { defaultValue: 'pers.' })}`, cols.capacity.x + 5, y + 6.5)
      doc.text(`${item.duration} ${t('min', { defaultValue: 'min' })}`, cols.duration.x + 5, y + 6.5)
    } else if (isBlocked) {
      const lbl = item.date ? new Date(item.date).toLocaleDateString(lang,{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'
      doc.text(lbl.charAt(0).toUpperCase()+lbl.slice(1), cols.date.x + 5, y + 6.5)
    } else {
      // Reservations
      const sm = statusMeta(item.status, t)
      doc.setFillColor(...sm.rgb); doc.rect(PAD, y, 3, ROW_H, 'F')
      doc.text(trunc(doc, item.name, cols.name.w - 8), cols.name.x + 5, y + 5.5)
      if (item.phone) {
        doc.setFontSize(6.5); doc.setTextColor(160, 130, 100)
        doc.text(trunc(doc, item.phone, cols.name.w - 8), cols.name.x + 5, y + 9)
        doc.setFontSize(8.5); setD()
      }
      if (cols.date) doc.text(item.date || '—', cols.date.x + 5, y + 6.5)
      doc.setFont('helvetica','bold'); setG()
      doc.text(item.start_time || '—', cols.time.x + 5, y + 6.5)
      doc.setFont('helvetica','normal'); setD()
      doc.text(String(item.guests || '—'), cols.guests.x + 5, y + 6.5)
      if (cols.service) doc.text(trunc(doc, item.service || '—', cols.service.w - 4), cols.service.x + 5, y + 6.5)
      
      // Status pill
      doc.setFillColor(...sm.rgb); doc.rect(cols.status.x + 5, y + 2.5, 28, 5.5, 'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(6.5); setW()
      doc.text(sm.label, cols.status.x + 19, y + 6.3, { align:'center' })
    }
    y += ROW_H
  })

  // ── Totals row ────────────────────────────────────────────────────
  doc.setFillColor(...hexToRgb(DARK)); doc.rect(PAD, y, COL, 10, 'F')
  doc.setFillColor(...hexToRgb(GOLD)); doc.rect(PAD, y, 3, 10, 'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); setG()
  doc.text(countLabel, PAD + 7, y + 6.5)

  if (isDashboard || isResList || isPlanning) {
    const list = isDashboard || isResList || isPlanning ? items : []
    const conf = list.filter(r => r.status === 'Confirmed').length
    const pend = list.filter(r => r.status === 'Pending').length
    const canc = list.filter(r => r.status === 'Cancelled').length
    setW(); doc.setFont('helvetica','normal')
    doc.text(`${conf} ${t('totals_confirmed_short')} · ${pend} ${t('totals_pending_short')} · ${canc} ${t('totals_cancelled_short')}`, PW - PAD - 5, y + 6.5, { align:'right' })
  }

  footer(); doc.save(filename)
}

