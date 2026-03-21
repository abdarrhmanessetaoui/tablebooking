// ─────────────────────────────────────────────────────────────────
// Design tokens — single source of truth for the Dashboard UI
// Import from here in ALL dashboard components and style files
// ─────────────────────────────────────────────────────────────────

// ── Core palette ─────────────────────────────────────────────────
export const DARK     = '#2b2118'
export const GOLD     = '#c8a97e'
export const GOLD_DK  = '#a8834e'
export const CREAM    = '#faf8f5'
export const WHITE    = '#ffffff'
export const BORDER   = '#e8e0d6'

// ── Semantic colors ───────────────────────────────────────────────
export const GREEN    = '#1a6e42'
export const GREEN_BG = '#edfaf4'

export const RED      = '#b94040'
export const RED_BG   = '#fdf0f0'

export const AMBER    = '#a8670a'
export const AMBER_BG = '#fff8ec'

// ── Typography ────────────────────────────────────────────────────
export const FONT_FAMILY = "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif"
export const FONT_URL    = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"

// ── Fixed dates ───────────────────────────────────────────────────
export const TODAY_DATE    = new Date().toISOString().slice(0, 10)
export const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

// ── Spacing scale ─────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
}

// ── Font sizes ────────────────────────────────────────────────────
export const FONT_SIZE = {
  xxs:  7,
  xs:   8,
  sm:   9,
  md:   10,
  base: 11,
  lg:   12,
  xl:   13,
  xxl:  14,
}