// ─── Design Tokens   Tables module ───────────────────────────────
export const DARK        = '#2D2926'
export const DARK_LIGHT  = '#4A4A4A'
export const LIGHT_BROWN    = '#C19A6B'
export const LIGHT_BROWN_DK = '#A8834E'
export const RED         = '#EF4444'
export const GREEN       = '#22C55E'
export const WHITE       = '#ffffff'
export const CREAM       = '#FDF8F3'
export const BORDER      = '#E5E0DA'
export const BORDER_SOFT = '#E5E0DA'

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  full: 9999,
}


export const INPUT_STYLE = {
  padding: '12px 14px',
  border: `1px solid ${BORDER}`,
  borderRadius: RADIUS.sm,
  fontSize: 14, fontWeight: 800, color: DARK,
  fontFamily: 'inherit', outline: 'none',
  background: WHITE, transition: 'none',
  width: '100%', boxSizing: 'border-box',
  minWidth: 0, WebkitAppearance: 'none',
}

export const INPUT_STYLE_SM = {
  ...INPUT_STYLE,
  padding: '9px 12px',
  fontSize: 13,
}
