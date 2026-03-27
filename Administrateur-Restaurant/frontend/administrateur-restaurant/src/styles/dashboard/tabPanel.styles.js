export const tabPanelCSS = `
  .db-card {
    background: #fff;
    border: 4px solid #423428;
    overflow: hidden;
  }
  .db-body {
    display: grid;
    grid-template-columns: 260px 1fr;
    align-items: stretch;
    min-height: 600px;
  }
  .db-left {
    border-right: 4px solid #423428;
    display: flex;
    flex-direction: column;
  }
  .db-stats-sticky {
    position: sticky;
    top: 24px;
  }
  .db-right {
    display: flex;
    flex-direction: column;
    min-height: 100%;
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
    .db-left         { border-right: none; border-bottom: 4px solid #423428; }
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
  padding:      '20px 20px 18px',
  display:      'flex',
  alignItems:   'center',
  gap:          20,
  borderBottom: `4px solid #423428`,
  background:   '#fff',
  flexShrink:   0,
}

export const heroNumber = {
  margin:             0,
  fontSize:           'clamp(52px,8vw,80px)',
  fontWeight:         900,
  color:              '#423428',
  lineHeight:         0.9,
  letterSpacing:      '-4px',
  fontVariantNumeric: 'tabular-nums',
}

export const heroLabel = {
  margin:     '10px 0 0',
  fontSize:   11,
  fontWeight: 700,
  color:      '#423428',
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
  fontWeight: 900,
  color:      'rgba(66,52,40,0.25)',
}

export const mobileEmptySubtitle = {
  margin:     '5px 0 0',
  fontSize:   11,
  fontWeight: 700,
  color:      'rgba(200,169,126,0.6)',
}

export const mobileViewAllBtn = {
  width:          '100%',
  padding:        '13px 16px',
  background:     '#423428',
  border:         'none',
  color:          '#fff',
  fontSize:       11,
  fontWeight:     900,
  letterSpacing:  '0.1em',
  textTransform:  'uppercase',
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'space-between',
  fontFamily:     'inherit',
}
