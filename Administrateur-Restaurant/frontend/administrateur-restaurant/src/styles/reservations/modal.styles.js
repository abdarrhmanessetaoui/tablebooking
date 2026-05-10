import { DARK, LIGHT_BROWN, BORDER, WHITE, RADIUS } from './tokens'

// ── Main modal styles ─────────────────────────────────────────────
export const backdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(75, 54, 33, 0.4)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}

export const modalContainer = {
  background: '#ffffff',
  width: '100%',
  maxWidth: '560px',
  borderRadius: '20px',
  boxShadow: '0 20px 50px rgba(75, 54, 33, 0.15)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
}

// ── Aliases for legacy compatibility ──────────────────────────────
export const overlayStyle = backdrop
export const panelStyle   = modalContainer

// ── Header/Body/Footer ────────────────────────────────────────────
export const modalHeader = {
  padding: '24px 32px',
  borderBottom: `1px solid ${BORDER}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#FDFCFB',
}

export const modalTitle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '700',
  color: DARK,
  fontFamily: "'Poppins', sans-serif",
}

export const modalBody = {
  padding: '32px',
  overflowY: 'auto',
  flex: 1,
}

export const modalFooter = {
  padding: '20px 32px',
  borderTop: `1px solid ${BORDER}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  background: '#FDFCFB',
}

export const sectionTitle = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#000000',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '16px',
  display: 'block',
}

export const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: DARK,
  marginBottom: '8px',
  display: 'block',
}

export const inputBase = {
  width: '100%',
  padding: '12px 16px',
  border: `1.5px solid ${BORDER}`,
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '500',
  color: DARK,
  fontFamily: 'inherit',
  outline: 'none',
  background: '#ffffff',
  transition: 'none',
  boxSizing: 'border-box',
}

export const selectStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid #E5E0DA',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: '800',
  color: '#2D2926',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
  WebkitAppearance: 'none',
  appearance: 'none',
}

export const inputStyle = inputBase

export const footerBtnBase = {
  flex: 1,
  padding: '14px 24px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '700',
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}

export const footerBtnPrimary = (hov) => ({
  ...footerBtnBase,
  background: hov ? '#3D2B1A' : DARK,
  color: '#ffffff',
  border: 'none',
  transform: hov ? 'translateY(-1px)' : 'none',
  boxShadow: hov ? '0 4px 12px rgba(75, 54, 33, 0.2)' : 'none',
})

export const footerBtnSecondary = {
  ...footerBtnBase,
  background: 'transparent',
  color: DARK,
  border: `1.5px solid ${BORDER}`,
}

export const summaryBoxStyle = {
  background: '#FDFCFB',
  border: `1.5px solid ${BORDER}`,
  borderRadius: '16px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '24px',
}
