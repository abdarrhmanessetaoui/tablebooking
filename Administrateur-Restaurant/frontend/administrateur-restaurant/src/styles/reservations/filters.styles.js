import { DARK, GOLD, GOLD_DARK, BORDER } from './tokens'

export const filterInputBase = {
  background: '#fff', border: `4px solid ${DARK}`,
  padding: '10px 14px', fontSize: 13, fontWeight: 600,
  color: DARK, fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box',
  width: '100%', borderRadius: 0,
}

export const dateBtnStyle = (hasDate) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 8, width: '100%', padding: '10px 14px',
  background: hasDate ? DARK : '#fff',
  border: hasDate ? 'none' : `4px solid ${DARK}`,
  fontSize: 13, fontWeight: 800,
  color: hasDate ? GOLD : DARK,
  cursor: 'pointer', fontFamily: 'inherit',
  transition: 'all 0.15s',
})

export const calNavBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(200,169,126,0.7)', padding: '4px 6px',
  fontFamily: 'inherit', display: 'flex', alignItems: 'center',
}
