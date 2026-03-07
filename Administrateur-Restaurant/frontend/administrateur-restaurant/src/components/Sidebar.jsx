import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: DARK,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* LOGO */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: `1px solid rgba(200,169,126,0.18)`,
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ height: 36, objectFit: 'contain', display: 'block' }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
        />
        <span style={{ display:'none', fontSize:16, fontWeight:900, color: GOLD, letterSpacing:'-0.3px' }}>
          TableBooking.ma
        </span>
      </div>

      {/* NAV */}
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
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 13,
              padding: '13px 16px',
              textDecoration: 'none',
              position: 'relative',
              transition: 'background 0.18s, color 0.18s',
              background: isActive
                ? `rgba(200,169,126,0.18)`
                : hov === i
                  ? `rgba(200,169,126,0.09)`
                  : 'transparent',
              color: isActive ? GOLD : hov === i ? '#fff' : 'rgba(255,255,255,0.45)',
              transform: hov === i && !isActive ? 'translateX(4px)' : 'translateX(0)',
            })}
          >
            {({ isActive }) => (
              <>
                {/* active bar */}
                <div style={{
                  position:'absolute', left:0, top:'15%', bottom:'15%',
                  width: 3, background: GOLD,
                  transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1)',
                  transformOrigin: 'center',
                }} />
                {/* icon — scales up on hover */}
                <span style={{
                  display:'flex', alignItems:'center', flexShrink:0, color:'inherit',
                  transform: hov === i ? 'scale(1.18)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize:14, fontWeight: isActive ? 800 : 600, whiteSpace:'nowrap',
                }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div style={{ padding:'10px 12px 28px', borderTop:`1px solid rgba(200,169,126,0.18)`, flexShrink:0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          style={{
            width:'100%', display:'flex', alignItems:'center', gap:13,
            padding:'13px 16px', marginTop:8,
            background: hovOut ? 'rgba(255,100,80,0.12)' : 'transparent',
            border: 'none',
            color: hovOut ? '#ff8a80' : 'rgba(255,255,255,0.35)',
            cursor:'pointer',
            transform: hovOut ? 'translateX(4px)' : 'translateX(0)',
            transition: 'background 0.18s, color 0.18s, transform 0.2s cubic-bezier(0.22,1,0.36,1)',
            fontFamily:'inherit', fontSize:14, fontWeight:600, textAlign:'left',
          }}
        >
          <span style={{
            display:'flex', alignItems:'center', flexShrink:0, color:'inherit',
            transform: hovOut ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <LogoutIcon />
          </span>
          Déconnexion
        </button>
      </div>
    </div>
  )
}