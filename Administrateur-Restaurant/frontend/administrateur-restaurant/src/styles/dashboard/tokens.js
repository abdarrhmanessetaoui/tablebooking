// ─────────────────────────────────────────────────────────────────
// Design tokens   Minimalist Light Brown & White for TableBooking.ma
// ─────────────────────────────────────────────────────────────────

// ── Core palette ─────────────────────────────────────────────────
export const DARK        = '#2D2926'      // Soft charcoal (not pure black)
export const DARK_LIGHT  = '#4A4A4A'      // Medium gray
export const LIGHT_BROWN    = '#C19A6B'      // Logo-inspired light brown
export const LIGHT_BROWN_DK   = '#A8834E'      // Darker light brown for contrast
export const LIGHT_BROWN_DARK = LIGHT_BROWN_DK // Alias for consistency
export const GOLD            = LIGHT_BROWN    // Alias for gold color
export const BROWN_LT       = '#D2B48C'      // Very light brown / tan
export const BROWN_BG    = '#FDF8F3'      // Extremely light brown for backgrounds
export const WHITE       = '#ffffff'

// ── Background palette ───────────────────────────────────────────
export const BG_PAGE     = '#ffffff'      // Clean white background
export const BG_CARD     = '#ffffff'      // White surfaces
export const BG_SIDEBAR  = '#FDF8F3'      // Very light brown sidebar
export const BG_HOVER    = '#ffffff'      // No hover effect (keep white)
export const CREAM       = '#FDF8F3'      // Cream/off-white

// ── Border colors ────────────────────────────────────────────────
export const BORDER      = '#E5E0DA'      // Subtle warm border
export const BORDER_LT   = '#F2EFEB'      // Even more subtle

// ── Semantic colors (Solid versions) ────────────────────────────
export const GREEN       = '#22C55E'      // Solid Success Green
export const GREEN_BG    = '#F0FDF4'      // Light background for success
export const RED         = '#EF4444'      // Solid Error Red
export const RED_BG      = '#FEF2F2'      // Light background for error banners
export const AMBER       = '#F59E0B'      // Solid Warning Amber
export const AMBER_BG     = '#FFFBEB'      // Light background for warnings

// ── Typography ────────────────────────────────────────────────────
export const FONT_FAMILY  = "'Inter', system-ui, -apple-system, sans-serif"
export const FONT_DISPLAY = "'Inter', system-ui, sans-serif"
export const FONT_URL     = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"

// ── Radius (Small & Consistent) ───────────────────────────────────
export const RADIUS = {
  sm:   4,
  md:   6,
  lg:   8,
  xl:   10,
  full: 9999,
}

// ── Shadows (None per requirement) ────────────────────────────────
export const SHADOW = {
  card:      'none',
  cardHover: 'none',
  glass:     'none',
  subtle:    'none',
}

// ── Fixed dates ───────────────────────────────────────────────────
export const TODAY_DATE    = new Date().toISOString().slice(0, 10)
export const TOMORROW_DATE = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

// ── Spacing scale ─────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
  xxxl: 40,
}

// ── Font sizes ────────────────────────────────────────────────────
export const FONT_SIZE = {
  xxs:  11,
  xs:   12,
  sm:   13,
  md:   14,
  base: 15,
  lg:   16,
  xl:   18,
  xxl:  20,
  xxxl: 24,
}
