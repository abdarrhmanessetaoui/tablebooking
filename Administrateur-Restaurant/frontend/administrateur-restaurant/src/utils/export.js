/* src/utils/export.js */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DARK, GOLD, GREEN, RED, AMBER } from '../styles/dashboard/tokens'
import i18n from '../i18n'

// IMPORTANT: The system truncated the 435KB font data.
// The string below is a placeholder. You MUST paste the full Base64 string here.
const AMIRI_FONT_VFS = 'AAEAAAAPAIAAAwBwR0RFRqHBfaAAAAIIAAADCkdQT1PFKawVAAF0nAAAxPRHU1VCmbzlzAAA7lgAAIZCT1MvMp5/dp8AAAGoAAAAYGNtYXAJXbb/AAAOWAAAESJnYXNwAAAAEAAAAQQAAAAIZ2x5ZgsJjQkAAjmQAAQzuWhlYWTOXCcrAAABcAAAADZoaGVhL3wbKwAAAUwAAAAkaG10eOM401cAAB98AABnWGxvY2E3n1O4AACG1AAAZ4RtYXhwGkEGhAAAAQwAAAAgbmFtZSz4EP8AAAUUAAAJQnBvc3T+AwAyAAABLAAAACBwcmVwaAaMhQAAAPwAAAAHuAH/hbAEjQAAAQAB//8ADwABAAAZ4AISABMEcAArAAEAAAAAAAAAAAAAAAAAIgABAAMAAAAAAAD+AAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAABGT9hgAALKv+StNGLMsD6AAAAAAAAAAAAAAAAAAAGcwAAQAAAAEAgwTIbUxfDzz1AAMD6AAAAADICjGxAAAAAHwlsID+Svx8LMsHFwAAAAYAAgABAAAAAAAEAcgBkAAFAAACigJYAAAASwKKAlgAAAFeADIBBAAAAAAFAAAAAAAAAKAAIG+CACBDAAAACAAAAABBTElGAMAAIP//BGT9hgAABzoDjgAAANMACAAAAbEChgAAACAACAABAAIAogAAAA4AAAJEAB4ADQCMAIQAegByAGgAYABWAE4ARAByADoAMgAoAAIAARmSGZ4AAAACAGAABgABAigAAQAEAAEBFgACAE4ABgABAiEAAgBEAAYAAQI2AAEABAABARMAAgAgAAYAAQI4AAEABAABAS4AAgAOAAYAAQIjAAEABAABAREAAgAOAAYAAQIZAAEABAABAQ0AAQAEAAEBAwACAEUAAQABAAEADQAOAAEAIAAqAAMAMAAxAAEAMwBaAAEAWwBvAAMAfgB/AAEAgACAAAMAgQDiAAEA5QDlAAEA5gDsAAMA7wD0AAMA9QD2AAEA9wD4AAMA+gD9AAMA/gD/AAEBCgEMAAEBDwE/AAEBQgFDAAEBTAFmAAMBfgF/AAEBgQGBAAEERQRFAAEERwRHAAEFMwU1AAEFdwV8AAMFwAXAAAEFzAXQAAEF0gmfAAEJoQvPAAEL0RBrAAEQbRClAAEQpxT8AAEU/hUDAAEVHBUeAAMVHxUgAAEVIxUlAAEVJxU8AAEVQxVDAAEVRRVFAAEVRxVXAAEVWRVZAAEVXBVcAAEVXxWvAAEVtBXRAAEV0xXUAAEV1hXYAAEV2hXfAAEV4hXlAAEV5hXmAAMV/xY5AAEWUhZTAAEWVRaTAAElBaUAAMWlRasAAEWsRaxAAEWsxcVAAEXFhcZAAMXGhebAAEXnhegAAEXoxfGAAEXxxfJAAMX4RfiAAEX5RkiAAEZIxkzAAMZNBmPAAEZkhmeAAEZqxnKAAEZzRnfAAMAAQAFAAAAvAAAAFwAAABKAAAAHgAAABgAAQABGSgAAQAUAF0AYABhAGUAbABvAP0BTgFRAVUBVgFXAVoBXgFhAWIFfBaUFxgXGQABAAcAgADyAPQFeAV6FR0XFwABAC4AWwBcAF4AXwBhAGIAZABnAGoAawCAAPEA8gD0APcA+AD8AUwBTQFPAVABUgFTAVQBWAFZAVwBXQFfAWABYwFkAWUBZgV3BXgFeQV6BXsVHBUdFR4V5haUFxYXFwABAAMAXQBlAVoAAAAAABcBGgADAAEECQAAAKQHhAADAAEECQABAAoHegADAAEECQACAA4HbAADAAEECQADADAHPPAADAAEECQAEABoHIgADAAEECQAFABoHCAADAAEECQAGABoG7gADAAEECQAIABIG3AADAAEECQAJABgGxAADAAEECQAKAg4EtgADAAEECQALACgEjgADAAEECQAMADQEWgADAAEECQANASIDOAADAAEECQAOADYDAgADAAEECQATAMQCPgADAAEECQEAACoCFAADAAEECQEBADYB3gADAAEECQECAFwBggADAAEECQEDAEQBPgADAAEECQEEAGAA3gADAAEECQEFADIArAADAAEECQEGAEgAZAADAAEECQEHAGQAAABLAGEAcwByAGEAIABpAHMAIABwAGwAYQBjAGUAZAAgAGIAZQBsAG8AdwAgAFMAaABhAGQAZABhACAAaQBuAHMAdABlAGEAZAAgAG8AZgAgAGIAYQBzAGUAIABnAGwAeQBwAGgAQQBsAHQAZQByAG4AYQB0AGUALAAgAG0AbwByAGUAIABuAGEAcwBrAGgALQBsAGkAawBlACwAIABHAGEAZgAgAGYAbwByAG0ATABvAGMAYQBsAGkAcwBlAGQAIABAACAAYQBuAGQAIAAmACAAcwB5AG0AYgBvAGwAcwBBAGwAdABlAHIAbgBhAHQAZQAgAG0AZQBkAGkAYQBsACAATQBlAGUAbQAgAGEAbgBkACAAZgBpAG4AYQBsACAAQQBsAGUAZgAgAGMAbwBtAGIAaQBuAGEAdABpAG8AbgBMAG8AdwAgAEIAYQBhACAAZABvAHQAIABmAG8AbABsAG8AdwBpAG4AZwAgAGEAIABSAGEAYQAgAG8AcgAgAFcAYQB3AE4AbwAgAGEAdQB0AG8AbQBhAHQAIABpAGgAIABhAGIAbwB2AGUAIABuAGEAbQBlACAAbwBmACAARwBvAGQARABpAHMAYQBiAGwAZQAgAGMAdQByAHYAaQBsAGkAbgBWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAyAEEAbQBpAHIAaQAgAFIAZQBnAHUAbABhAHIAMQAuADAAMAAyADsAQQBMAEkARgA7AEEAbQBpAHIAaQAtAFIAZQBnAHUAbABhAHIAUgBlAGcAdQBsAGEAcgBBAG0AaQByAGkAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMQAwAC0AMgAwADIAMgAgAFQAaABlACAAQQBtAGkAcgBpACAAUAByAG8AagBlAGMAdAAgAEEAdQB0AGgAbwByAHMAIAAoAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AYQBsAGkAZgB0AHkAcABlAC8AYQBtAGkAcgBpACkALgAAAAAABAAAAAMAAAyIAAAABAAAACQAAwABAAAMiAADAAoAAAAkAAwAAAAADGQAAAAAAAABBwAAACAAAAAhAAAAAQAAACIAAAAnAAAX5QAAACgAAAApAAAAAwAAACoAAAAtAAAX6wAAAC4AAAAvAAAABQAAADAAAABaAAAX7wAAAFsAAABdAAAABwAAAF4AAAB6AAAYGgAAAHsAAAB9AAAACgAAAH4AAAB+AAAYNwAAAKAAAACgAAAADQAAAKEAAAClAAAYOAAAAKYAAACmAAAADgAAAKcAAACqAAAYPQAAAKsAAACrAAAADwAAAKwAAAC6AAAYQQAAALsAAAC7AAAAEAAAALwAAAF/AAAYUAAAAeYAAAHnAAAZFAAAAjcAAAI3AAAZFgAAArsAAAK8AAAZFwAAAr4AAAK/AAAZGQAAAsYAAALHAAAZGwAAAtgAAALdAAAZHQAAAwAAAAMIAAAZIwAAAwoAAAMKAAAZLAAAAwwAAAMMAAAZLQAAAxIAAAMSAAAZLgAAAxUAAAMVAAAZLwAAAyUAAAMoAAAZMAAABgAAAAYEAAAAEQAABgYAAAb/AAAAFgAAB1AAAAd/AAABEAAACJAAAAiRAAABQAAACKAAAAigAAABQgAACKwAAAisAAABQwAACLYAAAi9AAABRAAACNEAAAjRAAAWlAAACOQAAAj+AAABTAAAHgIAAB4DAAAZNAAAHgoAAB4RAAAZNgAAHh4AAB4fAAAZPgAAHiQAAB4lAAAZQAAAHigAAB4rAAAZQgAAHkAAAB5BAAAZRgAAHlYAAB5XAAAZSAAAHmAAAB5jAAAZSgAAHmoAAB5vAAAZTgAAHoAAAB6FAAAZVAAAHpIAAB6TAAAZWgAAHpYAAB6XAAAZXAAAHvIAAB7zAAAZXgAAIAAAACAPAAABZwAAIBAAACAVAAAZYAAAIBgAACAiAAAZZgAAICQAACAkAAAZcQAAICYAACAmAAAZcgAAICgAACAvAAABdwAAIDAAACAwAAAZcwAAIDIAACAzAAAZdAAAIDgAACA6AAAZdgAAID4AACA+AAAZeQAAIEIAACBCAAAZegAAIEQAACBEAAABfwAAIE8AACBPAAABgAAAIHAAACBwAAAZewAAIHQAACB5AAAZfAAAIKwAACCsAAAZggAAIhIAACITAAAZgwAAIhUAACIVAAABfwAAIhoAACIaAAAZhQAAJcwAACXMAAABgQAALkEAAC5BAAABggAA+1AAAPtQAAAAgQAA+1EAAPtRAAABgwAA+1IAAPtSAAAAiwAA+1MAAPtVAAABhAAA+1YAAPtWAAAAjgAA+1cAAPtZAAABhwAA+1oAAPtaAAAAkAAA+1sAAPtdAAABigAA+14AAPteAAAAigAA+18AAPthAAABjQAA+2IAAPtiAAAAjwAA+2MAAPtlAAABkAAA+2YAAPtmAAAAiQAA+2cAAPtpAAABkwAA+2oAAPtqAAAAtAAA+2sAAPttAAABlgAA+24AAPtuAAAAtgAA+28AAPtxAAABmQAA+3IAAPtyAAAAlAAA+3MAAPt1AAABnAAA+3YAAPt2AAAAkwAA+3cAAPt5AAABnwAA+3oAAPt6AAAAlgAA+3sAAPt9AAABogAA+34AAPt+AAAAlwAA+38AAPuBAAABpQAA+4IAAPuBAAAAAAAAD0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9Fz0XPRc9OAAAAAAADAAAAfACPAJ8ArwC/AM8A3wDvAP8AIAEiASI'

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

  // 1. SAFE Font Configuration (Prevents crash if data is truncated)
  let fontAdded = false;
  if (AMIRI_FONT_VFS && AMIRI_FONT_VFS.length > 50000) {
    try {
      doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_VFS)
      doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal')
      fontAdded = true;
    } catch (e) {
      console.error("PDF Font Error: Amiri font data truncated or invalid.", e);
    }
  }

  const PW = 210, PAD = 14, COL = PW - PAD * 2, FOOT_Y = 285
  const today = new Date().toLocaleDateString(lang, { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const now = new Date().toLocaleTimeString(lang, { hour:'2-digit', minute:'2-digit' })

  // 2. BIDI Support Helpers
  const hasAr = (s) => /[\u0600-\u06FF]/.test(s)
  const setFontAr = () => { if (isAr && fontAdded) doc.setFont('Amiri', 'normal'); else doc.setFont('helvetica') }
  const xAr = (x) => (isAr ? PW - x : x)
  const alignAr = (def) => (isAr ? (def === 'right' ? 'left' : (def === 'left' ? 'right' : def)) : def)

  const tAr = (txt, x, y, options = {}) => {
    if (!txt) return
    const s = String(txt)
    const needsRTL = isAr && hasAr(s)
    if (needsRTL) doc.setR2L(true)
    doc.text(s, x, y, options)
    doc.setR2L(false)
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

  const isTables = tabLabel === t('tables_module.title'), isServices = tabLabel === t('services_module.title')
  const isDashboard = !isTables && !isServices

  pageHeader(tabLabel.toUpperCase())
  let y = 40

  // 3. Data Extraction
  let columns = [t('name'), t('time'), t('guests'), t('status')]
  let data = items.map(r => [
    r.name || r.number || t('unknown'),
    r.start_time || r.capacity || '—',
    r.guests || r.location || '—',
    isAr ? t('status_' + r.status?.toLowerCase()) : (r.status || (r.active ? t('tables_module.active') : t('status_pending')))
  ])

  // 4. Modern autoTable Implementation
  autoTable(doc, {
    startY: y,
    head: [columns],
    body: data,
    theme: 'grid',
    styles: { 
      font: (isAr && fontAdded) ? 'Amiri' : 'helvetica', 
      fontSize: 8, 
      halign: isAr ? 'right' : 'left',
      textColor: hexToRgb(DARK)
    },
    headStyles: { fillColor: hexToRgb(DARK), textColor: hexToRgb(GOLD), fontStyle: 'bold' },
    willDrawCell: (data) => {
      const cellText = data.cell.text.join(' ')
      if (isAr && hasAr(cellText) && fontAdded) doc.setR2L(true)
      else doc.setR2L(false)
    },
    didDrawCell: () => { doc.setR2L(false) },
    didDrawPage: () => { doc.setR2L(false); footer() }
  })

  doc.save(`${t('dashboard_pdf_filename_prefix')}_${new Date().toISOString().slice(0,10)}.pdf`)
}
