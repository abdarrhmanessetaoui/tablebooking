import { DARK, LIGHT_BROWN_DK, BORDER } from './tokens'

// ── SVG ring wrapper ──────────────────────────────────────────────
export const ringWrapper = (size) => ({
  position:  'relative',
  width:     size,
  height:    size,
  flexShrink: 0,
})

export const svg = (size) => ({
  transform: 'rotate(-90deg)',
  width:     size,
  height:    size,
})

// ── Background track circle ───────────────────────────────────────
export const trackCircle = {
  fill:        'none',
  stroke:      '#F0EBE5',
  strokeWidth: '7',
}

// ── Animated segment ──────────────────────────────────────────────
export const segment = (arc, circ, offset, color, index) => ({
  fill:              'none',
  stroke:            color,
  strokeWidth:       '7',
  strokeLinecap:     'round',
  strokeDasharray:   `${arc} ${circ}`,
  strokeDashoffset:  -offset,
  transition:        `stroke-dasharray 0.9s ease ${index * 0.12}s`,
})

// ── Center label overlay ──────────────────────────────────────────
export const centerOverlay = {
  position:       'absolute',
  inset:          0,
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  justifyContent: 'center',
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
