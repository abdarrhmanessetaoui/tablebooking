import { DARK, GOLD, CREAM, BORDER } from './tokens'

export const cellStyle = { padding: '9px 8px' }

export const headerCellStyle = {
  padding: '11px 8px', textAlign: 'left',
  fontSize: 9, fontWeight: 900, color: GOLD,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

export const actionBtnStyle = (hov, danger) => ({
  width: 28, height: 28,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: danger ? (hov ? '#dc2626' : '#fef2f2') : (hov ? DARK : '#f5f0eb'),
  border: 'none', cursor: 'pointer',
  transition: 'all 0.15s', flexShrink: 0,
})

export const pageBtnStyle = (active, hov, disabled) => ({
  minWidth: 32, height: 32, padding: '0 6px',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: active ? DARK : hov && !disabled ? '#f0ebe4' : '#fff',
  border: `1.5px solid ${active ? DARK : BORDER}`,
  color: active ? GOLD : disabled ? 'rgba(43,33,24,0.25)' : DARK,
  fontSize: 12, fontWeight: active ? 900 : 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.15s', flexShrink: 0,
})

export const checkboxStyle = (checked) => ({
  width: 17, height: 17, flexShrink: 0,
  background: checked ? DARK : '#fff',
  border: `2px solid ${checked ? DARK : 'rgba(43,33,24,0.2)'}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all 0.15s',
})