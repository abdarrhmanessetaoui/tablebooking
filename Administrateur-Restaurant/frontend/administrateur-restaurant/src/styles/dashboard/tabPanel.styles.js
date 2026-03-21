import { DARK, WHITE, BORDER } from './tokens'

// ── Responsive layout CSS string ──────────────────────────────────
export const tabPanelCSS = `
  .db-card {
    background: ${WHITE};
    border: 2px solid ${DARK};
    overflow: hidden;
  }
  .db-body {
    display: grid;
    grid-template-columns: 280px 1fr;
  }
  .db-left {
    border-right: 2px solid ${DARK};
  }
  .db-stats-sticky {
    position: sticky;
    top: 24px;
  }
  @media (max-width: 860px) {
    .db-body              { grid-template-columns: 1fr; }
    .db-left              { border-right: none; border-bottom: 2px solid ${DARK}; }
    .db-stats-sticky      { position: static; }
  }
  .res-desktop { display: block; }
  .res-mobile  { display: none;  }
  @media (max-width: 640px) {
    .res-desktop { display: none;  }
    .res-mobile  { display: block; }
  }
`

// ── Hero section (big number + ring) ─────────────────────────────
export const heroSection = {
  padding:       '18px 20px 16px',
  display:       'flex',
  alignItems:    'center',
  gap:           20,
  borderBottom:  `1px solid ${BORDER}`,
  background:    WHITE,
}

export const heroNumber = {
  margin:               0,
  fontSize:             'clamp(52px,8vw,80px)',
  fontWeight:           900,
  color:                DARK,
  lineHeight:           0.9,
  letterSpacing:        '-4px',
  fontVariantNumeric:   'tabular-nums',
}

export const heroLabel = {
  margin:     '10px 0 0',
  fontSize:   11,
  fontWeight: 700,
  color:      DARK,
}

// ── Stat blocks list ──────────────────────────────────────────────
export const statsList = {
  display:       'flex',
  flexDirection: 'column',
  gap:           1,
  background:    BORDER,
}

// ── Mobile empty state ────────────────────────────────────────────
export const mobileEmpty = {
  padding:   '40px 16px',
  textAlign: 'center',
}

export const mobileEmptyTitle = {
  margin:     0,
  fontSize:   13,
  fontWeight: 900,
  color:      'rgba(200,169,126,0.9)',
}

export const mobileEmptySubtitle = {
  margin:     '5px 0 0',
  fontSize:   11,
  fontWeight: 700,
  color:      'rgba(200,169,126,0.9)',
}

// ── Mobile view-all button ────────────────────────────────────────
export const mobileViewAllBtn = {
  width:          '100%',
  padding:        '13px 16px',
  background:     DARK,
  border:         'none',
  color:          WHITE,
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