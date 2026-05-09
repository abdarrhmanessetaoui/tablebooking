import { DARK, LIGHT_BROWN, BORDER, CREAM, WHITE, RADIUS } from './tokens'

export const tableWrapper = {
  background: WHITE,
  borderRadius: RADIUS,
  border: `1px solid ${BORDER}`,
  overflow: 'hidden',
  boxShadow: 'none',
}

export const headerStyle = {
  display: 'grid',
  padding: '16px 24px',
  background: WHITE,
  borderBottom: `1px solid ${BORDER}`,
  alignItems: 'center',
  gap: '12px',
}

export const headerCell = {
  fontSize: '11px',
  fontWeight: '900',
  color: DARK,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export const headerCellStyle = {
  ...headerCell,
  padding: '12px 14px',
  textAlign: 'left',
  borderBottom: `1px solid ${BORDER}`,
  background: WHITE,
}

export const rowStyle = (isHovered, isSelected) => ({
  display: 'grid',
  padding: '14px 24px',
  background: isSelected ? LIGHT_BROWN : isHovered ? '#FAF7F4' : WHITE,
  borderBottom: `1px solid ${BORDER}`,
  alignItems: 'center',
  gap: '12px',
  transition: 'none',
  cursor: 'pointer',
})

export const cellStyle = {
  fontSize: '13px',
  fontWeight: '800',
  color: DARK,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  padding: '12px 14px',
}

// ── Additional components ─────────────────────────────────────────

export const checkboxStyle = (isActive) => ({
  width: '18px',
  height: '18px',
  border: `1.5px solid ${isActive ? LIGHT_BROWN : BORDER}`,
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'none',
  background: isActive ? LIGHT_BROWN : WHITE,
})

export const actionBtnStyle = (isDanger, isSuccess) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  border: 'none',
  background: isDanger ? '#EF4444' : isSuccess ? '#22c55e' : LIGHT_BROWN,
  color: WHITE,
  cursor: 'pointer',
  transition: 'none',
  boxShadow: 'none',
})

export const pageBtnStyle = (isActive) => ({
  minWidth: '34px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: isActive ? LIGHT_BROWN : WHITE,
  border: `1px solid ${isActive ? LIGHT_BROWN : BORDER}`,
  borderRadius: '4px',
  color: isActive ? WHITE : DARK,
  fontSize: '13px',
  fontWeight: '800',
  cursor: 'pointer',
  transition: 'none',
})

// ── Text helpers ──────────────────────────────────────────────────

export const nameTxt = {
  fontWeight: '800',
  color: DARK,
}

export const subTxt = {
  fontSize: '11px',
  color: DARK,
  marginTop: '2px',
  fontWeight: '800',
}

export const timeChip = {
  display: 'inline-flex',
  padding: '4px 10px',
  background: '#FAF7F4',
  border: `1px solid ${BORDER}`,
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '900',
  color: DARK,
}
