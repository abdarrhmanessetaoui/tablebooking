import { DARK, BORDER } from './tokens'

// ── Wrapper ───────────────────────────────────────────────────────
export const wrapper = (bg) => ({
  background:  bg,
  padding:     '10px 16px',
  display:     'flex',
  alignItems:  'center',
  gap:         12,
})

// ── Left accent bar ───────────────────────────────────────────────
export const accentBar = (accent) => ({
  width:        3,
  height:       36,
  background:   accent,
  flexShrink:   0,
  borderRadius: 2,
})

// ── Text content ──────────────────────────────────────────────────
export const content = {
  flex:     1,
  minWidth: 0,
}

export const labelRow = {
  display:     'flex',
  alignItems:  'center',
  gap:         4,
  marginBottom: 3,
}

export const labelText = (accent) => ({
  fontSize:      8,
  fontWeight:    900,
  color:         accent,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
})

export const valueRow = {
  display:    'flex',
  alignItems: 'baseline',
  gap:        10,
}

export const valueNumber = {
  fontSize:           22,
  fontWeight:         900,
  color:              DARK,
  letterSpacing:      '-1px',
  lineHeight:         1,
  fontVariantNumeric: 'tabular-nums',
}

export const valuePct = (accent) => ({
  fontSize:   9,
  fontWeight: 900,
  color:      accent,
  opacity:    0.7,
})

// ── Progress bar ──────────────────────────────────────────────────
export const progressTrack = {
  width:      36,
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