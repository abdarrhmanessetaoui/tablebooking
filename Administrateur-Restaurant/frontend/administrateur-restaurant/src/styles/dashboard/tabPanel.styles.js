import { DARK, BG_CARD, BORDER, RADIUS, SHADOW, LIGHT_BROWN, BROWN_LT, BROWN_BG, DARK_LIGHT, WHITE } from './tokens'

export const tabPanelCSS = `
  .db-card {
    background: ${BG_CARD};
    border: 1px solid ${BORDER};
    border-radius: ${RADIUS.sm}px;
    overflow: hidden;
    box-shadow: none;
  }
  .db-body {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: stretch;
    min-height: 520px;
  }
  .db-left {
    border-right: 1px solid ${BORDER};
    display: flex;
    flex-direction: column;
    background: ${BROWN_BG};
  }
  .db-stats-sticky {
    position: sticky;
    top: 24px;
  }
  .db-right {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: ${WHITE};
  }
  .db-stat-blocks {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .db-stat-blocks > div {
    flex: 1;
  }
  @media (max-width: 860px) {
    .db-body         { grid-template-columns: 1fr; min-height: auto; }
    .db-left         { border-right: none; border-bottom: 1px solid ${BORDER}; }
    .db-stats-sticky { position: static; }
    .db-stat-blocks  { flex-direction: row; }
  }
  @media (max-width: 540px) {
    .db-stat-blocks  { flex-direction: column; }
  }
  .res-desktop { display: block; height: 100%; }
  .res-mobile  { display: none;  }
  @media (max-width: 640px) {
    .res-desktop { display: none;  }
    .res-mobile  { display: block; }
  }
`

export const heroSection = {
  padding:      '24px 20px',
  display:      'flex',
  alignItems:   'center',
  gap:          16,
  borderBottom: `1px solid ${BORDER}`,
  background:   BROWN_BG,
  flexShrink:   0,
}

export const heroNumber = {
  margin:             0,
  fontSize:           'clamp(40px,5vw,60px)',
  fontWeight:         800,
  color:              DARK,
  lineHeight:         1,
  letterSpacing:      '-0.03em',
  fontVariantNumeric: 'tabular-nums',
  fontFamily:         'inherit',
}

export const heroLabel = {
  margin:     '8px 0 0',
  fontSize:   12,
  fontWeight: 800,
  color:      DARK,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

export const statsList = {
  display:       'flex',
  flexDirection: 'column',
  flex:          1,
}

export const mobileEmpty = {
  padding:   '40px 16px',
  textAlign: 'center',
}

export const mobileEmptyTitle = {
  margin:     0,
  fontSize:   13,
  fontWeight: 800,
  color:      DARK,
}

export const mobileEmptySubtitle = {
  margin:     '4px 0 0',
  fontSize:   12,
  fontWeight: 600,
  color:      DARK_LIGHT,
}

export const mobileViewAllBtn = {
  width:          '100%',
  padding:        '12px 16px',
  background:     LIGHT_BROWN,
  border:         'none',
  borderRadius:   `0 0 ${RADIUS.sm}px ${RADIUS.sm}px`,
  color:          WHITE,
  fontSize:       12,
  fontWeight:     800,
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  fontFamily:     'inherit',
  transition:     'none',
}
