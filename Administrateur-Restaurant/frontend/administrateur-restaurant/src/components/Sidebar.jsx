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
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflowX: 'visible',
    }}>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '18px 0',
        gap: 2,
        overflowY: 'auto',
        overflowX: 'visible',
      }}>
        {navItems.map((item, i) => (
          <div
            key={item.to}
            style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
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
                width: 42, height: 42,
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.13s ease, color 0.13s ease',
                position: 'relative',
                background: isActive ? '#FDF6E8' : hov === i ? '#F4F5F7' : 'transparent',
                color: isActive ? '#9A6F2E' : hov === i ? '#111827' : '#6B7280',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0, top: '18%', bottom: '18%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: '#9A6F2E',
                    }} />
                  )}
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    lineHeight: 1,
                    color: 'inherit',
                  }}>
                    {item.icon}
                  </span>
                </>
              )}
            </NavLink>

            {/* Tooltip */}
            {hov === i && (
              <div style={{
                position: 'absolute',
                left: 'calc(100% + 8px)',
                top: '50%', transform: 'translateY(-50%)',
                background: '#111827',
                borderRadius: 8,
                padding: '6px 12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                animation: 'tfade .1s ease',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                  {item.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{ width: 24, height: 1, background: '#E4E7ED', flexShrink: 0, margin: '4px 0' }} />

      {/* ── LOGOUT ── */}
      <div
        style={{ padding: '6px 0 24px', width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', flexShrink: 0 }}
        onMouseEnter={() => setHovOut(true)}
        onMouseLeave={() => setHovOut(false)}
      >
        <button
          onClick={handleLogout}
          style={{
            width: 42, height: 42, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovOut ? '#FFF1F1' : 'transparent',
            border: 'none',
            color: hovOut ? '#DC2626' : '#9CA3AF',
            cursor: 'pointer',
            transition: 'background 0.13s, color 0.13s',
            fontSize: 22, lineHeight: 1,
          }}
        >
          <LogoutIcon />
        </button>

        {hovOut && (
          <div style={{
            position: 'absolute', left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)',
            background: '#111827', borderRadius: 8,
            padding: '6px 12px', whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 9999,
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F87171' }}>Déconnexion</span>
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