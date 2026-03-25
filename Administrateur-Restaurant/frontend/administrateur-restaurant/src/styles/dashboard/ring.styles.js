import { DARK, GOLD } from './tokens'

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
  fill:         'none',
  stroke:       '#f5f0eb',
  strokeWidth:  '8',
}

// ── Progress segment circle style ─────────────────────────────────
export const segment = (arc, circ, offset, color, index) => ({
  fill:              'none',
  stroke:            color,
  strokeWidth:       '8',
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
  display:       'block',
  fontSize:      '26px',
  fontWeight:    '900',
  color:         DARK,
  lineHeight:    '1',
  letterSpacing: '-1.5px',
}

export const centerLabel = {
  fontSize:      '10px',
  fontWeight:    '900',
  color:         DARK,
  textTransform: 'uppercase',
  marginTop:     '4px',
  opacity:       '0.6',
}