import { GREEN, RED, AMBER } from './tokens'

// ── Status color map ──────────────────────────────────────────────
export const STATUS_MAP = {
  Confirmed: { label: 'Confirmée',  color: GREEN },
  Pending:   { label: 'En attente', color: AMBER },
  Cancelled: { label: 'Annulée',    color: RED   },
}

// ── Badge wrapper ─────────────────────────────────────────────────
export const badge = (color) => ({
  display:       'inline-flex',
  alignItems:    'center',
  gap:           5,
  fontSize:      10,
  fontWeight:    900,
  color:         color,
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
  boxShadow:    `0 0 0 2px ${color}22`,
})
