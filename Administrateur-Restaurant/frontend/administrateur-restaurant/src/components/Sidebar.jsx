import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 10px 10px',
        gap: 2,
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
              padding: '10px 14px',
              borderRadius: 10,
              textDecoration: 'none',
              position: 'relative',
              transition: 'background 0.13s',
              background: isActive
                ? '#F4F5F7'
                : hov === i
                  ? '#F9FAFB'
                  : 'transparent',
              color: isActive
                ? '#111827'
                : hov === i
                  ? '#374151'
                  : '#6B7280',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active left bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: '18%', bottom: '18%',
                    width: 3,
                    borderRadius: '0 3px 3px 0',
                    background: '#111827',
                  }} />
                )}

                {/* Icon */}
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 19,
                  lineHeight: 1,
                  flexShrink: 0,
                  color: 'inherit',
                }}>
                  {item.icon}
                </span>

                {/* Label — always visible */}
                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 600,
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{ margin: '0 16px', height: 1, background: '#F0F0F0', flexShrink: 0 }} />

      {/* ── LOGOUT ── */}
      <div style={{ padding: '10px 10px 22px', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '10px 14px',
            borderRadius: 10,
            background: hovOut ? '#FFF5F5' : 'transparent',
            border: 'none',
            color: hovOut ? '#EF4444' : '#9CA3AF',
            cursor: 'pointer',
            transition: 'background 0.13s, color 0.13s',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, lineHeight: 1, flexShrink: 0 }}>
            <LogoutIcon />
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
            Déconnexion
          </span>
        </button>
      </div>

    </div>
  )
}