import { DARK, BORDER, LIGHT_BROWN, RADIUS, WHITE } from '../dashboard/tokens'

// ── Base input style ──────────────────────────────────────────────
export const filterInputBase = {
  width: '100%',
  padding: '10px 14px',
  background: WHITE,
  border: `1px solid ${BORDER}`,
  borderRadius: RADIUS.sm,
  fontSize: '13px',
  fontWeight: '800',
  color: DARK,
  outline: 'none',
  transition: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

// ── Date button style ─────────────────────────────────────────────
export const dateBtnStyle = (isActive) => ({
  ...filterInputBase,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  gap: '8px',
  ...(isActive ? {
    background: LIGHT_BROWN,
    color: WHITE,
    borderColor: LIGHT_BROWN,
    fontWeight: '800',
  } : {}),
})

// ── Calendar Nav Button (for the popup) ───────────────────────────
export const calNavBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: RADIUS.sm,
  border: `1px solid ${BORDER}`,
  background: WHITE,
  color: DARK,
  cursor: 'pointer',
  transition: 'none',
}

// ── Legacy exports/aliases ────────────────────────────────────────
export const filterBar = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '24px',
  alignItems: 'center',
}

export const searchWrapper = {
  position: 'relative',
  flex: '1',
  minWidth: '240px',
}

export const inputStyle = { ...filterInputBase, paddingInlineStart: '40px' }
export const selectStyle = { ...filterInputBase, cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none' }

export const activeFilter = {
  borderColor: LIGHT_BROWN,
  background: 'transparent',
  color: DARK,
}

export const clearBtn = {
  padding: '8px 12px',
  background: 'transparent',
  border: 'none',
  color: DARK,
  fontSize: '13px',
  fontWeight: '800',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'none',
}
