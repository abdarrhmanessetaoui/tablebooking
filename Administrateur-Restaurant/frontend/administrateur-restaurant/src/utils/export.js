/* src/utils/export.js
 *
 * Arabic-safe PDF export   font embedded, correct reshaping with lam-alef.
 *
 * Fixes in this version:
 *  1. Lam-alef mandatory ligatures added (لا لأ لآ لإ)
 *     Without these, Arabic words with ل+ا look broken/disconnected.
 *  2. NO_LEFT letters (ا و ر ز د ذ etc.) no longer get hasNext=true
 *     so medial/initial forms are assigned correctly.
 *  3. Headers drawn manually (bypasses jspdf-autotable Identity-H bug).
 *
 * Requires: src/utils/amiriFont.js  (run: node convertFont.cjs)
 * Callers:  await exportPDF(stats, items, tabLabel)
 */

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import i18n from '../i18n'
import AMIRI_B64 from './amiriFont'

import {
  DARK as DARK_TOKEN,
  LIGHT_BROWN as LIGHT_BROWN_TOKEN,
  GREEN as GREEN_TOKEN,
  RED as RED_TOKEN,
  AMBER as AMBER_TOKEN,
} from '../styles/dashboard/tokens'

const DARK  = DARK_TOKEN
const LIGHT_BROWN  = LIGHT_BROWN_TOKEN
const GREEN = GREEN_TOKEN
const RED   = RED_TOKEN
const AMBER = AMBER_TOKEN

function hex2rgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

// ─── Arabic reshaper ──────────────────────────────────────────────────────────
const FORMS = {
  0x0621: ['\uFE80', '\uFE80', '\uFE80', '\uFE80'], // Hamza
  0x0622: ['\uFE81', '\uFE82', '\uFE81', '\uFE82'], // Alef with Madda
  0x0623: ['\uFE83', '\uFE84', '\uFE83', '\uFE84'], // Alef with Hamza above
  0x0624: ['\uFE85', '\uFE86', '\uFE85', '\uFE86'], // Waw with Hamza
  0x0625: ['\uFE87', '\uFE88', '\uFE87', '\uFE88'], // Alef with Hamza below
  0x0626: ['\uFE89', '\uFE8A', '\uFE8B', '\uFE8C'], // Yeh with Hamza
  0x0627: ['\uFE8D', '\uFE8E', '\uFE8D', '\uFE8E'], // Alef
  0x0628: ['\uFE8F', '\uFE90', '\uFE91', '\uFE92'], // Beh
  0x0629: ['\uFE93', '\uFE94', '\uFE93', '\uFE94'], // Teh Marbuta
  0x062A: ['\uFE95', '\uFE96', '\uFE97', '\uFE98'], // Teh
  0x062B: ['\uFE99', '\uFE9A', '\uFE9B', '\uFE9C'], // Theh
  0x062C: ['\uFE9D', '\uFE9E', '\uFE9F', '\uFEA0'], // Jeem
  0x062D: ['\uFEA1', '\uFEA2', '\uFEA3', '\uFEA4'], // Hah
  0x062E: ['\uFEA5', '\uFEA6', '\uFEA7', '\uFEA8'], // Khah
  0x062F: ['\uFEA9', '\uFEAA', '\uFEA9', '\uFEAA'], // Dal
  0x0630: ['\uFEAB', '\uFEAC', '\uFEAB', '\uFEAC'], // Thal
  0x0631: ['\uFEAD', '\uFEAE', '\uFEAD', '\uFEAE'], // Reh
  0x0632: ['\uFEAF', '\uFEB0', '\uFEAF', '\uFEB0'], // Zain
  0x0633: ['\uFEB1', '\uFEB2', '\uFEB3', '\uFEB4'], // Seen
  0x0634: ['\uFEB5', '\uFEB6', '\uFEB7', '\uFEB8'], // Sheen
  0x0635: ['\uFEB9', '\uFEBA', '\uFEBB', '\uFEBC'], // Sad
  0x0636: ['\uFEBD', '\uFEBE', '\uFEBF', '\uFEC0'], // Dad
  0x0637: ['\uFEC1', '\uFEC2', '\uFEC3', '\uFEC4'], // Tah
  0x0638: ['\uFEC5', '\uFEC6', '\uFEC7', '\uFEC8'], // Zah
  0x0639: ['\uFEC9', '\uFECA', '\uFECB', '\uFECC'], // Ain
  0x063A: ['\uFECD', '\uFECE', '\uFECF', '\uFED0'], // Ghain
  0x0641: ['\uFED1', '\uFED2', '\uFED3', '\uFED4'], // Feh
  0x0642: ['\uFED5', '\uFED6', '\uFED7', '\uFED8'], // Qaf
  0x0643: ['\uFED9', '\uFEDA', '\uFEDB', '\uFEDC'], // Kaf
  0x0644: ['\uFEDD', '\uFEDE', '\uFEDF', '\uFEE0'], // Lam
  0x0645: ['\uFEE1', '\uFEE2', '\uFEE3', '\uFEE4'], // Meem
  0x0646: ['\uFEE5', '\uFEE6', '\uFEE7', '\uFEE8'], // Noon
  0x0647: ['\uFEE9', '\uFEEA', '\uFEEB', '\uFEEC'], // Heh
  0x0648: ['\uFEED', '\uFEEE', '\uFEED', '\uFEEE'], // Waw
  0x0649: ['\uFEEF', '\uFEF0', '\uFEEF', '\uFEF0'], // Alef Maksura
  0x064A: ['\uFEF1', '\uFEF2', '\uFEF3', '\uFEF4'], // Yeh
}

