import { DARK, GOLD, CREAM, BORDER } from './tokens'

export const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  border: `2px solid #e8e0d8`, background: '#fff',
  padding: '10px 14px', fontSize: 14, fontWeight: 600,
  color: DARK, fontFamily: 'inherit', outline: 'none',
}

export const selectStyle = {
  ...inputStyle,
  fontSize: 15,
  appearance: 'none',
  cursor: 'pointer',
}

export const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: '#fff',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', padding: 16,
  fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
}

export const panelStyle = {
  background: '#fff', width: '100%', maxWidth: 480,
  maxHeight: '92vh', overflow: 'auto',
  display: 'flex', flexDirection: 'column',
  border: `2px solid ${DARK}`,
}

export const headerStyle = {
  background: DARK, padding: '20px 26px',
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', flexShrink: 0,
}

export const summaryBoxStyle = {
  background: '#faf8f5', padding: '14px 18px',
  display: 'flex', flexDirection: 'column', gap: 8,
  borderLeft: `3px solid ${GOLD}`,
}

export const footerBtnPrimary = {
  flex: 2, padding: '12px', background: DARK,
  border: 'none', fontSize: 13, fontWeight: 900, color: GOLD,
  cursor: 'pointer', fontFamily: 'inherit',
}
export const footerBtnSecondary = {
  flex: 1, padding: '12px', background: GOLD,
  border: 'none', fontSize: 13, fontWeight: 900,
  color: DARK, cursor: 'pointer', fontFamily: 'inherit',
}