import { DARK, BORDER } from './tokens'

// ── KPI card wrapper ──────────────────────────────────────────────
export const wrapper = (bg, accent) => ({
  flex:          1,
  minWidth:      0,
  background:    bg,
  padding:       '18px 20px',
  display:       'flex',
  flexDirection: 'column',
  gap:           10,
  borderTop:     `3px solid ${accent}`,
  position:      'relative',
  overflow:      'hidden',
})

// ── Label row ─────────────────────────────────────────────────────
export const labelRow = {
  display:    'flex',
  alignItems: 'center',
  gap:        6,
}

export const labelText = (accent) => ({
  fontSize:      9,
  fontWeight:    900,
  color:         accent,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
})

// ── Value row ─────────────────────────────────────────────────────
export const valueRow = {
  display:    'flex',
  alignItems: 'baseline',
  gap:        8,
}

export const valueNumber = {
  fontSize:           36,
  fontWeight:         900,
  color:              DARK,
  letterSpacing:      '-2px',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const valuePct = (accent) => ({
  fontSize:   11,
  fontWeight: 800,
  color:      accent,
  opacity:    0.8,
})

// ── Full-width progress bar at bottom ─────────────────────────────
export const progressTrack = {
  width:      '100%',
  height:     3,
  background: BORDER,
  overflow:   'hidden',
  flexShrink: 0,
}

export const progressFill = (w, accent) => ({
  height:     '100%',
  width:      `${w}%`,
  background: accent,
  transition: 'width 0.9s ease',
})

// ── These are no longer used but kept to avoid import errors ──────
export const accentBar = () => ({})
export const content   = {}