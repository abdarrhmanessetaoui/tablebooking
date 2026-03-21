import { BORDER } from './tokens'

export const wrapper = (bg, accent) => ({
  background:    accent,        // ← solid colored background
  padding:       '16px 20px',
  display:       'flex',
  flexDirection: 'column',
  gap:           8,
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
  fontSize:           32,
  fontWeight:         900,
  color:              '#fff',
  letterSpacing:      '-1.5px',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const valuePct = () => ({
  fontSize:   10,
  fontWeight: 800,
  color:      'rgba(255,255,255,0.7)',
})

// ── Progress row ──────────────────────────────────────────────────
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
  fontSize:   10,
  fontWeight: 900,
  color:      '#fff',
  flexShrink: 0,
  minWidth:   28,
  textAlign:  'right',
})

export const accentBar = () => ({})
export const content   = {}