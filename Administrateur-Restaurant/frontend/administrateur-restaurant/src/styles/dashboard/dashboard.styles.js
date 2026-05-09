import {
    DARK, DARK_LIGHT, LIGHT_BROWN, BROWN_LT, BG_PAGE, BG_CARD, WHITE,
    RED, RED_BG, AMBER, AMBER_BG,
    FONT_FAMILY, FONT_DISPLAY, BORDER, RADIUS, SHADOW,
  } from './tokens'
  
  // ── Page wrapper ──────────────────────────────────────────────────
  export const page = {
    minHeight:   '100vh',
    background:  BG_PAGE,
    fontFamily:  FONT_FAMILY,
    padding:     'clamp(20px,3vw,40px) clamp(20px,4vw,44px)',
    width:       '100%',
    overflowX:   'hidden',
    boxSizing:   'border-box',
    color:       DARK,
  }
  
  // ── Header row ────────────────────────────────────────────────────
  export const header = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            16,
    marginBottom:   8,
    flexWrap:       'wrap',
  }
  
  export const headerLeft = {
    minWidth: 0,
    flex:     1,
  }
  
  export const h1 = {
    margin:        0,
    fontSize:      'clamp(20px,3.5vw,28px)',
    fontWeight:    800,
    color:         DARK,
    letterSpacing: '-0.02em',
    lineHeight:    1.2,
    fontFamily:    FONT_DISPLAY,
  }
  
  export const subtitle = {
    margin:     '4px 0 0',
    fontSize:   13,
    fontWeight: 600,
    color:      DARK_LIGHT,
  }
  
  // ── Divider ───────────────────────────────────────────────────────
  export const divider = {
    display:    'none',
  }
  
  // ── Error banner ──────────────────────────────────────────────────
  export const errorBanner = {
    marginTop:    12,
    padding:      '12px 16px',
    background:   WHITE,
    border:       `1px solid ${RED}`,
    borderRadius: RADIUS.sm,
    fontSize:     13,
    fontWeight:   800,
    color:        RED,
  }
  
  // ── Button ────────────────────────────────────────────────────────
  export function btnStyle(hov, primary, disabled) {
    const bg    = primary ? LIGHT_BROWN : WHITE
    const color = primary ? WHITE : DARK
    const border = primary ? 'none' : `1px solid ${BORDER}`
    
    return {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            8,
      padding:        '8px 18px',
      background:     bg,
      border,
      borderRadius:   RADIUS.sm,
      color,
      fontSize:       13,
      fontWeight:     800,
      cursor:         disabled ? 'not-allowed' : 'pointer',
      opacity:        disabled ? 0.5 : 1,
      transition:     'none',
      fontFamily:     'inherit',
      whiteSpace:     'nowrap',
      minHeight:      40,
      boxShadow:      'none',
    }
  }
  
  // ── Tabs CSS string (injected via <style>) ────────────────────────
  export const tabsCSS = `
    * { box-sizing: border-box; }
  
    @media (max-width: 480px) {
      .btn-label     { display: none !important; }
      .page-subtitle { display: none !important; }
    }
  
    .db-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 24px;
      overflow-x: auto;
      scrollbar-width: none;
      background: ${WHITE};
      border-radius: ${RADIUS.sm}px;
      border: 1px solid ${BORDER};
      padding: 0;
    }
    .db-tabs::-webkit-scrollbar { display: none; }
  
    .db-tab {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 12px 24px;
      background: none;
      border: none;
      border-right: 1px solid ${BORDER};
      color: ${DARK};
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
      transition: none;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .db-tab:last-child { border-right: none; }
    
    .db-tab.active {
      background: ${LIGHT_BROWN};
      color: ${WHITE};
    }
  
    .tab-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      font-size: 10px;
      font-weight: 900;
      border-radius: 4px;
      background: ${DARK};
      color: ${WHITE};
      margin-left: 4px;
    }
    .db-tab.active .tab-pill { background: ${WHITE}; color: ${LIGHT_BROWN}; }
  `