// Letters that never connect on their LEFT side
const NO_LEFT = new Set([
  0x0621, 0x0622, 0x0623, 0x0624, 0x0625,
  0x0627, 0x062F, 0x0630, 0x0631, 0x0632, 0x0648, 0x0649,
])

// Mandatory lam-alef ligatures
// key = alef variant codepoint, value = [isolated_ligature, final_ligature]
const LAM = 0x0644
const LAM_ALEF = {
  0x0622: ['\uFEF5', '\uFEF6'],   // لآ
  0x0623: ['\uFEF7', '\uFEF8'],   // لأ
  0x0625: ['\uFEF9', '\uFEFA'],   // لإ
  0x0627: ['\uFEFB', '\uFEFC'],   // لا
}

function isArCP(cp) {
  return (cp >= 0x0600 && cp <= 0x06FF) || (cp >= 0xFB50 && cp <= 0xFEFF)
}

function reshapeAndReverse(text) {
  if (!text || !/[\u0600-\u06FF]/.test(text)) return text
  const chars = [...text]
  const cps = chars.map(c => c.codePointAt(0))
  const reshaped = []
  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i]
    
    // ── Lam + Alef → mandatory ligature ────────────────────────
    if (cp === LAM && i + 1 < cps.length && LAM_ALEF[cps[i + 1]]) {
      const alefCp = cps[i + 1]
      const prevCp = i > 0 ? cps[i - 1] : null
      const hasPrev = prevCp !== null && isArCP(prevCp) &&
        !NO_LEFT.has(prevCp) && FORMS[prevCp]
      const pair = LAM_ALEF[alefCp]
      reshaped.push(hasPrev ? pair[1] : pair[0])
      i++
      continue
    }

    if (!isArCP(cp)) { reshaped.push(chars[i]); continue }
    const forms = FORMS[cp]
    if (!forms) { reshaped.push(chars[i]); continue }

    const prevCp = i > 0 ? cps[i - 1] : null
    const nextCp = i < cps.length - 1 ? cps[i + 1] : null

    // hasPrev: previous letter exists, is Arabic, connects on ITS left
    const hasPrev = prevCp !== null && isArCP(prevCp) &&
      !NO_LEFT.has(prevCp) && FORMS[prevCp]

    // hasNext: next letter exists, is Arabic, AND current letter connects left
    // (NO_LEFT letters never connect leftward so hasNext is always false for them)
    const hasNext = !NO_LEFT.has(cp) &&
      nextCp !== null && isArCP(nextCp) && FORMS[nextCp]

    let form
    if (hasPrev && hasNext) form = 3   // medial
    else if (hasPrev) form = 1   // final
    else if (hasNext) form = 2   // initial
    else form = 0   // isolated

    reshaped.push(forms[form])
  }

  // ── Split into alternating non-Arabic and Arabic sequences ───
  const logicalStr = reshaped.join('')
  const tokens = logicalStr.split(/([\u0600-\u06FF\uFB50-\uFEFF]+)/g)

  const outTokens = []
  for (let t of tokens) {
    if (!t) continue
    if (/^[\u0600-\u06FF\uFB50-\uFEFF]+$/.test(t)) {
      // Reverse Arabic words letter-by-letter
      outTokens.push([...t].reverse().join(''))
    } else {
      // Keep LTR order for numbers, English, spaces
      outTokens.push(t)
    }
  }

  // Reverse tokens array (RTL overall reading flow)
  return outTokens.reverse().join('')
}

// ─── Status colour ────────────────────────────────────────────────────────────
function statusRgb(status) {
  if (status === 'Confirmed') return hex2rgb(GREEN)
  if (status === 'Cancelled') return hex2rgb(RED)
  return hex2rgb(AMBER)
}

// ─── Column widths (LTR order: name, time, guests, status) ───────────────────
const COL_WIDTHS_DEF = [70, 30, 22, 60]

