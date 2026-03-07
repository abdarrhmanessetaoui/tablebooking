import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov] = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#111318',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflowX: 'visible',
    }}>

      {/* ── LOGO ── */}
      <div style={{
        width: '100%',
        padding: '20px 0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ width: 36, height: 36, objectFit: 'contain' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        {/* fallback monogram */}
        <div style={{
          display: 'none', width: 36, height: 36,
          borderRadius: 10, alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg,#9A6F2E,#C49A4A)',
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>TB</span>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: 4,
        overflowY: 'auto',
        overflowX: 'visible',
        position: 'relative',
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
                width: 44, height: 44,
                borderRadius: 13,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                position: 'relative',
                background: isActive
                  ? 'rgba(196,154,74,0.16)'
                  : hov === i
                    ? 'rgba(255,255,255,0.07)'
                    : 'transparent',
                border: isActive
                  ? '1.5px solid rgba(196,154,74,0.3)'
                  : '1.5px solid transparent',
                color: isActive ? '#C49A4A' : hov === i ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute', left: -1,
                      top: '18%', bottom: '18%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(180deg,#C49A4A,#9A6F2E)',
                      boxShadow: '0 0 10px rgba(196,154,74,0.6)',
                    }} />
                  )}
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: 'inherit', lineHeight: 1,
                  }}>
                    {item.icon}
                  </span>
                </>
              )}
            </NavLink>

            {/* Floating tooltip */}
            {hov === i && (
              <div style={{
                position: 'absolute',
                left: 'calc(100% + 10px)',
                top: '50%', transform: 'translateY(-50%)',
                background: '#1E2333',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 9,
                padding: '7px 12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                animation: 'tfade .12s ease',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                  {item.label}
                </span>
                {/* arrow */}
                <span style={{
                  position: 'absolute',
                  left: -4, top: '50%',
                  width: 7, height: 7,
                  background: '#1E2333',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRight: 'none', borderTop: 'none',
                  transform: 'translateY(-50%) rotate(45deg)',
                  display: 'block',
                }} />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── DIVIDER ── */}
      <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

      {/* ── LOGOUT ── */}
      <div
        style={{ padding: '10px 0 22px', width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', flexShrink: 0 }}
        onMouseEnter={() => setHovOut(true)}
        onMouseLeave={() => setHovOut(false)}
      >
        <button
          onClick={handleLogout}
          style={{
            width: 44, height: 44, borderRadius: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovOut ? 'rgba(248,113,113,0.12)' : 'transparent',
            border: `1.5px solid ${hovOut ? 'rgba(248,113,113,0.28)' : 'transparent'}`,
            color: hovOut ? '#F87171' : 'rgba(255,255,255,0.3)',
            cursor: 'pointer', transition: 'all 0.15s ease',
            fontSize: 20, lineHeight: 1,
          }}
        >
          <LogoutIcon />
        </button>
        {hovOut && (
          <div style={{
            position: 'absolute', left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)',
            background: '#1E2333', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 9, padding: '7px 12px', whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F87171' }}>Déconnexion</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes tfade {
          from { opacity:0; transform:translateY(-50%) translateX(-6px); }
          to   { opacity:1; transform:translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  )
}