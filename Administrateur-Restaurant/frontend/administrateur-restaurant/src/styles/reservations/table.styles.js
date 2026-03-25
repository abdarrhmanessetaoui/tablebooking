import { DARK, GOLD, CREAM, BORDER } from './tokens'

export const cellStyle = { padding: '9px 8px' }

export const headerCellStyle = {
  padding: '11px 8px', textAlign: 'left',
  fontSize: 9, fontWeight: 900, color: GOLD,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

export const actionBtnStyle = (danger) => ({
  height: 24, padding: '0 12px', // Wider for text labels
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: danger ? '#FF0000' : DARK,
  border: 'none', cursor: 'pointer',
  flexShrink: 0,
  fontSize: 10, fontWeight: 900, color: danger ? '#fff' : GOLD,
  textTransform: 'uppercase'
})

export const pageBtnStyle = (active, disabled) => ({
  minWidth: 32, padding: '0 10px', height: 32,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: active ? DARK : disabled ? '#f0f0f0' : '#FFFFFF',
  border: `2px solid ${active ? DARK : BORDER}`,
  color: active ? GOLD : disabled ? '#ccc' : DARK,
  fontSize: 10, fontWeight: 900,
  cursor: disabled ? 'not-allowed' : 'pointer',
  flexShrink: 0, textTransform: 'uppercase'
})

export const checkboxStyle = (checked) => ({
  width: 17, height: 17, flexShrink: 0,
  background: checked ? DARK : '#fff',
  border: `2px solid ${checked ? DARK : 'rgba(43,33,24,0.2)'}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
})