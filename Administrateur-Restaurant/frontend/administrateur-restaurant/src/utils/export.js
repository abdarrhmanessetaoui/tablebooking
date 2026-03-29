/* src/utils/export.js
 *
 * Simple PDF export — clean table, no decorative header.
 * Arabic fix: uses bidi-js + arabic-reshaper-js to reshape
 * Arabic glyphs before passing them to jsPDF/autoTable.
 *
 * npm install jspdf jspdf-autotable bidi-js
 * (arabic-reshaper is bundled inline below — no extra dep)
 */

import { jsPDF }   from 'jspdf'
import autoTable   from 'jspdf-autotable'
import i18n        from '../i18n'

// ─── Colours ──────────────────────────────────────────────────────────────────
const DARK  = '#423428'
const GOLD  = '#c8a97e'
const GREEN = '#16A34A'
const RED   = '#DC2626'
const AMBER = '#D97706'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hex2rgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

// Very small Arabic letter-joining table so we don't need an extra package.
// Maps Unicode code-point → [isolated, final, initial, medial]
// Only the most common letters needed for restaurant/booking text.
const AR_FORMS = {
  0x0627: ['\u0627', '\uFE8E', '\u0627', '\uFE8E'], // ا
  0x0628: ['\u0628', '\uFE90', '\uFE91', '\uFE92'], // ب
  0x0629: ['\u0629', '\uFE94', '\u0629', '\uFE94'], // ة
  0x062A: ['\u062A', '\uFE96', '\uFE97', '\uFE98'], // ت
  0x062B: ['\u062B', '\uFE9A', '\uFE9B', '\uFE9C'], // ث
  0x062C: ['\u062C', '\uFE9E', '\uFE9F', '\uFEA0'], // ج
  0x062D: ['\u062D', '\uFEA2', '\uFEA3', '\uFEA4'], // ح
  0x062E: ['\u062E', '\uFEA6', '\uFEA7', '\uFEA8'], // خ
  0x062F: ['\u062F', '\uFEAA', '\u062F', '\uFEAA'], // د
  0x0630: ['\u0630', '\uFEAC', '\u0630', '\uFEAC'], // ذ
  0x0631: ['\u0631', '\uFEAE', '\u0631', '\uFEAE'], // ر
  0x0632: ['\u0632', '\uFEB0', '\u0632', '\uFEB0'], // ز
  0x0633: ['\u0633', '\uFEB2', '\uFEB3', '\uFEB4'], // س
  0x0634: ['\u0634', '\uFEB6', '\uFEB7', '\uFEB8'], // ش
  0x0635: ['\u0635', '\uFEBA', '\uFEBB', '\uFEBC'], // ص
  0x0636: ['\u0636', '\uFEBE', '\uFEBF', '\uFEC0'], // ض
  0x0637: ['\u0637', '\uFEC2', '\uFEC3', '\uFEC4'], // ط
  0x0638: ['\u0638', '\uFEC6', '\uFEC7', '\uFEC8'], // ظ
  0x0639: ['\u0639', '\uFECA', '\uFECB', '\uFECC'], // ع
  0x063A: ['\u063A', '\uFECE', '\uFECF', '\uFED0'], // غ
  0x0641: ['\u0641', '\uFED2', '\uFED3', '\uFED4'], // ف
  0x0642: ['\u0642', '\uFED6', '\uFED7', '\uFED8'], // ق
  0x0643: ['\u0643', '\uFEDA', '\uFEDB', '\uFEDC'], // ك
  0x0644: ['\u0644', '\uFEDE', '\uFEDF', '\uFEE0'], // ل
  0x0645: ['\u0645', '\uFEE2', '\uFEE3', '\uFEE4'], // م
  0x0646: ['\u0646', '\uFEE6', '\uFEE7', '\uFEE8'], // ن
  0x0647: ['\u0647', '\uFEEA', '\uFEEB', '\uFEEC'], // ه
  0x0648: ['\u0648', '\uFEEE', '\u0648', '\uFEEE'], // و
  0x064A: ['\u064A', '\uFEF2', '\uFEF3', '\uFEF4'], // ي
  0x0649: ['\u0649', '\uFEF0', '\u0649', '\uFEF0'], // ى
  // LAM-ALEF ligatures (required)
  0xFEFB:      ['\uFEFB', '\uFEFC', '\uFEFB', '\uFEFC'], // lam-alef ligature
}

// Non-joining (right-joining only) characters
const NON_JOINING = new Set([
  0x0627,0x062F,0x0630,0x0631,0x0632,0x0648,0x0649,0x0621,
  0x0623,0x0625,0x0622,0x0624,0x0626,
])

function isArabicChar(cp) {
  return (cp >= 0x0600 && cp <= 0x06FF) || (cp >= 0xFB50 && cp <= 0xFEFF)
}

/**
 * Reshape + reverse an Arabic string so jsPDF (LTR engine) renders it correctly.
 * Works without external packages.
 */
