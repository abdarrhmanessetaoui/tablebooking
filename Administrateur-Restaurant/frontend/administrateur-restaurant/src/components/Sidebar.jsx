import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov]     = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#FFFFFF',
      borderRight: '1px solid #E4E7ED',
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
        borderBottom: '1px solid #F0F2F5',
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
        {/* Fallback monogram */}
        <div style={{
          display: 'none', width: 38, height: 38,
          borderRadius: 10, alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg,#9A6F2E,#C49A4A)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>TB</span>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px 0',
        gap: 4,
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
                width: 44, height: 44,
                borderRadius: 12,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                position: 'relative',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(154,111,46,0.12), rgba(196,154,74,0.08))'
                  : hov === i
                    ? '#F4F5F7'
                    : 'transparent',
                border: isActive
                  ? '1.5px solid rgba(196,154,74,0.35)'
                  : '1.5px solid transparent',
                color: isActive ? '#9A6F2E' : hov === i ? '#2D3142' : '#9CA3AF',
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: -1, top: '20%', bottom: '20%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(180deg,#C49A4A,#9A6F2E)',
                      boxShadow: '0 0 8px rgba(196,154,74,0.5)',
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

            {/* Tooltip */}
            {hov === i && (
              <div style={{
                position: 'absolute',
                left: 'calc(100% + 10px)',
                top: '50%', transform: 'translateY(-50%)',
                background: '#1C2333',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 9,
                padding: '8px 13px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
                animation: 'tfade .12s ease',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  {item.label}
                </span>
                <span style={{
                  position: 'absolute',
                  left: -4, top: '50%',
                  width: 7, height: 7,
                  background: '#1C2333',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRight: 'none', borderTop: 'none',
                  transform: 'translateY(-50%) rotate(45deg)',
                  display: 'block',
                }} />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{ width: 28, height: 1, background: '#E4E7ED', flexShrink: 0 }} />

      {/* ── LOGOUT ── */}
      <div
        style={{ padding: '10px 0 22px', width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', flexShrink: 0 }}
        onMouseEnter={() => setHovOut(true)}
        onMouseLeave={() => setHovOut(false)}
      >
        <button
          onClick={handleLogout}
          style={{
            width: 44, height: 44, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovOut ? '#FFF1F1' : 'transparent',
            border: `1.5px solid ${hovOut ? 'rgba(220,38,38,0.2)' : 'transparent'}`,
            color: hovOut ? '#DC2626' : '#C4C9D4',
            cursor: 'pointer', transition: 'all 0.15s ease',
            fontSize: 20, lineHeight: 1,
          }}
        >
          <LogoutIcon />
        </button>

        {hovOut && (
          <div style={{
            position: 'absolute', left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)',
            background: '#1C2333', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 9, padding: '8px 13px', whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 9999, boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
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