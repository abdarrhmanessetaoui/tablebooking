import { GREEN, RED, AMBER, WHITE, RADIUS } from './tokens'

// ── Status color map ──────────────────────────────────────────────
export const STATUS_MAP = {
  Confirmed: { color: WHITE, bg: GREEN },
  Pending:   { color: WHITE, bg: AMBER },
  Cancelled: { color: WHITE, bg: RED },
}

// ── Badge wrapper ─────────────────────────────────────────────────
export const badge = (color, bg) => ({
  display:       'inline-flex',
  alignItems:    'center',
  padding:       '4px 10px',
  borderRadius:  RADIUS.sm,
  fontSize:      11,
  fontWeight:    800,
  color:         color,
  background:    bg,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace:    'nowrap',
})

// ── Dot ───────────────────────────────────────────────────────────
export const dot = (color) => ({
  width:        6,
  height:       6,
  borderRadius: '50%',
  background:   color,
  flexShrink:   0,
})
