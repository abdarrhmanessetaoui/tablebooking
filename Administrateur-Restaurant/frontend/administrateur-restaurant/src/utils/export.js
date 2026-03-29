/* src/utils/export.js
 *
 * Arabic-safe PDF export.
 *
 * Root cause of garbled text: jsPDF built-in fonts (helvetica, courier…)
 * contain ZERO Arabic glyphs — every Arabic char becomes a garbage byte.
 * Fix: download Amiri TTF at runtime, embed it in jsPDF, use it everywhere.
 *
 * The function is now async — update callers:
 *   await exportPDF(stats, items, tabLabel)
 *
 * No new npm deps — only jspdf + jspdf-autotable (already installed).
 */

import { jsPDF }  from 'jspdf'
import autoTable  from 'jspdf-autotable'
import i18n       from '../i18n'

// ─── Theme ────────────────────────────────────────────────────────────────────
const DARK  = '#423428'
const GOLD  = '#c8a97e'
const GREEN = '#16A34A'
const RED   = '#DC2626'
const AMBER = '#D97706'

function hex2rgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

// ─── Amiri font — fetched once, cached forever in memory ─────────────────────
const FONT_URL  = 'https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.ttf'
let   _fontB64  = null

async function loadAmiri() {
  if (_fontB64) return _fontB64
  const res    = await fetch(FONT_URL)
  const buffer = await res.arrayBuffer()
  const bytes  = new Uint8Array(buffer)
  let   bin    = ''
  // Build binary string in chunks to avoid call-stack overflow on large arrays
  const CHUNK  = 8192
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  _fontB64 = btoa(bin)
  return _fontB64
}

// ─── Arabic reshaper ──────────────────────────────────────────────────────────
// jsPDF is a pure LTR engine. To render Arabic correctly we must:
//   1. Replace every letter with its contextual glyph form
//      (isolated / initial / medial / final)
//   2. Reverse the whole string so LTR paint order = correct RTL reading order
//
// This table covers the complete Arabic block used in Moroccan names / labels.
const FORMS = {
  0x0621:['\u0621','\u0621','\u0621','\u0621'],   // ء
  0x0622:['\u0622','\uFE82','\u0622','\uFE82'],   // آ
  0x0623:['\u0623','\uFE84','\u0623','\uFE84'],   // أ
  0x0624:['\u0624','\uFE86','\u0624','\uFE86'],   // ؤ
  0x0625:['\u0625','\uFE88','\u0625','\uFE88'],   // إ
  0x0626:['\u0626','\uFE8A','\uFE8B','\uFE8C'],   // ئ
  0x0627:['\u0627','\uFE8E','\u0627','\uFE8E'],   // ا
  0x0628:['\u0628','\uFE90','\uFE91','\uFE92'],   // ب
  0x0629:['\u0629','\uFE94','\u0629','\uFE94'],   // ة
  0x062A:['\u062A','\uFE96','\uFE97','\uFE98'],   // ت
  0x062B:['\u062B','\uFE9A','\uFE9B','\uFE9C'],   // ث
  0x062C:['\u062C','\uFE9E','\uFE9F','\uFEA0'],   // ج
  0x062D:['\u062D','\uFEA2','\uFEA3','\uFEA4'],   // ح
  0x062E:['\u062E','\uFEA6','\uFEA7','\uFEA8'],   // خ
  0x062F:['\u062F','\uFEAA','\u062F','\uFEAA'],   // د
  0x0630:['\u0630','\uFEAC','\u0630','\uFEAC'],   // ذ
  0x0631:['\u0631','\uFEAE','\u0631','\uFEAE'],   // ر
  0x0632:['\u0632','\uFEB0','\u0632','\uFEB0'],   // ز
  0x0633:['\u0633','\uFEB2','\uFEB3','\uFEB4'],   // س
  0x0634:['\u0634','\uFEB6','\uFEB7','\uFEB8'],   // ش
  0x0635:['\u0635','\uFEBA','\uFEBB','\uFEBC'],   // ص
  0x0636:['\u0636','\uFEBE','\uFEBF','\uFEC0'],   // ض
  0x0637:['\u0637','\uFEC2','\uFEC3','\uFEC4'],   // ط
  0x0638:['\u0638','\uFEC6','\uFEC7','\uFEC8'],   // ظ
  0x0639:['\u0639','\uFECA','\uFECB','\uFECC'],   // ع
  0x063A:['\u063A','\uFECE','\uFECF','\uFED0'],   // غ
  0x0641:['\u0641','\uFED2','\uFED3','\uFED4'],   // ف
  0x0642:['\u0642','\uFED6','\uFED7','\uFED8'],   // ق
  0x0643:['\u0643','\uFEDA','\uFEDB','\uFEDC'],   // ك
  0x0644:['\u0644','\uFEDE','\uFEDF','\uFEE0'],   // ل
  0x0645:['\u0645','\uFEE2','\uFEE3','\uFEE4'],   // م
  0x0646:['\u0646','\uFEE6','\uFEE7','\uFEE8'],   // ن
  0x0647:['\u0647','\uFEEA','\uFEEB','\uFEEC'],   // ه
  0x0648:['\u0648','\uFEEE','\u0648','\uFEEE'],   // و
  0x0649:['\u0649','\uFEF0','\u0649','\uFEF0'],   // ى
  0x064A:['\u064A','\uFEF2','\uFEF3','\uFEF4'],   // ي
}

// These letters never connect on their LEFT side (right-join only)
const NO_LEFT = new Set([
  0x0621,0x0622,0x0623,0x0624,0x0625,
  0x0627,0x062F,0x0630,0x0631,0x0632,0x0648,0x0649,
])

