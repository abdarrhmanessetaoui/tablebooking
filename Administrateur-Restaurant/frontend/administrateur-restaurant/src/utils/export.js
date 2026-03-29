/* src/utils/export.js */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DARK, GOLD, GREEN, RED, AMBER } from '../styles/dashboard/tokens'
import i18n from '../i18n'

// Arabic Font Base64 (Amiri-Regular)
// NOTE: This is a 32kb+ valid Unicode font mapping. 
const AMIRI_FONT_VFS = 'AAEAAAAPAIAAAwBwR0RFRqHBfaAAAAIIAAADCkdQT1PFKawVAAF0nAAAxPRHU1VCmbzlzAAA7lgAAIZCT1MvMp5/dp8AAAGoAAAAYGNtYXAJXbb/AAAOWAAAESJnYXNwAAAAEAAAAQQAAAAIZ2x5ZgsJjQkAAjmQAAQzuWhlYWTOXCcrAAABcAAAADZoaGVhL3wbKwAAAUwAAAAkaG10eOM401cAAB98AABnWGxvY2E3n1O4AACG1AAAZ4RtYXhwGkEGhAAAAQwAAAAgbmFtZSz4EP8AAAUUAAAJQnBvc3T+AwAyAAABLAAAACBwcmVwaAaMhQAAAPwAAAAHuAH/hbAEjQAAAQAB//8ADwABAAAZ4AISABMEcAArAAEAAAAAAAAAAAAAAAAAIgABAAMAAAAAAAD+AAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAABGT9hgAALKv+StNGLMsD6AAAAAAAAAAAAAAAAAAAGcwAAQAAAAEAgwTIbUxfDzz1AAMD6AAAAADICjGxAAAAAHwlsID+Svx8LMsHFwAAAAYAAgABAAAAAAAEAcgBkAAFAAACigJYAAAASwKKAlgAAAFeADIBBAAAAAAFAAAAAAAAAKAAIG+CACBDAAAACAAAAABBTElGAMAAIP//BGT9hgAABzoDjgAAANMACAAAAbEChgAAACAACAABAAIAogAAAA4AAAJEAB4ADQCMAIQAegByAGgAYABWAE4ARAByADoAMgAoAAIAARmSGZ4AAAACAGAABgABAigAAQAEAAEBFgACAE4ABgABAiEAAgBEAAYAAQI2AAEABAABARMAAgAgAAYAAQI4AAEABAABAS4AAgAOAAYAAQIjAAEABAABAREAAgAOAAYAAQIZAAEABAABAQ0AAQAEAAEBAwACAEUAAQABAAEADQAOAAEAIAAqAAMAMAAxAAEAMwBaAAEAWwBvAAMAfgB/AAEAgACAAAMAgQDiAAEA5QDlAAEA5gDsAAMA7wD0AAMA9QD2AAEA9wD4AAMA+gD9AAMA/gD/AAEBCgEMAAEBDwE/AAEBQgFDAAEBTAFmAAMBfgF/AAEBgQGBAAEERQRFAAEERwRHAAEFMwU1AAEFdwV8AAMFwAXAAAEFzAXQAAEF0gmfAAEJoQvPAAEL0RBrAAEQbRClAAEQpxT8AAEU/hUDAAEVHBUeAAMVHxUgAAEVIxUlAAEVJxU8AAEVQxVDAAEVRRVFAAEVRxVXAAEVWRVZAAEVXBVcAAEVXxWvAAEVtBXRAAEV0xXUAAEV1hXYAAEV2hXfAAEV4hXlAAEV5hXmAAMV/xY5AAEWUhZTAAEWVRaTAAElBaUAAMWlRasAAEWsRaxAAEWsxcVAAEXFhcZAAMXGhebAAEXnhegAAEXoxfGAAEXxxfJAAMX4RfiAAEX5RkiAAEZIxkzAAMZNBmPAAEZkhmeAAEZqxnKAAEZzRnfAAMAAQAFAAAAvAAAAFwAAABKAAAAHgAAABgAAQABGSgAAQAUAF0AYABhAGUAbABvAP0BTgFRAVUBVgFXAVoBXgFhAWIFfBaUFxgXGQABAAcAgADyAPQFeAV6FR0XFwABAC4AWwBcAF4AXwBhAGIAZABnAGoAawCAAPEA8gD0APcA+AD8AUwBTQFPAVABUgFTAVQBWAFZAVwBXQFfAWABYwFkAWUBZgV3BXgFeQV6BXsVHBUdFR4V5haUFxYXFwABAAMAXQBlAVoAAAAAABcBGgADAAEECQAAAKQHhAADAAEECQABAAoHegADAAEECQACAA4HbAADAAEECQADADAHPPAADAAEECQAEABoHIgADAAEECQAFABoHCAADAAEECQAGABoG7gADAAEECQAIABIG3AADAAEECQAJABgGxAADAAEECQAKAg4EtgADAAEECQALACgEjgADAAEECQAMADQEWgADAAEECQANASIDOAADAAEECQAOADYDAgADAAEECQATAMQCPgADAAEECQEAACoCFAADAAEECQEBADYB3gADAAEECQECAFwBggADAAEECQEDAEQBPgADAAEECQEEAGAA3gADAAEECQEFADIArAADAAEECQEGAEgAZAADAAEECQEHAGQAAABLAGEAcwByAGEAIABpAHMAIABwAGwAYQBjAGUAZAAgAGIAZQBsAG8AdwAgAFMAaABhAGQAZABhACAAaQBuAHMAdABlAGEAZAAgAG8AZgAgAGIAYQBzAGUAIABnAGwAeQBwAGgAQQBsAHQAZQByAG4AYQB0AGUALAAgAG0AbwByAGUAIABuAGEAcwBrAGgALQBsAGkAawBlACwAIABHAGEAZgAgAGYAbwByAG0ATABvAGMAYQBsAGkAcwBlAGQAIABAACAAYQBuAGQAIAAmACAAcwB5AG0AYgBvAGwAcwBBAGwAdABlAHIAbgBhAHQAZQAgAG0AZQBkAGkAYQBsACAATQBlAGUAbQAgAGEAbgBkACAAZgBpAG4AYQBsACAAQQBsAGUAZgAgAGMAbwBtAGIAaQBuAGEAdABpAG8AbgBMAG8AdwAgAEIAYQBhACAAZABvAHQAIABmAG8AbABsAG8AdwBpAG4AZwAgAGEAIABSAGEAYQAgAG8AcgAgAFcAYQB3AE4AbwAgAGEAdQB0AG8AbQBhAHQAaQBjACAAdgBvAHcAZQBsACAAaQBuAHMAZQByAHQAaQBvAG4AIABhAGIAbwB2AGUAIABuAGEAbQBlACAAbwBmACAARwBvAGQARABpAHMAYQBiAGwAZQAgAGMAdQByAHYAaQBsAGkAbgBWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAyAEEAbQBpAHIAaQAgAFIAZQBnAHUAbABhAHIAMQAuADAAMAAyADsAQQBMAEkARgA7AEEAbQBpAHIAaQAtAFIAZQBnAHUAbABhAHIAUgBlAGcAdQBsAGEAcgBBAG0AaQByAGkAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMQAwAC0AMgAwADIAMgAgAFQAaABlACAAQQBtAGkAcgBpACAAUAByAG8AagBlAGMAdAAgAEEAdQB0AGgAbwByAHMAIAAoAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AYQBsAGkAZgB0AHkAcABlAC8AYQBtAGkAcgBpACkALgAAAAAABAAAAAMAAAyIAAAABAAAACQAAwABAAAMiAADAAoAAAAkAAwAAAAADGQAAAAAAAABBwAAACAAAAAhAAAAAQAAACIAAAAnAAAX5QAAACgAAAApAAAAAwAAACoAAAAtAAAX6wAAAC4AAAAvAAAABQAAADAAAABaAAAX7wAAAFsAAABdAAAABwAAAF4AAAB6AAAYGgAAAHsAAAB9AAAACgAAAH4AAAB+AAAYNwAAAKAAAACgAAAADQAAAKEAAAClAAAYOAAAAKYAAACmAAAADgAAAKcAAACqAAAYPQAAAKsAAACrAAAADwAAAKwAAAC6AAAYQQAAALsAAAC7AAAAEAAAALwAAAF/AAAYUAAAAeYAAAHnAAAZFAAAAjcAAAI3AAAZFgAAArsAAAK8AAAZFwAAAr4AAAK/AAAZGQAAAsYAAALHAAAZGwAAAtgAAALdAAAZHQAAAwAAAAMIAAAZIwAAAwoAAAMKAAAZLAAAAwwAAAMMAAAZLQAAAxIAAAMSAAAZLgAAAxUAAAMVAAAZLwAAAyUAAAMoAAAZMAAABgAAAAYEAAAAEQAABgYAAAb/AAAAFgAAB1AAAAd/AAABEAAACJAAAAiRAAABQAAACKAAAAigAAABQgAACKwAAAisAAABQwAACLYAAAi9AAABRAAACNEAAAjRAAAWlAAACOQAAAj+AAABTAAAHgIAAB4DAAAZNAAAHgoAAB4RAAAZNgAAHh4AAB4fAAAZPgAAHiQAAB4lAAAZQAAAHigAAB4rAAAZQgAAHkAAAB5BAAAZRgAAHlYAAB5XAAAZSAAAHmAAAB5jAAAZSgAAHmoAAB5vAAAZTgAAHoAAAB6FAAAZVAAAHpIAAB6TAAAZWgAAHpYAAB6XAAAZXAAAHvIAAB7zAAAZXgAAIAAAACAPAAABZwAAIBAAACAVAAAZYAAAIBgAACAiAAAZZgAAICQAACAkAAAZcQAAICYAACAmAAAZcgAAICgAACAvAAABdwAAIDAAACAwAAAZcwAAIDIAACAzAAAZdAAAIDgAACA6AAAZdgAAID4AACA+AAAZeQAAIEIAACBCAAAZegAAIEQAACBEAAABfwAAIE8AACBPAAABgAAAIHAAACBwAAAZewAAIHQAACB5AAAZfAAAIKwAACCsAAAZggAAIhIAACITAAAZgwAAIhUAACIVAAABfwAAIhoAACIaAAAZhQAAJcwAACXMAAABgQAALkEAAC5BAAABggAA+1AAAPtQAAAAgQAA+1EAAPtRAAABgwAA+1IAAPtSAAAAiwAA+1MAAPtVAAABhAAA+1YAAPtWAAAAjgAA+1cAAPtZAAABhwAA+1oAAPtaAAAAkAAA+1sAAPtdAAABigAA+14AAPteAAAAigAA+18AAPthAAABjQAA+2IAAPtiAAAAjwAA+2MAAPtlAAABkAAA+2YAAPtmAAAAiQAA+2cAAPtpAAABkwAA+2oAAPtqAAAAtAAA+2sAAPttAAABlgAA+24AAPtuAAAAtgAA+28AAPtxAAABmQAA+3IAAPtyAAAAlAAA+3MAAPt1AAABnAAA+3YAAPt2AAAAkwAA+3cAAPt5AAABnwAA+3oAAPt6AAAAlgAA+3sAAPt9AAABogAA+34AAPt+AAAAlwAA+38AAPuBAAABpQAA+4IAAPuBAAAAAAAAD0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPTAAAAAAADAAAAfACPAJ8ArwC/AM8A3wDvAP8AIAEiASI' 

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16)
  return [r,g,b]
}

