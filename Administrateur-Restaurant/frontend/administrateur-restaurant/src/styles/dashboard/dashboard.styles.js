import {
    DARK, GOLD, GOLD_DK, CREAM, WHITE,
    RED, RED_BG, AMBER, AMBER_BG,
    FONT_FAMILY, BORDER,
  } from './tokens'
  
  // ── Page wrapper ──────────────────────────────────────────────────
  export const page = {
    minHeight:   '100vh',
    background:  CREAM,
    fontFamily:  FONT_FAMILY,
    padding:     'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
    width:       '100%',
    overflowX:   'hidden',
    boxSizing:   'border-box',
  }
  
  // ── Header row ────────────────────────────────────────────────────
  export const header = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            12,
    marginBottom:   8,
    flexWrap:       'wrap',
  }
  
  export const headerLeft = {
    minWidth: 0,
    flex:     1,
  }
  
  export const h1 = {
    margin:        0,
    fontSize:      'clamp(20px,5vw,36px)',
    fontWeight:    900,
    color:         DARK,
    letterSpacing: '-1.5px',
    lineHeight:    1,
  }
  
  export const subtitle = {
    margin:     '6px 0 0',
    fontSize:   12,
    fontWeight: 700,
    color:      GOLD_DK,
  }
  
  // ── Divider ───────────────────────────────────────────────────────
  export const divider = {
    height:     2,
    background: DARK,
    margin:     '16px 0 20px',
  }
  
  // ── Error banner ──────────────────────────────────────────────────
  export const errorBanner = {
    marginTop:   12,
    padding:     '11px 16px',
    background:  RED_BG,
    borderLeft:  `3px solid ${RED}`,
    fontSize:    12,
    fontWeight:  700,
    color:       RED,
  }
  
  // ── Button ────────────────────────────────────────────────────────
  export function btnStyle(hov, primary, disabled) {
    const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
    const color = primary ? (hov ? GOLD : DARK) : WHITE
    return {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            8,
      padding:        '10px 16px',
      background:     bg,
      border:         'none',
      color,
      fontSize:       13,
      fontWeight:     800,
      cursor:         disabled ? 'not-allowed' : 'pointer',
      opacity:        disabled ? 0.5 : 1,
      transition:     'background 0.15s, color 0.15s',
      fontFamily:     'inherit',
      whiteSpace:     'nowrap',
      minHeight:      40,
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
      border-bottom: 2px solid ${DARK};
      margin-bottom: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      background: ${WHITE};
    }
    .db-tabs::-webkit-scrollbar { display: none; }
  
    .db-tab {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 13px clamp(16px, 2.2vw, 28px);
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      color: ${DARK};
      font-size: 10px;
      font-weight: 900;
      cursor: pointer;
      font-family: inherit;
      letter-spacing: .14em;
      text-transform: uppercase;
      transition: color .14s, background .14s, border-color .14s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .db-tab:hover:not(.active) {
      background: #fdf0d5;
    }
    .db-tab.active {
      background: ${DARK};
      border-bottom-color: ${GOLD};
      color: ${GOLD};
    }
  
    .tab-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      font-size: 9px;
      font-weight: 900;
    }
    .db-tab.active .tab-pill       { background: ${GOLD}22;   color: ${GOLD};  }
    .db-tab:not(.active) .tab-pill { background: ${AMBER_BG}; color: ${AMBER}; }
  `