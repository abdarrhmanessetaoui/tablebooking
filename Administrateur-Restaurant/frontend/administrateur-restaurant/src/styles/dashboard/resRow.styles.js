import { DARK, GOLD_DK, WHITE, CREAM, BORDER } from './tokens'

// ── Row wrapper ───────────────────────────────────────────────────
export const row = (hov, i) => ({
  display:         'grid',
  gap:             10,
  padding:         '13px 16px',
  background:      hov ? '#f5ede0' : i % 2 === 0 ? WHITE : CREAM,
  borderBottom:    `1px solid ${BORDER}`,
  alignItems:      'center',
  cursor:          'pointer',
  transition:      'background 0.12s',
})

// ── Name cell ─────────────────────────────────────────────────────
export const nameWrapper = {
  minWidth: 0,
}

export const nameInner = {
  display:    'flex',
  alignItems: 'center',
  gap:        5,
  overflow:   'hidden',
}

export const nameTxt = {
  margin:        0,
  fontSize:      13,
  fontWeight:    900,
  color:         DARK,
  overflow:      'hidden',
  textOverflow:  'ellipsis',
  whiteSpace:    'nowrap',
}

export const phoneTxt = {
  margin:        '2px 0 0',
  fontSize:      10,
  fontWeight:    700,
  color:         DARK,
  overflow:      'hidden',
  textOverflow:  'ellipsis',
  whiteSpace:    'nowrap',
}

// ── Date cell ─────────────────────────────────────────────────────
export const dateTxt = {
  fontSize:   11,
  fontWeight: 900,
  color:      GOLD_DK,
  whiteSpace: 'nowrap',
}

// ── Time chip ─────────────────────────────────────────────────────
export const timeChip = {
  display:            'inline-flex',
  alignItems:         'center',
  gap:                5,
  padding:            '4px 9px',
  background:         '#f5f0eb',
  fontSize:           11,
  fontWeight:         700,
  color:              GOLD_DK,
  whiteSpace:         'nowrap',
  fontVariantNumeric: 'tabular-nums',
}

// ── Guests cell ───────────────────────────────────────────────────
export const guestsTxt = {
  display:    'flex',
  alignItems: 'center',
  gap:        4,
  fontSize:   13,
  fontWeight: 900,
  color:      DARK,
}

// ── Service chip ──────────────────────────────────────────────────
export const serviceChip = {
  display:    'inline-flex',
  alignItems: 'center',
  gap:        5,
  padding:    '4px 9px',
  background: '#f5f0eb',
  fontSize:   11,
  fontWeight: 700,
  color:      GOLD_DK,
  whiteSpace: 'nowrap',
  overflow:   'hidden',
}

export const serviceText = {
  overflow:     'hidden',
  textOverflow: 'ellipsis',
}

// ── Chevron ───────────────────────────────────────────────────────
export const chevron = (hov) => ({
  transition:  'color 0.12s',
  justifySelf: 'end',
  color:       hov ? GOLD_DK : 'transparent',
})
