import { BORDER } from './tokens'

export const wrapper = (bg, accent) => ({
  background:    accent,
  padding:       '10px 20px',      // ← was 16px, now compact
  display:       'flex',
  flexDirection: 'column',
  gap:           6,
  borderBottom:  `1px solid rgba(255,255,255,0.15)`,
})

export const labelRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        5,
}

export const labelText = () => ({
  fontSize:      9,
  fontWeight:    900,
  color:         'rgba(255,255,255,0.75)',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
})

export const valueRow = {
  display:    'flex',
  alignItems: 'baseline',
  gap:        6,
}

export const valueNumber = {
  fontSize:           24,          // ← was 32, now smaller
  fontWeight:         900,
  color:              '#fff',
  letterSpacing:      '-1px',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const valuePct = () => ({
  fontSize:   10,
  fontWeight: 800,
  color:      'rgba(255,255,255,0.7)',
})

export const progressRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        8,
}

export const progressTrack = {
  flex:       1,
  height:     4,
  background: 'rgba(255,255,255,0.25)',
  overflow:   'hidden',
  flexShrink: 0,
}

export const progressFill = (w) => ({
  height:     '100%',
  width:      `${w}%`,
  background: '#fff',
  transition: 'width 0.9s ease',
})

export const progressPct = () => ({
  fontSize:   9,
  fontWeight: 900,
  color:      'rgba(255,255,255,0.85)',
  flexShrink: 0,
  minWidth:   24,
  textAlign:  'right',
})

export const accentBar = () => ({})
export const content   = {}