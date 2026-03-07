import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { B } from '../utils/brand'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── LOGO ── */}
      <div style={{
        padding: '24px 22px 20px',
        borderBottom: '1px solid #F5F0EA',
        flexShrink: 0,
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ height: 28, objectFit: 'contain', display: 'block' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        {/* Text fallback */}
        <div style={{ display: 'none' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: B.brown || '#9A6F2E', letterSpacing: '-0.3px' }}>
            Table<span style={{ color: '#1C1C1C' }}>Booking</span>
            <span style={{ color: B.brown || '#9A6F2E' }}>.ma</span>
          </span>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        padding: '14px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
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
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 13px',
              borderRadius: 11,
              textDecoration: 'none',
              position: 'relative',
              transition: 'background 0.13s',
              background: isActive
                ? (B.brownTint || '#FDF6E8')
                : hov === i
                  ? '#FAF8F5'
                  : 'transparent',
              color: isActive
                ? (B.brown || '#9A6F2E')
                : hov === i
                  ? '#2D2418'
                  : '#6B6B6B',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active left bar — warm brown */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: '18%', bottom: '18%',
                    width: 3, borderRadius: '0 3px 3px 0',
                    background: B.brown || '#9A6F2E',
                  }} />
                )}

                {/* Icon */}
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  lineHeight: 1,
                  flexShrink: 0,
                  color: 'inherit',
                  opacity: isActive ? 1 : hov === i ? 1 : 0.75,
                }}>
                  {item.icon}
                </span>

                {/* Label */}
                <span style={{
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  letterSpacing: isActive ? '-0.1px' : 'normal',
                }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{ margin: '0 14px', height: 1, background: '#F0EDE8', flexShrink: 0 }} />

      {/* ── LOGOUT ── */}
      <div style={{ padding: '10px 10px 24px', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 13px',
            borderRadius: 11,
            background: hovOut ? '#FFF5F5' : 'transparent',
            border: 'none',
            color: hovOut ? '#C0182B' : '#9CA3AF',
            cursor: 'pointer',
            transition: 'background 0.13s, color 0.13s',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
            <LogoutIcon />
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            Déconnexion
          </span>
        </button>
      </div>

    </div>
  )
}