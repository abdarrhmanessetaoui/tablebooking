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
      alignItems: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>

      <nav style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        overflowY: 'auto',
        overflowX: 'visible',
      }}>
        {navItems.map((item, i) => (
          <div
            key={item.to}
            style={{ position: 'relative', width: '100%' }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            <NavLink
              to={item.to}
              onClick={onNavClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 52,
                textDecoration: 'none',
                position: 'relative',
                color: isActive ? '#1C1F24' : hov === i ? '#1C1F24' : '#B0B7C3',
                background: 'transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 3,
                      background: '#1C1F24',
                    }} />
                  )}
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    lineHeight: 1,
                  }}>
                    {item.icon}
                  </span>
                </>
              )}
            </NavLink>

            {hov === i && (
              <div style={{
                position: 'absolute',
                left: 'calc(100% + 8px)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#1C1F24',
                borderRadius: 6,
                padding: '5px 10px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 9999,
                animation: 'tfade .1s ease',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
                  {item.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ width: '50%', height: 1, background: '#F0F0F0', margin: '4px 0', flexShrink: 0 }} />

      {/* Logout */}
      <div
        style={{ paddingBottom: 20, paddingTop: 4, position: 'relative', flexShrink: 0 }}
        onMouseEnter={() => setHovOut(true)}
        onMouseLeave={() => setHovOut(false)}
      >
        <button
          onClick={handleLogout}
          style={{
            width: 52, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: hovOut ? '#EF4444' : '#B0B7C3',
            cursor: 'pointer',
            fontSize: 22,
          }}
        >
          <LogoutIcon />
        </button>

        {hovOut && (
          <div style={{
            position: 'absolute',
            left: 'calc(100% + 8px)',
            top: '50%', transform: 'translateY(-50%)',
            background: '#1C1F24', borderRadius: 6,
            padding: '5px 10px', whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 9999,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F87171' }}>Déconnexion</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes tfade {
          from { opacity:0; transform:translateY(-50%) translateX(-4px); }
          to   { opacity:1; transform:translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  )
}