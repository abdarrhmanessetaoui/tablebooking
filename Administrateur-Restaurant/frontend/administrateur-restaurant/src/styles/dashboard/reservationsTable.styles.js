import { DARK, LIGHT_BROWN, WHITE, RADIUS, SHADOW, BORDER, BROWN_BG, DARK_LIGHT } from './tokens'

// ── Table header row ──────────────────────────────────────────────
export const tableHeader = (tpl) => ({
  display:               'grid',
  gridTemplateColumns:   tpl,
  gap:                   10,
  padding:               '12px 20px',
  background:            BROWN_BG,
  borderBottom:          `1px solid ${BORDER}`,
})

export const headerCell = {
  fontSize:      11,
  fontWeight:    800,
  color:         DARK,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace:    'normal',
  lineHeight:    1.2,
}

// ── Rows container ────────────────────────────────────────────────
export const rowsContainer = {
  flex:     1,
  overflow: 'hidden',
}

// ── View all button ───────────────────────────────────────────────
export const viewAllBtn = {
  width:              'fit-content',
  marginInlineStart: 'auto',
  marginInlineEnd:   '20px',
  marginTop:          '12px',
  marginBottom:       '12px',
  padding:            '8px 20px',
  background:         LIGHT_BROWN,
  border:             'none',
  borderRadius:       RADIUS.sm,
  color:              WHITE,
  fontSize:           12,
  fontWeight:         800,
  cursor:             'pointer',
  display:            'flex',
  alignItems:         'center',
  justifyContent: 'center',
  fontFamily:     'inherit',
  flexShrink:     0,
  transition:     'none',
  boxShadow:      'none',
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
  padding:        '48px 20px',
  textAlign:      'center',
}

export const emptyTitle = {
  margin:     0,
  fontSize:   14,
  fontWeight: 800,
  color:      DARK,
}

export const emptySubtitle = {
  margin:     '4px 0 0',
  fontSize:   12,
  fontWeight: 600,
  color:      DARK_LIGHT,
}

// ── Full table wrapper ────────────────────────────────────────────
export const tableWrapper = {
  display:       'flex',
  flexDirection: 'column',
  flex:          1,
  height:        '100%',
}
