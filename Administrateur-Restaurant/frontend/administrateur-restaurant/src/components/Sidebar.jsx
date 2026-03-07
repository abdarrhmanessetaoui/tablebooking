import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#9A6F2E',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── LOGO ── */}
      <div style={{ padding: '28px 24px 22px', borderBottom: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ height: 28, objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
        <span style={{ display: 'none', fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
          TableBooking.ma
        </span>
      </div>

      {/* ── NAV ── */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '11px 14px',
              textDecoration: 'none',
              background: isActive
                ? 'rgba(255,255,255,0.18)'
                : hov === i
                  ? 'rgba(255,255,255,0.10)'
                  : 'transparent',
              color: isActive ? '#fff' : hov === i ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
              transition: 'background 0.13s, color 0.13s',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 18, flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── LOGOUT ── */}
      <div style={{ padding: '10px 12px 26px', borderTop: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 11,
            padding: '11px 14px', marginTop: 10,
            background: hovOut ? 'rgba(255,255,255,0.10)' : 'transparent',
            border: 'none',
            color: hovOut ? '#FCA5A5' : 'rgba(255,255,255,0.45)',
            cursor: 'pointer', transition: 'all 0.13s',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 18, flexShrink: 0 }}>
            <LogoutIcon />
          </span>
          Déconnexion
        </button>
      </div>
    </div>
  )
}