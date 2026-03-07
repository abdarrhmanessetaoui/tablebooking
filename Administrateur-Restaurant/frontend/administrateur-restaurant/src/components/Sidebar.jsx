import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

const BROWN      = '#9A6F2E'
const BROWN_DARK = '#7A5520'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hovIdx,  setHovIdx]  = useState(null)
  const [hovOut,  setHovOut]  = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: BROWN,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── LOGO ── */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.13)',
        flexShrink: 0,
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ height: 30, objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
        />
        <span style={{ display:'none', fontSize:16, fontWeight:900, color:'#fff', letterSpacing:'-0.3px' }}>
          TableBooking.ma
        </span>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1, padding: '16px 12px',
        display: 'flex', flexDirection: 'column', gap: 2,
        overflowY: 'auto',
      }}>
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 13,
              padding: '12px 16px',
              textDecoration: 'none',
              transition: 'background 0.13s, color 0.13s',
              background: isActive
                ? 'rgba(255,255,255,0.18)'
                : hovIdx === i
                  ? 'rgba(255,255,255,0.10)'
                  : 'transparent',
              color: isActive
                ? '#fff'
                : hovIdx === i
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.5)',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active white left bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '15%', bottom: '15%',
                    width: 3, background: '#fff', borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <span style={{ display:'flex', alignItems:'center', flexShrink: 0, color: 'inherit' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 14, fontWeight: isActive ? 800 : 600, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── LOGOUT ── */}
      <div style={{ padding: '10px 12px 28px', borderTop: '1px solid rgba(255,255,255,0.13)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 13,
            padding: '12px 16px', marginTop: 8,
            background: hovOut ? 'rgba(255,255,255,0.10)' : 'transparent',
            border: 'none',
            color: hovOut ? '#FCA5A5' : 'rgba(255,255,255,0.45)',
            cursor: 'pointer', transition: 'all 0.13s',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left',
          }}
        >
          <span style={{ display:'flex', alignItems:'center', flexShrink: 0, color: 'inherit' }}>
            <LogoutIcon />
          </span>
          Déconnexion
        </button>
      </div>
    </div>
  )
}