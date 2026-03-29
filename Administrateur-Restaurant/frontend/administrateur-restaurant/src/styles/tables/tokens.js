// ─── Design Tokens — Tables module ───────────────────────────────
export const DARK        = '#423428'
export const GOLD        = '#c8a97e'
export const GOLD_DK     = '#a8834e'
export const RED         = '#DC2626'
export const GREEN       = '#16a34a'
export const CREAM       = '#ffffff'
export const BORDER      = '#423428'
export const BORDER_SOFT = 'rgba(66,52,40,0.10)'

export const LOC_COLORS = {
  'Intérieur':   { bg: '#f0f4ff', color: '#3b5bdb' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#ffffff', color: '#a8834e' },
  'Salon privé': { bg: '#ffffff', color: '#DC2626' },
}

export const PRESET_COLORS = [
  '#4f6ef7', '#16a34a', '#a8834e', '#DC2626',
  '#0891b2', '#7c3aed', '#db2777', '#d97706',
  '#475569', '#15803d',
]

export const INPUT_STYLE = {
  padding: '12px 14px',
  border: `4px solid ${BORDER}`,
  fontSize: 14, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none',
  background: '#fff', transition: 'border-color 0.15s',
  width: '100%', boxSizing: 'border-box',
  minWidth: 0, WebkitAppearance: 'none', borderRadius: 0,
}

export const INPUT_STYLE_SM = {
  ...INPUT_STYLE,
  padding: '9px 12px',
  fontSize: 13,
}