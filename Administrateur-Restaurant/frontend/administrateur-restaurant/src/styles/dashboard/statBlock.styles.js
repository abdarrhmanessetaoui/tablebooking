import { DARK, BORDER } from './tokens'

export const wrapper = (bg, accent) => ({
  background:   bg,
  padding:      '12px 20px',
  display:      'grid',
  gridTemplateColumns: '1fr auto',
  alignItems:   'center',
  gap:          12,
  borderLeft:   `3px solid ${accent}`,
  borderBottom: `1px solid ${BORDER}`,
})

export const labelRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        5,
  marginBottom: 4,
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
  letterSpacing:      '-1.5px',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const valuePct = (accent) => ({
  fontSize:   10,
  fontWeight: 800,
  color:      accent,
  opacity:    0.8,
})

export const progressTrack = {
  width:      48,
  height:     3,
  background: BORDER,
  overflow:   'hidden',
  flexShrink: 0,
  alignSelf:  'center',
}

export const progressFill = (w, accent) => ({
  height:     '100%',
  width:      `${w}%`,
  background: accent,
  transition: 'width 0.9s ease',
})

export const accentBar = () => ({})
export const content   = {}