import { DARK, GOLD_DK, BORDER } from './tokens'

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
  stroke:      BORDER,
  strokeWidth: '8',
}

// ── Animated segment ──────────────────────────────────────────────
export const segment = (arc, circ, offset, color, index) => ({
  fill:              'none',
  stroke:            color,
  strokeWidth:       '8',
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
  fontSize:           16,
  fontWeight:         900,
  color:              DARK,
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const centerLabel = {
  fontSize:      7,
  fontWeight:    900,
  color:         GOLD_DK,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginTop:     2,
}