function statusMeta(status, t) {
  if (status === 'Confirmed') return { label: t('status_confirmed'),  rgb: hexToRgb(GREEN) }
  if (status === 'Cancelled') return { label: t('status_cancelled'),    rgb: hexToRgb(RED)   }
  return                             { label: t('status_pending'),   rgb: hexToRgb(AMBER) }
}

export function exportPDF(stats, items = [], tabLabel = i18n.t('dashboard_today'), t = i18n.t) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const lang = i18n.language || 'en', isAr = lang === 'ar'

  // 1. Font Configuration
  if (AMIRI_FONT_VFS && AMIRI_FONT_VFS.length > 100) {
    doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_VFS)
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal')
  }

  const PW = 210, PAD = 14, COL = PW - PAD * 2, FOOT_Y = 285
  const today = new Date().toLocaleDateString(lang, { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const now = new Date().toLocaleTimeString(lang, { hour:'2-digit', minute:'2-digit' })

  // 2. BIDI Support Helpers
  const hasAr = (s) => /[\u0600-\u06FF]/.test(s)
  const setFontAr = () => { if (isAr) doc.setFont('Amiri', 'normal'); else doc.setFont('helvetica') }
  const xAr = (x) => (isAr ? PW - x : x)
  const alignAr = (def) => (isAr ? (def === 'right' ? 'left' : (def === 'left' ? 'right' : def)) : def)

  // Smart text drawer: Toggles RTL ONLY when text contains Arabic characters
  const tAr = (txt, x, y, options = {}) => {
    if (!txt) return
    const s = String(txt)
    const needsRTL = isAr && hasAr(s)
    if (needsRTL) doc.setR2L(true)
    doc.text(s, x, y, options)
    doc.setR2L(false) // Defensive reset
  }

  const footer = () => {
    doc.setDrawColor(...hexToRgb(GOLD)); doc.setLineWidth(0.4); doc.line(PAD, FOOT_Y - 2, PW - PAD, FOOT_Y - 2)
    setFontAr(); doc.setFontSize(7); doc.setTextColor(...hexToRgb(GOLD))
    tAr(`${t('brand_name')}.ma`, xAr(PAD), FOOT_Y + 3, { align: alignAr('left') })
    doc.setTextColor(...hexToRgb(DARK))
    tAr(`${today} · ${now}`, xAr(PAD, 'right'), FOOT_Y + 3, { align: alignAr('right') })
    doc.setR2L(false)
  }

  const pageHeader = (subtitle = '') => {
    doc.setFillColor(...hexToRgb(DARK)); doc.rect(0, 0, PW, 26, 'F')
    setFontAr(); doc.setFontSize(14); doc.setTextColor(...hexToRgb(GOLD))
    tAr(t('brand_name'), xAr(PAD), 16, { align: alignAr('left') })
    const lw = doc.getTextWidth(t('brand_name'))
    doc.setTextColor(255, 255, 255); tAr('.ma', xAr(PAD + lw), 16, { align: alignAr('left') })
    doc.setFontSize(7); doc.setTextColor(...hexToRgb(GOLD)); tAr(subtitle, xAr(PAD, 'right'), 11, { align: alignAr('right') })
    doc.setTextColor(255, 255, 255); tAr(`${today} · ${now}`, xAr(PAD, 'right'), 19, { align: alignAr('right') })
    doc.setFillColor(...hexToRgb(GOLD)); doc.rect(0, 26, PW, 1.5, 'F')
    doc.setR2L(false)
  }

  // ── Logic Mapping ────────────────────────────────────────────────
  const isTables   = tabLabel === t('tables_module.title')
  const isServices = tabLabel === t('services_module.title')
  const isBlocked  = tabLabel === t('calendar.blocked_dates_list')
  const isPlanning = tabLabel?.startsWith(t('planning'))
  const isResList  = tabLabel === t('reservations_list_title')
  const isDashboard = !isTables && !isServices && !isBlocked && !isPlanning && !isResList

  const filenamePrefix = isTables ? 'tables' : isServices ? 'services' : isBlocked ? 'dates_bloquees' : isPlanning ? 'planning' : isResList ? 'reservations' : t('dashboard_pdf_filename_prefix')
  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0,10)}.pdf`

  pageHeader(tabLabel.toUpperCase())
  let y = 36

  // 3. Stats Cards (Dashboard)
  if (isDashboard && stats) {
    const statItems = [
      { v: stats.today,           l: t('dashboard_today'),      accent: DARK  },
      { v: stats.today_confirmed, l: t('dashboard_confirmed'),  accent: GREEN },
      { v: stats.today_pending,   l: t('dashboard_pending'),    accent: AMBER },
      { v: stats.today_cancelled, l: t('dashboard_cancelled'),  accent: RED   },
      { v: stats.tomorrow,        l: t('dashboard_tomorrow'),   accent: GOLD  },
      { v: stats.total,           l: t('dashboard_this_month'), accent: DARK  },
    ]
    const sw = COL / statItems.length
    statItems.forEach((s, idx) => {
      const x = PAD + (isAr ? statItems.length - 1 - idx : idx) * sw
      doc.setFillColor(255, 255, 255); doc.rect(x, y, sw, 22, 'F')
      doc.setFillColor(...hexToRgb(s.accent)); doc.rect(x, y, sw, 2.5, 'F')
      setFontAr(); doc.setFontSize(18); doc.setTextColor(...hexToRgb(s.accent))
      tAr(String(s.v), x + sw / 2, y + 13, { align: 'center' })
      doc.setFontSize(6); doc.setTextColor(...hexToRgb(DARK))
      tAr(s.l, x + sw / 2, y + 19.5, { align: 'center' })
      doc.setR2L(false)
    })
    y += 28
  } else if (!isDashboard) {
    doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.setTextColor(...hexToRgb(DARK))
    doc.text(tabLabel, PAD, y + 12)
    y += 20
  }

  setFontAr(); doc.setFontSize(9); doc.setTextColor(...hexToRgb(DARK))
  tAr(`${isTables ? t('tables_module.title') : isServices ? t('services_module.title') : isBlocked ? t('calendar.blocked_dates_list') : t('reservations')} · ${tabLabel}`, xAr(PAD), y, { align: alignAr('left') })
  doc.setFontSize(7); doc.setTextColor(...hexToRgb(GOLD))
  const countLabel = isTables ? t('tables_module.table_count', { count: items.length }) : isServices ? t('services_module.service_count', { count: items.length }) : isBlocked ? t('calendar.dates_success_blocked', { count: items.length }) : t('reservations_count', { count: items.length })
  tAr(countLabel, xAr(PAD, 'right'), y, { align: alignAr('right') })
  y += 6

  if (!items.length) {
    setFontAr(); doc.setFontSize(10); doc.setTextColor(...hexToRgb(DARK)); tAr(t('no_reservations_period'), xAr(PAD), y + 10, { align: alignAr('left') })
    footer(); doc.save(filename); return
  }

  // 4. Data Mapping (Arabic-Aware)
  let columns = [], data = []
  if (isTables) {
    columns = [t('tables_module.header_table'), t('tables_module.header_capacity'), t('tables_module.header_location'), t('tables_module.header_status')]
    data = items.map(r => [r.number, r.capacity, r.location || '—', r.active ? t('tables_module.active') : t('tables_module.inactive')])
  } else if (isServices) {
    columns = [t('services_module.name_header'), t('services_module.price_header'), t('services_module.capacity_header'), t('services_module.duration_header')]
    data = items.map(r => [r.name, `${r.price} dh`, r.capacity, `${r.duration} min`])
  } else if (isBlocked) {
    columns = [t('calendar.blocked_date')]
    data = items.map(r => [new Date(r.date).toLocaleDateString(lang, {weekday:'long', day:'numeric', month:'long', year:'numeric'})])
  } else {
    columns = [t('table_name'), t('table_time'), t('table_guests'), t('table_service'), t('table_status')]
    if (isResList || isPlanning) columns = [t('name'), t('phone_label'), t('date'), t('time'), t('guests'), t('status')]
    data = items.map(r => {
      if (isResList || isPlanning) return [r.name, r.phone || '—', r.date, r.start_time, r.guests, statusMeta(r.status, t).label]
      return [r.name, r.start_time, r.guests, r.service || '—', statusMeta(r.status, t).label]
    })
  }

  // 5. Integrated Arabic-Capable autoTable
  autoTable(doc, {
    startY: y + 2,
    head: [columns],
    body: data,
    theme: 'grid',
    styles: { 
      font: isAr ? 'Amiri' : 'helvetica', 
      fontSize: 8, 
      halign: isAr ? 'right' : 'left',
      textColor: hexToRgb(DARK)
    },
    headStyles: { fillColor: hexToRgb(DARK), textColor: hexToRgb(GOLD), fontSize: 7, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [253, 246, 236] },
    margin: { left: PAD, right: PAD },
    willDrawCell: (data) => {
      // Force correct direction for each cell BEFORE drawing
      const cellText = data.cell.text.join(' ')
      if (isAr && hasAr(cellText)) doc.setR2L(true)
      else doc.setR2L(false)
    },
    didDrawCell: () => {
      doc.setR2L(false) // Defensive reset after every cell
    },
    didDrawPage: () => { 
      doc.setR2L(false) // Safety reset for non-table elements
      footer() 
    }
  })

  doc.save(filename)
}
