import { GREEN, RED, AMBER, DARK } from './tokens'

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
  padding:       '4px 12px',
  background:    color,
  fontSize:      10,
  fontWeight:    900,
  color:         DARK,
  letterSpacing: '0.04em',
  whiteSpace:    'nowrap',
})
