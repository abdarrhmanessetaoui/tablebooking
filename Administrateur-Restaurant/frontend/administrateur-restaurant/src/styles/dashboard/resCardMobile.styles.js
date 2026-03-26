import { DARK, GOLD_DK, WHITE, CREAM, BORDER } from './tokens'

// ── Card wrapper ──────────────────────────────────────────────────
export const card = (hov, i) => ({
  padding:      '13px 14px',
  borderBottom: `1px solid ${BORDER}`,
  background:   hov ? '#f5ede0' : i % 2 === 0 ? WHITE : CREAM,
  cursor:       'pointer',
  transition:   'background 0.12s',
})

// ── Top row: name + badge + chevron ──────────────────────────────
export const topRow = {
  display:        'flex',
  alignItems:     'flex-start',
  justifyContent: 'space-between',
  gap:            10,
  marginBottom:   7,
}

export const nameBlock = {
  minWidth: 0,
}

export const nameTxt = {
  margin:       0,
  fontSize:     13,
  fontWeight:   900,
  color:        DARK,
  overflow:     'hidden',
  textOverflow: 'ellipsis',
  whiteSpace:   'nowrap',
}

export const phoneTxt = {
  margin:     '2px 0 0',
  fontSize:   11,
  fontWeight: 700,
  color:      DARK,
}

export const badgeRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        8,
  flexShrink: 0,
}

// ── Chips row ─────────────────────────────────────────────────────
export const chipsRow = {
  display:  'flex',
  flexWrap: 'wrap',
  gap:      6,
}

export const chip = (gold) => ({
  display:    'inline-flex',
  alignItems: 'center',
  gap:        5,
  padding:    '4px 9px',
  background: gold ? '#f5f0eb' : CREAM,
  fontSize:   11,
  fontWeight: 700,
  color:      gold ? GOLD_DK : DARK,
})