function isArCP(cp) {
  return (cp >= 0x0600 && cp <= 0x06FF) || (cp >= 0xFB50 && cp <= 0xFEFF)
}

function reshapeAndReverse(text) {
  if (!text || !/[\u0600-\u06FF]/.test(text)) return text

  const chars = [...text]
  const cps   = chars.map(c => c.codePointAt(0))
  const out   = []

  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i]
    if (!isArCP(cp))         { out.push(chars[i]); continue }
    const forms = FORMS[cp]
    if (!forms)              { out.push(chars[i]); continue }

    const prevCp  = i > 0             ? cps[i - 1] : null
    const nextCp  = i < cps.length-1 ? cps[i + 1] : null
    const hasPrev = prevCp !== null && isArCP(prevCp) && !NO_LEFT.has(prevCp) && FORMS[prevCp]
    const hasNext = nextCp !== null && isArCP(nextCp) && FORMS[nextCp]

    let form
    if (hasPrev && hasNext) form = 3   // medial
    else if (hasPrev)       form = 1   // final
    else if (hasNext)       form = 2   // initial
    else                    form = 0   // isolated

    out.push(forms[form])
  }

  return out.reverse().join('')
}

function fix(text, isRTL) {
  const s = String(text ?? '')
  return isRTL ? reshapeAndReverse(s) : s
}

// ─── Status colour ────────────────────────────────────────────────────────────
function statusRgb(status) {
  if (status === 'Confirmed') return hex2rgb(GREEN)
  if (status === 'Cancelled') return hex2rgb(RED)
  return hex2rgb(AMBER)
}

// ─── Export ───────────────────────────────────────────────────────────────────
// Old signature kept: exportPDF(stats, items, tabLabel)
// Now async — callers must await it.
export async function exportPDF(stats, items = [], tabLabel = '') {
  const t     = i18n.t.bind(i18n)
  const lang  = i18n.language || 'en'
  const isRTL = lang === 'ar'

  // 1. Load Amiri font (fast after first call — memory cached)
  let fontB64 = null
  try {
    fontB64 = await loadAmiri()
  } catch (err) {
    console.warn('[exportPDF] Amiri font failed to load:', err)
  }

  // 2. Create PDF + register font
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const FONT = 'Amiri'

  if (fontB64) {
    doc.addFileToVFS('Amiri-Regular.ttf', fontB64)
    doc.addFont('Amiri-Regular.ttf', FONT, 'normal')
    doc.setFont(FONT, 'normal')
  }

  const PW  = 210
  const PAD = 14

  const today = new Date().toLocaleDateString(lang, {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // 3. Title & date
  doc.setFont(FONT, 'normal')
  doc.setFontSize(16)
  doc.setTextColor(...hex2rgb(DARK))
  doc.text(
    fix(tabLabel || t('dashboard_today'), isRTL),
    isRTL ? PW - PAD : PAD, 18,
    { align: isRTL ? 'right' : 'left' }
  )

  doc.setFontSize(9)
  doc.setTextColor(...hex2rgb(GOLD))
  doc.text(
    fix(today, isRTL),
    isRTL ? PW - PAD : PAD, 25,
    { align: isRTL ? 'right' : 'left' }
  )

  doc.setDrawColor(...hex2rgb(GOLD))
  doc.setLineWidth(0.4)
  doc.line(PAD, 28, PW - PAD, 28)

  // 4. Build columns + rows
  const colName   = fix(t('name'),   isRTL)
  const colTime   = fix(t('time'),   isRTL)
  const colGuests = fix(t('guests'), isRTL)
  const colStatus = fix(t('status'), isRTL)

  const columns = isRTL
    ? [colStatus, colGuests, colTime, colName]
    : [colName,   colTime,   colGuests, colStatus]

  const rows = items.map(r => {
    const rawSt  = r.status || (r.active ? 'Confirmed' : 'Pending')
    const name   = fix(r.name || r.number || t('unknown'), isRTL)
    const time   = fix(r.start_time || r.capacity || '—',  isRTL)
    const guests = fix(r.guests     || r.location  || '—', isRTL)
    const status = fix(
      isRTL ? t(`status_${rawSt.toLowerCase()}`, { defaultValue: rawSt }) : rawSt,
      isRTL
    )
    return isRTL
      ? [status, guests, time, name]
      : [name,   time,   guests, status]
  })

  // 5. Table
  autoTable(doc, {
    startY:  33,
    head:    [columns],
    body:    rows,
    theme:   'grid',
    margin:  { left: PAD, right: PAD },

    styles: {
      font:        FONT,
      fontSize:    9,
      cellPadding: 4,
      halign:      isRTL ? 'right' : 'left',
      textColor:   hex2rgb(DARK),
      lineColor:   [220, 215, 210],
      lineWidth:   0.25,
    },

    headStyles: {
      fillColor: hex2rgb(DARK),
      textColor: hex2rgb(GOLD),
      fontSize:  9,
    },

    alternateRowStyles: {
      fillColor: [252, 250, 247],
    },

    didParseCell(data) {
      if (data.section !== 'body') return
      const statusColIdx = isRTL ? 0 : 3
      if (data.column.index !== statusColIdx) return
      const raw = items[data.row.index]?.status
      if (raw) {
        data.cell.styles.textColor = statusRgb(raw)
      }
    },
  })

  // 6. Page footer
  const total = doc.internal.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFont(FONT, 'normal')
    doc.setFontSize(7)
    doc.setTextColor(170, 165, 160)
    doc.text(`${p} / ${total}`, PW / 2, 290, { align: 'center' })
  }

  // 7. Download
  doc.save(`export_${new Date().toISOString().slice(0, 10)}.pdf`)
}