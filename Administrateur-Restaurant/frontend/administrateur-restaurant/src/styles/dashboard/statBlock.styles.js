import { DARK, BORDER, WHITE } from './tokens'

export const wrapper = (bg, accent) => ({
  background:    WHITE,
  padding:       '14px 20px',
  display:       'flex',
  flexDirection: 'column',
  gap:           8,
  borderLeft:    `4px solid ${accent}`,
  borderBottom:  `1px solid ${BORDER}`,
})

export const labelRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        5,
}

export const labelText = (accent) => ({
  fontSize:      9,
  fontWeight:    900,
  color:         accent,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
})

export const valueRow = {
  display:    'flex',
  alignItems: 'baseline',
  gap:        6,
}

export const valueNumber = {
  fontSize:           28,
  fontWeight:         900,
  color:              DARK,
  letterSpacing:      '-1px',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const valuePct = (accent) => ({
  fontSize:   10,
  fontWeight: 800,
  color:      accent,
  opacity:    0.8,
})

export const progressRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        8,
}

export const progressTrack = {
  flex:       1,
  height:     4,
  background: BORDER,
  overflow:   'hidden',
  flexShrink: 0,
}

export const progressFill = (w, accent) => ({
  height:     '100%',
  width:      `${w}%`,
  background: accent,
})

export const progressPct = (accent) => ({
  fontSize:   9,
  fontWeight: 900,
  color:      accent,
  flexShrink: 0,
  minWidth:   24,
  textAlign:  'right',
})

export const accentBar = () => ({})
export const content   = {}