// ─── Export ───────────────────────────────────────────────────────────────────
export async function exportPDF(stats, items = [], tabLabel = '', customCols = null) {
  const t = i18n.t.bind(i18n)
  const lang = i18n.language || 'en'
  const isRTL = lang === 'ar'

  // 1. Create PDF + register embedded Amiri font
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const FONT = 'Amiri'

  doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_B64)
  doc.addFont('Amiri-Regular.ttf', FONT, 'normal', 'Identity-H')
  doc.setFont(FONT, 'normal')

  const fixText = (text) => {
    const s = String(text ?? '')
    return isRTL ? reshapeAndReverse(s) : s
  }

  const PW = 210
  const PAD = 14
  const COL_H = 8   // header row height mm

  const today = new Date().toLocaleDateString(lang, {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // 2. Title & date
  doc.setFont(FONT, 'normal')
  doc.setFontSize(18)
  doc.setTextColor(...hex2rgb(DARK))
  doc.text(
    fixText(tabLabel || t('dashboard_today')),
    isRTL ? PW - PAD : PAD, 18,
    { align: isRTL ? 'right' : 'left' }
  )

  doc.setFontSize(10)
  doc.setTextColor(...hex2rgb(LIGHT_BROWN))
  doc.text(
    fixText(today),
    isRTL ? PW - PAD : PAD, 25,
    { align: isRTL ? 'right' : 'left' }
  )

  doc.setDrawColor(...hex2rgb(LIGHT_BROWN))
  doc.setLineWidth(0.5)
  doc.line(PAD, 28, PW - PAD, 28)

  // 3. Dynamic Columns detection
  let labels = customCols
  let widths = COL_WIDTHS_DEF

  if (!labels) {
    const first = items[0] || {}
    if (first.number && first.capacity && first.location) {
      // It's a Table
      labels = [t('tables_module.header_table'), t('tables_module.header_capacity'), t('tables_module.header_location'), t('status')]
      widths = [60, 40, 52, 30]
    } else if (first.price !== undefined && first.duration) {
      // It's a Service
      labels = [t('services_module.name_header'), t('services_module.price_header'), t('services_module.capacity_header'), t('services_module.duration_header'), t('status')]
      widths = [65, 25, 25, 32, 35]
    } else if (first.date && first.reason !== undefined) {
      // It's a Blocked Date
      labels = [t('calendar.blocked_date'), t('calendar.block_reason')]
      widths = [80, PW - 2 * PAD - 80]
    } else {
      // Default (Reservations)
      labels = [t('name'), t('time'), t('guests'), t('status')]
      widths = [70, 30, 22, 60]
    }
  }

  const colLabels = labels.map(l => fixText(l))
  const colWidths = isRTL ? [...widths].reverse() : widths
  const colTexts  = isRTL ? [...colLabels].reverse() : colLabels

  // 4. Draw header row manually
  const headerY = 33
  doc.setFillColor(...hex2rgb(LIGHT_BROWN))
  doc.rect(PAD, headerY, PW - 2 * PAD, COL_H, 'F')

  doc.setFont(FONT, 'normal')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)

  let xCursor = PAD
  colWidths.forEach((w, i) => {
    const textX = isRTL ? xCursor + w - 2 : xCursor + 2
    doc.text(colTexts[i], textX, headerY + 5.5, {
      align: isRTL ? 'right' : 'left',
    })
    xCursor += w
  })

  // 5. Build body rows
  const rows = items.map(r => {
    const rawSt = r.status || (r.active ? 'Confirmed' : 'Pending')
    const stText = fixText(t(`status_${rawSt.toLowerCase()}`, { defaultValue: rawSt }))
    
    let vals = []
    if (labels.length === 5) {
      // Service
      vals = [fixText(r.name), fixText(r.price), fixText(r.capacity), fixText(r.duration), stText]
    } else if (labels.length === 2 && r.date) {
      // Blocked Date
      vals = [fixText(r.date), fixText(r.reason || r.notes || '-')]
    } else if (labels.length === 4 && r.number) {
      // Table
      vals = [fixText(r.number), fixText(r.capacity), fixText(r.location), stText]
    } else {
      // Res
      vals = [fixText(r.name || r.number || t('unknown')), fixText(r.start_time || r.capacity || ' '), fixText(r.guests || r.location || ' '), stText]
    }
    
    return isRTL ? vals.reverse() : vals
  })

  // 6. Table body
  autoTable(doc, {
    startY: headerY + COL_H,
    head: [colTexts],
    showHead: 'never',
    body: rows,
    theme: 'plain',
    margin: { left: PAD, right: PAD },

    columnStyles: Object.fromEntries(
      colWidths.map((w, i) => [i, { cellWidth: w }])
    ),

    styles: {
      font: FONT,
      fontSize: 9,
      cellPadding: 4,
      halign: isRTL ? 'right' : 'left',
      textColor: hex2rgb(DARK),
      lineWidth: 0,
    },

    didDrawCell(data) {
      if (data.section === 'body') {
        doc.setDrawColor(229, 224, 218)
        doc.setLineWidth(0.1)
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height)
      }
    },

    didParseCell(data) {
      if (data.section !== 'body') return
      const statusColIdx = isRTL ? 0 : labels.length - 1
      if (data.column.index !== statusColIdx) return
      const raw = items[data.row.index]?.status
      if (raw) data.cell.styles.textColor = statusRgb(raw)
    },
  })

  // 7. Page footer
  const total = doc.internal.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFont(FONT, 'normal')
    doc.setFontSize(7)
    doc.setTextColor(170, 165, 160)
    doc.text(`${p} / ${total}`, PW / 2, 290, { align: 'center' })
  }

  // 8. Download
  doc.save(`export_${new Date().toISOString().slice(0, 10)}.pdf`)
}
