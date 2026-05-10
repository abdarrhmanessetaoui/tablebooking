import { DARK, LIGHT_BROWN_DK, BORDER } from './tokens'

// ── Wrapper (size-based flex container) ───────────────────────────
export const ringWrapper = (size) => ({
  position: 'relative',
  width:    size,
  height:   size,
  display:  'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

// ── SVG props ─────────────────────────────────────────────────────
export const svg = (size) => ({
  transform: 'rotate(-90deg)',
  display:   'block',
})

// ── Background track circle ───────────────────────────────────────
export const trackCircle = {
  fill:        'none',
  stroke:      '#F0EBE5',
  strokeWidth: '7',
}

// ── Progress segment circle style ─────────────────────────────────
export const segment = (arc, circ, offset, color, index) => ({
  fill:              'none',
  stroke:            color,
  strokeWidth:       '7',
  strokeLinecap:     'round',
  strokeDasharray:   `${arc} ${circ}`,
  strokeDashoffset:  -offset,
  // NO TRANSITION — strictly static
})

// ── Center label overlay (absolute centered) ──────────────────────
export const centerOverlay = {
  position: 'absolute',
  top:      '50%',
  left:     '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  display:   'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'none',
}

export const centerPct = {
  fontSize:           17,
  fontWeight:         700,
  color:              DARK,
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
  fontFamily:         "'Poppins','Inter',system-ui,sans-serif",
}

export const centerLabel = {
  fontSize:      8,
  fontWeight:    600,
  color:         '#000000',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginTop:     3,
}
