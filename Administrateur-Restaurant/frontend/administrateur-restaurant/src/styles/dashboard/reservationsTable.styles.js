import { DARK, GOLD, WHITE } from './tokens'

// ── Table header row ──────────────────────────────────────────────
export const tableHeader = (tpl) => ({
  display:               'grid',
  gridTemplateColumns:   tpl,
  gap:                   10,
  padding:               '11px 16px',
  background:            DARK,
})

export const headerCell = {
  fontSize:      9,
  fontWeight:    900,
  color:         GOLD,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  overflow:      'hidden',
  textOverflow:  'ellipsis',
  whiteSpace:    'nowrap',
}

// ── Rows container ────────────────────────────────────────────────
export const rowsContainer = {
  flex:     1,
  overflow: 'hidden',
}

// ── View all button ───────────────────────────────────────────────
export const viewAllBtn = {
  width:          '100%',
  padding:        '13px 16px',
  background:     DARK,
  border:         'none',
  color:          WHITE,
  fontSize:       11,
  fontWeight:     900,
  letterSpacing:  '0.1em',
  textTransform:  'uppercase',
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'space-between',
  fontFamily:     'inherit',
  flexShrink:     0,
  marginTop:      'auto',
}

// ── Empty state ───────────────────────────────────────────────────
export const emptyWrapper = {
  display:       'flex',
  flexDirection: 'column',
  flex:          1,
  height:        '100%',
}

export const emptyInner = {
  flex:           1,
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  justifyContent: 'center',
  padding:        '48px 16px',
  textAlign:      'center',
}

export const emptyTitle = {
  margin:     0,
  fontSize:   14,
  fontWeight: 900,
  color:      'rgba(200,169,126,0.9)',
}

export const emptySubtitle = {
  margin:     '5px 0 0',
  fontSize:   11,
  fontWeight: 700,
  color:      'rgba(200,169,126,0.9)',
}

// ── Full table wrapper ────────────────────────────────────────────
export const tableWrapper = {
  display:       'flex',
  flexDirection: 'column',
  flex:          1,
  height:        '100%',
}