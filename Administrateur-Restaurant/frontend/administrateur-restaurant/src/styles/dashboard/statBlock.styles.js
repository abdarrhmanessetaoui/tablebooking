import { DARK, BORDER, BORDER_LT, WHITE, BG_CARD, RADIUS } from './tokens'

export const wrapper = (bg, accent) => ({
  background:    WHITE,
  padding:       '16px 20px',
  display:       'flex',
  flexDirection: 'column',
  gap:           6,
  borderBottom:  `1px solid ${BORDER}`,
  transition:    'none',
})

export const labelRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        6,
}

export const labelText = (accent) => ({
  fontSize:      11,
  fontWeight:    800,
  color:         accent,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

export const valueRow = {
  display:    'flex',
  alignItems: 'baseline',
  gap:        6,
}

export const valueNumber = {
  fontSize:           28,
  fontWeight:         800,
  color:              DARK,
  letterSpacing:      '-0.02em',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
  fontFamily:         'inherit',
}

export const valuePct = (accent) => ({
  fontSize:   11,
  fontWeight: 800,
  color:      accent,
})

export const progressRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        8,
  marginTop:  2,
}

export const progressTrack = {
  flex:         1,
  height:       4,
  background:   BORDER_LT,
  overflow:     'hidden',
  flexShrink:   0,
  borderRadius: RADIUS.sm,
}

export const progressFill = (w, accent) => ({
  height:       '100%',
  width:        `${w}%`,
  background:   accent,
  transition:   'width 0.9s ease',
  borderRadius: RADIUS.sm,
})

export const progressPct = (accent) => ({
  fontSize:   10,
  fontWeight: 800,
  color:      accent,
  flexShrink: 0,
  minWidth:   24,
  textAlign:  'right',
})

export const accentBar = () => ({})
export const content   = {}
