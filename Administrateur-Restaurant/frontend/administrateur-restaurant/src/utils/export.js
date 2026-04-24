/* src/utils/export.js
 *
 * Arabic-safe PDF export — font embedded, correct reshaping with lam-alef.
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

// ─── Theme ────────────────────────────────────────────────────────────────────
const DARK = '#423428'
const GOLD = '#c8a97e'
const GREEN = '#16A34A'
const RED = '#DC2626'
const AMBER = '#D97706'

function hex2rgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

// ─── Arabic reshaper ──────────────────────────────────────────────────────────
const FORMS = {
  0x0621: ['\u0621', '\u0621', '\u0621', '\u0621'],
  0x0622: ['\u0622', '\uFE82', '\u0622', '\uFE82'],
  0x0623: ['\u0623', '\uFE84', '\u0623', '\uFE84'],
  0x0624: ['\u0624', '\uFE86', '\u0624', '\uFE86'],
  0x0625: ['\u0625', '\uFE88', '\u0625', '\uFE88'],
  0x0626: ['\u0626', '\uFE8A', '\uFE8B', '\uFE8C'],
  0x0627: ['\u0627', '\uFE8E', '\u0627', '\uFE8E'],
  0x0628: ['\u0628', '\uFE90', '\uFE91', '\uFE92'],
  0x0629: ['\u0629', '\uFE94', '\u0629', '\uFE94'],
  0x062A: ['\u062A', '\uFE96', '\uFE97', '\uFE98'],
  0x062B: ['\u062B', '\uFE9A', '\uFE9B', '\uFE9C'],
  0x062C: ['\u062C', '\uFE9E', '\uFE9F', '\uFEA0'],
  0x062D: ['\u062D', '\uFEA2', '\uFEA3', '\uFEA4'],
  0x062E: ['\u062E', '\uFEA6', '\uFEA7', '\uFEA8'],
  0x062F: ['\u062F', '\uFEAA', '\u062F', '\uFEAA'],
  0x0630: ['\u0630', '\uFEAC', '\u0630', '\uFEAC'],
  0x0631: ['\u0631', '\uFEAE', '\u0631', '\uFEAE'],
  0x0632: ['\u0632', '\uFEB0', '\u0632', '\uFEB0'],
  0x0633: ['\u0633', '\uFEB2', '\uFEB3', '\uFEB4'],
  0x0634: ['\u0634', '\uFEB6', '\uFEB7', '\uFEB8'],
  0x0635: ['\u0635', '\uFEBA', '\uFEBB', '\uFEBC'],
  0x0636: ['\u0636', '\uFEBE', '\uFEBF', '\uFEC0'],
  0x0637: ['\u0637', '\uFEC2', '\uFEC3', '\uFEC4'],
  0x0638: ['\u0638', '\uFEC6', '\uFEC7', '\uFEC8'],
  0x0639: ['\u0639', '\uFECA', '\uFECB', '\uFECC'],
  0x063A: ['\u063A', '\uFECE', '\uFECF', '\uFED0'],
  0x0641: ['\u0641', '\uFED2', '\uFED3', '\uFED4'],
  0x0642: ['\u0642', '\uFED6', '\uFED7', '\uFED8'],
  0x0643: ['\u0643', '\uFEDA', '\uFEDB', '\uFEDC'],
  0x0644: ['\u0644', '\uFEDE', '\uFEDF', '\uFEE0'],
  0x0645: ['\u0645', '\uFEE2', '\uFEE3', '\uFEE4'],
  0x0646: ['\u0646', '\uFEE6', '\uFEE7', '\uFEE8'],
  0x0647: ['\u0647', '\uFEEA', '\uFEEB', '\uFEEC'],
  0x0648: ['\u0648', '\uFEEE', '\u0648', '\uFEEE'],
  0x0649: ['\u0649', '\uFEF0', '\u0649', '\uFEF0'],
  0x064A: ['\u064A', '\uFEF2', '\uFEF3', '\uFEF4'],
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
// Must sum to PW - 2*PAD = 210 - 28 = 182 mm
const COL_WIDTHS_LTR = [70, 30, 22, 60]

// ─── Export ───────────────────────────────────────────────────────────────────
export async function exportPDF(stats, items = [], tabLabel = '') {
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
  doc.setFontSize(16)
  doc.setTextColor(...hex2rgb(DARK))
  doc.text(
    fixText(tabLabel || t('dashboard_today')),
    isRTL ? PW - PAD : PAD, 18,
    { align: isRTL ? 'right' : 'left' }
  )

  doc.setFontSize(9)
  doc.setTextColor(...hex2rgb(GOLD))
  doc.text(
    fixText(today),
    isRTL ? PW - PAD : PAD, 25,
    { align: isRTL ? 'right' : 'left' }
  )

  doc.setDrawColor(...hex2rgb(GOLD))
  doc.setLineWidth(0.4)
  doc.line(PAD, 28, PW - PAD, 28)

  // 3. Column setup (reverse order for RTL)
  const colLabels = [
    fixText(t('name')),
    fixText(t('time')),
    fixText(t('guests')),
    fixText(t('status')),
  ]
  const colWidths = isRTL ? [...COL_WIDTHS_LTR].reverse() : COL_WIDTHS_LTR
  const colTexts = isRTL ? [...colLabels].reverse() : colLabels

  // 4. Draw header row manually
  //    (autoTable headStyles does NOT apply Identity-H → garbled Arabic)
  const headerY = 33
  doc.setFillColor(...hex2rgb(DARK))
  doc.rect(PAD, headerY, PW - 2 * PAD, COL_H, 'F')

  doc.setFont(FONT, 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...hex2rgb(GOLD))

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
    const name = fixText(r.name || r.number || t('unknown'))
    const time = fixText(r.start_time || r.capacity || '—')
    const guests = fixText(r.guests || r.location || '—')
    const status = fixText(
      isRTL
        ? t(`status_${rawSt.toLowerCase()}`, { defaultValue: rawSt })
        : rawSt
    )
    return isRTL
      ? [status, guests, time, name]
      : [name, time, guests, status]
  })

  // 6. Table body — showHead:'never' because headers drawn manually above
  autoTable(doc, {
    startY: headerY + COL_H,
    head: [colTexts],
    showHead: 'never',
    body: rows,
    theme: 'grid',
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
      lineColor: [220, 215, 210],
      lineWidth: 0.25,
    },

    alternateRowStyles: {
      fillColor: [252, 250, 247],
    },

    didParseCell(data) {
      if (data.section !== 'body') return
      const statusColIdx = isRTL ? 0 : 3
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