function reshapeArabic(text) {
  if (!text || !/[\u0600-\u06FF]/.test(text)) return text

  const chars = [...text]
  const cps   = chars.map(c => c.codePointAt(0))
  const out   = []

  for (let i = 0; i < cps.length; i++) {
    const cp   = cps[i]
    const prev = i > 0             ? cps[i - 1] : null
    const next = i < cps.length-1 ? cps[i + 1] : null

    if (!isArabicChar(cp)) { out.push(chars[i]); continue }

    const forms = AR_FORMS[cp]
    if (!forms) { out.push(chars[i]); continue }

    const hasPrev = prev !== null && isArabicChar(prev) && !NON_JOINING.has(prev) && AR_FORMS[prev]
    const hasNext = next !== null && isArabicChar(next) && AR_FORMS[next]

    let form
    if (hasPrev && hasNext) form = 3      // medial
    else if (hasPrev)       form = 1      // final
    else if (hasNext)       form = 2      // initial
    else                    form = 0      // isolated

    out.push(forms[form])
  }

  // Reverse the array so LTR jsPDF renders RTL correctly
  return out.reverse().join('')
}

function safeText(text, isRTL) {
  const s = String(text ?? '')
  return isRTL ? reshapeArabic(s) : s
}

// ─── Status colours ───────────────────────────────────────────────────────────
function statusColor(status) {
  if (status === 'Confirmed') return hex2rgb(GREEN)
  if (status === 'Cancelled') return hex2rgb(RED)
  return hex2rgb(AMBER)
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function exportPDF(stats, items = [], tabLabel = '') {
  const t     = i18n.t.bind(i18n)  // always a function, never broken by caller
  const lang  = i18n.language || 'en'
  const isRTL = lang === 'ar'

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const PW  = 210
  const PAD = 14

  const today = new Date().toLocaleDateString(lang, {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // ── Title block ────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...hex2rgb(DARK))

  const title = safeText(tabLabel || t('dashboard_today'), isRTL)
  doc.text(title, isRTL ? PW - PAD : PAD, 18, { align: isRTL ? 'right' : 'left' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...hex2rgb(GOLD))
  const dateStr = safeText(today, isRTL)
  doc.text(dateStr, isRTL ? PW - PAD : PAD, 24, { align: isRTL ? 'right' : 'left' })

  // thin gold rule
  doc.setDrawColor(...hex2rgb(GOLD))
  doc.setLineWidth(0.5)
  doc.line(PAD, 27, PW - PAD, 27)

  // ── Table columns & rows ───────────────────────────────────────────────────
  const colName    = safeText(t('name'),   isRTL)
  const colTime    = safeText(t('time'),   isRTL)
  const colGuests  = safeText(t('guests'), isRTL)
  const colStatus  = safeText(t('status'), isRTL)

  const columns = isRTL
    ? [colStatus, colGuests, colTime, colName]   // reversed for RTL
    : [colName,   colTime,   colGuests, colStatus]

  const rows = items.map(r => {
    const name   = safeText(r.name   || r.number || t('unknown'), isRTL)
    const time   = safeText(r.start_time || r.capacity || '—', isRTL)
    const guests = safeText(r.guests || r.location    || '—', isRTL)
    const status = safeText(
      isRTL
        ? t('status_' + (r.status || 'pending').toLowerCase(), { defaultValue: r.status || '—' })
        : (r.status || (r.active ? t('tables_module.active') : t('status_pending'))),
      isRTL
    )

    return isRTL
      ? [status, guests, time, name]
      : [name,   time,   guests, status]
  })

  autoTable(doc, {
    startY:      32,
    head:        [columns],
    body:        rows,
    theme:       'grid',
    tableWidth:  'auto',
    margin:      { left: PAD, right: PAD },

    styles: {
      font:      'helvetica',
      fontSize:  9,
      cellPadding: 4,
      halign:    isRTL ? 'right' : 'left',
      textColor: hex2rgb(DARK),
      lineColor: [210, 210, 210],
      lineWidth: 0.3,
    },

    headStyles: {
      fillColor:  hex2rgb(DARK),
      textColor:  hex2rgb(GOLD),
      fontStyle:  'bold',
      fontSize:   9,
    },

    alternateRowStyles: {
      fillColor: [250, 248, 245],
    },

    // Color the status cell
    didParseCell(data) {
      if (data.section !== 'body') return
      // status is last col in LTR, first col in RTL
      const statusColIdx = isRTL ? 0 : 3
      if (data.column.index !== statusColIdx) return
      const rawStatus = items[data.row.index]?.status
      if (rawStatus) {
        data.cell.styles.textColor = statusColor(rawStatus)
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  // ── Footer: page count + date ──────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(160, 160, 160)
    doc.text(
      `${p} / ${totalPages}`,
      PW / 2, 290,
      { align: 'center' }
    )
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10)
  doc.save(`export_${date}.pdf`)
}