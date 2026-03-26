// ─────────────────────────────────────────────────────────────────
// Design tokens — single source of truth for the Dashboard UI
// ─────────────────────────────────────────────────────────────────

// ── Core palette ─────────────────────────────────────────────────
export const DARK     = '#2b2118'
export const GOLD     = '#C8A97E'
export const GOLD_DK  = '#a8834e'
export const WHITE    = '#ffffff'

// ── Background — pure white everywhere ───────────────────────────
export const CREAM    = '#ffffff'
export const BORDER   = '#e8e0d6'

// ── Semantic colors ───────────────────────────────────────────────
export const GREEN    = '#16A34A'
export const GREEN_BG = '#ffffff'

export const RED      = '#DC2626'
export const RED_BG   = '#ffffff'

export const AMBER    = '#C8A97E'
export const AMBER_BG = '#ffffff'

// ── Typography ────────────────────────────────────────────────────
export const FONT_FAMILY = "'Inter',system-ui,-apple-system,sans-serif"
export const FONT_URL    = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"

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