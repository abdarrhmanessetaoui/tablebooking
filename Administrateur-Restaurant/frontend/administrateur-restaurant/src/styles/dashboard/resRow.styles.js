import { DARK, DARK_LIGHT, WHITE, BORDER } from './tokens'

// ── Row wrapper ───────────────────────────────────────────────────
export const row = (i) => ({
  display:         'grid',
  gap:             10,
  padding:         '12px 20px',
  background:      WHITE,
  borderBottom:    `1px solid ${BORDER}`,
  alignItems:      'center',
  cursor:          'pointer',
  transition:      'none',
})

// ── Name cell ─────────────────────────────────────────────────────
export const nameWrapper = {
  minWidth: 0,
}

export const nameTxt = {
  margin:        0,
  fontSize:      14,
  fontWeight:    800,
  color:         DARK,
  overflow:      'hidden',
  textOverflow:  'ellipsis',
  whiteSpace:    'nowrap',
}

export const phoneTxt = {
  margin:        '2px 0 0',
  fontSize:      11,
  fontWeight:    600,
  color:         DARK_LIGHT,
  overflow:      'hidden',
  textOverflow:  'ellipsis',
  whiteSpace:    'nowrap',
}

// ── Date cell ─────────────────────────────────────────────────────
export const dateTxt = {
  fontSize:   12,
  fontWeight: 800,
  color:      DARK,
  whiteSpace: 'nowrap',
}

// ── Time chip ─────────────────────────────────────────────────────
export const timeChip = {
  fontSize:           14,
  fontWeight:         800,
  color:              DARK,
  whiteSpace:         'nowrap',
  fontVariantNumeric: 'tabular-nums',
  textTransform:      'uppercase'
}

// ── Guests cell ───────────────────────────────────────────────────
export const guestsTxt = {
  fontSize:   14,
  fontWeight: 800,
  color:      DARK,
}

// ── Service chip ──────────────────────────────────────────────────
export const serviceChip = {
  fontSize:     13,
  fontWeight:   600,
  color:        DARK_LIGHT,
}

export const serviceText = {
  lineHeight:   1.2,
}
