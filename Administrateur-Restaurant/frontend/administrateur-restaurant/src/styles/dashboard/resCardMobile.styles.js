import { DARK, BORDER, LIGHT_BROWN_DK, BG_CARD, BG_HOVER } from './tokens'

// ── Card wrapper ──────────────────────────────────────────────────
export const card = (hov, i) => ({
  padding:      '16px 20px',
  background:   hov ? BG_HOVER : BG_CARD,
  borderBottom: `1px solid ${BORDER}`,
  cursor:       'pointer',
  transition:   'background 0.15s ease',
})

// ── Top row ───────────────────────────────────────────────────────
export const topRow = {
  display:        'flex',
  alignItems:     'flex-start',
  justifyContent: 'space-between',
  gap:            12,
  marginBottom:   10,
}

export const nameBlock = {
  flex:     1,
  minWidth: 0,
}

export const nameTxt = {
  margin:       0,
  fontSize:     14,
  fontWeight:   600,
  color:        DARK,
  overflow:     'hidden',
  textOverflow: 'ellipsis',
  whiteSpace:   'nowrap',
}

export const phoneTxt = {
  margin:       '3px 0 0',
  fontSize:     12,
  fontWeight:   500,
  color:        '#000000',
  overflow:     'hidden',
  textOverflow: 'ellipsis',
  whiteSpace:   'nowrap',
}

// ── Badge row ─────────────────────────────────────────────────────
export const badgeRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        6,
  flexShrink: 0,
}

// ── Chips row ─────────────────────────────────────────────────────
export const chipsRow = {
  display:  'flex',
  flexWrap: 'wrap',
  gap:      6,
}

export const chip = (LIGHT_BROWN) => ({
  display:      'inline-flex',
  alignItems:   'center',
  gap:          5,
  padding:      '4px 10px',
  background:   '#F5F1ED',
  borderRadius: 8,
  fontSize:     12,
  fontWeight:   LIGHT_BROWN ? 500 : 600,
  color:        LIGHT_BROWN ? '#6B5339' : DARK,
  whiteSpace:   'nowrap',
})
